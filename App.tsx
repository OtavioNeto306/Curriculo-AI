import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ResumeProvider } from './context/ResumeContext';
import Home from './pages/Home';
import PersonalInfo from './pages/PersonalInfo';
import TemplateSelection from './pages/TemplateSelection';
import Generating from './pages/Generating';
import ResumePreview from './pages/ResumePreview';
import Success from './pages/Success';
import ConnectAI from './pages/ConnectAI';
import Payment from './pages/Payment';
import MyPlan from './pages/MyPlan';

const App: React.FC = () => {
  return (
    <ResumeProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/form" element={<ConnectAI />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/my-plan" element={<MyPlan />} />
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
