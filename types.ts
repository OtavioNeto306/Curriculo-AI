export interface Experience {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  year: string;
}

export interface Course {
  id: string;
  name: string;
  year: string;
}

export interface Language {
  id: string;
  name: string;
  level: 'Básico' | 'Intermediário' | 'Avançado' | 'Fluente' | 'Nativo' | string;
}

export interface Project {
  id: string;
  name: string;
  url: string;
  description: string;
  technologies: string[];
}

export interface Certification {
  id: string;
  name: string;
  institution: string;
  year: string;
}

export interface CustomField {
  id: string;
  label: string;
  value: string;
}

export interface ResumeData {
  fullName: string;
  age: string;
  phone: string;
  email: string;
  address: string;
  cityState: string;
  linkedin: string;
  github: string;
  
  objective: string;
  summary: string; // Manual summary
  softSkills: string[];
  
  experiences: Experience[];
  education: Education[];
  skills: string[]; // Hard Skills
  languages: Language[];
  projects: Project[];
  certifications: Certification[];
  courses: Course[];
  
  // Additional Info
  availability: string;
  cnh: string;
  openToTravel: boolean;
  remoteWork: boolean; // Home office/Hybrid
  customFields: CustomField[];
}

export type TemplateType = 'minimalist' | 'modern' | 'highlight';

export interface AppState {
  apiKey: string;
  resumeData: ResumeData;
  selectedTemplate: TemplateType;
  generatedContent: ResumeData | null; // The AI enhanced version
  isGenerating: boolean;
}