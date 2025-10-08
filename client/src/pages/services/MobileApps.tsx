import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Smartphone, 
  Tablet, 
  Download, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  Apple,
  Play,
  Code,
  Users,
  Star,
  Clock,
  Shield,
  Globe
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const MobileApps = () => {
  const [visibleElements, setVisibleElements] = useState<number[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      Array.from({ length: 100 }).forEach((_, index) => {
        setTimeout(() => {
          setVisibleElements(prev => [...prev, index]);
        }, index * 100);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const services = [
    {
      icon: Smartphone,
      title: 'Нативные приложения',
      description: 'iOS и Android приложения с максимальной производительностью',
      features: ['Swift/Kotlin', 'Нативный UI', 'Полный доступ к API', 'Высокая производительность']
    },
    {
      icon: Code,
      title: 'Кроссплатформенные',
      description: 'Одна кодовая база для iOS и Android с React Native/Flutter',
      features: ['React Native', 'Flutter', 'Быстрая разработка', 'Единый код']
    },
    {
      icon: Globe,
      title: 'PWA приложения',
      description: 'Прогрессивные веб-приложения с возможностями нативных',
      features: ['Работа офлайн', 'Push-уведомления', 'Установка на устройство', 'Быстрая загрузка']
    },
    {
      icon: Shield,
      title: 'Enterprise решения',
      description: 'Корпоративные мобильные приложения для бизнеса',
      features: ['Безопасность', 'Интеграция с системами', 'Масштабируемость', 'Поддержка 24/7']
    }
  ];

  const platforms = [
    { name: 'iOS', icon: Apple, color: 'from-gray-600 to-gray-800', users: '1.8B+' },
    { name: 'Android', icon: Play, color: 'from-green-500 to-green-700', users: '3.0B+' },
    { name: 'Web', icon: Globe, color: 'from-blue-500 to-blue-700', users: '4.6B+' }
  ];

  const stats = [
    { number: '50+', label: 'Мобильных приложений', icon: Smartphone },
    { number: '1M+', label: 'Скачиваний', icon: Download },
    { number: '4.8★', label: 'Средний рейтинг', icon: Star },
    { number: '99.9%', label: 'Uptime', icon: Shield }
  ];

  const features = [
    { title: 'Push-уведомления', description: 'Умные уведомления для вовлечения пользователей' },
    { title: 'Геолокация', description: 'Интеграция с картами и GPS-навигацией' },
    { title: 'Камера и медиа', description: 'Работа с фото, видео и аудио контентом' },
    { title: 'Платежи', description: 'Интеграция с платежными системами' },
    { title: 'Социальные сети', description: 'Авторизация и шаринг в соцсетях' },
    { title: 'Аналитика', description: 'Детальная аналитика поведения пользователей' }
  ];

  return (
    <div className="min-h-screen bg-dark-900">
      <Helmet>
        <title>Мобильные приложения | KolTech</title>
        <meta name="description" content="Разрабатываем мобильные приложения, которые пользователи любят использовать. От стартапов до крупных корпораций - создаем решения любой сложности." />
        <meta name="keywords" content="Нативные приложения, Кроссплатформенные, PWA приложения, Enterprise решения" />
        <meta property="og:title" content="Мобильные приложения | KolTech" />
        <meta property="og:description" content="Разрабатываем мобильные приложения, которые пользователи любят использовать. От стартапов до крупных корпораций - создаем решения любой сложности." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://koltech.dev/mobile-development" />
      </Helmet>
      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4 sm:px-6 hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 tech-pattern opacity-20" />
        <div className="container mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="bounce-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                Мобильные
                <span className="text-shimmer block">приложения</span>
              </h1>
              <p className="text-lg sm:text-xl text-white/90 mb-6 sm:mb-8 leading-relaxed fade-in-delay">
                Разрабатываем мобильные приложения, которые пользователи любят использовать. 
                От стартапов до крупных корпораций - создаем решения любой сложности.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 slide-up">
                <Link
                  to="/contacts"
                  className="ios-button inline-flex items-center justify-center text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4"
                >
                  Обсудить проект
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
                <Link
                  to="/portfolio"
                  className="glass-effect text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold hover:bg-white/10 transition-all duration-300 text-center text-sm sm:text-base"
                >
                  Наши приложения
                </Link>
              </div>
            </div>
            <div className="relative slide-up floating-elements" style={{ animationDelay: '0.3s' }}>
              <div className="ios-card p-4 sm:p-6 md:p-8 rounded-3xl">
                <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
                  {platforms.map((platform, index) => (
                    <div
                      key={index}
                      className={`p-2 sm:p-4 glass-effect rounded-2xl text-center magnetic-hover ${
                        visibleElements.includes(index) ? 'stagger-animation' : 'opacity-0'
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <platform.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white mx-auto mb-1 sm:mb-2" />
                      <p className="text-white text-xs sm:text-sm font-medium">{platform.name}</p>
                      <p className="text-gray-400 text-xs">{platform.users}</p>
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto bg-gradient-to-br from-primary-500 to-accent-purple rounded-3xl flex items-center justify-center mb-3 sm:mb-4 magnetic-hover">
                    <Smartphone className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                  </div>
                  <p className="text-white font-semibold text-sm sm:text-base">Кроссплатформенная разработка</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-dark-800/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`text-center ios-card p-4 sm:p-6 rounded-2xl magnetic-hover ${
                  visibleElements.includes(index + 3) ? 'stagger-animation' : 'opacity-0'
                }`}
                style={{ animationDelay: `${(index + 3) * 0.1}s` }}
              >
                <div className="flex justify-center mb-3 sm:mb-4">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-primary-500 to-accent-purple rounded-2xl">
                    <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">{stat.number}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4 bounce-in">Типы приложений</h2>
            <p className="text-base sm:text-xl text-gray-400 max-w-3xl mx-auto fade-in-delay">
              Выбираем оптимальный подход для каждого проекта
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="ios-card p-6 sm:p-8 rounded-3xl magnetic-hover slide-up h-full flex flex-col"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4 sm:mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-purple rounded-2xl flex items-center justify-center mr-3 sm:mr-4 mb-3 sm:mb-0 flex-shrink-0">
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white break-words flex-1 min-w-0">{service.title}</h3>
                </div>
                
                <p className="text-gray-300 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base md:text-lg break-words">
                  {service.description}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mt-auto">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start space-x-1 sm:space-x-2">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-accent-green flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-xs sm:text-sm break-words">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gradient-to-br from-dark-800 to-dark-900">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4 bounce-in">Технологии и возможности</h2>
            <p className="text-base sm:text-xl text-gray-400 max-w-3xl mx-auto fade-in-delay">
              Современный стек технологий для мобильной разработки
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 max-w-6xl mx-auto mb-12 sm:mb-16">
            {[
              { name: 'React Native', color: 'from-blue-500 to-cyan-500' },
              { name: 'Flutter', color: 'from-blue-600 to-indigo-500' },
              { name: 'Swift', color: 'from-orange-500 to-red-500' },
              { name: 'Kotlin', color: 'from-green-500 to-emerald-500' },
              { name: 'Dart', color: 'from-blue-400 to-teal-500' },
              { name: 'Objective-C', color: 'from-gray-600 to-blue-600' },
              { name: 'Java', color: 'from-red-600 to-orange-600' },
              { name: 'Xamarin', color: 'from-purple-600 to-blue-600' },
              { name: 'Ionic', color: 'from-blue-500 to-indigo-600' },
              { name: 'Cordova', color: 'from-gray-700 to-gray-900' },
              { name: 'Firebase', color: 'from-yellow-500 to-orange-600' },
              { name: 'SQLite', color: 'from-blue-700 to-indigo-700' },
              { name: 'Realm', color: 'from-purple-500 to-pink-500' },
              { name: 'Core Data', color: 'from-gray-600 to-blue-500' },
              { name: 'Room', color: 'from-green-600 to-teal-600' }
            ].map((tech, index) => (
              <div
                key={index}
                className={`group cursor-pointer ${
                  visibleElements.includes(index + 6) ? 'stagger-animation' : 'opacity-0'
                }`}
                style={{ animationDelay: `${(index + 6) * 0.03}s` }}
              >
                <div className={`
                  px-5 py-2.5 rounded-xl font-medium text-white
                  bg-gradient-to-r ${tech.color}
                  hover:scale-105 hover:shadow-xl hover:shadow-primary-500/20
                  transition-all duration-300 ease-out
                  relative overflow-hidden
                `}>
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                  <span className="relative z-10">{tech.name}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8">Возможности приложений</h3>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 max-w-4xl mx-auto">
              {[
                { name: 'Push-уведомления', color: 'from-yellow-500 to-orange-500' },
                { name: 'Геолокация', color: 'from-green-500 to-teal-500' },
                { name: 'Камера', color: 'from-purple-500 to-pink-500' },
                { name: 'Платежи', color: 'from-blue-500 to-indigo-500' },
                { name: 'Социальные сети', color: 'from-pink-500 to-red-500' },
                { name: 'Аналитика', color: 'from-indigo-500 to-purple-500' },
                { name: 'Биометрия', color: 'from-red-500 to-pink-500' },
                { name: 'Офлайн режим', color: 'from-gray-600 to-gray-800' },
                { name: 'Синхронизация', color: 'from-cyan-500 to-blue-500' },
                { name: 'AR/VR', color: 'from-purple-600 to-indigo-600' }
              ].map((feature, index) => (
                <div
                  key={index}
                  className={`group cursor-pointer ${
                    visibleElements.includes(index + 10) ? 'stagger-animation' : 'opacity-0'
                  }`}
                  style={{ animationDelay: `${(index + 10) * 0.05}s` }}
                >
                  <div className={`
                    px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-white text-xs sm:text-sm
                    bg-gradient-to-r ${feature.color}
                    hover:scale-105 hover:shadow-lg
                    transition-all duration-300 ease-out
                    relative overflow-hidden
                  `}>
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                    <span className="relative z-10">{feature.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4 bounce-in">Этапы разработки</h2>
            <p className="text-base sm:text-xl text-gray-400 max-w-3xl mx-auto fade-in-delay">
              Структурированный подход к созданию мобильных приложений
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
            {[
              { step: '01', title: 'Исследование', description: 'Анализ рынка и пользователей', icon: Users },
              { step: '02', title: 'Прототип', description: 'UX/UI дизайн и wireframes', icon: Tablet },
              { step: '03', title: 'Разработка', description: 'Программирование функционала', icon: Code },
              { step: '04', title: 'Тестирование', description: 'QA и оптимизация', icon: Shield },
              { step: '05', title: 'Публикация', description: 'Релиз в App Store/Google Play', icon: Download }
            ].map((process, index) => (
              <div
                key={index}
                className="text-center slide-up magnetic-hover h-full flex flex-col"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="ios-card p-4 sm:p-6 rounded-3xl mb-4 h-full flex flex-col">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-500 to-accent-purple rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <process.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div className="text-primary-400 font-bold text-base sm:text-lg mb-2">{process.step}</div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3">{process.title}</h3>
                  <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mt-auto">{process.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="ios-card p-8 sm:p-12 rounded-3xl text-center slide-up relative overflow-hidden">
            <div className="absolute inset-0 hero-gradient opacity-10" />
            <div className="relative">
              <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">
                Создадим ваше мобильное приложение?
              </h2>
              <p className="text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto text-base sm:text-lg">
                Превратим вашу идею в успешное мобильное приложение,
                которое пользователи будут любить и рекомендовать друзьям
              </p>
              <Link
                to="/contacts"
                className="ios-button inline-flex items-center text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4"
              >
                Обсудить проект
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MobileApps;