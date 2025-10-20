import React, { useEffect } from 'react';
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
  Share2,
  ChevronRight
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const KolTechLineArticle = () => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
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
    <div className="min-h-screen bg-dark-900">
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
      <section className="hero-with-video relative min-h-[70vh] flex items-center overflow-hidden pt-20 sm:pt-24">
        {/* Animated background elements */}
        <div className="absolute inset-0 z-0">
          {/* Animated circles */}
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full bg-purple-500/5 blur-3xl"
            style={{ top: '-10%', right: '-10%' }}
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
              rotate: [0, 90, 0]
            }}
            transition={{ 
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-3xl"
            style={{ bottom: '-5%', left: '-5%' }}
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
              rotate: [0, -60, 0]
            }}
            transition={{ 
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute w-[300px] h-[300px] rounded-full bg-teal-500/5 blur-3xl"
            style={{ top: '30%', left: '20%' }}
            animate={{ 
              scale: [1, 1.4, 1],
              opacity: [0.2, 0.3, 0.2],
              y: [0, -30, 0]
            }}
            transition={{ 
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Floating particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary-400 rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{ 
                opacity: [0.3, 0.7, 0.3],
                y: [0, -10, 0]
              }}
              transition={{ 
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2
              }}
            />
          ))}
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-dark-900/80 tech-pattern z-0"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-8 z-10 py-12 sm:py-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              to="/koltechline"
              className="inline-flex items-center text-gray-400 hover:text-white mb-6 sm:mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад к KolTechLine
            </Link>
          </motion.div>

          <div className="max-w-4xl mx-auto text-center">
            <motion.div 
              className="flex justify-center mb-6 sm:mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div 
                className="dimensional-card card-purple p-6 relative rounded-3xl"
                animate={{ 
                  boxShadow: ['0 0 20px rgba(168, 85, 247, 0.3)', '0 0 40px rgba(168, 85, 247, 0.5)', '0 0 20px rgba(168, 85, 247, 0.3)']
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 360]
                  }}
                  transition={{ 
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <Zap className="w-12 h-12 text-purple-500" />
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.h1 
              className="heading-xl text-white mb-6 relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.span
                className="absolute -left-10 -top-10 text-purple-500/10 text-9xl font-bold z-0 hidden sm:block"
                animate={{ 
                  opacity: [0.3, 0.5, 0.3],
                  rotate: [-5, 0, -5]
                }}
                transition={{ 
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                K
              </motion.span>
              Будущее
              <span className="block text-purple-500 relative">
                Цифрового Сотрудничества
                <motion.div
                  className="absolute -bottom-2 left-0 h-1 bg-purple-500/50 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.5, delay: 1 }}
                />
              </span>
            </motion.h1>

            <motion.p 
              className="subheading text-gray-300 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              KolTechLine - это не просто платформа, это революционная экосистема,
              которая объединяет фрилансеров, заказчиков, стартаперов и инвесторов
              в единое пространство для создания инновационных проектов.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="content-section section-gradient py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="heading-lg text-white mb-6">Наша Миссия</h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Мы создаем мир, где талант не знает границ, где инновационные идеи
                находят свое воплощение, а предприниматели получают необходимые
                ресурсы для реализации своих амбиций.
              </p>
              <p className="text-gray-300 mb-8 leading-relaxed">
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
                  <motion.div 
                    key={index} 
                    className="flex items-center space-x-3"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-300">{item}</span>
                  </motion.div>
                ))}
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-8"
              >
                <Link to="/contacts" className="modern-button button-purple inline-flex items-center">
                  <span>Узнать больше</span>
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </motion.div>
            </motion.div>
            
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="dimensional-card card-purple p-8 sm:p-12 flex items-center justify-center">
                <div className="text-center">
                  <motion.div
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: [0, 5, 0]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="mb-6"
                  >
                    <Globe className="w-20 h-20 sm:w-24 sm:h-24 text-purple-500 mx-auto" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-white mb-2">Объединение талантов</h3>
                  <p className="text-gray-400 text-sm">Создаем глобальную сеть специалистов</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="content-section section-dark py-20 sm:py-28 bg-[#0c1222]">
        <div className="container mx-auto px-4 sm:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="heading-lg text-white mb-4">Ключевые Возможности</h2>
            <p className="subheading max-w-2xl mx-auto">
              Три основных направления, которые делают KolTechLine уникальной платформой
            </p>
          </motion.div>

          <div className="space-y-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`grid lg:grid-cols-2 gap-8 sm:gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                  }`}
              >
                <motion.div 
                  className={`${index % 2 === 1 ? 'lg:col-start-2' : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div className={`icon-container icon-${index === 0 ? 'blue' : index === 1 ? 'purple' : 'teal'}`}>
                      <feature.icon className="w-6 h-6 text-white relative z-10" />
                    </div>
                    <h3 className="text-2xl font-semibold text-white">{feature.title}</h3>
                  </div>

                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {feature.description}
                  </p>

                  <div className="space-y-3">
                    {feature.details.map((detail, detailIndex) => (
                      <motion.div 
                        key={detailIndex} 
                        className="flex items-center space-x-3"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: 0.2 + detailIndex * 0.1 }}
                      >
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <span className="text-gray-300">{detail}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div 
                  className={`${index % 2 === 1 ? 'lg:col-start-1' : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className={`dimensional-card card-${index === 0 ? 'blue' : index === 1 ? 'purple' : 'teal'} p-8 relative overflow-hidden`}>
                    <div className="absolute right-4 bottom-4 opacity-5 pointer-events-none">
                      <feature.icon className="w-64 h-64" />
                    </div>
                    
                    <div className="h-48 flex items-center justify-center">
                      <motion.div
                        animate={{ 
                          y: [0, -10, 0],
                          rotate: [0, 5, 0]
                        }}
                        transition={{ 
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <feature.icon className="w-24 h-24 text-white/50" />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="content-section section-gradient py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="heading-lg text-white mb-4">Передовые Технологии</h2>
            <p className="subheading max-w-2xl mx-auto">
              Мы используем самые современные технологии для создания безупречного пользовательского опыта
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {technologies.map((tech, index) => {
              const colors = ['blue', 'purple', 'teal', 'orange'];
              const color = colors[index % colors.length];
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`dimensional-card card-${color} p-6 relative overflow-hidden text-center`}
                >
                  {/* Background icon */}
                  <div className="absolute right-4 bottom-4 opacity-5 pointer-events-none">
                    <tech.icon className="w-32 h-32" />
                  </div>
                  
                  <div className={`icon-container icon-${color} mb-4 mx-auto`}>
                    <tech.icon className="w-5 h-5 text-white relative z-10" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-2">{tech.name}</h3>
                  <p className="text-gray-400 text-sm">{tech.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>


      {/* Stats Section */}
      <section className="content-section section-dark py-20 sm:py-28 bg-[#0c1222]">
        <div className="container mx-auto px-4 sm:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="heading-lg text-white mb-4">Наши Достижения</h2>
            <p className="subheading max-w-2xl mx-auto">
              Результаты, которыми мы гордимся
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="dimensional-card card-purple p-6 text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="icon-container icon-purple">
                    <stat.icon className="w-5 h-5 text-white relative z-10" />
                  </div>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">{stat.number}</h3>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="content-section section-gradient py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="heading-lg text-white mb-4">Дорожная Карта</h2>
            <p className="subheading max-w-2xl mx-auto">
              Наши планы по развитию платформы в ближайшие месяцы
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="grid gap-6 sm:gap-8">
              {[
                {
                  phase: 'Этап 1',
                  title: 'Бета запуск',
                  description: 'Запуск бета-версии для ограниченного круга пользователей',
                  status: 'current',
                  icon: Zap,
                  color: 'purple'
                },
                {
                  phase: 'Этап 2',
                  title: 'Публичный запуск',
                  description: 'Публичный запуск всех основных функций платформы',
                  status: 'upcoming',
                  year: '2026',
                  icon: Globe,
                  color: 'blue'
                },
                {
                  phase: 'Этап 3',
                  title: 'Мобильные приложения',
                  description: 'Выпуск мобильных приложений для iOS и Android',
                  status: 'upcoming',
                  year: '2026',
                  icon: Smartphone,
                  color: 'teal'
                },
                {
                  phase: 'Этап 4',
                  title: 'Расширение и развитие',
                  description: 'Расширение на международные рынки и новые языки',
                  status: 'upcoming',
                  year: '2026',
                  icon: TrendingUp,
                  color: 'orange'
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`dimensional-card card-${item.color} p-6 sm:p-8 relative overflow-hidden`}
                >
                  <div className="sm:flex items-center">
                    <div className="mb-4 sm:mb-0 sm:mr-6 flex-shrink-0">
                      <div className={`icon-container icon-${item.color} mx-auto sm:mx-0`}>
                        <item.icon className="w-5 h-5 text-white relative z-10" />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-xl font-semibold text-white mr-3">{item.title}</h3>
                        {item.status === 'current' && (
                          <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full border border-purple-500/30">
                            Текущий
                          </span>
                        )}
                      </div>
                      <p className="text-gray-300 text-sm mb-2">{item.description}</p>
                      <div className="flex items-center text-xs text-gray-400">
                        <span className="font-semibold mr-2">{item.phase}</span>
                        {item.year && (
                          <span className="bg-dark-700 px-2 py-0.5 rounded-full">{item.year}</span>
                        )}
                      </div>
                    </div>
                    
                    {item.status === 'current' && (
                      <div className="hidden sm:block ml-4">
                        <motion.div 
                          className="w-3 h-3 bg-purple-500 rounded-full"
                          animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.7, 1, 0.7]
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="content-section py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-8">
          <motion.div 
            className="dimensional-card card-purple p-8 sm:p-12 text-center sm:text-left relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="sm:flex items-center justify-between">
              <div className="mb-8 sm:mb-0 sm:mr-8">
                <h2 className="heading-lg text-white mb-4">Готовы стать частью будущего?</h2>
                <p className="subheading max-w-xl mb-0">
                  Присоединяйтесь к KolTechLine и станьте частью революции в мире
                  цифрового сотрудничества. Будущее начинается сегодня.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/contacts"
                  className="modern-button button-purple inline-flex items-center justify-center text-base px-6 py-3"
                >
                  <span>Узнать о запуске</span>
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Link>
                
                <Link
                  to="/portfolio"
                  className="modern-ghost-button inline-flex items-center justify-center text-base px-6 py-3"
                >
                  <span>Наши работы</span>
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default KolTechLineArticle;
