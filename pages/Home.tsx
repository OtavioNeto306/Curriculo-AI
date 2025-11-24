import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white dark:bg-background-dark flex flex-col">
            {/* Header */}
            <header className="w-full max-w-7xl mx-auto p-6 flex justify-center">
                <div className="bg-blue-600 p-3 rounded-xl shadow-lg shadow-blue-600/20">
                    <span className="material-symbols-outlined text-white text-3xl">
                        description
                    </span>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-grow flex flex-col items-center justify-center px-4 text-center max-w-5xl mx-auto w-full mt-8">
                <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
                    Crie Currículos com <br className="hidden md:block" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                        Inteligência Artificial
                    </span>
                </h1>

                <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl leading-relaxed">
                    Transforme sua experiência em um currículo impressionante em minutos.
                    Nossa IA otimiza cada detalhe para destacar suas qualidades.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-20">
                    <button
                        onClick={() => navigate('/form')}
                        className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-lg transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 group"
                    >
                        <span className="material-symbols-outlined group-hover:scale-110 transition-transform">
                            bolt
                        </span>
                        Começar Gratuitamente
                    </button>

                    <button className="px-8 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-semibold text-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm">
                        Fazer Login
                    </button>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-6 w-full text-left">
                    {/* Feature 1 */}
                    <div className="p-8 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
                            <span className="material-symbols-outlined text-2xl">
                                flash_on
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                            Rápido e Fácil
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            Crie seu currículo profissional em minutos, não em horas.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="p-8 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mb-6 text-indigo-600 dark:text-indigo-400">
                            <span className="material-symbols-outlined text-2xl">
                                auto_awesome
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                            Otimizado por IA
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            IA aprimora suas descrições para máximo impacto.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="p-8 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mb-6 text-emerald-600 dark:text-emerald-400">
                            <span className="material-symbols-outlined text-2xl">
                                verified
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                            Templates Profissionais
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            Escolha entre modelos modernos e elegantes.
                        </p>
                    </div>
                </div>
            </main>

            <footer className="w-full py-8 text-center text-slate-400 text-sm">
                © {new Date().getFullYear()} AI Resume Builder
            </footer>
        </div>
    );
};

export default Home;
