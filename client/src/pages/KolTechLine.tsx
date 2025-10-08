import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight, Clock, Star, Users } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const KolTechLine = () => {
  return (
    <div className="bg-dark-900 flex flex-col">
      <Helmet>
        <title>KolTechLine | KolTech</title>
        <meta name="description" content="Мы создаем революционную платформу, которая объединит фрилансеров, заказчиков, стартаперов и инвесторов в единой экосистеме." />
        <meta name="keywords" content="Корпоративные сайты, E-commerce решения, Веб-приложения, Backend системы, Нативные приложения, Кроссплатформенные, PWA приложения, Enterprise решения, React Native, Flutter, Swift, Kotlin, Dart, Objective-C, Java, Xamarin, Ionic, Cordova, Firebase, SQLite, Realm, Core Data, Room, React, Vue.js, Angular, Node.js, TypeScript, JavaScript, Python, PHP, Next.js, Nuxt.js, Express.js, Django, Laravel, MySQL, Docker, AWS, GraphQL, Чат-боты, CV, Компьютерное зрение, Аналитика, Обработка текста, TensorFlow, PyTorch, OpenAI GPT, Hugging Face, Scikit-learn, Keras, OpenCV, NLTK, spaCy, Pandas, NumPy, Matplotlib, Jupyter, MLflow, Docker, Kubernetes, AWS SageMaker, Google AI, Azure ML, Apache Spark, Elasticsearch, MongoDB, PostgreSQL, Redis, Стратегическое планирование, Техническое консультирование, Безопасность и соответствие, Цифровая трансформация, Бизнес-Акселератор, Быстрый старт, AI-powered решения, Экспертная команда, Глобальный охват, Точное попадание, Надежность, Стратегическое планирование, Техническая реализация, Масштабирование, KolTechLine, FLineHub, KolTechValley, KolTechBusiness, Будущее Цифрового Сотрудничества, " />
        <meta property="og:title" content="KolTechLine | KolTech" />
        <meta property="og:description" content="Мы создаем революционную платформу, которая объединит фрилансеров, заказчиков, стартаперов и инвесторов в единой экосистеме." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://koltech.dev/koltechline" />
      </Helmet>
      {/* Coming Soon Overlay */}
      <div className="flex-1 pt-20 sm:pt-24 relative">
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
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4 sm:px-6">
          <div className="text-center max-w-4xl mx-auto">
            {/* Logo/Icon */}
            <div className="flex justify-center mb-6 sm:mb-8 bounce-in">
              <div className="p-4 sm:p-6 bg-gradient-to-br from-primary-500 to-accent-purple rounded-3xl relative">
                <Zap className="w-16 h-16 sm:w-20 sm:h-20 text-white" />
                <div className="absolute inset-0 bg-primary-400/20 rounded-3xl blur-xl animate-pulse" />
              </div>
            </div>

            {/* Main heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-white mb-4 sm:mb-6 leading-tight fade-in-delay">
              KolTech
              <span className="gradient-text block mt-1 sm:mt-2">Line</span>
            </h1>

            {/* Status message */}
            <div className="bg-dark-800/80 border border-dark-700 rounded-2xl p-6 sm:p-8 mb-6 sm:mb-8 backdrop-blur-sm slide-up">
              <div className="flex items-center justify-center space-x-3 mb-3 sm:mb-4">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-primary-400 animate-pulse" />
                <h2 className="text-xl sm:text-2xl font-bold text-white">В разработке</h2>
              </div>
              <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-4 sm:mb-6 leading-relaxed">
                Мы создаем революционную платформу, которая объединит фрилансеров,
                заказчиков, стартаперов и инвесторов в единой экосистеме.
              </p>
              
              {/* Features preview */}
              <div className="grid md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-500 to-accent-purple rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">FLineHub</h3>
                  <p className="text-gray-400 text-xs sm:text-sm">Найдите лучших специалистов</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-accent-purple to-accent-pink rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
                    <Star className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">KolTechValley</h3>
                  <p className="text-gray-400 text-xs sm:text-sm">Краудфандинг для стартапов</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-accent-green to-primary-500 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">KolTechBusiness</h3>
                  <p className="text-gray-400 text-xs sm:text-sm">Связь с инвесторами</p>
                </div>
              </div>
              
              {/* CTA Button */}
              <div className="space-y-3 sm:space-y-4 slide-up" style={{ animationDelay: '0.5s' }}>
                <Link
                  to="/koltechline-article"
                  className="inline-flex items-center bg-gradient-to-r from-primary-500 to-accent-purple text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 pulse-glow text-sm sm:text-base"
                >
                  Подробнее о KolTechLine
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
                
                <div className="text-center">
                  <Link
                    to="/contacts"
                    className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm"
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