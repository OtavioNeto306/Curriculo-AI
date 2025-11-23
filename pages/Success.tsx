import React from 'react';
import { useNavigate } from 'react-router-dom';

const Success: React.FC = () => {
  const navigate = useNavigate();

  const handleDownload = () => {
    // In a real app, this would trigger a PDF generation library
    window.print();
  };

  return (
    <div className="relative flex h-screen w-full flex-col bg-background-light dark:bg-background-dark items-center justify-center p-4">
       <div className="flex flex-col max-w-[480px] w-full bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-8 sm:p-12 items-center text-center border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-6 animate-bounce">
             <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-5xl">check_circle</span>
          </div>
          <h1 className="text-gray-900 dark:text-white text-3xl font-bold mb-3">Seu PDF está pronto!</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Faça o download do seu currículo ou visualize-o agora.</p>
          
          <div className="flex flex-col w-full gap-3">
             <button onClick={handleDownload} className="flex items-center justify-center gap-2 rounded-lg h-12 bg-primary text-white font-bold hover:bg-primary/90 transition-colors shadow-md">
                <span className="material-symbols-outlined">download</span>
                Baixar PDF
             </button>
              <button onClick={() => navigate('/preview')} className="flex items-center justify-center gap-2 rounded-lg h-12 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <span className="material-symbols-outlined">visibility</span>
                Voltar para Editor
             </button>
          </div>
       </div>
    </div>
  );
};

export default Success;
