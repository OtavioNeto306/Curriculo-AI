import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';

const ConnectAI: React.FC = () => {
  const { apiKey, setApiKey } = useResume();
  const navigate = useNavigate();
  const [inputKey, setInputKey] = useState(apiKey || "");

  useEffect(() => {
    // If API Key is already loaded from env, skip this screen
    if (apiKey && apiKey.length > 10) {
      navigate('/info');
    }
  }, [apiKey, navigate]);

  const handleConnect = () => {
    if (inputKey.trim()) {
      setApiKey(inputKey);
      navigate('/info');
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background-light p-4 dark:bg-background-dark">
      <div className="w-full max-w-2xl rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50 md:p-8">
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-semibold text-[#111111] dark:text-white">Conectar IA</h1>
          <p className="mt-2 max-w-md text-center text-base font-normal text-[#555555] dark:text-neutral-400">
            Escolha a Inteligência Artificial e insira sua API Key para continuar.
          </p>

          <div className="mt-8 grid w-full grid-cols-2 gap-4 sm:grid-cols-4">
            {/* OpenAI Card - Disabled style for contrast */}
            <div className="group relative flex cursor-not-allowed opacity-50 flex-col items-center gap-3 rounded-lg border border-[#E1E1E1] p-4 dark:border-neutral-700">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                <span className="material-symbols-outlined text-3xl text-neutral-800 dark:text-neutral-200">hub</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-center">
                <h2 className="text-base font-medium text-neutral-800 dark:text-neutral-200">OpenAI</h2>
                <p className="text-sm font-normal text-neutral-500 dark:text-neutral-400">GPT-4</p>
              </div>
            </div>

             {/* Gemini Card - Selected */}
            <div className="group relative flex cursor-pointer flex-col items-center gap-3 rounded-lg border-2 border-primary bg-primary/5 p-4 transition-all hover:border-primary">
              <span className="material-symbols-outlined absolute right-2 top-2 text-primary filled-icon">check_circle</span>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                <span className="material-symbols-outlined text-3xl text-neutral-800 dark:text-neutral-200">spark</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-center">
                <h2 className="text-base font-medium text-neutral-800 dark:text-neutral-200">Gemini</h2>
                <p className="text-sm font-normal text-neutral-500 dark:text-neutral-400">By Google</p>
              </div>
            </div>

            {/* Others */}
            <div className="group relative flex cursor-not-allowed opacity-50 flex-col items-center gap-3 rounded-lg border border-[#E1E1E1] p-4 dark:border-neutral-700">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                <span className="material-symbols-outlined text-3xl text-neutral-800 dark:text-neutral-200">emergency</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-center">
                <h2 className="text-base font-medium text-neutral-800 dark:text-neutral-200">Grok</h2>
                <p className="text-sm font-normal text-neutral-500 dark:text-neutral-400">By xAI</p>
              </div>
            </div>
             <div className="group relative flex cursor-not-allowed opacity-50 flex-col items-center gap-3 rounded-lg border border-[#E1E1E1] p-4 dark:border-neutral-700">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                <span className="material-symbols-outlined text-3xl text-neutral-800 dark:text-neutral-200">neurology</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-center">
                <h2 className="text-base font-medium text-neutral-800 dark:text-neutral-200">DeepSeek</h2>
                <p className="text-sm font-normal text-neutral-500 dark:text-neutral-400">By DeepSeek</p>
              </div>
            </div>
          </div>

          <div className="mt-8 w-full">
            <label className="flex w-full flex-col">
              <p className="pb-2 text-sm font-medium text-neutral-800 dark:text-neutral-200">API Key da IA escolhida</p>
              <div className="group flex w-full items-stretch rounded-lg">
                <input 
                  type="password"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  className="form-input h-11 flex-1 resize-none overflow-hidden rounded-l-lg border border-[#E1E1E1] bg-white p-3 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:placeholder:text-neutral-500 dark:focus:border-primary" 
                  placeholder="Cole aqui sua chave de API (Google Gemini)..."
                />
                <div className="flex cursor-pointer items-center justify-center rounded-r-lg border border-l-0 border-[#E1E1E1] bg-white px-3 text-neutral-500 group-focus-within:border-primary group-focus-within:ring-2 group-focus-within:ring-primary/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:group-focus-within:border-primary">
                  <span className="material-symbols-outlined text-xl">visibility</span>
                </div>
              </div>
            </label>
          </div>

          <div className="mt-8 w-full">
            <button 
              onClick={handleConnect}
              disabled={!inputKey}
              className="flex h-11 w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary px-5 text-base font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="truncate">Avançar para criar currículo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectAI;