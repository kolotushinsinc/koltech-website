import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import logo from '../../logo.svg';

const Footer = () => {
  return (
    <footer className="bg-dark-800 border-t border-dark-700">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img src={logo} alt="KolTech Logo" className="w-8 h-8 sm:w-10 sm:h-10" />
              <span className="text-lg sm:text-xl font-bold text-white">KolTech</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md text-sm sm:text-base">
              {/* Фрилансерская инициатива в области разработки веб-сайтов, мобильных приложений и AI-решений. Мы создаем будущее технологий уже сегодня. */}
              Независимые эксперты в вебе, мобильной разработке и AI. Делаем то, что цепляет — быстро, честно и без «агентских» схем.
            </p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <a
                href="mailto:kolotushintechnologies@gmail.com"
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span className="text-xs sm:text-sm">kolotushintechnologies@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Быстрые ссылки</h3>
            <div className="space-y-2">
              <Link to="/" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Главная
              </Link>
              <Link to="/portfolio" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Портфолио
              </Link>
              <Link to="/business-accelerator" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Бизнес-акселератор
              </Link>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Услуги</h3>
            <div className="space-y-2">
              <Link to="/web-development" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Веб-разработка
              </Link>
              <Link to="/mobile-development" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Мобильные приложения
              </Link>
              <Link to="/ai-solutions" className="block text-gray-400 hover:text-white transition-colors text-sm">
                AI-решения
              </Link>
              <Link to="/consulting" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Консалтинг
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-dark-700 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
          <p className="text-gray-500 text-xs sm:text-sm">
            © 2025 KolTech. Все права защищены. Создано для инновационного будущего.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;