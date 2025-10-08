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
  ArrowRight,
  Shield,
  Zap,
  CheckCircle,
  Star,
  MessageCircle,
  Heart,
  Share2
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const KolTechLineArticle = () => {
  const features = [
    {
      icon: Users,
      title: 'FLineHub',
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
      title: 'KolTechValley',
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
      title: 'KolTechBusiness',
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
    { name: 'Реал-тайм общение', icon: MessageCircle, description: 'Мгновенное общение между участниками' },
    { name: 'AI Поиск', icon: Brain, description: 'ИИ для подбора идеальных команд' },
    { name: 'Безопасность на базе Блокчейна', icon: Shield, description: 'Безопасность на основе блокчейна' },
    { name: 'Глобальный поиск', icon: Globe, description: 'Доступ к мировому рынку талантов' }
  ];

  const stats = [
    { number: '10,000+', label: 'Зарегистрированных пользователей', icon: Users },
    { number: '$50M+', label: 'Объем транзакций', icon: DollarSign },
    { number: '500+', label: 'Успешных проектов', icon: Star },
    { number: '95%', label: 'Удовлетворенность клиентов', icon: CheckCircle }
  ];

  return (
    <div className="bg-dark-900">
      <Helmet>
        <title>KolTechLine Будущее Цифрового Сотрудничества | KolTech</title>
        <meta name="description" content="KolTechLine - это не просто платформа, это революционная экосистема, которая объединяет фрилансеров, заказчиков, стартаперов и инвесторов в единое пространство для создания инновационных проектов." />
        <meta name="keywords" content="Корпоративные сайты, E-commerce решения, Веб-приложения, Backend системы, Нативные приложения, Кроссплатформенные, PWA приложения, Enterprise решения, React Native, Flutter, Swift, Kotlin, Dart, Objective-C, Java, Xamarin, Ionic, Cordova, Firebase, SQLite, Realm, Core Data, Room, React, Vue.js, Angular, Node.js, TypeScript, JavaScript, Python, PHP, Next.js, Nuxt.js, Express.js, Django, Laravel, MySQL, Docker, AWS, GraphQL, Чат-боты, CV, Компьютерное зрение, Аналитика, Обработка текста, TensorFlow, PyTorch, OpenAI GPT, Hugging Face, Scikit-learn, Keras, OpenCV, NLTK, spaCy, Pandas, NumPy, Matplotlib, Jupyter, MLflow, Docker, Kubernetes, AWS SageMaker, Google AI, Azure ML, Apache Spark, Elasticsearch, MongoDB, PostgreSQL, Redis, Стратегическое планирование, Техническое консультирование, Безопасность и соответствие, Цифровая трансформация, Бизнес-Акселератор, Быстрый старт, AI-powered решения, Экспертная команда, Глобальный охват, Точное попадание, Надежность, Стратегическое планирование, Техническая реализация, Масштабирование, KolTechLine, FLineHub, KolTechValley, KolTechBusiness, Будущее Цифрового Сотрудничества, " />
        <meta property="og:title" content="KolTechLine Будущее Цифрового Сотрудничества | KolTech" />
        <meta property="og:description" content="KolTechLine - это не просто платформа, это революционная экосистема, которая объединяет фрилансеров, заказчиков, стартаперов и инвесторов в единое пространство для создания инновационных проектов." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://koltech.dev/koltechline-article" />
      </Helmet>
      {/* Hero Section */}
      <section className="pt-20 sm:pt-24 pb-8 sm:pb-12 px-4 sm:px-6">
        <div className="container mx-auto">
          <Link
            to="/koltechline"
            className="inline-flex items-center text-gray-400 hover:text-white mb-6 sm:mb-8 transition-colors bounce-in text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад к KolTechLine
          </Link>

          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6 sm:mb-8 bounce-in">
              <div className="p-3 sm:p-4 bg-gradient-to-br from-primary-500 to-accent-purple rounded-2xl">
                <Zap className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight fade-in-delay">
              Будущее
              <span className="gradient-text block mt-1 sm:mt-2">Цифрового Сотрудничества</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed slide-up">
              KolTechLine - это не просто платформа, это революционная экосистема,
              которая объединяет фрилансеров, заказчиков, стартаперов и инвесторов
              в единое пространство для создания инновационных проектов.
            </p>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-gradient-to-br from-dark-800 to-dark-900">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
            <div className="slide-up">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">Наша Миссия</h2>
              <p className="text-gray-300 mb-4 sm:mb-6 leading-relaxed text-base sm:text-lg">
                Мы создаем мир, где талант не знает границ, где инновационные идеи
                находят свое воплощение, а предприниматели получают необходимые
                ресурсы для реализации своих амбиций.
              </p>
              <p className="text-gray-300 mb-6 sm:mb-8 leading-relaxed text-base sm:text-lg">
                KolTechLine устраняет барьеры между участниками IT-экосистемы,
                создавая прозрачную, безопасную и эффективную среду для сотрудничества.
              </p>

              <div className="space-y-3 sm:space-y-4">
                {[
                  'Глобальная сеть верифицированных специалистов',
                  'Инновационные инструменты для управления проектами',
                  'Безопасная система платежей и контрактов',
                  'AI-powered подбор команд и проектов'
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-accent-green flex-shrink-0" />
                    <span className="text-gray-300 text-sm sm:text-base">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="w-full h-64 sm:h-80 md:h-96 bg-gradient-to-br from-primary-500/20 to-accent-purple/20 rounded-3xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 tech-pattern opacity-30" />
                <div className="text-center relative z-10 px-4">
                  <Globe className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 text-primary-400 mx-auto mb-4 sm:mb-6 animate-float" />
                  <p className="text-white font-semibold text-sm sm:text-base md:text-lg">Объединение талантов по всему Миру</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4 bounce-in">Ключевые Возможности</h2>
            <p className="text-gray-400 max-w-2xl mx-auto fade-in-delay text-sm sm:text-base">
              Три основных направления, которые делают KolTechLine уникальной платформой
            </p>
          </div>

          <div className="space-y-12 sm:space-y-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`grid lg:grid-cols-2 gap-8 sm:gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                  }`}
              >
                <div className={`slide-up ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-500 to-accent-purple rounded-xl flex items-center justify-center">
                      <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white">{feature.title}</h3>
                  </div>

                  <p className="text-gray-300 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                    {feature.description}
                  </p>

                  <div className="space-y-2 sm:space-y-3">
                    {feature.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-primary-400 rounded-full" />
                        <span className="text-gray-300 text-sm sm:text-base">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`slide-up ${index % 2 === 1 ? 'lg:col-start-1' : ''}`} style={{ animationDelay: '0.2s' }}>
                  <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 sm:p-8 card-hover">
                    <div className="h-48 sm:h-64 bg-gradient-to-br from-primary-500/10 to-accent-purple/10 rounded-xl flex items-center justify-center">
                      <feature.icon className="w-16 h-16 sm:w-24 sm:h-24 text-primary-400 animate-float" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-dark-800/50">
        <div className="container mx-auto">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4 bounce-in">Передовые Технологии</h2>
            <p className="text-gray-400 max-w-2xl mx-auto fade-in-delay text-sm sm:text-base">
              Мы используем самые современные технологии для создания безупречного пользовательского опыта
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {technologies.map((tech, index) => (
              <div
                key={index}
                className="bg-dark-800 border border-dark-700 rounded-2xl p-4 sm:p-6 card-hover text-center slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-500 to-accent-purple rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <tech.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">{tech.name}</h3>
                <p className="text-gray-400 text-xs sm:text-sm">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Roadmap Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-gradient-to-br from-dark-800 to-dark-900">
        <div className="container mx-auto">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4 bounce-in">Дорожная Карта</h2>
            <p className="text-gray-400 max-w-2xl mx-auto fade-in-delay text-sm sm:text-base">
              Наши планы по развитию платформы в ближайшие месяцы
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-4 sm:space-y-6 md:space-y-8">
              {[
                {
                  phase: 'St1',
                  title: 'Бета запуск',
                  description: 'Запуск бета-версии для ограниченного круга пользователей',
                  status: 'current'
                },
                {
                  phase: 'St2',
                  title: 'Публичный запуск',
                  description: 'Публичный запуск всех основных функций платформы',
                  status: 'upcoming',
                  year: '2026'
                },
                {
                  phase: 'St3',
                  title: 'Мобильные приложения',
                  description: 'Выпуск мобильных приложений для iOS и Android',
                  status: 'upcoming',
                  year: '2026'
                },
                {
                  phase: 'St4',
                  title: 'Расширение и развитие',
                  description: 'Расширение на международные рынки и новые языки',
                  status: 'upcoming',
                  year: '2026'
                }
              ].map((item, index) => (
                <div
                  key={index}
                  className={`flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 p-4 sm:p-6 rounded-2xl border transition-all duration-300 slide-up ${item.status === 'current'
                      ? 'bg-primary-500/10 border-primary-500/30'
                      : 'bg-dark-800 border-dark-700 hover:border-dark-600'
                    }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex flex-col items-center justify-center font-bold ${item.status === 'current'
                      ? 'bg-primary-500 text-white'
                      : 'bg-dark-700 text-gray-400'
                    }`}>
                    <span>{item.phase}</span>
                    {item.year && <span className="text-xs mt-1">{item.year}</span>}
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm sm:text-base">{item.description}</p>
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
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto bg-gradient-to-br from-dark-800 to-dark-700 p-6 sm:p-8 md:p-12 rounded-3xl border border-dark-600">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
              Готовы стать частью будущего?
            </h2>
            <p className="text-gray-300 mb-6 sm:mb-8 text-sm sm:text-base">
              Присоединяйтесь к KolTechLine и станьте частью революции в мире
              цифрового сотрудничества. Будущее начинается сегодня.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link
                to="/contacts"
                className="ios-button inline-flex items-center justify-center text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4"
              >
                Узнать о запуске первыми
              </Link>
              <Link
                to="/portfolio"
                className="glass-effect text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold hover:bg-white/10 transition-all duration-300 text-sm sm:text-base"
              >
                Посмотреть наши работы
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default KolTechLineArticle;