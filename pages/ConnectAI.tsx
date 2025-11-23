import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';
import { LLMProvider } from '../types';
import { supabase } from '../services/supabase';

const ConnectAI: React.FC = () => {
  const { userApiKey, updateUserApiKey, llmProvider, updateLlmProvider, loadProfileFromSupabase } = useResume();
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
    // If we have a user and an API key, redirect to info
    if (!loading && user && userApiKey) {
      navigate('/info');
    }
  }, [loading, user, userApiKey, navigate]);

  const handleConnect = async () => {
    if (inputKey.trim()) {
      await updateLlmProvider(selectedProvider);
      await updateUserApiKey(inputKey.trim());
      navigate('/info');
    }
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
      <div className="grid w-full max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
        {/* Left Column: Form */}
        <div className="flex flex-col justify-center rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50 md:p-8">
          <div className="flex flex-col items-center">
            <h1 className="text-3xl font-semibold text-[#111111] dark:text-white">Conectar IA</h1>
            <p className="mt-2 max-w-md text-center text-base font-normal text-[#555555] dark:text-neutral-400">
              Configure sua inteligência artificial preferida.
            </p>

            <div className="mt-8 w-full space-y-6">
              {/* Provider Dropdown */}
              <label className="flex w-full flex-col">
                <p className="pb-2 text-sm font-medium text-neutral-800 dark:text-neutral-200">Provedor de IA</p>
                <select
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value as LLMProvider)}
                  className="h-11 w-full rounded-lg border border-[#E1E1E1] bg-white px-3 text-sm text-neutral-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
                >
                  <option value="openai">OpenAI (GPT-4)</option>
                  <option value="groq">Groq (Llama 3/Mixtral)</option>
                  <option value="gemini">Gemini (Google)</option>
                  <option value="deepseek">DeepSeek</option>
                </select>
              </label>

              {/* API Key Input */}
              <label className="flex w-full flex-col">
                <p className="pb-2 text-sm font-medium text-neutral-800 dark:text-neutral-200">API Key</p>
                <div className="group flex w-full items-stretch rounded-lg">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    className="form-input h-11 flex-1 resize-none overflow-hidden rounded-l-lg border border-[#E1E1E1] bg-white p-3 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:placeholder:text-neutral-500 dark:focus:border-primary"
                    placeholder="Digite sua API Key do provedor escolhido"
                  />
                  <div
                    onClick={() => setShowPassword(!showPassword)}
                    className="flex cursor-pointer items-center justify-center rounded-r-lg border border-l-0 border-[#E1E1E1] bg-white px-3 text-neutral-500 group-focus-within:border-primary group-focus-within:ring-2 group-focus-within:ring-primary/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:group-focus-within:border-primary"
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </div>
                </div>
              </label>

              <button
                onClick={handleConnect}
                disabled={!inputKey}
                className="flex h-11 w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary px-5 text-base font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="truncate">Salvar API Key e Continuar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Tutorial */}
        <div className="flex flex-col justify-center rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50 md:p-8">
          <h2 className="mb-4 text-xl font-semibold text-[#111111] dark:text-white">Como obter sua API Key</h2>
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
          <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
            Assista ao vídeo para aprender como gerar uma chave de API gratuita para o provedor selecionado.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConnectAI;