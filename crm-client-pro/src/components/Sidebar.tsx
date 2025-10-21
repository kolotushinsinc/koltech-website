import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  MessageSquare,
  Users,
  UserPlus,
  Briefcase,
  MessageCircle,
  ChevronDown,
  ChevronRight,
  Globe,
  LogOut,
  Settings,
  X
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEditMode } from '../contexts/EditModeContext';

type Workspace = 'website' | 'pro';
type Page =
  | 'dashboard'
  | 'projects'
  | 'feedback'
  | 'pro-employees'
  | 'pro-clients'
  | 'pro-projects'
  | 'pro-chat';

interface SidebarProps {
  currentWorkspace: Workspace;
  currentPage: Page;
  onWorkspaceChange: (workspace: Workspace) => void;
  onPageChange: (page: Page) => void;
  onCloseMobile?: () => void;
}

export function Sidebar({ 
  currentWorkspace, 
  currentPage, 
  onWorkspaceChange, 
  onPageChange,
  onCloseMobile
}: SidebarProps) {
  const [websiteExpanded, setWebsiteExpanded] = useState(currentWorkspace === 'website');
  const [proExpanded, setProExpanded] = useState(currentWorkspace === 'pro');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get edit mode context
  const { isEditMode, showExitWarning } = useEditMode();

  const websiteMenuItems = [
    { id: 'projects' as Page, label: 'Проекты', icon: FolderKanban },
    { id: 'feedback' as Page, label: 'Обратная связь', icon: MessageSquare },
  ];

  const proMenuItems = [
    { id: 'pro-employees' as Page, label: 'Сотрудники', icon: Users },
    { id: 'pro-clients' as Page, label: 'Заказчики', icon: Briefcase },
    { id: 'pro-projects' as Page, label: 'Проекты', icon: FolderKanban },
    { id: 'pro-chat' as Page, label: 'Чат с заказчиками', icon: MessageCircle },
  ];

  // Close mobile sidebar when page changes
  useEffect(() => {
    if (onCloseMobile) {
      onCloseMobile();
    }
  }, [currentPage, onCloseMobile]);

  const handleWorkspaceClick = (workspace: Workspace) => {
    // If in edit mode, show warning before expanding/collapsing
    if (isEditMode) {
      showExitWarning(() => {
        if (workspace === 'website') {
          setWebsiteExpanded(!websiteExpanded);
          setProExpanded(false);
          if (!websiteExpanded) {
            onWorkspaceChange('website');
            onPageChange('dashboard');
          }
        } else {
          setProExpanded(!proExpanded);
          setWebsiteExpanded(false);
          if (!proExpanded) {
            onWorkspaceChange('pro');
            onPageChange('pro-employees');
          }
        }
      });
      return;
    }
    
    // Normal behavior
    if (workspace === 'website') {
      setWebsiteExpanded(!websiteExpanded);
      setProExpanded(false);
      if (!websiteExpanded) {
        onWorkspaceChange('website');
        onPageChange('dashboard');
      }
    } else {
      setProExpanded(!proExpanded);
      setWebsiteExpanded(false);
      if (!proExpanded) {
        onWorkspaceChange('pro');
        onPageChange('pro-employees');
      }
    }
  };

  const handlePageClick = (page: Page, workspace: Workspace) => {
    // If in edit mode, show warning before navigation
    if (isEditMode) {
      showExitWarning(() => {
        onWorkspaceChange(workspace);
        onPageChange(page);
        if (onCloseMobile) {
          onCloseMobile();
        }
      });
      return;
    }
    
    // Normal navigation
    onWorkspaceChange(workspace);
    onPageChange(page);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <div className="w-72 bg-dark-800 border-r border-dark-700 flex flex-col h-screen">
      {/* Header with logo and mobile close button */}
      <div className="p-5 border-b border-dark-700 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-primary-500 to-secondary-500 p-2 rounded-xl shadow-glow-sm">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">KolTech</h1>
            <p className="text-xs text-dark-300">CRM System</p>
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
      <nav className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* Dashboard - accessible from both workspaces */}
        <button
          onClick={() => handlePageClick('dashboard', currentWorkspace)}
          className={`sidebar-item ${
            currentPage === 'dashboard'
              ? 'sidebar-item-active'
              : 'sidebar-item-inactive'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Дашборд</span>
        </button>
        <div>
          <button
            onClick={() => handleWorkspaceClick('website')}
            className="sidebar-item w-full flex items-center justify-between px-4 py-3 rounded-xl text-white hover:bg-dark-700"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-primary-500/20 p-2 rounded-lg">
                <Globe className="w-5 h-5 text-primary-400" />
              </div>
              <span className="font-medium">KolTech Website</span>
            </div>
            {websiteExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

          {websiteExpanded && (
            <div className="ml-4 mt-2 space-y-1 animate-fade-in">
              {websiteMenuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handlePageClick(item.id, 'website')}
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
            </div>
          )}
        </div>

        <div>
          <button
            onClick={() => handleWorkspaceClick('pro')}
            className="sidebar-item w-full flex items-center justify-between px-4 py-3 rounded-xl text-white hover:bg-dark-700"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-secondary-500/20 p-2 rounded-lg">
                <Briefcase className="w-5 h-5 text-secondary-400" />
              </div>
              <span className="font-medium">KolTech Pro</span>
            </div>
            {proExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

          {proExpanded && (
            <div className="ml-4 mt-2 space-y-1 animate-fade-in">
              {proMenuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handlePageClick(item.id, 'pro')}
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
            </div>
          )}
        </div>
      </nav>

      {/* User profile */}
      <div className="relative p-4 border-t border-dark-700">
        <button 
          onClick={() => {
            if (isEditMode) {
              showExitWarning(() => setShowUserMenu(!showUserMenu));
              return;
            }
            setShowUserMenu(!showUserMenu);
          }}
          className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-dark-700 transition-colors"
        >
          <div className="avatar avatar-md">
            <span>А</span>
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-white">Администратор</p>
            <p className="text-xs text-dark-300">admin@koltech.com</p>
          </div>
          <ChevronDown className={`w-4 h-4 text-dark-300 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
        </button>
        
        {/* User dropdown menu */}
        {showUserMenu && (
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-dark-700 rounded-xl border border-dark-600 shadow-lg overflow-hidden animate-slide-up">
            <button 
              className="dropdown-item"
              onClick={(e) => {
                e.stopPropagation();
                if (isEditMode) {
                  showExitWarning(() => {
                    setShowUserMenu(false);
                    // Navigate to settings in a real app
                  });
                  return;
                }
                setShowUserMenu(false);
                // Navigate to settings in a real app
              }}
            >
              <Settings className="w-4 h-4 mr-2" />
              <span>Настройки</span>
            </button>
            <button 
              className="dropdown-item text-red-400 hover:bg-red-500/10"
              onClick={(e) => {
                e.stopPropagation();
                if (isEditMode) {
                  showExitWarning(() => {
                    setShowUserMenu(false);
                    // Trigger the global logout modal via custom event
                    window.dispatchEvent(new CustomEvent('show-logout-modal'));
                  });
                  return;
                }
                setShowUserMenu(false);
                // Trigger the global logout modal via custom event
                window.dispatchEvent(new CustomEvent('show-logout-modal'));
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
