import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';
import { supabase } from '../services/supabase';

type PaymentStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

interface PaymentRecord {
    id: string;
    status: PaymentStatus;
    created_at: string;
    pix_qr: string;
    mp_payment_id: string;
}

const MyPlan: React.FC = () => {
    const { plan, loadProfileFromSupabase } = useResume();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [latestPayment, setLatestPayment] = useState<PaymentRecord | null>(null);
    const [copySuccess, setCopySuccess] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await loadProfileFromSupabase();

            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data, error } = await supabase
                    .from('payments')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single();

                if (data) {
                    setLatestPayment(data as PaymentRecord);
                }
            }
            setLoading(false);
        };

        fetchData();
    }, [loadProfileFromSupabase]);

    const handleCopyCode = () => {
        if (latestPayment?.pix_qr) {
            navigator.clipboard.writeText(latestPayment.pix_qr);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background-light dark:bg-background-dark">
                <div className="text-neutral-600 dark:text-neutral-300">Carregando...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-light p-4 dark:bg-background-dark md:p-8">
            <div className="mx-auto max-w-3xl">
                <div className="mb-8 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-[#111111] dark:text-white">Meu Plano</h1>
                    <button
                        onClick={() => navigate('/')}
                        className="rounded-lg bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                    >
                        Voltar
                    </button>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Plan Status Card */}
                    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <h2 className="mb-4 text-lg font-semibold text-[#111111] dark:text-white">Status da Assinatura</h2>

                        <div className="mb-6">
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">Plano Atual</p>
                            <div className="mt-1 flex items-center">
                                <span className={`text-2xl font-bold ${plan === 'paid' ? 'text-blue-600' : 'text-neutral-800 dark:text-white'}`}>
                                    {plan === 'paid' ? 'Premium Vitalício' : 'Gratuito'}
                                </span>
                                {plan === 'paid' && (
                                    <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                        Ativo
                                    </span>
                                )}
                            </div>
                        </div>

                        {plan === 'free' && (
                            <button
                                onClick={() => navigate('/payment')}
                                className="w-full rounded-lg bg-primary py-3 text-base font-semibold text-white transition-colors hover:bg-primary/90"
                            >
                                Atualizar para Plano Vitalício
                            </button>
                        )}
                    </div>

                    {/* Payment Info Card */}
                    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <h2 className="mb-4 text-lg font-semibold text-[#111111] dark:text-white">Último Pagamento</h2>

                        {latestPayment ? (
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Data</p>
                                    <p className="font-medium text-[#111111] dark:text-white">{formatDate(latestPayment.created_at)}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Status</p>
                                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${latestPayment.status === 'approved'
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                            : latestPayment.status === 'pending'
                                                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                                        }`}>
                                        {latestPayment.status === 'approved' ? 'Pago' :
                                            latestPayment.status === 'pending' ? 'Pendente' :
                                                'Falhou/Cancelado'}
                                    </span>
                                </div>

                                {latestPayment.status === 'pending' && latestPayment.pix_qr && (
                                    <div className="mt-4 rounded-lg bg-neutral-50 p-4 dark:bg-neutral-800">
                                        <p className="mb-2 text-sm font-medium text-neutral-800 dark:text-neutral-200">Código PIX Pendente</p>
                                        <div className="flex items-center">
                                            <input
                                                type="text"
                                                value={latestPayment.pix_qr}
                                                readOnly
                                                className="flex-1 truncate bg-transparent text-xs text-neutral-500 outline-none dark:text-neutral-400"
                                            />
                                            <button onClick={handleCopyCode} className="ml-2 text-primary hover:underline text-xs">
                                                {copySuccess ? 'Copiado!' : 'Copiar'}
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => navigate('/payment')}
                                            className="mt-3 w-full rounded border border-primary py-1 text-xs font-medium text-primary hover:bg-primary/5 dark:border-primary dark:text-primary"
                                        >
                                            Ir para tela de pagamento
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">Nenhum histórico de pagamento encontrado.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyPlan;
