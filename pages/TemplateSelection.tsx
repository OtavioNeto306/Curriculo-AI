import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';
import { TemplateType } from '../types';

const TemplateSelection: React.FC = () => {
  const { selectedTemplate, setSelectedTemplate } = useResume();
  const navigate = useNavigate();

  const handleApply = () => {
    navigate('/generating');
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display overflow-x-hidden">
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-gray-700 px-4 sm:px-10 py-3 bg-white dark:bg-background-dark">
        <div className="flex items-center gap-4 text-[#111318] dark:text-white">
          <div className="size-6 text-primary">
            <span className="material-symbols-outlined">description</span>
          </div>
          <h2 className="text-[#111318] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">AI Resume Builder</h2>
        </div>
        <button onClick={handleApply} className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-gray-200 dark:bg-gray-700 text-[#111318] dark:text-white text-sm font-bold leading-normal tracking-[0.015em]">
          <span className="truncate">Skip & Generate</span>
        </button>
      </header>

      <main className="flex flex-col gap-8 mt-10 px-4 sm:px-10 pb-10">
        <div className="flex flex-wrap justify-between gap-3">
          <div className="flex min-w-72 flex-col gap-3">
            <p className="text-[#111318] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">Escolha o Modelo do seu Currículo</p>
            <p className="text-[#616e89] dark:text-gray-400 text-base font-normal leading-normal">Selecione o layout que melhor representa sua trajetória profissional.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Template 1: Minimalist */}
          <div onClick={() => setSelectedTemplate('minimalist')} className={`flex flex-col gap-3 pb-3 group cursor-pointer transition-all ${selectedTemplate === 'minimalist' ? 'scale-[1.02]' : ''}`}>
            <div className={`relative w-full overflow-hidden rounded-xl border-2 shadow-lg transition-all ${selectedTemplate === 'minimalist' ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-primary/50'}`}>
               {selectedTemplate === 'minimalist' && (
                <div className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-primary text-white z-10">
                  <span className="material-symbols-outlined text-base">check</span>
                </div>
              )}
              <div className="w-full bg-gray-100 h-64 md:h-80 flex items-center justify-center text-gray-400 bg-white">
                 <div className="p-4 w-3/4 h-3/4 bg-white border shadow-sm text-[6px] overflow-hidden text-left">
                    <div className="font-bold text-[8px] mb-1">JOHN DOE</div>
                    <div className="mb-2">Software Engineer</div>
                    <div className="border-b my-1"></div>
                    <div>Lorem ipsum dolor sit amet...</div>
                 </div>
              </div>
            </div>
            <div>
              <p className="text-[#111318] dark:text-white text-base font-medium leading-normal">Minimalista</p>
              <p className="text-[#616e89] dark:text-gray-400 text-sm font-normal leading-normal">Um design limpo e direto, focado no conteúdo.</p>
            </div>
          </div>

          {/* Template 2: Modern */}
          <div onClick={() => setSelectedTemplate('modern')} className={`flex flex-col gap-3 pb-3 group cursor-pointer transition-all ${selectedTemplate === 'modern' ? 'scale-[1.02]' : ''}`}>
            <div className={`relative w-full overflow-hidden rounded-xl border-2 shadow-lg transition-all ${selectedTemplate === 'modern' ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-primary/50'}`}>
              {selectedTemplate === 'modern' && (
                <div className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-primary text-white z-10">
                  <span className="material-symbols-outlined text-base">check</span>
                </div>
              )}
              <div className="w-full bg-gray-100 h-64 md:h-80 flex items-center justify-center text-gray-400 bg-white">
                  <div className="flex w-3/4 h-3/4 bg-white border shadow-sm text-[6px] overflow-hidden text-left">
                    <div className="w-1/3 bg-blue-100 p-1">
                        <div className="w-6 h-6 bg-gray-300 rounded-full mb-2"></div>
                        <div>Contact</div>
                    </div>
                    <div className="w-2/3 p-1">
                        <div className="font-bold text-[8px]">JOHN DOE</div>
                        <div className="mb-1">Developer</div>
                         <div>Lorem ipsum dolor...</div>
                    </div>
                 </div>
              </div>
            </div>
            <div>
              <p className="text-[#111318] dark:text-white text-base font-medium leading-normal">Moderno</p>
              <p className="text-[#616e89] dark:text-gray-400 text-sm font-normal leading-normal">Um layout contemporâneo com uma barra lateral colorida.</p>
            </div>
          </div>

          {/* Template 3: Highlight */}
          <div onClick={() => setSelectedTemplate('highlight')} className={`flex flex-col gap-3 pb-3 group cursor-pointer transition-all ${selectedTemplate === 'highlight' ? 'scale-[1.02]' : ''}`}>
            <div className={`relative w-full overflow-hidden rounded-xl border-2 shadow-lg transition-all ${selectedTemplate === 'highlight' ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-primary/50'}`}>
              {selectedTemplate === 'highlight' && (
                <div className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-primary text-white z-10">
                  <span className="material-symbols-outlined text-base">check</span>
                </div>
              )}
              <div className="w-full bg-gray-100 h-64 md:h-80 flex items-center justify-center text-gray-400 bg-white">
                   <div className="p-4 w-3/4 h-3/4 bg-white border shadow-sm text-[6px] overflow-hidden text-left">
                    <div className="font-bold text-[10px] mb-1 text-center text-blue-600">JOHN DOE</div>
                    <div className="text-center mb-2">Creative Director</div>
                    <div className="text-center bg-gray-100 p-1 mb-1">SUMMARY</div>
                 </div>
              </div>
            </div>
            <div>
              <p className="text-[#111318] dark:text-white text-base font-medium leading-normal">Destaque</p>
              <p className="text-[#616e89] dark:text-gray-400 text-sm font-normal leading-normal">Destaque seu nome e resumo com este modelo ousado.</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button onClick={handleApply} className="flex w-full max-w-xs cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors">
            <span className="truncate">Aplicar modelo</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default TemplateSelection;
