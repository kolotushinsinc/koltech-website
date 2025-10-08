import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  TrendingUp, 
  Target, 
  Lightbulb, 
  CheckCircle, 
  ArrowRight,
  BarChart3,
  Shield,
  Zap,
  Globe,
  Star,
  Clock,
  Award,
  MessageSquare,
  FileText,
  Settings
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const Consulting = () => {
  const [visibleElements, setVisibleElements] = useState<number[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      Array.from({ length: 100 }).forEach((_, index) => {
        setTimeout(() => {
          setVisibleElements(prev => [...prev, index]);
        }, index * 80);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const services = [
    {
      icon: Target,
      title: 'Стратегическое планирование',
      description: 'Разработка IT-стратегии и дорожной карты цифровой трансформации',
      features: ['Анализ текущего состояния', 'Планирование развития', 'ROI расчеты', 'Roadmap создание']
    },
    {
      icon: Settings,
      title: 'Техническое консультирование',
      description: 'Экспертная оценка архитектуры и выбор технологий',
      features: ['Code Review', 'Архитектурный аудит', 'Выбор технологий', 'Оптимизация производительности']
    },
    {
      icon: Shield,
      title: 'Безопасность и соответствие',
      description: 'Аудит безопасности и соответствие стандартам',
      features: ['Security аудит', 'GDPR соответствие', 'Пентестинг', 'Политики безопасности']
    },
    {
      icon: TrendingUp,
      title: 'Цифровая трансформация',
      description: 'Комплексная модернизация бизнес-процессов',
      features: ['Процессный анализ', 'Автоматизация', 'Интеграция систем', 'Change management']
    }
  ];

  const expertise = [
    { area: 'Cloud Computing', level: 95, color: 'from-blue-500 to-cyan-500' },
    { area: 'DevOps & CI/CD', level: 92, color: 'from-green-500 to-emerald-500' },
    { area: 'Microservices', level: 88, color: 'from-purple-500 to-indigo-500' },
    { area: 'Data Analytics', level: 90, color: 'from-orange-500 to-red-500' },
    { area: 'Cybersecurity', level: 87, color: 'from-red-500 to-pink-500' },
    { area: 'AI/ML Integration', level: 85, color: 'from-yellow-500 to-orange-500' }
  ];

  const stats = [
    { number: '200+', label: 'Консультационных проектов', icon: FileText },
    { number: '95%', label: 'Успешных внедрений', icon: Award },
    { number: '50+', label: 'Экспертов', icon: Users },
    { number: '24/7', label: 'Поддержка', icon: MessageSquare }
  ];

  const industries = [
    { 
      title: 'Финансовые услуги', 
      description: 'Банки, страховые компании, финтех стартапы',
      icon: BarChart3
    },
    { 
      title: 'Здравоохранение', 
      description: 'Медицинские учреждения, фармацевтика',
      icon: Shield
    },
    { 
      title: 'E-commerce', 
      description: 'Интернет-магазины, маркетплейсы',
      icon: Globe
    },
    { 
      title: 'Производство', 
      description: 'Промышленные предприятия, IoT решения',
      icon: Settings
    },
    { 
      title: 'Образование', 
      description: 'EdTech платформы, онлайн обучение',
      icon: Lightbulb
    },
    { 
      title: 'Государственный сектор', 
      description: 'Цифровизация госуслуг',
      icon: Users
    }
  ];

  const benefits = [
    'Экспертная оценка от ведущих специалистов',
    'Независимый взгляд на ваши IT-процессы',
    'Конкретные рекомендации с планом внедрения',
    'Снижение рисков и оптимизация затрат',
    'Ускорение цифровой трансформации',
    'Повышение конкурентоспособности'
  ];

  return (
    <div className="min-h-screen bg-dark-900">
      <Helmet>
          <title>IT-консалтинг | KolTech</title>
          <meta name="description" content="Экспертные консультации по цифровой трансформации, архитектуре систем и стратегическому планированию IT-развития вашего бизнеса." />
          <meta name="keywords" content="Стратегическое планирование, Техническое консультирование, Безопасность и соответствие, Цифровая трансформация" />
          <meta property="og:title" content="IT-консалтинг | KolTech" />
          <meta property="og:description" content="Экспертные консультации по цифровой трансформации, архитектуре систем и стратегическому планированию IT-развития вашего бизнеса." />
          <meta property="og:type" content="website" />
          <link rel="canonical" href="https://koltech.dev/consulting" />
      </Helmet>
      {/* Hero Section */}
      <section className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6 hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 tech-pattern opacity-20" />
        <div className="container mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="bounce-in">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                IT-
                <span className="text-shimmer block">консалтинг</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 leading-relaxed fade-in-delay">
                Экспертные консультации по цифровой трансформации, архитектуре систем
                и стратегическому планированию IT-развития вашего бизнеса.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 slide-up">
                <Link
                  to="/contacts"
                  className="ios-button inline-flex items-center justify-center text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4"
                >
                  Получить консультацию
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
                <Link
                  to="/portfolio"
                  className="glass-effect text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold hover:bg-white/10 transition-all duration-300 text-center text-sm sm:text-base"
                >
                  Кейсы консалтинга
                </Link>
              </div>
            </div>
            <div className="relative slide-up floating-elements h-full flex flex-col" style={{ animationDelay: '0.3s' }}>
              <div className="ios-card p-4 sm:p-6 md:p-8 rounded-3xl h-full flex flex-col">
                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  {[Target, TrendingUp, Shield, Lightbulb].map((Icon, index) => (
                    <div
                      key={index}
                      className={`p-4 sm:p-6 glass-effect rounded-2xl text-center magnetic-hover ${
                        visibleElements.includes(index) ? 'stagger-animation' : 'opacity-0'
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary-400 mx-auto mb-1 sm:mb-2" />
                      <p className="text-white text-xs sm:text-sm font-medium">
                        {['Стратегия', 'Рост', 'Безопасность', 'Инновации'][index]}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-auto">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 mx-auto bg-gradient-to-br from-primary-500 to-accent-purple rounded-3xl flex items-center justify-center mb-3 sm:mb-4 magnetic-hover">
                    <Users className="w-10 h-10 sm:w-12 sm:w-16 md:w-16 md:h-16 text-white" />
                  </div>
                  <p className="text-white font-semibold text-sm sm:text-base">Экспертные консультации</p>
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
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4 bounce-in">Консалтинговые услуги</h2>
            <p className="text-base sm:text-xl text-gray-400 max-w-3xl mx-auto fade-in-delay">
              Комплексная экспертная поддержка на всех этапах IT-развития
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
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

      {/* Expertise Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-dark-800 to-dark-900">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-4 bounce-in">Области экспертизы</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto fade-in-delay">
              Глубокие знания в ключевых IT-направлениях
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 max-w-6xl mx-auto">
            {[
              { name: 'Cloud Computing', color: 'from-blue-500 to-cyan-500' },
              { name: 'DevOps & CI/CD', color: 'from-green-500 to-emerald-500' },
              { name: 'Microservices', color: 'from-purple-500 to-indigo-500' },
              { name: 'Data Analytics', color: 'from-orange-500 to-red-500' },
              { name: 'Cybersecurity', color: 'from-red-500 to-pink-500' },
              { name: 'AI/ML Integration', color: 'from-yellow-500 to-orange-500' },
              { name: 'AWS', color: 'from-orange-500 to-yellow-600' },
              { name: 'Azure', color: 'from-blue-600 to-cyan-600' },
              { name: 'Google Cloud', color: 'from-blue-500 to-green-500' },
              { name: 'Kubernetes', color: 'from-blue-600 to-indigo-600' },
              { name: 'Docker', color: 'from-blue-500 to-cyan-500' },
              { name: 'Terraform', color: 'from-purple-600 to-indigo-600' },
              { name: 'Jenkins', color: 'from-blue-700 to-gray-600' },
              { name: 'GitLab CI', color: 'from-orange-600 to-red-600' },
              { name: 'GitHub Actions', color: 'from-gray-700 to-gray-900' },
              { name: 'Ansible', color: 'from-red-600 to-red-800' },
              { name: 'Prometheus', color: 'from-orange-500 to-red-500' },
              { name: 'Grafana', color: 'from-orange-600 to-yellow-500' },
              { name: 'ELK Stack', color: 'from-yellow-500 to-orange-500' },
              { name: 'Apache Kafka', color: 'from-gray-700 to-gray-900' },
              { name: 'Redis', color: 'from-red-600 to-red-800' },
              { name: 'MongoDB', color: 'from-green-600 to-green-800' },
              { name: 'PostgreSQL', color: 'from-blue-700 to-indigo-600' },
              { name: 'OWASP', color: 'from-red-500 to-pink-500' },
              { name: 'ISO 27001', color: 'from-blue-600 to-purple-600' },
              { name: 'GDPR', color: 'from-indigo-600 to-purple-600' }
            ].map((tech, index) => (
              <div
                key={index}
                className={`group cursor-pointer ${
                  visibleElements.includes(index + 8) ? 'stagger-animation' : 'opacity-0'
                }`}
                style={{ animationDelay: `${(index + 8) * 0.03}s` }}
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
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-4 bounce-in">Отрасли</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto fade-in-delay">
              Опыт работы в различных сферах бизнеса
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((industry, index) => (
              <div
                key={index}
                className={`ios-card p-6 rounded-2xl text-center magnetic-hover ${
                  visibleElements.includes(index + 14) ? 'stagger-animation' : 'opacity-0'
                }`}
                style={{ animationDelay: `${(index + 14) * 0.1}s` }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-purple rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <industry.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{industry.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{industry.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gradient-to-br from-dark-800 to-dark-900">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="slide-up">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">Преимущества работы с нами</h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 leading-relaxed">
                Получите максимальную отдачу от IT-инвестиций с помощью
                экспертных консультаций от команды KolTech.
              </p>
              
              <div className="space-y-3 sm:space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-2 sm:space-x-3">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-accent-green flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm sm:text-base md:text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative slide-up h-full flex flex-col" style={{ animationDelay: '0.2s' }}>
              <div className="ios-card p-6 sm:p-8 rounded-3xl h-full flex flex-col">
                <div className="text-center mb-4 sm:mb-6">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto bg-gradient-to-br from-primary-500 to-accent-purple rounded-3xl flex items-center justify-center mb-3 sm:mb-4">
                    <Award className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2">Сертифицированные эксперты</h3>
                  <p className="text-gray-400 text-sm sm:text-base">Команда с международными сертификациями</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-auto">
                  {['AWS', 'Azure', 'Google Cloud', 'Kubernetes'].map((cert, index) => (
                    <div key={index} className="glass-effect p-2 sm:p-3 rounded-xl text-center">
                      <p className="text-white text-xs sm:text-sm font-medium">{cert}</p>
                      <p className="text-primary-400 text-xs">Certified</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-4 bounce-in">Процесс консалтинга</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto fade-in-delay">
              Структурированный подход к решению ваших IT-задач
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Диагностика', description: 'Анализ текущего состояния IT-систем', icon: Target },
              { step: '02', title: 'Стратегия', description: 'Разработка плана развития', icon: Lightbulb },
              { step: '03', title: 'Roadmap', description: 'Создание дорожной карты внедрения', icon: TrendingUp },
              { step: '04', title: 'Поддержка', description: 'Сопровождение реализации', icon: Users }
            ].map((process, index) => (
              <div
                key={index}
                className="text-center slide-up magnetic-hover h-full flex flex-col"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="ios-card p-6 sm:p-8 rounded-3xl h-full flex flex-col">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-500 to-accent-purple rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <process.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div className="text-primary-400 font-bold text-base sm:text-lg mb-2">{process.step}</div>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2 sm:mb-4">{process.title}</h3>
                  <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mt-auto">{process.description}</p>
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
                Нужна экспертная консультация?
              </h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-lg">
                Получите профессиональную оценку ваших IT-систем и рекомендации 
                по оптимизации от ведущих экспертов индустрии
              </p>
              <Link
                to="/contacts"
                className="ios-button inline-flex items-center"
              >
                Заказать консультацию
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Consulting;