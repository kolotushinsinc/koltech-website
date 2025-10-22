import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Messages } from './pages/Messages';
import { Projects } from './pages/Projects';
import { ProjectForm } from './pages/ProjectForm';
import Auth from './pages/Auth';
import { Menu, X } from 'lucide-react';
import { EditModeProvider, useEditMode } from './contexts/EditModeContext';

import './App.css';

type Page = 'dashboard' | 'projects' | 'messages' | 'settings';

// Layout component that includes the sidebar and main content
function Layout() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isEditMode, showExitWarning, handleNavigation } = useEditMode();

  // Update current page based on route
  useEffect(() => {
    const path = location.pathname.substring(1) || 'dashboard';
    setCurrentPage(path as Page);
  }, [location]);

  // Handle responsive sidebar
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      setSidebarOpen(window.innerWidth >= 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Get current page title
  const getPageTitle = () => {
    switch (currentPage) {
      case 'dashboard': return 'Дашборд';
      case 'projects': return 'Мои проекты';
      case 'messages': return 'Сообщения';
      case 'settings': return 'Настройки';
      default: return 'KolTech Pro';
    }
  };

  // Handle page change with edit mode warning
  const handlePageChange = (page: Page) => {
    // Use the handleNavigation function from context
    const path = `/${page}`;
    handleNavigation(path);
    
    // currentPage will be updated by the location change effect
    // if navigation is allowed
  };

  return (
    <div className="flex h-screen">
      {/* Mobile sidebar backdrop */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-30 lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <Sidebar
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onCloseMobile={isMobile ? () => setSidebarOpen(false) : undefined}
        />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
        {/* Mobile header */}
        <div className="sticky top-0 z-10 lg:hidden bg-dark-800/80 backdrop-blur-md border-b border-dark-700 px-4 py-3 flex items-center justify-between">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="btn btn-icon btn-secondary p-2"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-white">{getPageTitle()}</h1>
          <div className="w-10" /> {/* Spacer for alignment */}
        </div>
        
        {/* Page content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fade-in">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:projectId" element={<ProjectForm />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/settings" element={<SettingsPlaceholder />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}


function SettingsPlaceholder() {
  return (
    <div className="card p-8 text-center">
      <h2 className="text-2xl font-bold text-white mb-4">Настройки</h2>
      <p className="text-dark-300">Страница в разработке</p>
    </div>
  );
}

function App() {
  return (
    <Router>
      <EditModeProvider>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/*" element={<Layout />} />
        </Routes>
      </EditModeProvider>
    </Router>
  );
}

export default App;
