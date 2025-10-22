import { useState } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  MessageSquare,
  Settings,
  LogOut,
  ChevronDown,
  User,
  X,
  Briefcase
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEditMode } from '../contexts/EditModeContext';

type Page = 'dashboard' | 'projects' | 'messages' | 'settings';

interface SidebarProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
  onCloseMobile?: () => void;
}

export function Sidebar({ 
  currentPage, 
  onPageChange,
  onCloseMobile
}: SidebarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { handleNavigation } = useEditMode();

  const menuItems = [
    { id: 'dashboard' as Page, label: 'Дашборд', icon: LayoutDashboard },
    { id: 'projects' as Page, label: 'Мои проекты', icon: FolderKanban },
    { id: 'messages' as Page, label: 'Сообщения', icon: MessageSquare },
  ];

  const handlePageClick = (page: Page) => {
    onPageChange(page);
    handleNavigation(`/${page}`);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const handleLogout = () => {
    handleNavigation('/auth');
  };

  return (
    <div className="w-72 bg-dark-800 border-r border-dark-700 flex flex-col h-screen">
      {/* Header with logo and mobile close button */}
      <div className="p-5 border-b border-dark-700 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-primary-500 to-secondary-500 p-2 rounded-xl shadow-glow-sm">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">KolTech Pro</h1>
            <p className="text-xs text-dark-300">Личный кабинет</p>
          </div>
        </div>
        
        {onCloseMobile && (
          <button 
            onClick={onCloseMobile}
            className="lg:hidden btn btn-icon btn-secondary p-2"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handlePageClick(item.id)}
            className={`sidebar-item ${
              currentPage === item.id
                ? 'sidebar-item-active'
                : 'sidebar-item-inactive'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* User profile */}
      <div className="relative p-4 border-t border-dark-700">
        <button 
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-dark-700 transition-colors"
        >
          <div className="avatar avatar-md">
            <span>И</span>
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-white">Иван Петров</p>
            <p className="text-xs text-dark-300">ivan@example.com</p>
          </div>
          <ChevronDown className={`w-4 h-4 text-dark-300 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
        </button>
        
        {/* User dropdown menu */}
        {showUserMenu && (
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-dark-700 rounded-xl border border-dark-600 shadow-lg overflow-hidden animate-slide-up">
            <button 
              className="dropdown-item"
              onClick={() => {
                setShowUserMenu(false);
                handlePageClick('settings');
              }}
            >
              <Settings className="w-4 h-4 mr-2" />
              <span>Настройки</span>
            </button>
            <button 
              className="dropdown-item text-red-400 hover:bg-red-500/10"
              onClick={() => {
                setShowUserMenu(false);
                handleLogout();
              }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span>Выйти</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
