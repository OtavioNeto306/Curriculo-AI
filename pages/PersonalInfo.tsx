import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';
import { Experience, Education, Course, Language, Project, Certification, CustomField } from '../types';
import { v4 as uuidv4 } from 'uuid';

const PersonalInfo: React.FC = () => {
  const { resumeData, updateResumeDataField } = useResume();
  const navigate = useNavigate();

  // Local states for inputs that require "Enter" to add
  const [skillInput, setSkillInput] = useState("");
  const [softSkillInput, setSoftSkillInput] = useState("");
  const [projectTagInputs, setProjectTagInputs] = useState<Record<string, string>>({});

  // --- Handlers for Arrays ---

  // Experience
  const addExperience = () => {
    const newExp: Experience = { id: uuidv4(), title: "", company: "", startDate: "", endDate: "", description: "" };
    updateResumeDataField('experiences', [...resumeData.experiences, newExp]);
  };
  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    const newExps = resumeData.experiences.map(exp => exp.id === id ? { ...exp, [field]: value } : exp);
    updateResumeDataField('experiences', newExps);
  };

  // Education
  const addEducation = () => {
     const newEdu: Education = { id: uuidv4(), institution: "", degree: "", year: "" };
     updateResumeDataField('education', [...resumeData.education, newEdu]);
  }
  const updateEducation = (id: string, field: keyof Education, value: string) => {
    const newEdus = resumeData.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu);
    updateResumeDataField('education', newEdus);
  };

  // Skills (Hard)
  const addSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      updateResumeDataField('skills', [...resumeData.skills, skillInput.trim()]);
      setSkillInput("");
    }
  };
  const removeSkill = (skill: string) => {
    updateResumeDataField('skills', resumeData.skills.filter(s => s !== skill));
  };

  // Soft Skills
  const addSoftSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && softSkillInput.trim()) {
      e.preventDefault();
      updateResumeDataField('softSkills', [...resumeData.softSkills, softSkillInput.trim()]);
      setSoftSkillInput("");
    }
  };
  const removeSoftSkill = (skill: string) => {
    updateResumeDataField('softSkills', resumeData.softSkills.filter(s => s !== skill));
  };

  // Languages
  const addLanguage = () => {
    const newLang: Language = { id: uuidv4(), name: "", level: "Básico" };
    updateResumeDataField('languages', [...resumeData.languages, newLang]);
  };
  const updateLanguage = (id: string, field: keyof Language, value: string) => {
    const newLangs = resumeData.languages.map(l => l.id === id ? { ...l, [field]: value } : l);
    updateResumeDataField('languages', newLangs);
  };
  const removeLanguage = (id: string) => {
    updateResumeDataField('languages', resumeData.languages.filter(l => l.id !== id));
  };

  // Projects
  const addProject = () => {
    const newProj: Project = { id: uuidv4(), name: "", url: "", description: "", technologies: [] };
    updateResumeDataField('projects', [...resumeData.projects, newProj]);
  };
  const updateProject = (id: string, field: keyof Project, value: any) => {
    const newProjs = resumeData.projects.map(p => p.id === id ? { ...p, [field]: value } : p);
    updateResumeDataField('projects', newProjs);
  };
  const addProjectTech = (e: React.KeyboardEvent, projectId: string) => {
    const val = projectTagInputs[projectId] || "";
    if (e.key === 'Enter' && val.trim()) {
      e.preventDefault();
      const project = resumeData.projects.find(p => p.id === projectId);
      if (project) {
        updateProject(projectId, 'technologies', [...project.technologies, val.trim()]);
        setProjectTagInputs(prev => ({ ...prev, [projectId]: "" }));
      }
    }
  };
  const removeProjectTech = (projectId: string, tech: string) => {
     const project = resumeData.projects.find(p => p.id === projectId);
     if(project) {
        updateProject(projectId, 'technologies', project.technologies.filter(t => t !== tech));
     }
  }

  // Certifications
  const addCertification = () => {
    const newCert: Certification = { id: uuidv4(), name: "", institution: "", year: "" };
    updateResumeDataField('certifications', [...resumeData.certifications, newCert]);
  };
  const updateCertification = (id: string, field: keyof Certification, value: string) => {
    const newCerts = resumeData.certifications.map(c => c.id === id ? { ...c, [field]: value } : c);
    updateResumeDataField('certifications', newCerts);
  };

  // Custom Fields
  const addCustomField = () => {
    const newField: CustomField = { id: uuidv4(), label: "", value: "" };
    updateResumeDataField('customFields', [...resumeData.customFields, newField]);
  };
  const updateCustomField = (id: string, field: keyof CustomField, value: string) => {
    const newFields = resumeData.customFields.map(f => f.id === id ? { ...f, [field]: value } : f);
    updateResumeDataField('customFields', newFields);
  };
  const removeCustomField = (id: string) => {
    updateResumeDataField('customFields', resumeData.customFields.filter(f => f.id !== id));
  };

  return (
    <div className="relative flex min-h-screen w-full flex-row bg-background-light dark:bg-background-dark">
      {/* SideNavBar */}
      <aside className="sticky top-0 flex h-screen min-w-[250px] max-w-[250px] flex-col justify-between border-r border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-background-dark">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-full bg-primary/10 text-primary">
              <span className="material-symbols-outlined">description</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-gray-900 dark:text-white text-base font-medium leading-normal">AI Resume Builder</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">Welcome Back!</p>
            </div>
          </div>
          <nav className="flex flex-col gap-2">
            <a className="flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-2 text-primary dark:bg-primary/20" href="#">
              <span className="material-symbols-outlined text-primary">add_circle</span>
              <p className="text-sm font-medium leading-normal">Create New</p>
            </a>
            <div className="opacity-50 pointer-events-none">
                 <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800" href="#">
                  <span className="material-symbols-outlined">description</span>
                  <p className="text-sm font-medium leading-normal">My Resumes</p>
                </a>
                <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800" href="#">
                  <span className="material-symbols-outlined">grid_view</span>
                  <p className="text-sm font-medium leading-normal">Templates</p>
                </a>
            </div>
          </nav>
        </div>
        <div className="flex flex-col gap-1">
           <div className="opacity-50 pointer-events-none">
              <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800" href="#">
                <span className="material-symbols-outlined">settings</span>
                <p className="text-sm font-medium leading-normal">Settings</p>
              </a>
              <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800" href="#">
                <span className="material-symbols-outlined">help</span>
                <p className="text-sm font-medium leading-normal">Help</p>
              </a>
          </div>
        </div>
      </aside>

      <main className="flex flex-1 flex-col p-8 overflow-y-auto h-screen">
        <div className="mx-auto w-full max-w-4xl pb-20">
          <header className="mb-8">
            <h1 className="text-4xl font-black leading-tight tracking-[-0.033em] text-gray-900 dark:text-white">Informações para o Currículo</h1>
          </header>

          <div className="flex flex-col gap-4">
            {/* 1. Informações Pessoais */}
            <details className="group rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900/50" open>
              <summary className="flex cursor-pointer list-none items-center justify-between p-4">
                <p className="text-base font-medium text-gray-900 dark:text-white">Informações Pessoais</p>
                <span className="material-symbols-outlined text-gray-600 transition-transform group-open:rotate-180 dark:text-gray-400">expand_more</span>
              </summary>
              <div className="grid grid-cols-1 gap-x-6 gap-y-4 border-t border-gray-200 p-4 dark:border-gray-700 md:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Nome completo*</p>
                  <input className="form-input w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900 focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white" 
                    placeholder="Ex: João da Silva" 
                    value={resumeData.fullName}
                    onChange={e => updateResumeDataField('fullName', e.target.value)}
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Idade</p>
                  <input className="form-input w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900 focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white" 
                    placeholder="Ex: 28" 
                    value={resumeData.age}
                    onChange={e => updateResumeDataField('age', e.target.value)}
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Telefone</p>
                  <input className="form-input w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900 focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white" 
                    placeholder="Ex: (11) 99999-9999" 
                    value={resumeData.phone}
                    onChange={e => updateResumeDataField('phone', e.target.value)}
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Email</p>
                  <input className="form-input w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900 focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white" 
                    placeholder="Ex: joao.silva@email.com" 
                    value={resumeData.email}
                    onChange={e => updateResumeDataField('email', e.target.value)}
                  />
                </label>
                 <label className="flex flex-col gap-2">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Endereço</p>
                  <input className="form-input w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900 focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white" 
                    placeholder="Ex: Rua das Flores, 123" 
                    value={resumeData.address}
                    onChange={e => updateResumeDataField('address', e.target.value)}
                  />
                </label>
                 <label className="flex flex-col gap-2">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Cidade / Estado</p>
                  <input className="form-input w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900 focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white" 
                    placeholder="Ex: São Paulo / SP" 
                    value={resumeData.cityState}
                    onChange={e => updateResumeDataField('cityState', e.target.value)}
                  />
                </label>
                 <label className="flex flex-col gap-2">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">LinkedIn</p>
                  <input className="form-input w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900 focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white" 
                    placeholder="Ex: linkedin.com/in/joao" 
                    value={resumeData.linkedin}
                    onChange={e => updateResumeDataField('linkedin', e.target.value)}
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">GitHub</p>
                  <input className="form-input w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900 focus:border-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white" 
                    placeholder="Ex: github.com/joao" 
                    value={resumeData.github}
                    onChange={e => updateResumeDataField('github', e.target.value)}
                  />
                </label>
              </div>
            </details>

            {/* 2. Objetivo Profissional */}
            <details className="group rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900/50">
              <summary className="flex cursor-pointer list-none items-center justify-between p-4">
                <p className="text-base font-medium text-gray-900 dark:text-white">Objetivo Profissional</p>
                <span className="material-symbols-outlined text-gray-600 transition-transform group-open:rotate-180 dark:text-gray-400">expand_more</span>
              </summary>
              <div className="border-t border-gray-200 p-4 dark:border-gray-700">
                 <label className="flex flex-col gap-2">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Descreva seu objetivo</p>
                  <textarea className="form-textarea w-full rounded-lg border-gray-300 text-sm dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:border-primary focus:ring-primary" 
                    rows={2}
                    placeholder="Ex: Atuar como Desenvolvedor Front-end contribuindo com interfaces modernas e acessíveis."
                    value={resumeData.objective}
                    onChange={e => updateResumeDataField('objective', e.target.value)}
                  />
                </label>
              </div>
            </details>

            {/* 3. Resumo Profissional */}
            <details className="group rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900/50">
              <summary className="flex cursor-pointer list-none items-center justify-between p-4">
                <p className="text-base font-medium text-gray-900 dark:text-white">Resumo Profissional</p>
                <span className="material-symbols-outlined text-gray-600 transition-transform group-open:rotate-180 dark:text-gray-400">expand_more</span>
              </summary>
              <div className="border-t border-gray-200 p-4 dark:border-gray-700">
                 <label className="flex flex-col gap-2">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Resumo da carreira</p>
                  <textarea className="form-textarea w-full rounded-lg border-gray-300 text-sm dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:border-primary focus:ring-primary" 
                    rows={5}
                    placeholder="Descreva um resumo das suas principais habilidades e experiências. Se deixar em branco, a IA irá gerar um automaticamente."
                    value={resumeData.summary}
                    onChange={e => updateResumeDataField('summary', e.target.value)}
                  />
                </label>
              </div>
            </details>

            {/* 4. Experiências Profissionais */}
            <details className="group rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900/50">
              <summary className="flex cursor-pointer list-none items-center justify-between p-4">
                <p className="text-base font-medium text-gray-900 dark:text-white">Experiências Profissionais</p>
                <span className="material-symbols-outlined text-gray-600 transition-transform group-open:rotate-180 dark:text-gray-400">expand_more</span>
              </summary>
              <div className="space-y-4 border-t border-gray-200 p-4 dark:border-gray-700">
                {resumeData.experiences.map((exp) => (
                  <div key={exp.id} className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                    <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
                      <label className="flex flex-col gap-2">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Cargo</p>
                        <input className="form-input w-full rounded-lg border-gray-300 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:border-primary focus:ring-primary" 
                          value={exp.title}
                          onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                          placeholder="Ex: Desenvolvedor Sênior"
                        />
                      </label>
                      <label className="flex flex-col gap-2">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Empresa</p>
                         <input className="form-input w-full rounded-lg border-gray-300 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:border-primary focus:ring-primary" 
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                          placeholder="Ex: Google"
                        />
                      </label>
                      <label className="flex flex-col gap-2">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Início</p>
                        <input type="text" className="form-input w-full rounded-lg border-gray-300 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:border-primary focus:ring-primary" 
                          placeholder="Ex: Jan 2020"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                        />
                      </label>
                       <label className="flex flex-col gap-2">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Fim</p>
                        <input type="text" className="form-input w-full rounded-lg border-gray-300 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:border-primary focus:ring-primary" 
                          placeholder="Ex: Jan 2022"
                          value={exp.endDate}
                          onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                        />
                      </label>
                       <label className="col-span-1 flex flex-col gap-2 md:col-span-2">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Descrição</p>
                        <textarea className="form-textarea w-full rounded-lg border-gray-300 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:border-primary focus:ring-primary" rows={3}
                           value={exp.description}
                           onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                           placeholder="Liste suas responsabilidades e conquistas..."
                        ></textarea>
                      </label>
                    </div>
                  </div>
                ))}
                <button onClick={addExperience} className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30">
                  <span className="material-symbols-outlined text-base">add</span>
                  Adicionar Experiência
                </button>
              </div>
            </details>

             {/* 5. Habilidades (Hard Skills) */}
            <details className="group rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900/50">
              <summary className="flex cursor-pointer list-none items-center justify-between p-4">
                <p className="text-base font-medium text-gray-900 dark:text-white">Habilidades Técnicas (Hard Skills)</p>
                <span className="material-symbols-outlined text-gray-600 transition-transform group-open:rotate-180 dark:text-gray-400">expand_more</span>
              </summary>
              <div className="border-t border-gray-200 p-4 dark:border-gray-700">
                 <label className="flex flex-col gap-2">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Adicione suas habilidades</p>
                  <input className="form-input w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:border-primary focus:ring-primary" 
                    placeholder="Digite uma habilidade e pressione Enter (Ex: React, Figma, Java...)" 
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={addSkill}
                  />
                </label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {resumeData.skills.map((skill, index) => (
                    <span key={index} className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary dark:bg-primary/20">
                      {skill}
                      <button onClick={() => removeSkill(skill)} className="text-primary/70 hover:text-primary">
                        <span className="material-symbols-outlined text-base">close</span>
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </details>

            {/* 6. Soft Skills */}
            <details className="group rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900/50">
              <summary className="flex cursor-pointer list-none items-center justify-between p-4">
                <p className="text-base font-medium text-gray-900 dark:text-white">Competências Comportamentais (Soft Skills)</p>
                <span className="material-symbols-outlined text-gray-600 transition-transform group-open:rotate-180 dark:text-gray-400">expand_more</span>
              </summary>
              <div className="border-t border-gray-200 p-4 dark:border-gray-700">
                 <label className="flex flex-col gap-2">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Adicione suas competências</p>
                  <input className="form-input w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:border-primary focus:ring-primary" 
                    placeholder="Digite uma competência e pressione Enter (ex: Proatividade, Liderança...)" 
                    value={softSkillInput}
                    onChange={(e) => setSoftSkillInput(e.target.value)}
                    onKeyDown={addSoftSkill}
                  />
                </label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {resumeData.softSkills.map((skill, index) => (
                    <span key={index} className="flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                      {skill}
                      <button onClick={() => removeSoftSkill(skill)} className="text-purple-700/70 hover:text-purple-900 dark:hover:text-purple-100">
                        <span className="material-symbols-outlined text-base">close</span>
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </details>

            {/* 7. Formação Acadêmica */}
            <details className="group rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900/50">
              <summary className="flex cursor-pointer list-none items-center justify-between p-4">
                <p className="text-base font-medium text-gray-900 dark:text-white">Formação Acadêmica</p>
                <span className="material-symbols-outlined text-gray-600 transition-transform group-open:rotate-180 dark:text-gray-400">expand_more</span>
              </summary>
              <div className="space-y-4 border-t border-gray-200 p-4 dark:border-gray-700">
                 {resumeData.education.map((edu) => (
                  <div key={edu.id} className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                    <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-3">
                      <label className="flex flex-col gap-2 md:col-span-2">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Instituição</p>
                        <input className="form-input w-full rounded-lg border-gray-300 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:border-primary focus:ring-primary" 
                          value={edu.institution}
                          onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                          placeholder="Ex: Universidade de São Paulo"
                        />
                      </label>
                      <label className="flex flex-col gap-2">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Ano</p>
                        <input className="form-input w-full rounded-lg border-gray-300 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:border-primary focus:ring-primary" 
                          value={edu.year}
                          onChange={(e) => updateEducation(edu.id, 'year', e.target.value)}
                          placeholder="Ex: 2019 - 2023"
                        />
                      </label>
                      <label className="col-span-full flex flex-col gap-2">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Grau / Curso</p>
                        <input className="form-input w-full rounded-lg border-gray-300 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:border-primary focus:ring-primary" 
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                          placeholder="Ex: Bacharelado em Ciência da Computação"
                        />
                      </label>
                    </div>
                  </div>
                 ))}
                <button onClick={addEducation} className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30">
                  <span className="material-symbols-outlined text-base">add</span>
                  Adicionar Formação
                </button>
              </div>
            </details>

            {/* 8. Idiomas */}
             <details className="group rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900/50">
              <summary className="flex cursor-pointer list-none items-center justify-between p-4">
                <p className="text-base font-medium text-gray-900 dark:text-white">Idiomas</p>
                <span className="material-symbols-outlined text-gray-600 transition-transform group-open:rotate-180 dark:text-gray-400">expand_more</span>
              </summary>
              <div className="space-y-4 border-t border-gray-200 p-4 dark:border-gray-700">
                {resumeData.languages.map((lang) => (
                  <div key={lang.id} className="flex flex-col md:flex-row gap-4 items-start md:items-end rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                      <label className="flex flex-col gap-2 flex-1 w-full">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Idioma</p>
                        <input className="form-input w-full rounded-lg border-gray-300 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:border-primary focus:ring-primary" 
                          value={lang.name}
                          onChange={(e) => updateLanguage(lang.id, 'name', e.target.value)}
                          placeholder="Ex: Inglês"
                        />
                      </label>
                      <label className="flex flex-col gap-2 w-full md:w-48">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Nível</p>
                        <select className="form-select w-full rounded-lg border-gray-300 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:border-primary focus:ring-primary"
                           value={lang.level}
                           onChange={(e) => updateLanguage(lang.id, 'level', e.target.value)}
                        >
                            <option>Básico</option>
                            <option>Intermediário</option>
                            <option>Avançado</option>
                            <option>Fluente</option>
                            <option>Nativo</option>
                        </select>
                      </label>
                       <button onClick={() => removeLanguage(lang.id)} className="flex items-center justify-center w-10 h-10 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg mb-[1px]">
                        <span className="material-symbols-outlined text-xl">delete</span>
                      </button>
                  </div>
                ))}
                <button onClick={addLanguage} className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30">
                  <span className="material-symbols-outlined text-base">add</span>
                  Adicionar Idioma
                </button>
              </div>
            </details>

            {/* 9. Projetos Relevantes */}
            <details className="group rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900/50">
              <summary className="flex cursor-pointer list-none items-center justify-between p-4">
                <p className="text-base font-medium text-gray-900 dark:text-white">Projetos Relevantes</p>
                <span className="material-symbols-outlined text-gray-600 transition-transform group-open:rotate-180 dark:text-gray-400">expand_more</span>
              </summary>
              <div className="space-y-4 border-t border-gray-200 p-4 dark:border-gray-700">
                {resumeData.projects.map((proj) => (
                  <div key={proj.id} className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                    <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
                      <label className="flex flex-col gap-2">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Nome do Projeto</p>
                        <input className="form-input w-full rounded-lg border-gray-300 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:border-primary focus:ring-primary" 
                          value={proj.name}
                          onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
                          placeholder="Ex: E-commerce App"
                        />
                      </label>
                      <label className="flex flex-col gap-2">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">URL (Opcional)</p>
                        <input className="form-input w-full rounded-lg border-gray-300 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:border-primary focus:ring-primary" 
                          value={proj.url}
                          onChange={(e) => updateProject(proj.id, 'url', e.target.value)}
                          placeholder="Ex: github.com/meu-projeto"
                        />
                      </label>
                       <label className="col-span-full flex flex-col gap-2">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Descrição</p>
                        <textarea className="form-textarea w-full rounded-lg border-gray-300 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:border-primary focus:ring-primary" rows={2}
                           value={proj.description}
                           onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                           placeholder="O que o projeto faz e qual foi seu papel..."
                        ></textarea>
                      </label>
                       <label className="col-span-full flex flex-col gap-2">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Tecnologias utilizadas</p>
                         <div className="flex flex-wrap gap-2 mb-2">
                            {proj.technologies.map((tech, i) => (
                                <span key={i} className="inline-flex items-center gap-1 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded-md">
                                    {tech}
                                    <button onClick={() => removeProjectTech(proj.id, tech)} className="hover:text-red-500"><span className="material-symbols-outlined text-xs">close</span></button>
                                </span>
                            ))}
                         </div>
                         <input className="form-input w-full rounded-lg border-gray-300 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:border-primary focus:ring-primary" 
                          value={projectTagInputs[proj.id] || ""}
                          onChange={(e) => setProjectTagInputs(prev => ({...prev, [proj.id]: e.target.value}))}
                          onKeyDown={(e) => addProjectTech(e, proj.id)}
                          placeholder="Digite a tecnologia e Enter (Ex: Node.js, AWS...)"
                        />
                      </label>
                    </div>
                  </div>
                ))}
                <button onClick={addProject} className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30">
                  <span className="material-symbols-outlined text-base">add</span>
                  Adicionar Projeto
                </button>
              </div>
            </details>

            {/* 10. Certificações */}
            <details className="group rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900/50">
              <summary className="flex cursor-pointer list-none items-center justify-between p-4">
                <p className="text-base font-medium text-gray-900 dark:text-white">Certificações</p>
                <span className="material-symbols-outlined text-gray-600 transition-transform group-open:rotate-180 dark:text-gray-400">expand_more</span>
              </summary>
              <div className="space-y-4 border-t border-gray-200 p-4 dark:border-gray-700">
                 {resumeData.certifications.map((cert) => (
                  <div key={cert.id} className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                    <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-3">
                      <label className="flex flex-col gap-2 md:col-span-2">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Nome da Certificação</p>
                        <input className="form-input w-full rounded-lg border-gray-300 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:border-primary focus:ring-primary" 
                          value={cert.name}
                          onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                          placeholder="Ex: AWS Certified Solutions Architect"
                        />
                      </label>
                       <label className="flex flex-col gap-2">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Ano</p>
                        <input className="form-input w-full rounded-lg border-gray-300 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:border-primary focus:ring-primary" 
                          value={cert.year}
                          onChange={(e) => updateCertification(cert.id, 'year', e.target.value)}
                          placeholder="Ex: 2023"
                        />
                      </label>
                      <label className="col-span-full flex flex-col gap-2">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Instituição Emissora</p>
                        <input className="form-input w-full rounded-lg border-gray-300 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:border-primary focus:ring-primary" 
                          value={cert.institution}
                          onChange={(e) => updateCertification(cert.id, 'institution', e.target.value)}
                          placeholder="Ex: Amazon Web Services"
                        />
                      </label>
                    </div>
                  </div>
                 ))}
                <button onClick={addCertification} className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30">
                  <span className="material-symbols-outlined text-base">add</span>
                  Adicionar Certificação
                </button>
              </div>
            </details>

            {/* 11. Informações Adicionais */}
            <details className="group rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900/50">
              <summary className="flex cursor-pointer list-none items-center justify-between p-4">
                <p className="text-base font-medium text-gray-900 dark:text-white">Informações Adicionais</p>
                <span className="material-symbols-outlined text-gray-600 transition-transform group-open:rotate-180 dark:text-gray-400">expand_more</span>
              </summary>
              <div className="border-t border-gray-200 p-4 dark:border-gray-700">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <label className="flex flex-col gap-2">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Disponibilidade</p>
                        <select className="form-select w-full rounded-lg border-gray-300 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:border-primary focus:ring-primary"
                           value={resumeData.availability}
                           onChange={(e) => updateResumeDataField('availability', e.target.value)}
                        >
                            <option value="">Selecione...</option>
                            <option value="Imediata">Imediata</option>
                            <option value="15 dias">15 dias</option>
                            <option value="30 dias">30 dias</option>
                            <option value="A combinar">A combinar</option>
                        </select>
                    </label>
                    <label className="flex flex-col gap-2">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">CNH (Opcional)</p>
                        <input className="form-input w-full rounded-lg border-gray-300 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:border-primary focus:ring-primary" 
                          value={resumeData.cnh}
                          onChange={(e) => updateResumeDataField('cnh', e.target.value)}
                          placeholder="Ex: B"
                        />
                    </label>
                 </div>

                 <div className="flex flex-col sm:flex-row gap-8 mb-6">
                    <label className="inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={resumeData.openToTravel} onChange={(e) => updateResumeDataField('openToTravel', e.target.checked)} />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Aceita viagens</span>
                    </label>
                     <label className="inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={resumeData.remoteWork} onChange={(e) => updateResumeDataField('remoteWork', e.target.checked)} />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Aceita Home Office/Híbrido</span>
                    </label>
                 </div>
                 
                 {/* Custom Fields */}
                 <div className="space-y-3">
                    {resumeData.customFields.map(field => (
                        <div key={field.id} className="flex gap-3 items-center">
                             <input className="form-input w-1/3 rounded-lg border-gray-300 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:border-primary focus:ring-primary" 
                                value={field.label}
                                onChange={(e) => updateCustomField(field.id, 'label', e.target.value)}
                                placeholder="Rótulo (Ex: Portfolio)"
                            />
                            <input className="form-input flex-1 rounded-lg border-gray-300 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:border-primary focus:ring-primary" 
                                value={field.value}
                                onChange={(e) => updateCustomField(field.id, 'value', e.target.value)}
                                placeholder="Valor"
                            />
                             <button onClick={() => removeCustomField(field.id)} className="text-red-500 hover:text-red-700"><span className="material-symbols-outlined">close</span></button>
                        </div>
                    ))}
                    <button onClick={addCustomField} className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
                        <span className="material-symbols-outlined text-base">add</span> Adicionar informação extra
                    </button>
                 </div>
              </div>
            </details>

            {/* CTA */}
            <div className="mt-8 flex justify-end pb-8">
              <button onClick={() => navigate('/templates')} className="flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-primary/90">
                <span className="material-symbols-outlined">bolt</span>
                Gerar currículo com IA
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PersonalInfo;