import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ResumeProvider } from './context/ResumeContext';
import ConnectAI from './pages/ConnectAI';
import PersonalInfo from './pages/PersonalInfo';
import TemplateSelection from './pages/TemplateSelection';
import Generating from './pages/Generating';
import ResumePreview from './pages/ResumePreview';
import Success from './pages/Success';

const App: React.FC = () => {
  return (
    <ResumeProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<ConnectAI />} />
          <Route path="/info" element={<PersonalInfo />} />
          <Route path="/templates" element={<TemplateSelection />} />
          <Route path="/generating" element={<Generating />} />
          <Route path="/preview" element={<ResumePreview />} />
          <Route path="/success" element={<Success />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </ResumeProvider>
  );
};

export default App;
