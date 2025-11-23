import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ResumeData, TemplateType } from '../types';

interface ResumeContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
  resumeData: ResumeData;
  setResumeData: (data: ResumeData) => void; // Updates raw data
  updateResumeDataField: (field: keyof ResumeData, value: any) => void;
  selectedTemplate: TemplateType;
  setSelectedTemplate: (template: TemplateType) => void;
  generatedResume: ResumeData | null;
  setGeneratedResume: (data: ResumeData | null) => void;
}

const defaultResumeData: ResumeData = {
  fullName: "",
  age: "",
  phone: "",
  email: "",
  address: "",
  cityState: "",
  linkedin: "",
  github: "",
  
  objective: "",
  summary: "",
  softSkills: [],
  
  experiences: [],
  education: [],
  skills: [],
  languages: [],
  projects: [],
  certifications: [],
  courses: [],
  
  availability: "",
  cnh: "",
  openToTravel: false,
  remoteWork: false,
  customFields: []
};

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Automatically load API Key from environment if available
  const [apiKey, setApiKey] = useState(process.env.API_KEY || "");
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('modern');
  const [generatedResume, setGeneratedResume] = useState<ResumeData | null>(null);

  const updateResumeDataField = (field: keyof ResumeData, value: any) => {
    setResumeData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <ResumeContext.Provider value={{
      apiKey,
      setApiKey,
      resumeData,
      setResumeData,
      updateResumeDataField,
      selectedTemplate,
      setSelectedTemplate,
      generatedResume,
      setGeneratedResume
    }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error("useResume must be used within a ResumeProvider");
  }
  return context;
};