import React, { useEffect } from 'react';
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
  Settings,
  ChevronRight
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const Consulting = () => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
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
      <section className="hero-with-video relative min-h-[70vh] flex items-center overflow-hidden pt-20 sm:pt-24">
        {/* Animated background elements */}
        <div className="absolute inset-0 z-0">
          {/* Animated circles */}
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full bg-orange-500/5 blur-3xl"
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
            className="absolute w-[400px] h-[400px] rounded-full bg-yellow-500/5 blur-3xl"
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
            className="absolute w-[300px] h-[300px] rounded-full bg-red-500/5 blur-3xl"
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
              className="absolute w-1 h-1 bg-orange-400 rounded-full"
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
          <div className="max-w-4xl">
            <motion.h1 
              className="heading-xl text-white mb-6 relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.span
                className="absolute -left-10 -top-10 text-orange-500/10 text-9xl font-bold z-0 hidden sm:block"
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
                C
              </motion.span>
              IT-
              <span className="block text-orange-500 relative">
                консалтинг
                <motion.div
                  className="absolute -bottom-2 left-0 h-1 bg-orange-500/50 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.5, delay: 1 }}
                />
              </span>
            </motion.h1>

            <motion.p 
              className="subheading text-gray-300 mb-8 max-w-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Экспертные консультации по цифровой трансформации, архитектуре систем
              и стратегическому планированию IT-развития вашего бизнеса.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-5 justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link
                to="/contacts"
                className="modern-button button-orange inline-flex items-center justify-center"
              >
                <span>Получить консультацию</span>
                <ChevronRight className="ml-2 w-4 h-4" />
              </Link>
              
              <Link
                to="/portfolio"
                className="modern-ghost-button inline-flex items-center justify-center"
              >
                <span>Кейсы консалтинга</span>
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </motion.div>
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
                className="dimensional-card card-orange p-6 text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="icon-container icon-orange">
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

      {/* Services Section */}
      <section className="content-section section-gradient py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="heading-lg text-white mb-4">Консалтинговые услуги</h2>
            <p className="subheading max-w-2xl mx-auto">
              Комплексная экспертная поддержка на всех этапах IT-развития
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const colors = ['orange', 'purple', 'teal', 'blue'];
              const color = colors[index % colors.length];
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`dimensional-card card-${color} p-6 sm:p-8 relative overflow-hidden`}
                >
                  <div className="flex items-center mb-6">
                    <div className={`icon-container icon-${color} mr-4`}>
                      <service.icon className="w-6 h-6 text-white relative z-10" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">{service.title}</h3>
                  </div>
                  
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {service.features.map((feature, featureIndex) => (
                      <motion.div 
                        key={featureIndex} 
                        className="flex items-center space-x-3"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: 0.2 + featureIndex * 0.1 }}
                      >
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="content-section section-dark py-20 sm:py-28 bg-[#0c1222]">
        <div className="container mx-auto px-4 sm:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="heading-lg text-white mb-4">Области экспертизы</h2>
            <p className="subheading max-w-2xl mx-auto">
              Глубокие знания в ключевых IT-направлениях
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
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
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.05 * index }}
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <div className={`
                  px-5 py-2.5 rounded-xl font-medium text-white
                  bg-gradient-to-r ${tech.color}
                  transition-all duration-300
                  relative overflow-hidden
                `}>
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                  <span className="relative z-10">{tech.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="content-section section-gradient py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="heading-lg text-white mb-4">Отрасли</h2>
            <p className="subheading max-w-2xl mx-auto">
              Опыт работы в различных сферах бизнеса
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((industry, index) => {
              const colors = ['orange', 'purple', 'teal', 'blue', 'purple', 'teal'];
              const color = colors[index % colors.length];
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`dimensional-card card-${color} p-6 text-center relative overflow-hidden`}
                >
                  <div className="flex justify-center mb-4">
                    <div className={`icon-container icon-${color}`}>
                      <industry.icon className="w-5 h-5 text-white relative z-10" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{industry.title}</h3>
                  <p className="text-gray-400 text-sm">{industry.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="content-section section-dark py-20 sm:py-28 bg-[#0c1222]">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="heading-lg text-white mb-6">Преимущества работы с нами</h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Получите максимальную отдачу от IT-инвестиций с помощью
                экспертных консультаций от команды KolTech.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-center space-x-3"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-300">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="dimensional-card card-orange p-3 sm:p-5 flex items-center justify-center">
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
                    <Award className="w-20 h-20 sm:w-24 sm:h-24 text-orange-500 mx-auto" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-white mb-2">Сертифицированные эксперты</h3>
                  <p className="text-gray-400 text-sm">Команда с международными сертификациями</p>
                  
                  <div className="grid grid-cols-2 gap-3 mt-6">
                    {['AWS', 'Azure', 'Google Cloud', 'Kubernetes'].map((cert, index) => (
                      <div key={index} className="bg-dark-900/50 p-2 rounded-lg border border-white/10">
                        <p className="text-white text-sm font-medium">{cert}</p>
                        <p className="text-orange-400 text-xs">Certified</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="content-section section-gradient py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="heading-lg text-white mb-4">Процесс консалтинга</h2>
            <p className="subheading max-w-2xl mx-auto">
              Структурированный подход к решению ваших IT-задач
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Диагностика', description: 'Анализ текущего состояния IT-систем', icon: Target, color: 'orange' },
              { step: '02', title: 'Стратегия', description: 'Разработка плана развития', icon: Lightbulb, color: 'purple' },
              { step: '03', title: 'Roadmap', description: 'Создание дорожной карты внедрения', icon: TrendingUp, color: 'teal' },
              { step: '04', title: 'Поддержка', description: 'Сопровождение реализации', icon: Users, color: 'blue' }
            ].map((process, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`dimensional-card card-${process.color} p-6 text-center relative overflow-hidden`}
              >
                <div className="flex justify-center mb-4">
                  <div className={`icon-container icon-${process.color}`}>
                    <process.icon className="w-5 h-5 text-white relative z-10" />
                  </div>
                </div>
                <div className="text-orange-500 font-bold text-lg mb-2">{process.step}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{process.title}</h3>
                <p className="text-gray-400 text-sm">{process.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="content-section py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-8">
          <motion.div 
            className="dimensional-card card-orange p-8 sm:p-12 text-center sm:text-left relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="sm:flex items-center justify-between">
              <div className="mb-8 sm:mb-0 sm:mr-8">
                <h2 className="heading-lg text-white mb-4">Готовы начать консалтинговый проект?</h2>
                <p className="subheading max-w-xl mb-0">
                  Обсудим ваши задачи и создадим эффективную стратегию
                  для достижения ваших бизнес-целей
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/contacts"
                  className="modern-button button-orange inline-flex items-center justify-center text-base px-6 py-3"
                >
                  <span>Получить консультацию</span>
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Link>
                
                <Link
                  to="/portfolio"
                  className="modern-ghost-button inline-flex items-center justify-center text-base px-6 py-3"
                >
                  <span>Наши кейсы</span>
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

export default Consulting;
