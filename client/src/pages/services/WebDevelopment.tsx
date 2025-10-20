import React, { useEffect } from 'react';
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
  Clock,
  ChevronRight
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const WebDevelopment = () => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
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
      <section className="hero-with-video relative min-h-[70vh] flex items-center overflow-hidden pt-20 sm:pt-24">
        {/* Animated background elements */}
        <div className="absolute inset-0 z-0">
          {/* Animated circles */}
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-3xl"
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
              className="absolute w-1 h-1 bg-blue-400 rounded-full"
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
                className="absolute -left-10 -top-10 text-blue-500/10 text-9xl font-bold z-0 hidden sm:block"
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
                W
              </motion.span>
              Веб-
              <span className="block text-blue-500 relative">
                разработка
                <motion.div
                  className="absolute -bottom-2 left-0 h-1 bg-blue-500/50 rounded-full"
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
              Создаем современные веб-решения, которые впечатляют пользователей 
              и приносят результат вашему бизнесу. От простых сайтов до сложных веб-приложений.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-5 justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link
                to="/contacts"
                className="modern-button inline-flex items-center justify-center"
              >
                <span>Начать проект</span>
                <ChevronRight className="ml-2 w-4 h-4" />
              </Link>
              
              <Link
                to="/portfolio"
                className="modern-ghost-button inline-flex items-center justify-center"
              >
                <span>Посмотреть работы</span>
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
                className="dimensional-card card-blue p-6 text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="icon-container icon-blue">
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
            <h2 className="heading-lg text-white mb-4">Наши услуги</h2>
            <p className="subheading max-w-2xl mx-auto">
              Полный спектр веб-разработки для решения любых бизнес-задач
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const colors = ['blue', 'purple', 'teal', 'orange'];
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

      {/* Technologies Section */}
      <section className="content-section section-dark py-20 sm:py-28 bg-[#0c1222]">
        <div className="container mx-auto px-4 sm:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="heading-lg text-white mb-4">Технологии</h2>
            <p className="subheading max-w-2xl mx-auto">
              Используем самые современные и надежные технологии
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
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
                  px-6 py-3 rounded-2xl font-semibold text-white
                  bg-gradient-to-r ${tech.color}
                  transition-all duration-300
                  relative overflow-hidden
                `}>
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                  <span className="relative z-10">{tech.name}</span>
                </div>
              </motion.div>
            ))}
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
            <h2 className="heading-lg text-white mb-4">Процесс работы</h2>
            <p className="subheading max-w-2xl mx-auto">
              Прозрачный и эффективный процесс от идеи до запуска
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Анализ', description: 'Изучаем ваши потребности и цели', icon: Users, color: 'blue' },
              { step: '02', title: 'Дизайн', description: 'Создаем современный UI/UX дизайн', icon: Monitor, color: 'purple' },
              { step: '03', title: 'Разработка', description: 'Программируем с использованием лучших практик', icon: Code, color: 'teal' },
              { step: '04', title: 'Запуск', description: 'Тестируем, оптимизируем и запускаем', icon: Rocket, color: 'orange' }
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
                <div className="text-blue-500 font-bold text-lg mb-2">{process.step}</div>
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
            className="dimensional-card card-blue p-8 sm:p-12 text-center sm:text-left relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="sm:flex items-center justify-between">
              <div className="mb-8 sm:mb-0 sm:mr-8">
                <h2 className="heading-lg text-white mb-4">Готовы создать ваш веб-проект?</h2>
                <p className="subheading max-w-xl mb-0">
                  Обсудим ваши идеи и создадим современное веб-решение,
                  которое поможет достичь ваших бизнес-целей
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/contacts"
                  className="modern-button button-blue inline-flex items-center justify-center text-base px-6 py-3"
                >
                  <span>Начать проект</span>
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

export default WebDevelopment;
