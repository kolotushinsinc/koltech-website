import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Brain, 
  Code, 
  Smartphone, 
  Globe, 
  Shield, 
  Zap,
  CheckCircle,
  Star,
  MessageCircle,
  Heart,
  Share2
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const KolTechLineArticle = () => {
  const features = [
    {
      icon: Users,
      title: 'Freelance Hub',
      description: 'Платформа для поиска и найма лучших IT-специалистов со всего мира',
      details: [
        'Верифицированные профили разработчиков',
        'Система рейтингов и отзывов',
        'Безопасные платежи через эскроу',
        'Интеграция с GitHub и портфолио'
      ]
    },
    {
      icon: TrendingUp,
      title: 'Startup Valley',
      description: 'Краудфандинговая платформа для технологических стартапов',
      details: [
        'Презентация проектов инвесторам',
        'Система голосования сообщества',
        'Менторская поддержка',
        'Аналитика и метрики проектов'
      ]
    },
    {
      icon: DollarSign,
      title: 'Investment Zone',
      description: 'Связующее звено между стартапами и инвесторами',
      details: [
        'Верифицированные инвесторы',
        'Due diligence инструменты',
        'Юридическое сопровождение',
        'Отслеживание инвестиций'
      ]
    }
  ];

  const technologies = [
    { name: 'Real-time Messaging', icon: MessageCircle, description: 'Мгновенное общение между участниками' },
    { name: 'AI Matching', icon: Brain, description: 'ИИ для подбора идеальных команд' },
    { name: 'Blockchain Security', icon: Shield, description: 'Безопасность на основе блокчейна' },
    { name: 'Global Reach', icon: Globe, description: 'Доступ к мировому рынку талантов' }
  ];

  const stats = [
    { number: '10,000+', label: 'Зарегистрированных пользователей', icon: Users },
    { number: '$50M+', label: 'Объем транзакций', icon: DollarSign },
    { number: '500+', label: 'Успешных проектов', icon: Star },
    { number: '95%', label: 'Удовлетворенность клиентов', icon: CheckCircle }
  ];

  return (
    <div className="min-h-screen bg-dark-900">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-6">
        <div className="container mx-auto">
          <Link
            to="/koltechline"
            className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors bounce-in"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад к KolTechLine
          </Link>

          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-8 bounce-in">
              <div className="p-4 bg-gradient-to-br from-primary-500 to-accent-purple rounded-2xl">
                <Zap className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight fade-in-delay">
              Будущее
              <span className="gradient-text block mt-2">Цифрового Сотрудничества</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed slide-up">
              KolTechLine - это не просто платформа, это революционная экосистема, 
              которая объединяет фрилансеров, заказчиков, стартаперов и инвесторов 
              в единое пространство для создания инновационных проектов.
            </p>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-dark-800 to-dark-900">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="slide-up">
              <h2 className="text-4xl font-bold text-white mb-6">Наша Миссия</h2>
              <p className="text-gray-300 mb-6 leading-relaxed text-lg">
                Мы создаем мир, где талант не знает границ, где инновационные идеи 
                находят свое воплощение, а предприниматели получают необходимые 
                ресурсы для реализации своих амбиций.
              </p>
              <p className="text-gray-300 mb-8 leading-relaxed text-lg">
                KolTechLine устраняет барьеры между участниками IT-экосистемы, 
                создавая прозрачную, безопасную и эффективную среду для сотрудничества.
              </p>
              
              <div className="space-y-4">
                {[
                  'Глобальная сеть верифицированных специалистов',
                  'Инновационные инструменты для управления проектами',
                  'Безопасная система платежей и контрактов',
                  'AI-powered подбор команд и проектов'
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-accent-green flex-shrink-0" />
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="w-full h-96 bg-gradient-to-br from-primary-500/20 to-accent-purple/20 rounded-3xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 tech-pattern opacity-30" />
                <div className="text-center relative z-10">
                  <Globe className="w-32 h-32 text-primary-400 mx-auto mb-6 animate-float" />
                  <p className="text-white font-semibold text-lg">Connecting Global Talent</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4 bounce-in">Ключевые Возможности</h2>
            <p className="text-gray-400 max-w-2xl mx-auto fade-in-delay">
              Три основных направления, которые делают KolTechLine уникальной платформой
            </p>
          </div>

          <div className="space-y-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                }`}
              >
                <div className={`slide-up ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-purple rounded-xl flex items-center justify-center">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-white">{feature.title}</h3>
                  </div>
                  
                  <p className="text-gray-300 mb-6 leading-relaxed text-lg">
                    {feature.description}
                  </p>
                  
                  <div className="space-y-3">
                    {feature.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-primary-400 rounded-full" />
                        <span className="text-gray-300">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className={`slide-up ${index % 2 === 1 ? 'lg:col-start-1' : ''}`} style={{ animationDelay: '0.2s' }}>
                  <div className="bg-dark-800 border border-dark-700 rounded-2xl p-8 card-hover">
                    <div className="h-64 bg-gradient-to-br from-primary-500/10 to-accent-purple/10 rounded-xl flex items-center justify-center">
                      <feature.icon className="w-24 h-24 text-primary-400 animate-float" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-20 px-6 bg-dark-800/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4 bounce-in">Передовые Технологии</h2>
            <p className="text-gray-400 max-w-2xl mx-auto fade-in-delay">
              Мы используем самые современные технологии для создания безупречного пользовательского опыта
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {technologies.map((tech, index) => (
              <div
                key={index}
                className="bg-dark-800 border border-dark-700 rounded-2xl p-6 card-hover text-center slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-purple rounded-xl flex items-center justify-center mx-auto mb-4">
                  <tech.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-3">{tech.name}</h3>
                <p className="text-gray-400 text-sm">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4 bounce-in">Впечатляющие Результаты</h2>
            <p className="text-gray-400 max-w-2xl mx-auto fade-in-delay">
              Цифры, которые говорят о нашем успехе и доверии пользователей
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-gradient-to-br from-primary-500 to-accent-purple rounded-2xl">
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-dark-800 to-dark-900">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4 bounce-in">Дорожная Карта</h2>
            <p className="text-gray-400 max-w-2xl mx-auto fade-in-delay">
              Наши планы по развитию платформы в ближайшие месяцы
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {[
                {
                  phase: 'Q1 2025',
                  title: 'Beta Launch',
                  description: 'Запуск бета-версии для ограниченного круга пользователей',
                  status: 'current'
                },
                {
                  phase: 'Q2 2025',
                  title: 'Public Release',
                  description: 'Публичный запуск всех основных функций платформы',
                  status: 'upcoming'
                },
                {
                  phase: 'Q3 2025',
                  title: 'Mobile Apps',
                  description: 'Выпуск мобильных приложений для iOS и Android',
                  status: 'upcoming'
                },
                {
                  phase: 'Q4 2025',
                  title: 'Global Expansion',
                  description: 'Расширение на международные рынки и новые языки',
                  status: 'upcoming'
                }
              ].map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-6 p-6 rounded-2xl border transition-all duration-300 slide-up ${
                    item.status === 'current'
                      ? 'bg-primary-500/10 border-primary-500/30'
                      : 'bg-dark-800 border-dark-700 hover:border-dark-600'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center font-bold ${
                    item.status === 'current'
                      ? 'bg-primary-500 text-white'
                      : 'bg-dark-700 text-gray-400'
                  }`}>
                    {item.phase}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-400">{item.description}</p>
                  </div>
                  {item.status === 'current' && (
                    <div className="w-3 h-3 bg-primary-400 rounded-full animate-pulse" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="bg-gradient-to-br from-dark-800 to-dark-700 p-12 rounded-3xl border border-dark-600 text-center slide-up relative overflow-hidden">
            <div className="absolute inset-0 tech-pattern opacity-10" />
            <div className="relative">
              <h2 className="text-4xl font-bold text-white mb-4">
                Готовы стать частью будущего?
              </h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-lg">
                Присоединяйтесь к KolTechLine и станьте частью революции в мире 
                цифрового сотрудничества. Будущее начинается сегодня.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contacts"
                  className="bg-gradient-to-r from-primary-500 to-accent-purple text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 pulse-glow"
                >
                  Узнать о запуске первыми
                </Link>
                <Link
                  to="/portfolio"
                  className="border-2 border-primary-500 text-primary-400 px-8 py-4 rounded-xl font-semibold hover:bg-primary-500 hover:text-white hover:scale-105 transition-all duration-300"
                >
                  Посмотреть наши работы
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default KolTechLineArticle;