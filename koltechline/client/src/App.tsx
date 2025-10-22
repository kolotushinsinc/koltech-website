import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Register from './pages/Register';
import AnonymousRegister from './pages/AnonymousRegister';
import ForgotPassword from './pages/ForgotPassword';
import Portfolio from './pages/Portfolio';
import BusinessAccelerator from './pages/BusinessAccelerator';
import Profile from './pages/Profile';
import Dashboard from './pages/profile/Dashboard';
import Projects from './pages/profile/Projects';
import Freelance from './pages/profile/Freelance';
import Social from './pages/profile/Social';
import ProjectDetail from './pages/ProjectDetail';
import UserProfile from './pages/UserProfile';
import SinglePost from './pages/SinglePost';
import Settings from './pages/Settings';
import KolTechLine from './pages/KolTechLine';
import Contacts from './pages/Contacts';
import Chat from './pages/Chat';
import Chats from './pages/Chats';
import ToastProvider from './components/ui/ToastProvider';
import LogoutConfirmModal from './components/ui/LogoutConfirmModal';
import { useModalStore } from './store/modalStore';
import { useAuthStore } from './store/authStore';
import toast from 'react-hot-toast';
import './App.css';

function AppContent() {
  const navigate = useNavigate();
  const { showLogoutModal, setShowLogoutModal } = useModalStore();
  const { logout } = useAuthStore();

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
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/register" element={<Register />} />
        <Route path="/anonymous-register" element={<AnonymousRegister />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/business-accelerator" element={<BusinessAccelerator />} />
        <Route path="/profile" element={<Profile />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="freelance" element={<Freelance />} />
          <Route path="social" element={<Social />} />
        </Route>
        <Route path="/settings" element={<Settings />} />
        <Route path="/koltech-line" element={<KolTechLine />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/chats" element={<Chats />} />
        <Route path="/chat/:chatId" element={<Chat />} />
        <Route path="/project/:projectId" element={<ProjectDetail />} />
        <Route path="/user/:userId" element={<UserProfile />} />
        <Route path="/post/:postId" element={<SinglePost />} />
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