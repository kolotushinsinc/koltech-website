import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Code, 
  Globe, 
  Smartphone, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  Monitor,
  Server,
  Database,
  Shield,
  Rocket,
  Users,
  Star,
  Clock
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const WebDevelopment = () => {
  const [visibleElements, setVisibleElements] = useState<number[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      Array.from({ length: 150 }).forEach((_, index) => {
        setTimeout(() => {
          setVisibleElements(prev => [...prev, index]);
        }, index * 150);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const services = [
    {
      icon: Monitor,
      title: 'Корпоративные сайты',
      description: 'Профессиональные веб-сайты для бизнеса с современным дизайном',
      features: ['Адаптивный дизайн', 'SEO-оптимизация', 'CMS интеграция', 'Аналитика']
    },
    {
      icon: Globe,
      title: 'E-commerce решения',
      description: 'Интернет-магазины с полным функционалом и интеграциями',
      features: ['Каталог товаров', 'Система платежей', 'Управление заказами', 'Интеграция с CRM']
    },
    {
      icon: Server,
      title: 'Веб-приложения',
      description: 'Сложные веб-приложения для автоматизации бизнес-процессов',
      features: ['SPA/PWA', 'API разработка', 'Микросервисы', 'Облачные решения']
    },
    {
      icon: Database,
      title: 'Backend системы',
      description: 'Надежные серверные решения и базы данных',
      features: ['REST/GraphQL API', 'Базы данных', 'Кэширование', 'Масштабирование']
    }
  ];

  const technologies = [
    { name: 'React', level: 95, color: 'from-blue-500 to-cyan-500' },
    { name: 'Vue.js', level: 90, color: 'from-green-500 to-emerald-500' },
    { name: 'Angular', level: 85, color: 'from-red-500 to-pink-500' },
    { name: 'Node.js', level: 92, color: 'from-green-600 to-lime-500' },
    { name: 'Python', level: 88, color: 'from-yellow-500 to-orange-500' },
    { name: 'PHP', level: 85, color: 'from-purple-500 to-indigo-500' }
  ];

  const stats = [
    { number: '150+', label: 'Веб-проектов', icon: Globe },
    { number: '100%', label: 'Довольных клиентов', icon: Star },
    { number: '24/7', label: 'Поддержка', icon: Shield },
    { number: '15 дней', label: 'Средний срок', icon: Clock }
  ];

  return (
    <div className="min-h-screen bg-dark-900">
      <Helmet>
        <title>Веб-Разработка | KolTech</title>
        <meta name="description" content="Создаем современные веб-решения, которые впечатляют пользователей и приносят результат вашему бизнесу. От простых сайтов до сложных веб-приложений." />
        <meta name="keywords" content="Корпоративные сайты, E-commerce решения, Веб-приложения, Backend системы" />
        <meta property="og:title" content="Веб-Разработка | KolTech" />
        <meta property="og:description" content="Создаем современные веб-решения, которые впечатляют пользователей и приносят результат вашему бизнесу. От простых сайтов до сложных веб-приложений." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://koltech.dev/web-development" />
      </Helmet>
      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4 sm:px-6 hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 tech-pattern opacity-20" />
        <div className="container mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="bounce-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                Веб-
                <span className="text-shimmer block">разработка</span>
              </h1>
              <p className="text-lg sm:text-xl text-white/90 mb-6 sm:mb-8 leading-relaxed fade-in-delay">
                Создаем современные веб-решения, которые впечатляют пользователей 
                и приносят результат вашему бизнесу. От простых сайтов до сложных веб-приложений.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 slide-up">
                <Link
                  to="/contacts"
                  className="ios-button inline-flex items-center justify-center text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4"
                >
                  Начать проект
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
                <Link
                  to="/portfolio"
                  className="glass-effect text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold hover:bg-white/10 transition-all duration-300 text-center text-sm sm:text-base"
                >
                  Посмотреть работы
                </Link>
              </div>
            </div>
            <div className="relative slide-up floating-elements" style={{ animationDelay: '0.3s' }}>
              <div className="ios-card p-4 sm:p-6 md:p-8 rounded-3xl">
                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  {[Code, Globe, Server, Database].map((Icon, index) => (
                    <div
                      key={index}
                      className={`p-3 sm:p-6 glass-effect rounded-2xl text-center magnetic-hover ${
                        visibleElements.includes(index) ? 'stagger-animation' : 'opacity-0'
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary-400 mx-auto mb-1 sm:mb-2" />
                      <p className="text-white text-xs sm:text-sm font-medium">
                        {['Frontend', 'Backend', 'API', 'Database'][index]}
                      </p>
                    </div>
                  ))}
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
                  visibleElements.includes(index + 4) ? 'stagger-animation' : 'opacity-0'
                }`}
                style={{ animationDelay: `${(index + 4) * 0.1}s` }}
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
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4 bounce-in">Наши услуги</h2>
            <p className="text-base sm:text-xl text-gray-400 max-w-3xl mx-auto fade-in-delay">
              Полный спектр веб-разработки для решения любых бизнес-задач
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="ios-card p-6 sm:p-8 rounded-3xl magnetic-hover slide-up h-full"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4 sm:mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-purple rounded-2xl flex items-center justify-center mr-3 sm:mr-4 mb-3 sm:mb-0 flex-shrink-0">
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white break-words flex-1 min-w-0">{service.title}</h3>
                </div>
                
                <p className="text-gray-300 mb-4 sm:mb-6 leading-relaxed text-base sm:text-lg break-words">
                  {service.description}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
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

      {/* Technologies Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gradient-to-br from-dark-800 to-dark-900">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4 bounce-in">Технологии</h2>
            <p className="text-base sm:text-xl text-gray-400 max-w-3xl mx-auto fade-in-delay">
              Используем самые современные и надежные технологии
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 max-w-5xl mx-auto">
            {[
              { name: 'React', color: 'from-blue-500 to-cyan-500' },
              { name: 'Vue.js', color: 'from-green-500 to-emerald-500' },
              { name: 'Angular', color: 'from-red-500 to-pink-500' },
              { name: 'Node.js', color: 'from-green-600 to-lime-500' },
              { name: 'TypeScript', color: 'from-blue-600 to-indigo-500' },
              { name: 'JavaScript', color: 'from-yellow-500 to-orange-500' },
              { name: 'Python', color: 'from-purple-500 to-pink-500' },
              { name: 'PHP', color: 'from-indigo-500 to-purple-500' },
              { name: 'Next.js', color: 'from-gray-600 to-gray-800' },
              { name: 'Nuxt.js', color: 'from-green-400 to-blue-500' },
              { name: 'Express.js', color: 'from-gray-700 to-green-600' },
              { name: 'Django', color: 'from-green-700 to-blue-600' },
              { name: 'Laravel', color: 'from-red-600 to-orange-500' },
              { name: 'MongoDB', color: 'from-green-600 to-green-800' },
              { name: 'PostgreSQL', color: 'from-blue-700 to-indigo-600' },
              { name: 'MySQL', color: 'from-orange-600 to-yellow-500' },
              { name: 'Redis', color: 'from-red-600 to-red-800' },
              { name: 'Docker', color: 'from-blue-600 to-cyan-600' },
              { name: 'AWS', color: 'from-orange-500 to-yellow-600' },
              { name: 'GraphQL', color: 'from-pink-500 to-purple-600' }
            ].map((tech, index) => (
              <div
                key={index}
                className={`group cursor-pointer ${
                  visibleElements.includes(index) ? 'stagger-animation' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className={`
                  px-6 py-3 rounded-2xl font-semibold text-white text-lg
                  bg-gradient-to-r ${tech.color}
                  hover:scale-110 hover:shadow-2xl hover:shadow-primary-500/25
                  transition-all duration-300 ease-out
                  relative overflow-hidden
                  group-hover:animate-pulse
                `}>
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                  <span className="relative z-10">{tech.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4 bounce-in">Процесс работы</h2>
            <p className="text-base sm:text-xl text-gray-400 max-w-3xl mx-auto fade-in-delay">
              Прозрачный и эффективный процесс от идеи до запуска
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { step: '01', title: 'Анализ', description: 'Изучаем ваши потребности и цели', icon: Users },
              { step: '02', title: 'Дизайн', description: 'Создаем современный UI/UX дизайн', icon: Monitor },
              { step: '03', title: 'Разработка', description: 'Программируем с использованием лучших практик', icon: Code },
              { step: '04', title: 'Запуск', description: 'Тестируем, оптимизируем и запускаем', icon: Rocket }
            ].map((process, index) => (
              <div
                key={index}
                className="text-center slide-up magnetic-hover h-full"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="ios-card p-4 sm:p-8 rounded-3xl h-full">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-500 to-accent-purple rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <process.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div className="text-primary-400 font-bold text-base sm:text-lg mb-2">{process.step}</div>
                  <h3 className="text-base sm:text-xl font-bold text-white mb-3 sm:mb-4">{process.title}</h3>
                  <p className="text-gray-400 text-sm sm:text-base leading-relaxed">{process.description}</p>
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
                Готовы создать ваш веб-проект?
              </h2>
              <p className="text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto text-base sm:text-lg">
                Обсудим ваши идеи и создадим современное веб-решение,
                которое поможет достичь ваших бизнес-целей
              </p>
              <Link
                to="/contacts"
                className="ios-button inline-flex items-center text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4"
              >
                Начать проект
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WebDevelopment;