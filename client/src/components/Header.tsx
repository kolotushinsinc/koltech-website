import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Zap } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Главная' },
    { path: '/portfolio', label: 'Портфолио' },
    { path: '/business-accelerator', label: 'Бизнес-акселератор' },
    { path: '/koltechline', label: 'KolTechLine' },
    { path: '/contacts', label: 'Контакты' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark-900/90 backdrop-blur-md border-b border-dark-700">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="flex items-center space-x-2">
              <motion.div
                className="p-2 bg-gradient-to-br from-primary-500 to-accent-purple rounded-lg"
                animate={{
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              >
                <Zap className="w-6 h-6 text-white" />
              </motion.div>
              <span className="text-xl font-bold text-white">KolTech</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.div
                key={item.path}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={item.path}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    location.pathname === item.path
                      ? 'text-primary-400'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/contacts"
                className="bg-gradient-to-r from-primary-500 to-accent-purple text-white px-6 py-2 rounded-lg text-sm font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                Связаться с нами
              </Link>
            </motion.div>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-dark-700">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'text-primary-400'
                      : 'text-gray-300 hover:text-white'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-4">
                <Link
                  to="/contacts"
                  className="bg-gradient-to-r from-primary-500 to-accent-purple text-white px-4 py-2 rounded-lg text-sm font-medium inline-block text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Связаться с нами
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;