import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';
import { generateResumeWithLLM } from '../services/aiService';

const Generating: React.FC = () => {
  const { userApiKey, llmProvider, resumeData, setGeneratedResume } = useResume();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Connecting to AI...");
  const [progress, setProgress] = useState(10);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    if (!userApiKey) {
      // Block generation if no key
      alert("API Key is missing. Please connect your AI provider.");
      navigate('/');
      return;
    }

    const processResume = async () => {
      try {
        await new Promise(r => setTimeout(r, 800));
        setStatus("Analyzing your experience...");
        setProgress(30);

        let enhancedData = resumeData;

        if (userApiKey) {
          setStatus(`Enhancing descriptions with ${llmProvider}...`);
          setProgress(50);

          try {
            const aiPromise = generateResumeWithLLM(llmProvider, userApiKey, resumeData);
            const timeoutPromise = new Promise<null>((_, reject) =>
              setTimeout(() => reject(new Error("Timeout")), 60000)
            );

            const result = await Promise.race([aiPromise, timeoutPromise]);
            if (result) {
              enhancedData = result;
            }
          } catch (e) {
            console.error("AI Generation failed or timed out, using raw data.", e);
            alert(`AI Generation failed: ${e instanceof Error ? e.message : 'Unknown error'}. Using raw data.`);
          }
        }

        setStatus("Formatting layout...");
        setProgress(90);

        setGeneratedResume(enhancedData);

        await new Promise(r => setTimeout(r, 800));
        setProgress(100);
        navigate('/preview');

      } catch (criticalError) {
        console.error("Critical error in generation flow:", criticalError);
        setGeneratedResume(resumeData);
        navigate('/preview');
      }
    };

    processResume();
  }, [userApiKey, llmProvider, resumeData, setGeneratedResume, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full px-4 text-center bg-background-light dark:bg-background-dark text-gray-800 dark:text-gray-200">
      <header className="absolute top-0 left-0 w-full p-6">
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <span className="material-symbols-outlined text-2xl text-primary">description</span>
          <span className="text-lg font-semibold">AI Resume Builder</span>
        </div>
      </header>

      <main className="flex flex-col items-center justify-center gap-8">
        <div aria-live="polite" className="flex flex-col items-center gap-6" role="status">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
            <div className="absolute inset-0 border-t-4 border-primary rounded-full animate-spin" style={{ animationDuration: '1s' }}></div>
          </div>

          <div className="h-16 flex flex-col items-center justify-center">
            <p className="text-xl font-medium text-gray-900 dark:text-white animate-pulse">{status}</p>
          </div>
        </div>

        <div className="w-full max-w-sm">
          <div className="flex flex-col gap-3">
            <div className="rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <div className="h-2 rounded-full bg-primary transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">This will take a few seconds.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Generating;