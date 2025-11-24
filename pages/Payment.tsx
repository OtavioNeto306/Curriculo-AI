import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';
import { createPayment } from '../services/paymentService';
import { supabase } from '../services/supabase';

type PaymentStatus = 'idle' | 'generating' | 'waiting' | 'confirmed' | 'failed';

const Payment: React.FC = () => {
    const { loadProfileFromSupabase, plan } = useResume();
    const navigate = useNavigate();
    const [status, setStatus] = useState<PaymentStatus>('idle');
    const [qrCode, setQrCode] = useState<string>('');
    const [qrCodeBase64, setQrCodeBase64] = useState<string>('');
    const [paymentId, setPaymentId] = useState<string>('');
    const [copySuccess, setCopySuccess] = useState(false);
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

    useEffect(() => {
        if (plan === 'paid') {
            navigate('/info');
        }
    }, [plan, navigate]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (status === 'waiting' && paymentId) {
            interval = setInterval(async () => {
                const { data, error } = await supabase
                    .from('payments')
                    .select('status')
                    .eq('mp_payment_id', paymentId)
                    .single();

                if (data?.status === 'approved') {
                    setStatus('confirmed');
                    await loadProfileFromSupabase(); // Update context
                } else if (data?.status === 'rejected' || data?.status === 'cancelled') {
                    setStatus('failed');
                }
            }, 5000);
        }
        return () => clearInterval(interval);
    }, [status, paymentId, loadProfileFromSupabase]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (status === 'waiting' && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setStatus('failed');
        }
        return () => clearInterval(timer);
    }, [status, timeLeft]);

    const handleGeneratePix = async () => {
        try {
            setStatus('generating');
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Split name if available, or use defaults
            const nameParts = user.user_metadata?.full_name?.split(' ') || ['User', 'Name'];
            const firstName = nameParts[0];
            const lastName = nameParts.slice(1).join(' ') || 'User';

            const response = await createPayment(user.email || '', firstName, lastName);

            setQrCode(response.qr_code);
            setQrCodeBase64(response.qr_code_base64);
            setPaymentId(response.payment_id.toString());
            setStatus('waiting');
            setTimeLeft(600);
        } catch (error) {
            console.error("Error generating PIX:", error);
            setStatus('failed');
        }
    };

    const handleCopyCode = () => {
        navigator.clipboard.writeText(qrCode);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')} : ${secs.toString().padStart(2, '0')}`;
    };

    if (status === 'idle') {
        return (
            <div className="flex min-h-screen w-full items-center justify-center bg-background-light p-4 dark:bg-background-dark">
                <div className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-8 shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="mb-6 flex justify-end">
                        <button onClick={() => navigate('/')} className="text-sm text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-white">
                            ✕ Fechar
                        </button>
                    </div>
                    <h1 className="mb-2 text-center text-2xl font-bold text-[#111111] dark:text-white">Ativar plano Premium</h1>
                    <p className="mb-8 text-center text-neutral-500 dark:text-neutral-400">Tenha acesso a todos os recursos avançados.</p>

                    <ul className="mb-8 space-y-4">
                        {[
                            { text: "Geração de currículos ilimitada", bold: "ilimitada" },
                            { text: "Análise de IA avançada para otimizar seu perfil", bold: "Análise de IA avançada" },
                            { text: "Acesso a todos os templates premium", bold: "templates premium" }
                        ].map((item, index) => (
                            <li key={index} className="flex items-start">
                                <span className="material-symbols-outlined mr-3 text-blue-500">check_circle</span>
                                <span className="text-sm text-neutral-600 dark:text-neutral-300">
                                    {item.text.split(item.bold).map((part, i, arr) => (
                                        <React.Fragment key={i}>
                                            {part}
                                            {i < arr.length - 1 && <span className="font-bold text-neutral-800 dark:text-white">{item.bold}</span>}
                                        </React.Fragment>
                                    ))}
                                </span>
                            </li>
                        ))}
                    </ul>

                    <div className="mb-6 rounded-lg bg-blue-50 p-4 text-center dark:bg-blue-900/20">
                        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">R$ 29,90</span>
                        <span className="text-sm text-blue-600 dark:text-blue-400"> /único</span>
                    </div>

                    <p className="mb-6 text-center text-xs text-neutral-400">
                        A renovação é automática. Você receberá sua chave de API para integrações via e-mail após a confirmação.
                    </p>

                    <button
                        onClick={handleGeneratePix}
                        className="w-full rounded-lg bg-primary py-3 text-base font-semibold text-white transition-colors hover:bg-primary/90"
                    >
                        Gerar QR Code PIX
                    </button>
                </div>
            </div>
        );
    }

    if (status === 'generating') {
        return (
            <div className="flex min-h-screen w-full items-center justify-center bg-background-light p-4 dark:bg-background-dark">
                <div className="text-center">
                    <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
                    <p className="text-neutral-600 dark:text-neutral-300">Gerando PIX...</p>
                </div>
            </div>
        );
    }

    if (status === 'waiting') {
        return (
            <div className="flex min-h-screen w-full items-center justify-center bg-background-light p-4 dark:bg-background-dark">
                <div className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-8 shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
                    <h1 className="mb-6 text-center text-2xl font-bold text-[#111111] dark:text-white">Escaneie para pagar</h1>

                    <div className="mb-6 flex justify-center">
                        <div className="rounded-lg bg-orange-300 p-4">
                            {/* Using base64 image if available, otherwise fallback (though API should return base64) */}
                            {qrCodeBase64 ? (
                                <img src={`data:image/png;base64,${qrCodeBase64}`} alt="QR Code PIX" className="h-48 w-48 rounded bg-white" />
                            ) : (
                                <div className="flex h-48 w-48 items-center justify-center bg-white text-xs text-neutral-400">QR Code Indisponível</div>
                            )}
                        </div>
                    </div>

                    <p className="mb-2 text-sm font-medium text-neutral-800 dark:text-neutral-200">PIX Copia e Cola</p>
                    <div className="mb-6 flex items-center rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-700 dark:bg-neutral-800">
                        <input
                            type="text"
                            value={qrCode}
                            readOnly
                            className="flex-1 bg-transparent text-sm text-neutral-600 outline-none dark:text-neutral-300"
                        />
                        <button onClick={handleCopyCode} className="ml-2 text-neutral-500 hover:text-primary">
                            <span className="material-symbols-outlined">{copySuccess ? 'check' : 'content_copy'}</span>
                        </button>
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Este código expira em:</p>
                        <div className="mt-2 text-3xl font-bold text-[#111111] dark:text-white tracking-widest">
                            {formatTime(timeLeft)}
                        </div>
                    </div>

                    <div className="mt-8 border-t border-neutral-100 pt-6 text-center dark:border-neutral-800">
                        <div className="flex items-center justify-center space-x-2 text-sm text-neutral-500 dark:text-neutral-400">
                            <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500"></div>
                            <span>Aguardando a confirmação do pagamento...</span>
                        </div>
                        <p className="mt-2 text-xs text-neutral-400">
                            Assim que o pagamento for confirmado, sua conta será desbloqueada automaticamente.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (status === 'confirmed') {
        return (
            <div className="flex min-h-screen w-full items-center justify-center bg-background-light p-4 dark:bg-background-dark">
                <div className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-8 shadow-lg dark:border-neutral-800 dark:bg-neutral-900 text-center">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                        <span className="material-symbols-outlined text-4xl text-green-500">check</span>
                    </div>
                    <h1 className="mb-2 text-2xl font-bold text-[#111111] dark:text-white">Pagamento confirmado!</h1>
                    <p className="mb-8 text-neutral-500 dark:text-neutral-400">Seu plano Premium foi ativado.</p>

                    <button
                        onClick={() => navigate('/info')}
                        className="mb-3 w-full rounded-lg bg-green-500 py-3 text-base font-semibold text-white transition-colors hover:bg-green-600"
                    >
                        Começar agora
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full rounded-lg bg-neutral-100 py-3 text-base font-semibold text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                    >
                        Voltar ao dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (status === 'failed') {
        return (
            <div className="flex min-h-screen w-full items-center justify-center bg-background-light p-4 dark:bg-background-dark">
                <div className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-8 shadow-lg dark:border-neutral-800 dark:bg-neutral-900 text-center">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                        <span className="material-symbols-outlined text-4xl text-red-500">close</span>
                    </div>
                    <h1 className="mb-2 text-2xl font-bold text-[#111111] dark:text-white">O pagamento não foi confirmado.</h1>
                    <p className="mb-8 text-sm text-neutral-500 dark:text-neutral-400">
                        Não conseguimos verificar o pagamento ou o código expirou. Não se preocupe, nenhuma cobrança foi realizada.
                    </p>

                    <button
                        onClick={handleGeneratePix}
                        className="mb-3 w-full rounded-lg bg-primary py-3 text-base font-semibold text-white transition-colors hover:bg-primary/90"
                    >
                        Gerar novo PIX
                    </button>
                    <button
                        onClick={() => setStatus('idle')}
                        className="w-full rounded-lg bg-neutral-100 py-3 text-base font-semibold text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                    >
                        Voltar aos planos
                    </button>
                </div>
            </div>
        );
    }

    return null;
};

export default Payment;
