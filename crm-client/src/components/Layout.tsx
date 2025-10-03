import { useState } from 'react';
import { LayoutDashboard, FolderKanban, MessageSquare, Menu, X, LogOut } from 'lucide-react';
import { LogoutConfirmationModal } from './LogoutConfirmationModal';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: 'dashboard' | 'projects' | 'feedback';
  onNavigate: (page: 'dashboard' | 'projects' | 'feedback') => void;
  onLogout: () => void;
}

export function Layout({ children, currentPage, onNavigate, onLogout }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard' as const, label: 'Дашборд', icon: LayoutDashboard },
    { id: 'projects' as const, label: 'Проекты', icon: FolderKanban },
    { id: 'feedback' as const, label: 'Обратная связь', icon: MessageSquare },
  ];

  const handleNavigation = (page: 'dashboard' | 'projects' | 'feedback') => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    onLogout();
    setIsLogoutModalOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <nav className="bg-slate-800/50 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-2 rounded-lg">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-white">KolTech CRM</span>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`flex items-center px-4 py-2 rounded-lg transition ${
                    currentPage === item.id
                      ? 'bg-blue-500 text-white'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-2" />
                  {item.label}
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 rounded-lg text-slate-300 hover:bg-red-500/20 hover:text-red-300 transition"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Выйти
              </button>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-slate-800/90 backdrop-blur-lg">
            <div className="px-4 py-4 space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition ${
                    currentPage === item.id
                      ? 'bg-blue-500 text-white'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3 rounded-lg text-slate-300 hover:bg-red-500/20 hover:text-red-300 transition"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Выйти
              </button>
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={confirmLogout}
      />
    </div>
  );
}
