import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight, Clock, Star, Users } from 'lucide-react';

const KolTechLine = () => {
  return (
    <div className="bg-dark-900 flex flex-col">
      {/* Coming Soon Overlay */}
      <div className="flex-1 pt-24 relative">
        {/* Background with blur effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
          <div className="absolute inset-0 tech-pattern opacity-20" />
          
          {/* Animated glowing orbs */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
          <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-accent-pink/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s' }} />
          
          {/* Floating particles */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary-400 rounded-full animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
                opacity: 0.3 + Math.random() * 0.7
              }}
            />
          ))}
          
          {/* Grid lines */}
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        </div>
        
        {/* Main overlay content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
          <div className="text-center max-w-4xl mx-auto">
            {/* Logo/Icon */}
            <div className="flex justify-center mb-8 bounce-in">
              <div className="p-6 bg-gradient-to-br from-primary-500 to-accent-purple rounded-3xl relative">
                <Zap className="w-20 h-20 text-white" />
                <div className="absolute inset-0 bg-primary-400/20 rounded-3xl blur-xl animate-pulse" />
              </div>
            </div>

            {/* Main heading */}
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight fade-in-delay">
              KolTech
              <span className="gradient-text block mt-2">Line</span>
            </h1>

            {/* Status message */}
            <div className="bg-dark-800/80 border border-dark-700 rounded-2xl p-8 mb-8 backdrop-blur-sm slide-up">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Clock className="w-6 h-6 text-primary-400 animate-pulse" />
                <h2 className="text-2xl font-bold text-white">В разработке</h2>
              </div>
              <p className="text-xl text-gray-300 mb-6">
                Мы создаем революционную платформу, которая объединит фрилансеров, 
                заказчиков, стартаперов и инвесторов в единой экосистеме.
              </p>
              
              {/* Features preview */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-purple rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">FLineHub</h3>
                  <p className="text-gray-400 text-sm">Найдите лучших специалистов</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent-purple to-accent-pink rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">KolTechValley</h3>
                  <p className="text-gray-400 text-sm">Краудфандинг для стартапов</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent-green to-primary-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">KolTechBusiness</h3>
                  <p className="text-gray-400 text-sm">Связь с инвесторами</p>
                </div>
              </div>
              
              {/* CTA Button */}
              <div className="space-y-4 slide-up" style={{ animationDelay: '0.5s' }}>
                <Link
                  to="/koltechline-article"
                  className="inline-flex items-center bg-gradient-to-r from-primary-500 to-accent-purple text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 pulse-glow"
                >
                  Подробнее о KolTechLine
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                
                <div className="text-center">
                  <Link
                    to="/contacts"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Хотите узнать о запуске первыми? Свяжитесь с нами
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KolTechLine;