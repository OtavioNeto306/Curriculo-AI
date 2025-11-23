import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';
import { ResumeData } from '../types';

// Minimalist Template Component
const MinimalistTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <div className="p-12 bg-white text-gray-900 font-serif min-h-[1000px]">
    <header className="border-b-2 border-gray-900 pb-4 mb-6">
        <h1 className="text-4xl font-bold uppercase tracking-widest">{data.fullName || "Your Name"}</h1>
        <div className="flex flex-wrap gap-4 text-sm mt-2 text-gray-600">
            {data.email && <span>{data.email}</span>}
            {data.phone && <span>{data.phone}</span>}
            {data.cityState && <span>{data.cityState}</span>}
            {data.linkedin && <span>{data.linkedin}</span>}
            {data.github && <span>{data.github}</span>}
            {data.cnh && <span>CNH: {data.cnh}</span>}
        </div>
    </header>
    
    {data.summary && (
        <section className="mb-6">
            <h2 className="font-bold uppercase text-sm mb-2 tracking-wider">Professional Summary</h2>
            <p className="text-sm leading-relaxed">{data.summary}</p>
        </section>
    )}

    {data.experiences && data.experiences.length > 0 && (
        <section className="mb-6">
            <h2 className="font-bold uppercase text-sm mb-4 tracking-wider border-b border-gray-200 pb-1">Experience</h2>
            {data.experiences.map(exp => (
                <div key={exp.id} className="mb-4">
                    <div className="flex justify-between items-baseline">
                        <h3 className="font-bold">{exp.title}</h3>
                        <span className="text-xs italic">{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <p className="text-sm font-semibold mb-1">{exp.company}</p>
                    <p className="text-sm text-gray-700 whitespace-pre-line">{exp.description}</p>
                </div>
            ))}
        </section>
    )}

     {data.projects && data.projects.length > 0 && (
        <section className="mb-6">
            <h2 className="font-bold uppercase text-sm mb-4 tracking-wider border-b border-gray-200 pb-1">Projects</h2>
            {data.projects.map(proj => (
                <div key={proj.id} className="mb-3">
                    <div className="flex justify-between items-baseline">
                         <h3 className="font-bold text-sm">
                            {proj.name}
                            {proj.url && <a href={proj.url} target="_blank" rel="noreferrer" className="ml-2 text-primary font-normal text-xs underline">{proj.url}</a>}
                         </h3>
                    </div>
                    <p className="text-sm text-gray-700 mb-1">{proj.description}</p>
                    {proj.technologies && proj.technologies.length > 0 && (
                        <p className="text-xs text-gray-500">Tech: {proj.technologies.join(', ')}</p>
                    )}
                </div>
            ))}
        </section>
    )}

    <div className="grid grid-cols-2 gap-8">
        <div>
            {data.skills && data.skills.length > 0 && (
                <section className="mb-6">
                    <h2 className="font-bold uppercase text-sm mb-4 tracking-wider border-b border-gray-200 pb-1">Skills</h2>
                    <ul className="text-sm list-disc pl-4">
                        {data.skills.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                </section>
            )}
            {data.certifications && data.certifications.length > 0 && (
                <section className="mb-6">
                    <h2 className="font-bold uppercase text-sm mb-4 tracking-wider border-b border-gray-200 pb-1">Certifications</h2>
                    <ul className="text-sm list-disc pl-4">
                         {data.certifications.map((cert, i) => (
                             <li key={i}>
                                <span className="font-semibold">{cert.name}</span> - {cert.institution} ({cert.year})
                             </li>
                         ))}
                    </ul>
                </section>
            )}
        </div>

        <div>
            {data.education && data.education.length > 0 && (
                <section className="mb-6">
                    <h2 className="font-bold uppercase text-sm mb-4 tracking-wider border-b border-gray-200 pb-1">Education</h2>
                    {data.education.map(edu => (
                        <div key={edu.id} className="mb-2">
                            <p className="font-bold text-sm">{edu.institution}</p>
                            <p className="text-sm">{edu.degree}</p>
                            <p className="text-xs text-gray-500">{edu.year}</p>
                        </div>
                    ))}
                </section>
            )}
            {data.languages && data.languages.length > 0 && (
                <section className="mb-6">
                    <h2 className="font-bold uppercase text-sm mb-4 tracking-wider border-b border-gray-200 pb-1">Languages</h2>
                    <ul className="text-sm list-disc pl-4">
                        {data.languages.map((lang, i) => (
                            <li key={i}>{lang.name} <span className="text-gray-500 text-xs">({lang.level})</span></li>
                        ))}
                    </ul>
                </section>
            )}
             {/* Additional Info & Custom Fields */}
             {(data.availability || data.openToTravel || data.remoteWork || data.customFields.length > 0) && (
                <section>
                    <h2 className="font-bold uppercase text-sm mb-4 tracking-wider border-b border-gray-200 pb-1">Additional</h2>
                    <ul className="text-sm list-none">
                        {data.availability && <li><span className="font-semibold">Availability:</span> {data.availability}</li>}
                        {data.openToTravel && <li>Available to travel</li>}
                        {data.remoteWork && <li>Open to remote/hybrid work</li>}
                        {data.customFields.map(f => (
                            <li key={f.id}><span className="font-semibold">{f.label}:</span> {f.value}</li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    </div>
  </div>
);

// Modern Template Component (Blue sidebar)
const ModernTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
    <div className="flex bg-white min-h-[1000px] text-gray-800">
        <aside className="w-1/3 bg-[#1e293b] text-white p-8 flex flex-col gap-6">
            <div className="text-center">
                <div className="w-24 h-24 bg-gray-400 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-gray-700 uppercase overflow-hidden bg-white">
                     {data.fullName ? data.fullName.charAt(0) : "U"}
                </div>
                <h2 className="text-lg font-bold tracking-widest border-b border-gray-500 pb-2 mb-2">CONTACT</h2>
                <div className="text-sm space-y-2 break-words opacity-90">
                    {data.email && <div>{data.email}</div>}
                    {data.phone && <div>{data.phone}</div>}
                    {data.cityState && <div>{data.cityState}</div>}
                    {data.linkedin && <div>{data.linkedin}</div>}
                    {data.github && <div>{data.github}</div>}
                </div>
            </div>

            {data.education && data.education.length > 0 && (
                <div>
                    <h2 className="text-lg font-bold border-b border-gray-500 pb-2 mb-4 tracking-widest">EDUCATION</h2>
                    {data.education.map(edu => (
                        <div key={edu.id} className="mb-3">
                            <p className="font-bold text-sm">{edu.degree}</p>
                            <p className="text-xs opacity-80">{edu.institution}</p>
                            <p className="text-xs opacity-60">{edu.year}</p>
                        </div>
                    ))}
                </div>
            )}

            {data.skills && data.skills.length > 0 && (
                <div>
                    <h2 className="text-lg font-bold border-b border-gray-500 pb-2 mb-4 tracking-widest">SKILLS</h2>
                    <div className="flex flex-wrap gap-2">
                        {data.skills.map((s, i) => (
                            <span key={i} className="bg-gray-700 px-2 py-1 rounded text-xs">{s}</span>
                        ))}
                    </div>
                </div>
            )}

            {data.languages && data.languages.length > 0 && (
                <div>
                    <h2 className="text-lg font-bold border-b border-gray-500 pb-2 mb-4 tracking-widest">LANGUAGES</h2>
                    <ul className="text-sm space-y-1">
                        {data.languages.map(l => (
                            <li key={l.id} className="flex justify-between">
                                <span>{l.name}</span>
                                <span className="opacity-60 text-xs">{l.level}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            
            {data.certifications && data.certifications.length > 0 && (
                <div>
                    <h2 className="text-lg font-bold border-b border-gray-500 pb-2 mb-4 tracking-widest">CERTIFICATIONS</h2>
                    <ul className="text-sm space-y-2">
                        {data.certifications.map(c => (
                            <li key={c.id}>
                                <div className="font-bold">{c.name}</div>
                                <div className="text-xs opacity-70">{c.institution}, {c.year}</div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </aside>

        <main className="w-2/3 p-8">
             <div className="mb-8">
                 <h1 className="text-4xl font-bold text-gray-800 mb-1">{data.fullName || "Your Name"}</h1>
                 <p className="text-xl text-primary font-medium tracking-wide">{data.experiences?.[0]?.title || "Professional"}</p>
             </div>

             {data.summary && (
                 <div className="mb-8">
                     <h3 className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-widest border-b pb-1">Profile</h3>
                     <p className="text-gray-700 text-sm leading-relaxed">{data.summary}</p>
                 </div>
             )}

             {data.experiences && data.experiences.length > 0 && (
                 <div className="mb-8">
                     <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-widest border-b pb-1">Work Experience</h3>
                     {data.experiences.map(exp => (
                         <div key={exp.id} className="mb-6 relative pl-4 border-l-2 border-gray-200">
                             <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-primary"></div>
                             <h4 className="font-bold text-gray-800 text-lg">{exp.title}</h4>
                             <div className="flex justify-between text-sm text-gray-500 mb-2">
                                 <span className="font-semibold text-gray-700">{exp.company}</span>
                                 <span>{exp.startDate} - {exp.endDate}</span>
                             </div>
                             <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{exp.description}</p>
                         </div>
                     ))}
                 </div>
             )}

             {data.projects && data.projects.length > 0 && (
                 <div className="mb-8">
                     <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-widest border-b pb-1">Key Projects</h3>
                     {data.projects.map(proj => (
                         <div key={proj.id} className="mb-4">
                             <div className="flex items-baseline gap-2">
                                 <h4 className="font-bold text-gray-800">{proj.name}</h4>
                                 {proj.url && <a href={proj.url} target="_blank" className="text-xs text-primary underline">Link</a>}
                             </div>
                             <p className="text-sm text-gray-600 mb-1">{proj.description}</p>
                             {proj.technologies.length > 0 && (
                                 <div className="flex gap-1 flex-wrap">
                                     {proj.technologies.map((t,i) => <span key={i} className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 border border-gray-200">{t}</span>)}
                                 </div>
                             )}
                         </div>
                     ))}
                 </div>
             )}
             
             {(data.availability || data.customFields.length > 0) && (
                 <div className="mb-8">
                     <h3 className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-widest border-b pb-1">Additional Info</h3>
                     <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        {data.availability && <div><span className="font-semibold">Availability:</span> {data.availability}</div>}
                        {data.customFields.map(f => (
                            <div key={f.id}><span className="font-semibold">{f.label}:</span> {f.value}</div>
                        ))}
                     </div>
                 </div>
             )}
        </main>
    </div>
);

// Highlight Template Component
const HighlightTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
    <div className="bg-white p-10 min-h-[1000px] font-sans text-gray-800">
        <div className="text-center mb-10">
            <h1 className="text-5xl font-black text-primary mb-2 tracking-tight">{data.fullName || "Your Name"}</h1>
            <p className="text-gray-500 uppercase tracking-[0.3em] text-sm">{data.experiences?.[0]?.title || "Professional"}</p>
            <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm font-medium text-gray-600">
                 {data.email && <span>{data.email}</span>}
                 {data.phone && <span>| {data.phone}</span>}
                 {data.cityState && <span>| {data.cityState}</span>}
                 {data.linkedin && <span>| LinkedIn</span>}
            </div>
        </div>

        {data.summary && (
             <div className="bg-gray-50 p-8 rounded-xl mb-10 border-l-4 border-primary shadow-sm">
                 <p className="text-center italic text-gray-700 leading-relaxed">{data.summary}</p>
             </div>
        )}

        <div className="grid grid-cols-12 gap-8">
            {/* Left Main Column */}
            <div className="col-span-8">
                 {data.experiences && data.experiences.length > 0 && (
                     <div className="mb-10">
                         <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-2">
                            <span className="material-symbols-outlined text-primary">work</span> Experience
                         </h3>
                         {data.experiences.map(exp => (
                             <div key={exp.id} className="mb-8">
                                 <div className="flex justify-between items-end mb-1">
                                     <h4 className="text-lg font-bold text-gray-900">{exp.title}</h4>
                                     <span className="text-xs font-bold text-white bg-primary px-2 py-1 rounded">{exp.startDate} - {exp.endDate}</span>
                                 </div>
                                 <p className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">{exp.company}</p>
                                 <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{exp.description}</p>
                             </div>
                         ))}
                     </div>
                 )}

                 {data.projects && data.projects.length > 0 && (
                     <div className="mb-10">
                         <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-2">
                            <span className="material-symbols-outlined text-primary">rocket_launch</span> Projects
                         </h3>
                         {data.projects.map(proj => (
                             <div key={proj.id} className="mb-6 bg-gray-50 p-4 rounded-lg">
                                 <div className="flex justify-between mb-2">
                                    <h4 className="font-bold text-gray-900">{proj.name}</h4>
                                    {proj.url && <a href={proj.url} className="text-xs text-primary underline">View Project</a>}
                                 </div>
                                 <p className="text-sm text-gray-700 mb-2">{proj.description}</p>
                                 <div className="flex flex-wrap gap-1">
                                     {proj.technologies.map((t,i) => <span key={i} className="text-xs font-mono text-gray-500">#{t}</span>)}
                                 </div>
                             </div>
                         ))}
                     </div>
                 )}
            </div>

            {/* Right Sidebar Column */}
            <div className="col-span-4 flex flex-col gap-8">
                {data.skills && data.skills.length > 0 && (
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">psychology</span> Skills
                         </h3>
                         <div className="flex flex-col gap-2">
                             {data.skills.map((s, i) => (
                                 <div key={i} className="flex items-center justify-between text-sm">
                                     <span className="font-medium">{s}</span>
                                     <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                         <div className="h-full bg-primary" style={{width: '100%'}}></div>
                                     </div>
                                 </div>
                             ))}
                         </div>
                    </div>
                )}

                {data.education && data.education.length > 0 && (
                     <div>
                         <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">school</span> Education
                         </h3>
                         {data.education.map(edu => (
                             <div key={edu.id} className="mb-4 border-l-2 border-gray-200 pl-3">
                                 <div className="font-bold text-sm">{edu.institution}</div>
                                 <div className="text-sm text-gray-600">{edu.degree}</div>
                                 <div className="text-xs text-gray-400 mt-1">{edu.year}</div>
                             </div>
                         ))}
                     </div>
                )}
                
                {data.languages && data.languages.length > 0 && (
                     <div>
                         <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">language</span> Languages
                         </h3>
                         <ul className="space-y-2">
                             {data.languages.map(l => (
                                 <li key={l.id} className="text-sm border-b border-gray-100 pb-1">
                                     <span className="font-bold">{l.name}</span> <span className="text-gray-500 text-xs">- {l.level}</span>
                                 </li>
                             ))}
                         </ul>
                     </div>
                )}

                {data.certifications && data.certifications.length > 0 && (
                     <div>
                         <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">verified</span> Certifications
                         </h3>
                         <ul className="space-y-3">
                             {data.certifications.map(c => (
                                 <li key={c.id} className="text-sm bg-blue-50 p-3 rounded text-blue-900">
                                     <div className="font-bold">{c.name}</div>
                                     <div className="text-xs opacity-80">{c.institution}</div>
                                 </li>
                             ))}
                         </ul>
                     </div>
                )}
            </div>
        </div>
    </div>
);


const ResumePreview: React.FC = () => {
  const { generatedResume, resumeData, selectedTemplate, setSelectedTemplate } = useResume();
  const navigate = useNavigate();

  // Fallback to raw data if generated is null (e.g. skipped or error)
  const displayData = generatedResume || resumeData;

  const handleDownload = () => {
    // Simple print trigger, allows saving as PDF
    window.print();
    setTimeout(() => {
        navigate('/success');
    }, 1000);
  };

  return (
    <div className="flex h-screen w-full bg-background-light dark:bg-background-dark overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[280px] flex-shrink-0 flex flex-col bg-[#F3F4F6] dark:bg-gray-900 p-6 border-r border-gray-200 dark:border-gray-800 no-print">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-full bg-primary/10 text-primary">
              <span className="material-symbols-outlined">description</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-gray-900 dark:text-white text-base font-medium leading-normal">AI Resume Builder</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">Craft your perfect resume</p>
            </div>
          </div>
          <nav className="flex flex-col gap-2">
            <button onClick={() => navigate('/templates')} className="flex items-center gap-3 px-3 py-2 rounded text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800 w-full text-left">
              <span className="material-symbols-outlined text-gray-700 dark:text-gray-300">swap_horiz</span>
              <p className="text-sm font-medium leading-normal">Trocar modelo</p>
            </button>
            <button onClick={() => navigate('/info')} className="flex items-center gap-3 px-3 py-2 rounded text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800 w-full text-left">
              <span className="material-symbols-outlined text-gray-700 dark:text-gray-300">edit_note</span>
              <p className="text-sm font-medium leading-normal">Editar informações</p>
            </button>
            <button onClick={handleDownload} className="flex items-center gap-3 px-3 py-2 rounded text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800 w-full text-left">
              <span className="material-symbols-outlined text-gray-700 dark:text-gray-300">download</span>
              <p className="text-sm font-medium leading-normal">Finalizar (PDF)</p>
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="flex-shrink-0 p-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-background-dark flex justify-between items-center no-print">
             <div className="flex flex-col">
                <label className="text-gray-500 text-xs font-medium mb-1">Current Template</label>
                <select 
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value as any)}
                    className="form-select rounded-md border-gray-300 py-1 text-sm focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white dark:border-gray-600"
                >
                    <option value="minimalist">Minimalist</option>
                    <option value="modern">Modern</option>
                    <option value="highlight">Highlight</option>
                </select>
             </div>
             <button onClick={() => navigate('/generating')} className="flex items-center justify-center rounded h-10 bg-primary text-white gap-2 text-sm font-bold px-4 shadow hover:bg-primary/90 transition-colors">
                <span className="material-symbols-outlined text-base">auto_awesome</span>
                <span>Regenerate with AI</span>
             </button>
        </header>

        {/* Resume Preview Area */}
        <div className="flex-1 overflow-y-auto p-8 bg-gray-100 dark:bg-black/20 print:p-0 print:overflow-visible print:bg-white">
            <div className="mx-auto max-w-[210mm] shadow-2xl transition-all duration-300 print:shadow-none print:w-full print:max-w-none">
                {selectedTemplate === 'minimalist' && <MinimalistTemplate data={displayData} />}
                {selectedTemplate === 'modern' && <ModernTemplate data={displayData} />}
                {selectedTemplate === 'highlight' && <HighlightTemplate data={displayData} />}
            </div>
        </div>
      </main>
    </div>
  );
};

export default ResumePreview;