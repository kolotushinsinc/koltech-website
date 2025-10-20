import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Github, Linkedin, Twitter, ArrowRight, Send, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../../logo.svg';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Here you would implement actual subscription logic
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };
  
  return (
    <footer className="modern-footer">
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Newsletter subscription */}
        <div className="mb-16 sm:mb-20 max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="dimensional-card card-blue p-8 sm:p-10 relative overflow-hidden"
          >
            <div className="text-center">
              <h3 className="text-2xl sm:text-3xl font-semibold mb-3 sm:mb-4 text-white">
                Подпишитесь на нашу рассылку
              </h3>
              <p className="text-gray-400 mb-8 text-sm sm:text-base max-w-lg mx-auto">
                Получайте новости о наших проектах, технологиях и специальных предложениях
              </p>
              
              <form onSubmit={handleSubscribe} className="relative max-w-md mx-auto">
                <AnimatePresence mode="wait">
                  {!subscribed ? (
                    <motion.div 
                      key="input"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="relative">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Ваш email"
                          className="w-full py-3 px-5 pr-12 rounded-lg bg-dark-900/60 text-white border border-white/10 focus:border-blue-500/50 focus:outline-none"
                          required
                        />
                        <button 
                          type="submit" 
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-white p-2 rounded-full transition-colors"
                        >
                          <Send className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="success"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="bg-blue-500/10 border border-blue-500/30 rounded-lg py-4 px-5"
                    >
                      <div className="flex items-center justify-center text-blue-500">
                        <MessageSquare className="w-5 h-5 mr-2" />
                        <span>Спасибо! Вы успешно подписались.</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <img src={logo} alt="KolTech Logo" className="w-8 h-8 sm:w-10 sm:h-10 relative z-10" />
                <motion.div 
                  animate={{ 
                    opacity: [0.2, 0.4, 0.2],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 4, 
                    ease: "easeInOut", 
                    repeat: Infinity 
                  }}
                  className="absolute inset-0 bg-blue-500 rounded-full blur-md opacity-20"
                />
              </div>
              <div className="relative">
                <span className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Kol<span className="text-blue-500">Tech</span>
                </span>
              </div>
            </div>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-gray-400 mb-6 max-w-md text-sm leading-relaxed"
            >
              Независимые эксперты в вебе, мобильной разработке и AI. Делаем то, что цепляет — быстро, честно и без «агентских» схем.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center space-x-4 mb-6"
            >
              <a
                href="mailto:kolotushintechnologies@gmail.com"
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-all duration-300"
              >
                <Mail className="w-4 h-4" />
                <span className="text-xs sm:text-sm">kolotushintechnologies@gmail.com</span>
              </a>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex space-x-4"
            >
              {[
                { icon: Github, href: "https://github.com" },
                { icon: Linkedin, href: "https://linkedin.com" },
                { icon: Twitter, href: "https://twitter.com" }
              ].map((social, index) => (
                <motion.a 
                  key={index}
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-dark-900/40 hover:bg-blue-500 text-gray-400 hover:text-white transition-all duration-300 border border-white/10"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-white font-semibold text-sm mb-4">
              Быстрые ссылки
            </h3>
            <div className="space-y-2">
              {[
                { path: '/', label: 'Главная' },
                { path: '/portfolio', label: 'Портфолио' },
                { path: '/business-accelerator', label: 'Бизнес-акселератор' },
                { path: '/koltechline', label: 'KolTechLine' },
                { path: '/contacts', label: 'Контакты' },
              ].map((item) => (
                <div key={item.path}>
                  <Link 
                    to={item.path} 
                    className="block text-gray-400 hover:text-white transition-all duration-300 text-xs flex items-center group"
                  >
                    <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item.label}
                  </Link>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-white font-semibold text-sm mb-4">
              Услуги
            </h3>
            <div className="space-y-2">
              {[
                { path: '/web-development', label: 'Веб-разработка' },
                { path: '/mobile-development', label: 'Мобильные приложения' },
                { path: '/ai-solutions', label: 'AI-решения' },
                { path: '/consulting', label: 'Консалтинг' },
              ].map((item) => (
                <div key={item.path}>
                  <Link 
                    to={item.path} 
                    className="block text-gray-400 hover:text-white transition-all duration-300 text-xs flex items-center group"
                  >
                    <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item.label}
                  </Link>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="border-t border-white/10 mt-12 sm:mt-16 pt-8 sm:pt-10 text-center">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-0"
            >
              © {currentYear} KolTech. Все права защищены. <span className="text-shimmer">Создано для инновационного будущего.</span>
            </motion.p>
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex space-x-6"
            >
              <Link to="/privacy" className="text-gray-400 hover:text-blue-500 text-xs sm:text-sm transition-colors">
                Политика конфиденциальности
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-blue-500 text-xs sm:text-sm transition-colors">
                Условия использования
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
