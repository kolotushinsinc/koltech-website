import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Register from './pages/Register';
import AnonymousRegister from './pages/AnonymousRegister';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import Dashboard from './pages/profile/Dashboard';
import Projects from './pages/profile/Projects';
import Freelance from './pages/profile/Freelance';
import Social from './pages/profile/Social';
import UserProfile from './pages/UserProfile';
import SinglePost from './pages/SinglePost';
import Settings from './pages/Settings';
import KolTechLine from './pages/KolTechLine';
import Chat from './pages/Chat';
import Chats from './pages/Chats';
import ToastProvider from './components/ui/ToastProvider';
import LogoutConfirmModal from './components/ui/LogoutConfirmModal';
import { useModalStore } from './store/modalStore';
import { useAuthStore } from './store/authStore';
import toast from 'react-hot-toast';
import './App.css';

// Новые страницы для KolTechLine
import FreelanceJobs from './pages/freelance/FreelanceJobs';
import FreelanceJobDetail from './pages/freelance/FreelanceJobDetail';
import CreateFreelanceJob from './pages/freelance/CreateFreelanceJob';
import Startups from './pages/startup/Startups';
import StartupDetail from './pages/startup/StartupDetail';
import CreateStartup from './pages/startup/CreateStartup';
import InvestorDashboard from './pages/investor/InvestorDashboard';

function AppContent() {
  const navigate = useNavigate();
  const { showLogoutModal, setShowLogoutModal } = useModalStore();
  const { logout, isAuthenticated } = useAuthStore();

  const handleLogoutConfirm = () => {
    logout();
    setShowLogoutModal(false);
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  return (
    <div className="min-h-screen bg-dark-900">
      <Routes>
        {/* Редирект с главной страницы на KolTechLine */}
        <Route path="/" element={<Navigate to="/koltech-line" replace />} />
        
        {/* Аутентификация */}
        <Route path="/auth" element={<Auth />} />
        <Route path="/register" element={<Register />} />
        <Route path="/anonymous-register" element={<AnonymousRegister />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Профиль пользователя */}
        <Route path="/profile" element={<Profile />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="freelance" element={<Freelance />} />
          <Route path="social" element={<Social />} />
        </Route>
        
        {/* Настройки */}
        <Route path="/settings" element={<Settings />} />
        
        {/* KolTechLine - основная страница */}
        <Route path="/koltech-line" element={<KolTechLine />} />
        <Route path="/koltech-line/:wallId" element={<KolTechLine />} />
        
        {/* Чаты и сообщения */}
        <Route path="/chats" element={<Chats />} />
        <Route path="/chat/:chatId" element={<Chat />} />
        
        {/* Пользователи и посты */}
        <Route path="/user/:userId" element={<UserProfile />} />
        <Route path="/post/:postId" element={<SinglePost />} />
        
        {/* Фриланс заказы */}
        <Route path="/freelance-jobs" element={<FreelanceJobs />} />
        <Route path="/freelance-jobs/:jobId" element={<FreelanceJobDetail />} />
        <Route path="/create-freelance-job" element={<CreateFreelanceJob />} />
        
        {/* Стартапы */}
        <Route path="/startups" element={<Startups />} />
        <Route path="/startups/:startupId" element={<StartupDetail />} />
        <Route path="/create-startup" element={<CreateStartup />} />
        
        {/* Инвесторы */}
        <Route path="/investor-dashboard" element={<InvestorDashboard />} />
        
        {/* Редирект для несуществующих страниц */}
        <Route path="*" element={<Navigate to="/koltech-line" replace />} />
      </Routes>
      
      <ToastProvider />
      
      {/* Global Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
