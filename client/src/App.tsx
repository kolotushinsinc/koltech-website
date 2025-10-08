import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import PageTransition from './components/PageTransition';
import { HelmetProvider } from 'react-helmet-async';
import './App.css';

// Компоненты страниц
const Home = React.lazy(() => import('./pages/Home'));
const Contacts = React.lazy(() => import('./pages/Contacts'));
const Portfolio = React.lazy(() => import('./pages/Portfolio'));
const ProjectDetail = React.lazy(() => import('./pages/ProjectDetail'));
const BusinessAccelerator = React.lazy(() => import('./pages/BusinessAccelerator'));
const KolTechLine = React.lazy(() => import('./pages/KolTechLine'));
const KolTechLineArticle = React.lazy(() => import('./pages/KolTechLineArticle'));
const WebDevelopment = React.lazy(() => import('./pages/services/WebDevelopment'));
const MobileDevelopment = React.lazy(() => import('./pages/services/MobileApps'));
const AiSolutions = React.lazy(() => import('./pages/services/AISolutions'));
const Consulting = React.lazy(() => import('./pages/services/Consulting'));

function App() {
  return (
    <HelmetProvider>
    <Router>
      <div className="bg-dark-900 min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-16">
          <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center">
            <div className="text-white text-xl">Загрузка...</div>
          </div>}>
            <Routes>
              <Route path="/" element={
                <PageTransition>
                  <Home />
                </PageTransition>
              } />
              <Route path="/contacts" element={
                <PageTransition>
                  <Contacts />
                </PageTransition>
              } />
              <Route path="/portfolio" element={
                <PageTransition>
                  <Portfolio />
                </PageTransition>
              } />
              <Route path="/project/:id" element={
                <PageTransition>
                  <ProjectDetail />
                </PageTransition>
              } />
              <Route path="/business-accelerator" element={
                <PageTransition>
                  <BusinessAccelerator />
                </PageTransition>
              } />
              <Route path="/koltechline" element={
                <PageTransition>
                  <KolTechLine />
                </PageTransition>
              } />
              <Route path="/koltechline-article" element={
                <PageTransition>
                  <KolTechLineArticle />
                </PageTransition>
              } />
              <Route path="/web-development" element={
                <PageTransition>
                  <WebDevelopment />
                </PageTransition>
              } />
              <Route path="/mobile-development" element={
                <PageTransition>
                  <MobileDevelopment />
                </PageTransition>
              } />
              <Route path="/ai-solutions" element={
                <PageTransition>
                  <AiSolutions />
                </PageTransition>
              } />
              <Route path="/consulting" element={
                <PageTransition>
                  <Consulting />
                </PageTransition>
              } />
            </Routes>
          </React.Suspense>
        </main>
        <Footer />
      </div>
    </Router>
    </HelmetProvider>
  );
}

export default App;