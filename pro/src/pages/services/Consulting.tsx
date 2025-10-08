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
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const Consulting = () => {
  const [visibleElements, setVisibleElements] = useState<number[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      Array.from({ length: 16 }).forEach((_, index) => {
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
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6 hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 tech-pattern opacity-20" />
        <div className="container mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="bounce-in">
              <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
                IT-
                <span className="text-shimmer block">консалтинг</span>
              </h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed fade-in-delay">
                Экспертные консультации по цифровой трансформации, архитектуре систем 
                и стратегическому планированию IT-развития вашего бизнеса.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 slide-up">
                <Link
                  to="/contacts"
                  className="ios-button inline-flex items-center justify-center"
                >
                  Получить консультацию
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  to="/portfolio"
                  className="glass-effect text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/10 transition-all duration-300 text-center"
                >
                  Кейсы консалтинга
                </Link>
              </div>
            </div>
            <div className="relative slide-up floating-elements" style={{ animationDelay: '0.3s' }}>
              <div className="ios-card p-8 rounded-3xl">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[Target, TrendingUp, Shield, Lightbulb].map((Icon, index) => (
                    <div
                      key={index}
                      className={`p-6 glass-effect rounded-2xl text-center magnetic-hover ${
                        visibleElements.includes(index) ? 'stagger-animation' : 'opacity-0'
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <Icon className="w-8 h-8 text-primary-400 mx-auto mb-2" />
                      <p className="text-white text-sm font-medium">
                        {['Strategy', 'Growth', 'Security', 'Innovation'][index]}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary-500 to-accent-purple rounded-3xl flex items-center justify-center mb-4 magnetic-hover">
                    <Users className="w-16 h-16 text-white" />
                  </div>
                  <p className="text-white font-semibold">Экспертные консультации</p>
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
            <h2 className="text-5xl font-bold text-white mb-4 bounce-in">Консалтинговые услуги</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto fade-in-delay">
              Комплексная экспертная поддержка на всех этапах IT-развития
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

      {/* Expertise Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-dark-800 to-dark-900">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-4 bounce-in">Области экспертизы</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto fade-in-delay">
              Глубокие знания в ключевых IT-направлениях
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {expertise.map((expert, index) => (
              <div
                key={index}
                className={`ios-card p-6 rounded-2xl slide-up ${
                  visibleElements.includes(index + 8) ? 'stagger-animation' : 'opacity-0'
                }`}
                style={{ animationDelay: `${(index + 8) * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">{expert.area}</h3>
                  <span className="text-primary-400 font-semibold">{expert.level}%</span>
                </div>
                <div className="w-full bg-dark-700 rounded-full h-3 overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${expert.color} rounded-full transition-all duration-1000 ease-out`}
                    style={{ 
                      width: visibleElements.includes(index + 8) ? `${expert.level}%` : '0%',
                      transitionDelay: `${(index + 8) * 0.1}s`
                    }}
                  />
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
      <section className="py-20 px-6 bg-gradient-to-br from-dark-800 to-dark-900">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="slide-up">
              <h2 className="text-5xl font-bold text-white mb-6">Преимущества работы с нами</h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Получите максимальную отдачу от IT-инвестиций с помощью 
                экспертных консультаций от команды KolTech.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-accent-green flex-shrink-0" />
                    <span className="text-gray-300 text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="ios-card p-8 rounded-3xl">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary-500 to-accent-purple rounded-3xl flex items-center justify-center mb-4">
                    <Award className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Сертифицированные эксперты</h3>
                  <p className="text-gray-400">Команда с международными сертификациями</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {['AWS', 'Azure', 'Google Cloud', 'Kubernetes'].map((cert, index) => (
                    <div key={index} className="glass-effect p-3 rounded-xl text-center">
                      <p className="text-white text-sm font-medium">{cert}</p>
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

      <Footer />
    </div>
  );
};

export default Consulting;