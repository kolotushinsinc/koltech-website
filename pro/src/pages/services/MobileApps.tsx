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
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const MobileApps = () => {
  const [visibleElements, setVisibleElements] = useState<number[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      Array.from({ length: 12 }).forEach((_, index) => {
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
    { number: '150+', label: 'Мобильных приложений', icon: Smartphone },
    { number: '5M+', label: 'Скачиваний', icon: Download },
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
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6 hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 tech-pattern opacity-20" />
        <div className="container mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="bounce-in">
              <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Мобильные
                <span className="text-shimmer block">приложения</span>
              </h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed fade-in-delay">
                Разрабатываем мобильные приложения, которые пользователи любят использовать. 
                От стартапов до крупных корпораций - создаем решения любой сложности.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 slide-up">
                <Link
                  to="/contacts"
                  className="ios-button inline-flex items-center justify-center"
                >
                  Обсудить проект
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  to="/portfolio"
                  className="glass-effect text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/10 transition-all duration-300 text-center"
                >
                  Наши приложения
                </Link>
              </div>
            </div>
            <div className="relative slide-up floating-elements" style={{ animationDelay: '0.3s' }}>
              <div className="ios-card p-8 rounded-3xl">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {platforms.map((platform, index) => (
                    <div
                      key={index}
                      className={`p-4 glass-effect rounded-2xl text-center magnetic-hover ${
                        visibleElements.includes(index) ? 'stagger-animation' : 'opacity-0'
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <platform.icon className="w-8 h-8 text-white mx-auto mb-2" />
                      <p className="text-white text-sm font-medium">{platform.name}</p>
                      <p className="text-gray-400 text-xs">{platform.users}</p>
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary-500 to-accent-purple rounded-3xl flex items-center justify-center mb-4 magnetic-hover">
                    <Smartphone className="w-16 h-16 text-white" />
                  </div>
                  <p className="text-white font-semibold">Кроссплатформенная разработка</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-dark-800/50">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className={`text-center ios-card p-6 rounded-2xl magnetic-hover ${
                  visibleElements.includes(index + 3) ? 'stagger-animation' : 'opacity-0'
                }`}
                style={{ animationDelay: `${(index + 3) * 0.1}s` }}
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gradient-to-br from-primary-500 to-accent-purple rounded-2xl">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-4 bounce-in">Типы приложений</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto fade-in-delay">
              Выбираем оптимальный подход для каждого проекта
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="ios-card p-8 rounded-3xl magnetic-hover slide-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-purple rounded-2xl flex items-center justify-center mr-4">
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">{service.title}</h3>
                </div>
                
                <p className="text-gray-300 mb-6 leading-relaxed text-lg">
                  {service.description}
                </p>
                
                <div className="grid grid-cols-2 gap-3">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-accent-green flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-dark-800 to-dark-900">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-4 bounce-in">Возможности</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto fade-in-delay">
              Интегрируем современные функции для лучшего пользовательского опыта
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`ios-card p-6 rounded-2xl text-center magnetic-hover ${
                  visibleElements.includes(index + 6) ? 'stagger-animation' : 'opacity-0'
                }`}
                style={{ animationDelay: `${(index + 6) * 0.1}s` }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-purple rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-4 bounce-in">Этапы разработки</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto fade-in-delay">
              Структурированный подход к созданию мобильных приложений
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
            {[
              { step: '01', title: 'Исследование', description: 'Анализ рынка и пользователей', icon: Users },
              { step: '02', title: 'Прототип', description: 'UX/UI дизайн и wireframes', icon: Tablet },
              { step: '03', title: 'Разработка', description: 'Программирование функционала', icon: Code },
              { step: '04', title: 'Тестирование', description: 'QA и оптимизация', icon: Shield },
              { step: '05', title: 'Публикация', description: 'Релиз в App Store/Google Play', icon: Download }
            ].map((process, index) => (
              <div 
                key={index} 
                className="text-center slide-up magnetic-hover"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="ios-card p-6 rounded-3xl mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-purple rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <process.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-primary-400 font-bold text-lg mb-2">{process.step}</div>
                  <h3 className="text-lg font-bold text-white mb-3">{process.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{process.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="ios-card p-12 rounded-3xl text-center slide-up relative overflow-hidden">
            <div className="absolute inset-0 hero-gradient opacity-10" />
            <div className="relative">
              <h2 className="text-4xl font-bold text-white mb-4">
                Создадим ваше мобильное приложение?
              </h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-lg">
                Превратим вашу идею в успешное мобильное приложение, 
                которое пользователи будут любить и рекомендовать друзьям
              </p>
              <Link
                to="/contacts"
                className="ios-button inline-flex items-center"
              >
                Обсудить проект
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MobileApps;