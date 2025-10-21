import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { EditModeProvider } from './contexts/EditModeContext';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { Feedback } from './pages/Feedback';
import { Employees } from './pages/pro/Employees';
import { Clients } from './pages/pro/Clients';
import { ProProjects } from './pages/pro/ProProjects';
import { ProjectDetail } from './pages/pro/ProjectDetail';
import { ClientDetail } from './pages/pro/ClientDetail';
import { EmployeeDetail } from './pages/pro/EmployeeDetail';
import { FeedbackDetail } from './pages/FeedbackDetail';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { Chat } from './pages/pro/Chat';
import { Login } from './pages/Login';
import { LogoutConfirmationModal } from './components/LogoutConfirmationModal';
import { Menu, X } from 'lucide-react';

type Workspace = 'website' | 'pro';
type Page =
  | 'dashboard'
  | 'projects'
  | 'feedback'
  | 'pro-employees'
  | 'pro-clients'
  | 'pro-projects'
  | 'pro-chat';

// Layout component that includes the sidebar and main content
function Layout() {
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace>('website');
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Update current page based on route
  useEffect(() => {
    const path = location.pathname.substring(1) || 'dashboard';
    
    if (path.startsWith('pro-')) {
      setCurrentWorkspace('pro');
      setCurrentPage(path as Page);
    } else {
      setCurrentWorkspace('website');
      setCurrentPage(path as Page);
    }
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
      case 'projects': return 'Проекты';
      case 'feedback': return 'Обратная связь';
      case 'pro-employees': return 'Сотрудники';
      case 'pro-clients': return 'Заказчики';
      case 'pro-projects': return 'Проекты Pro';
      case 'pro-chat': return 'Чат с заказчиками';
      default: return 'KolTech CRM';
    }
  };

  // Handle page change
  const handlePageChange = (page: Page) => {
    setCurrentPage(page);
    navigate(`/${page}`);
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
          currentWorkspace={currentWorkspace}
          currentPage={currentPage}
          onWorkspaceChange={setCurrentWorkspace}
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
            <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/feedback/:messageId" element={<FeedbackDetail />} />
            <Route path="/pro-employees" element={<Employees />} />
            <Route path="/pro-employees/:employeeId" element={<EmployeeDetail />} />
            <Route path="/pro-clients" element={<Clients />} />
            <Route path="/pro-clients/:clientId" element={<ClientDetail />} />
            <Route path="/pro-projects" element={<ProProjects />} />
            <Route path="/pro-projects/:projectId" element={<ProjectDetail />} />
            <Route path="/pro-chat" element={<Chat />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function App() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  // Listen for the custom event to show the logout modal
  useEffect(() => {
    const handleShowLogoutModal = () => {
      setShowLogoutModal(true);
    };
    
    window.addEventListener('show-logout-modal', handleShowLogoutModal);
    
    return () => {
      window.removeEventListener('show-logout-modal', handleShowLogoutModal);
    };
  }, []);
  
  return (
    <Router>
      <EditModeProvider>
        <div style={{ position: 'relative' }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={<Layout />} />
          </Routes>
          
          {/* Logout confirmation modal - positioned at the app root level */}
          <LogoutConfirmationModal 
            isOpen={showLogoutModal} 
            onClose={() => setShowLogoutModal(false)} 
          />
        </div>
      </EditModeProvider>
    </Router>
  );
}

export default App;
