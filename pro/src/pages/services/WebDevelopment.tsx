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
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const WebDevelopment = () => {
  const [visibleElements, setVisibleElements] = useState<number[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      Array.from({ length: 8 }).forEach((_, index) => {
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
    { number: '200+', label: 'Веб-проектов', icon: Globe },
    { number: '98%', label: 'Довольных клиентов', icon: Star },
    { number: '24/7', label: 'Поддержка', icon: Shield },
    { number: '30 дней', label: 'Средний срок', icon: Clock }
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
                Веб-
                <span className="text-shimmer block">разработка</span>
              </h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed fade-in-delay">
                Создаем современные веб-решения, которые впечатляют пользователей 
                и приносят результат вашему бизнесу. От простых сайтов до сложных веб-приложений.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 slide-up">
                <Link
                  to="/contacts"
                  className="ios-button inline-flex items-center justify-center"
                >
                  Начать проект
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  to="/portfolio"
                  className="glass-effect text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/10 transition-all duration-300 text-center"
                >
                  Посмотреть работы
                </Link>
              </div>
            </div>
            <div className="relative slide-up floating-elements" style={{ animationDelay: '0.3s' }}>
              <div className="ios-card p-8 rounded-3xl">
                <div className="grid grid-cols-2 gap-4">
                  {[Code, Globe, Server, Database].map((Icon, index) => (
                    <div
                      key={index}
                      className={`p-6 glass-effect rounded-2xl text-center magnetic-hover ${
                        visibleElements.includes(index) ? 'stagger-animation' : 'opacity-0'
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <Icon className="w-8 h-8 text-primary-400 mx-auto mb-2" />
                      <p className="text-white text-sm font-medium">
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
      <section className="py-16 px-6 bg-dark-800/50">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className={`text-center ios-card p-6 rounded-2xl magnetic-hover ${
                  visibleElements.includes(index + 4) ? 'stagger-animation' : 'opacity-0'
                }`}
                style={{ animationDelay: `${(index + 4) * 0.1}s` }}
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
            <h2 className="text-5xl font-bold text-white mb-4 bounce-in">Наши услуги</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto fade-in-delay">
              Полный спектр веб-разработки для решения любых бизнес-задач
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

      {/* Technologies Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-dark-800 to-dark-900">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-4 bounce-in">Технологии</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto fade-in-delay">
              Используем самые современные и надежные технологии
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {technologies.map((tech, index) => (
              <div
                key={index}
                className={`ios-card p-6 rounded-2xl slide-up ${
                  visibleElements.includes(index) ? 'stagger-animation' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">{tech.name}</h3>
                  <span className="text-primary-400 font-semibold">{tech.level}%</span>
                </div>
                <div className="w-full bg-dark-700 rounded-full h-3 overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${tech.color} rounded-full transition-all duration-1000 ease-out`}
                    style={{ 
                      width: visibleElements.includes(index) ? `${tech.level}%` : '0%',
                      transitionDelay: `${index * 0.1}s`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-4 bounce-in">Процесс работы</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto fade-in-delay">
              Прозрачный и эффективный процесс от идеи до запуска
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Анализ', description: 'Изучаем ваши потребности и цели', icon: Users },
              { step: '02', title: 'Дизайн', description: 'Создаем современный UI/UX дизайн', icon: Monitor },
              { step: '03', title: 'Разработка', description: 'Программируем с использованием лучших практик', icon: Code },
              { step: '04', title: 'Запуск', description: 'Тестируем, оптимизируем и запускаем', icon: Rocket }
            ].map((process, index) => (
              <div 
                key={index} 
                className="text-center slide-up magnetic-hover"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="ios-card p-8 rounded-3xl mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-purple rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <process.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-primary-400 font-bold text-lg mb-2">{process.step}</div>
                  <h3 className="text-xl font-bold text-white mb-4">{process.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{process.description}</p>
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
                Готовы создать ваш веб-проект?
              </h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-lg">
                Обсудим ваши идеи и создадим современное веб-решение, 
                которое поможет достичь ваших бизнес-целей
              </p>
              <Link
                to="/contacts"
                className="ios-button inline-flex items-center"
              >
                Начать проект
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

export default WebDevelopment;