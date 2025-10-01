import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Contacts from './pages/Contacts';
import Portfolio from './pages/Portfolio';
import BusinessAccelerator from './pages/BusinessAccelerator';
import KolTechLine from './pages/KolTechLine';
import KolTechLineArticle from './pages/KolTechLineArticle';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark-900">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/business-accelerator" element={<BusinessAccelerator />} />
          <Route path="/koltechline" element={<KolTechLine />} />
          <Route path="/koltechline-article" element={<KolTechLineArticle />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;