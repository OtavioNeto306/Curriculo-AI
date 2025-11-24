import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { ResumeData, TemplateType, LLMProvider } from '../types';
import { supabase } from '../services/supabase';

interface ResumeContextType {
  apiKey: string;
  setApiKey: (key: string) => void;

  userApiKey: string;
  updateUserApiKey: (key: string) => Promise<void>;

  llmProvider: LLMProvider;
  updateLlmProvider: (provider: LLMProvider) => Promise<void>;

  plan: 'free' | 'paid';
  setPlan: (plan: 'free' | 'paid') => void;

  resumeData: ResumeData;
  setResumeData: (data: ResumeData) => void; // Updates raw data
  updateResumeDataField: (field: keyof ResumeData, value: any) => void;

  selectedTemplate: TemplateType;
  setSelectedTemplate: (template: TemplateType) => void;

  generatedResume: ResumeData | null;
  setGeneratedResume: (data: ResumeData | null) => void;

  loadProfileFromSupabase: () => Promise<void>;
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
  const [userApiKey, setUserApiKey] = useState("");
  const [llmProvider, setLlmProvider] = useState<LLMProvider>('gemini');
  const [plan, setPlan] = useState<'free' | 'paid'>('free');

  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('modern');
  const [generatedResume, setGeneratedResume] = useState<ResumeData | null>(null);

  const updateResumeDataField = (field: keyof ResumeData, value: any) => {
    setResumeData(prev => ({ ...prev, [field]: value }));
  };

  const loadProfileFromSupabase = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('profiles')
        .select('llm_provider, user_api_key, plan')
        .eq('id', user.id)
        .single();

      if (data) {
        if (data.llm_provider) setLlmProvider(data.llm_provider as LLMProvider);
        if (data.user_api_key) setUserApiKey(data.user_api_key);
        if (data.plan) setPlan(data.plan as 'free' | 'paid');
      }
    }
  };

  const updateUserApiKey = async (key: string) => {
    setUserApiKey(key);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // Upsert needs to handle the case where the profile might not exist yet if the trigger didn't run
      // But typically we assume profile exists or we create it.
      // Since we have RLS "insert own profile", we can upsert.
      const { error } = await supabase
        .from('profiles')
        .upsert({ id: user.id, user_api_key: key }, { onConflict: 'id' });

      if (error) console.error("Error updating API key:", error);
    }
  };

  const updateLlmProvider = async (provider: LLMProvider) => {
    setLlmProvider(provider);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase
        .from('profiles')
        .upsert({ id: user.id, llm_provider: provider }, { onConflict: 'id' });

      if (error) console.error("Error updating provider:", error);
    }
  };

  useEffect(() => {
    loadProfileFromSupabase();
  }, []);

  return (
    <ResumeContext.Provider value={{
      apiKey,
      setApiKey,
      userApiKey,
      updateUserApiKey,
      llmProvider,
      updateLlmProvider,
      plan,
      setPlan,
      resumeData,
      setResumeData,
      updateResumeDataField,
      selectedTemplate,
      setSelectedTemplate,
      generatedResume,
      setGeneratedResume,
      loadProfileFromSupabase
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