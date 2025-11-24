import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';
import { LLMProvider } from '../types';
import { supabase } from '../services/supabase';

const ConnectAI: React.FC = () => {
  const { userApiKey, updateUserApiKey, llmProvider, updateLlmProvider, loadProfileFromSupabase, plan } = useResume();
  const navigate = useNavigate();
  const [inputKey, setInputKey] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<LLMProvider>('gemini');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Login State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true); // Login vs Signup
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        await loadProfileFromSupabase();
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  useEffect(() => {
    // If we have a user and they are already paid, redirect to info
    if (!loading && user && plan === 'paid') {
      navigate('/info');
    }
    // If we have a user and an API key (and they are on free plan), redirect to info
    else if (!loading && user && userApiKey && plan === 'free') {
      navigate('/info');
    }
  }, [loading, user, userApiKey, plan, navigate]);

  const handleConnectFree = async () => {
    if (inputKey.trim()) {
      await updateLlmProvider(selectedProvider);
      await updateUserApiKey(inputKey.trim());
      navigate('/info');
    }
  };

  const handleGoToPremium = () => {
    navigate('/payment');
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    if (isLoginMode) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setAuthError(error.message);
      else {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        await loadProfileFromSupabase();
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setAuthError(error.message);
      else setAuthError("Verifique seu email para confirmar o cadastro (ou login automático se configurado).");
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center bg-background-light dark:bg-background-dark text-neutral-800 dark:text-white">Carregando...</div>;

  if (!user) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background-light p-4 dark:bg-background-dark">
        <div className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50 md:p-8">
          <h1 className="mb-6 text-center text-2xl font-semibold text-[#111111] dark:text-white">
            {isLoginMode ? "Entrar no Curriculo AI" : "Criar Conta Gratuita"}
          </h1>
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-800 dark:text-neutral-200">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-[#E1E1E1] bg-white p-3 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-800 dark:text-neutral-200">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-[#E1E1E1] bg-white p-3 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                required
              />
            </div>
            {authError && <p className="text-sm text-red-500">{authError}</p>}
            <button
              type="submit"
              className="w-full rounded-lg bg-primary py-3 text-base font-semibold text-white hover:bg-primary/90"
            >
              {isLoginMode ? "Entrar" : "Cadastrar"}
            </button>
          </form>
          <div className="mt-4 text-center">
            <button
              onClick={() => setIsLoginMode(!isLoginMode)}
              className="text-sm text-primary hover:underline"
            >
              {isLoginMode ? "Não tem conta? Cadastre-se" : "Já tem conta? Entre"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background-light p-4 dark:bg-background-dark">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-[#111111] dark:text-white md:text-4xl">
          Escolha como deseja usar o <br className="hidden md:block" /> AI Resume Builder
        </h1>
        <p className="mt-4 text-base text-neutral-600 dark:text-neutral-400">
          Selecione um plano para começar a criar seu currículo com inteligência artificial.
        </p>
      </div>

      <div className="grid w-full max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">

        {/* Card 1: Premium Plan */}
        <div className="relative flex flex-col rounded-2xl border-2 border-primary bg-white p-8 shadow-lg dark:border-primary dark:bg-neutral-900/50">
          <div className="absolute -top-4 right-8 rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-100">
            Mais Popular
          </div>
          <h2 className="text-xl font-semibold text-[#111111] dark:text-white">Plano Premium</h2>
          <div className="mt-4 flex items-baseline">
            <span className="text-4xl font-bold text-[#111111] dark:text-white">R$29,90</span>
            <span className="ml-2 text-neutral-500 dark:text-neutral-400">/único</span>
          </div>

          <button
            onClick={handleGoToPremium}
            className="mt-8 w-full rounded-lg bg-primary py-3 text-base font-semibold text-white transition-colors hover:bg-primary/90"
          >
            Assinar Premium
          </button>

          <ul className="mt-8 space-y-4">
            {[
              "Utiliza nossa chave de IA interna e otimizada",
              "Salve e acesse seu histórico de currículos",
              "Geração ilimitada e mais rápida",
              "Nenhuma chave de API externa necessária",
              "Acesso vitalício"
            ].map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="material-symbols-outlined mr-3 text-blue-500">check_circle</span>
                <span className="text-sm text-neutral-600 dark:text-neutral-300">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Card 2: Free Plan */}
        <div className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50">
          <h2 className="text-xl font-semibold text-[#111111] dark:text-white">Plano Gratuito</h2>
          <div className="mt-4 flex items-baseline">
            <span className="text-4xl font-bold text-[#111111] dark:text-white">R$0</span>
            <span className="ml-2 text-neutral-500 dark:text-neutral-400">/mês</span>
          </div>

          <div className="mt-8 w-full space-y-4">
            {/* Provider Dropdown */}
            <label className="flex w-full flex-col">
              <p className="pb-1 text-xs font-medium text-neutral-600 dark:text-neutral-400">Provedor de IA</p>
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value as LLMProvider)}
                className="h-10 w-full rounded-lg border border-[#E1E1E1] bg-white px-3 text-sm text-neutral-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
              >
                <option value="openai">OpenAI (GPT-4)</option>
                <option value="groq">Groq (Llama 3/Mixtral)</option>
                <option value="gemini">Gemini (Google)</option>
                <option value="deepseek">DeepSeek</option>
              </select>
            </label>

            {/* API Key Input */}
            <label className="flex w-full flex-col">
              <p className="pb-1 text-xs font-medium text-neutral-600 dark:text-neutral-400">Sua API Key</p>
              <div className="group flex w-full items-stretch rounded-lg">
                <input
                  type={showPassword ? "text" : "password"}
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  className="form-input h-10 flex-1 resize-none overflow-hidden rounded-l-lg border border-[#E1E1E1] bg-white p-3 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:placeholder:text-neutral-500 dark:focus:border-primary"
                  placeholder="Cole sua chave aqui"
                />
                <div
                  onClick={() => setShowPassword(!showPassword)}
                  className="flex cursor-pointer items-center justify-center rounded-r-lg border border-l-0 border-[#E1E1E1] bg-white px-3 text-neutral-500 group-focus-within:border-primary group-focus-within:ring-2 group-focus-within:ring-primary/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:group-focus-within:border-primary"
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </div>
              </div>
            </label>

            <button
              onClick={handleConnectFree}
              disabled={!inputKey}
              className="w-full rounded-lg bg-neutral-100 py-3 text-base font-semibold text-neutral-900 hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
            >
              Começar grátis
            </button>
          </div>

          <ul className="mt-8 space-y-4">
            {[
              "Criação de currículos ilimitados",
              "Usuário fornece a própria chave de API",
              "Histórico de currículos não é salvo"
            ].map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="material-symbols-outlined mr-3 text-green-500">check_circle</span>
                <span className="text-sm text-neutral-600 dark:text-neutral-300">{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 border-t border-neutral-100 pt-4 dark:border-neutral-800">
            <p className="mb-2 text-xs text-neutral-500">Não sabe como pegar a chave?</p>
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-neutral-100">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Tutorial API Key"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ConnectAI;