import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Zap, ChevronDown, LogOut, User, Settings, MessageSquare, Users, MessageCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useModalStore } from '../store/modalStore';

interface Wall {
  id: string;
  name: string;
  description?: string;
  category?: string;
  participants?: number;
  [key: string]: any;
}

const Header = ({ 
  activeWall = null, 
  showWalls = false, 
  setShowWalls = () => {}, 
  wallsCount = 0,
  loadingWalls = false,
  selectedCategory = 'all',
  setSelectedCategory = () => {},
  categories = []
}: { 
  activeWall?: Wall | null,
  showWalls?: boolean,
  setShowWalls?: (show: boolean) => void,
  wallsCount?: number,
  loadingWalls?: boolean,
  selectedCategory?: string,
  setSelectedCategory?: (category: string) => void,
  categories?: Array<{id: string, name: string}>
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated } = useAuthStore();
  const { setShowLogoutModal } = useModalStore();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const navItems = [
    { path: '/', label: 'Home', icon: null },
    { path: '/koltech-line', label: 'KolTech Line', icon: MessageSquare },
    { path: '/portfolio', label: 'Portfolio', icon: null },
    { path: '/business-accelerator', label: 'Business Accelerator', icon: null },
    ...(isAuthenticated ? [
      { path: '/chats', label: 'Messages', icon: MessageCircle },
      { path: '/contacts', label: 'Contacts', icon: Users }
    ] : []),
  ];

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
  };

  const getDisplayName = () => {
    if (!user) return '';
    return `${user.firstName} ${user.lastName}`;
  };

  const getUsername = () => {
    if (!user) return '';
    return user.letteraTechNumber ? user.letteraTechNumber : (user.username || user.email);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-dark-900 via-dark-800 to-dark-900 border-b border-dark-700 shadow-xl backdrop-blur-sm">
      <div className="px-4">
        <div className="flex items-center justify-between h-16 max-w-full">
          {/* Logo - Enhanced */}
          <Link to="/" className="flex items-center space-x-3 flex-shrink-0 group">
            <div className="p-2.5 bg-gradient-to-br from-primary-500 to-accent-purple rounded-xl shadow-lg group-hover:shadow-primary-500/50 transition-all group-hover:scale-105">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                KolTechLine
              </span>
              {/* Fixed width container to prevent layout shift */}
              <div className="ml-4 pl-4 border-l border-dark-600 hidden sm:flex items-center space-x-2 min-w-[140px]">
                {activeWall ? (
                  <>
                    <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></div>
                    <span className="text-primary-400 font-semibold truncate">{activeWall.name}</span>
                  </>
                ) : (
                  /* Skeleton for wall name */
                  <div className="flex items-center space-x-2 animate-pulse">
                    <div className="w-2 h-2 bg-dark-600 rounded-full"></div>
                    <div className="h-4 bg-dark-600 rounded w-24"></div>
                  </div>
                )}
              </div>
            </div>
          </Link>

          {/* Live Walls Button - Centered in space before sidebar */}
          <div className="hidden lg:flex items-center justify-end flex-1" style={{ paddingRight: '4.6rem' }}>
            <div 
              className="flex items-center space-x-2 cursor-pointer px-4 py-2.5 rounded-2xl bg-dark-700/50 border border-dark-600 hover:border-primary-500/50 hover:bg-dark-700 transition-all group shadow-lg"
              onClick={() => setShowWalls(!showWalls)}
            >
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-2.5 h-2.5 bg-green-400 rounded-full animate-ping"></div>
                </div>
                <span className="text-green-400 text-sm font-semibold">Live</span>
              </div>
              <span className="text-white text-sm font-bold group-hover:text-primary-400 transition-colors">
                Walls
              </span>
              {loadingWalls ? (
                /* Skeleton for walls count */
                <div className="bg-dark-600 h-6 w-8 rounded-full animate-pulse"></div>
              ) : (
                wallsCount > 0 && (
                  <span className="bg-gradient-to-r from-primary-500 to-accent-purple text-white text-sm px-3 py-1 rounded-full font-bold shadow-lg">
                    {wallsCount}
                  </span>
                )
              )}
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showWalls ? 'rotate-180' : ''}`} />
            </div>
          </div>

          {/* Auth Section - Enhanced */}
          <div className="hidden md:flex items-center space-x-3 flex-shrink-0" style={{ paddingRight: '0.6rem' }}>
            {isAuthenticated && user ? (
              /* User Profile Dropdown - Enhanced */
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 text-gray-300 hover:text-white transition-all p-2 rounded-xl hover:bg-dark-700/50 border border-transparent hover:border-primary-500/30 group"
                >
                  <div className="relative">
                    <img
                      src={user.avatar ? `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5005'}${user.avatar}` : `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=6366f1&color=ffffff&size=32`}
                      alt={getDisplayName()}
                      className="w-10 h-10 rounded-full border-2 border-primary-500/50 group-hover:border-primary-500 transition-all group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=6366f1&color=ffffff&size=32`;
                      }}
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-dark-900 animate-pulse"></div>
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-white group-hover:text-primary-400 transition-colors">
                      {getDisplayName()}
                    </div>
                    <div className="text-xs text-gray-400 truncate max-w-24">
                      {user.letteraTechNumber ? `ID: ${user.letteraTechNumber}` : `@${getUsername()}`}
                    </div>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu - Enhanced with rounded hover effects */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-gradient-to-br from-dark-800 to-dark-900 rounded-xl shadow-2xl border border-dark-600 overflow-hidden animate-fade-in">
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-dark-700/50 transition-all group"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Profile</span>
                      </Link>
                      <Link
                        to="/chats"
                        className="flex items-center px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-dark-700/50 transition-all group"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <MessageCircle className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Messages</span>
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-dark-700/50 transition-all group"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4 mr-3 group-hover:scale-110 group-hover:rotate-90 transition-all" />
                        <span className="font-medium">Settings</span>
                      </Link>
                    </div>
                    <div className="border-t border-dark-600">
                      <button
                        onClick={handleLogoutClick}
                        className="flex items-center w-full px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all group"
                      >
                        <LogOut className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Auth Buttons for non-authenticated users - Enhanced */
              <>
                <Link
                  to="/auth"
                  className="text-gray-300 hover:text-white text-sm font-semibold transition-all px-4 py-2 rounded-xl hover:bg-dark-700/50 border border-transparent hover:border-primary-500/30"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-primary-500 to-accent-purple text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-200 transform hover:scale-105"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button - Enhanced */}
          <button
            className="md:hidden text-gray-300 hover:text-white p-2 rounded-xl hover:bg-dark-700/50 transition-all"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-dark-700">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`text-sm font-medium transition-colors flex items-center space-x-2 ${
                      location.pathname === item.path
                        ? 'text-primary-400'
                        : 'text-gray-300 hover:text-white'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {IconComponent && <IconComponent className="w-4 h-4" />}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              {/* Mobile Auth Section */}
              <div className="pt-4 border-t border-dark-600">
                {isAuthenticated && user ? (
                  <div className="space-y-3">
                    {/* User Info */}
                    <div className="flex items-center space-x-3 py-2">
                      <img
                        src={user.avatar ? `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5005'}${user.avatar}` : `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=6366f1&color=ffffff&size=32`}
                        alt={getDisplayName()}
                        className="w-8 h-8 rounded-full border-2 border-primary-500/30"
                        onError={(e) => {
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=6366f1&color=ffffff&size=32`;
                        }}
                      />
                      <div>
                        <div className="text-sm font-medium text-white">{getDisplayName()}</div>
                        <div className="text-xs text-gray-400">
                          {user.letteraTechNumber ? `ID: ${user.letteraTechNumber}` : `@${getUsername()}`}
                        </div>
                      </div>
                    </div>
                    
                    {/* Mobile User Menu */}
                    <Link
                      to="/profile"
                      className="flex items-center text-gray-300 hover:text-white text-sm font-medium py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-4 h-4 mr-3" />
                      Profile
                    </Link>
                    <Link
                      to="/chats"
                      className="flex items-center text-gray-300 hover:text-white text-sm font-medium py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <MessageCircle className="w-4 h-4 mr-3" />
                      Messages
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center text-gray-300 hover:text-white text-sm font-medium py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogoutClick}
                      className="flex items-center text-red-400 hover:text-red-300 text-sm font-medium py-2"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Link
                      to="/auth"
                      className="text-gray-300 hover:text-white text-sm font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="bg-gradient-to-r from-primary-500 to-accent-purple text-white px-4 py-2 rounded-lg text-sm font-medium inline-block text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
