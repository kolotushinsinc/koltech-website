import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './pages/Auth';
import CustomerDashboard from './pages/CustomerDashboard';
import WebDevelopment from './pages/services/WebDevelopment';
import MobileApps from './pages/services/MobileApps';
import AISolutions from './pages/services/AISolutions';
import Consulting from './pages/services/Consulting';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark-900">
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<CustomerDashboard />} />
          <Route path="/services/web-development" element={<WebDevelopment />} />
          <Route path="/services/mobile-apps" element={<MobileApps />} />
          <Route path="/services/ai-solutions" element={<AISolutions />} />
          <Route path="/services/consulting" element={<Consulting />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;