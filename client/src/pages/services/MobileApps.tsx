import React, { useEffect } from 'react';
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
  Globe,
  ChevronRight
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const MobileApps = () => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
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
    { number: '50+', label: 'Мобильных приложений', icon: Smartphone },
    { number: '1M+', label: 'Скачиваний', icon: Download },
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
      <Helmet>
        <title>Мобильные приложения | KolTech</title>
        <meta name="description" content="Разрабатываем мобильные приложения, которые пользователи любят использовать. От стартапов до крупных корпораций - создаем решения любой сложности." />
        <meta name="keywords" content="Нативные приложения, Кроссплатформенные, PWA приложения, Enterprise решения" />
        <meta property="og:title" content="Мобильные приложения | KolTech" />
        <meta property="og:description" content="Разрабатываем мобильные приложения, которые пользователи любят использовать. От стартапов до крупных корпораций - создаем решения любой сложности." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://koltech.dev/mobile-development" />
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
              className="absolute w-1 h-1 bg-purple-400 rounded-full"
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
                M
              </motion.span>
              Мобильные
              <span className="block text-purple-500 relative">
                приложения
                <motion.div
                  className="absolute -bottom-2 left-0 h-1 bg-purple-500/50 rounded-full"
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
              Разрабатываем мобильные приложения, которые пользователи любят использовать. 
              От стартапов до крупных корпораций - создаем решения любой сложности.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-5 justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link
                to="/contacts"
                className="modern-button button-purple inline-flex items-center justify-center"
              >
                <span>Обсудить проект</span>
                <ChevronRight className="ml-2 w-4 h-4" />
              </Link>
              
              <Link
                to="/portfolio"
                className="modern-ghost-button inline-flex items-center justify-center"
              >
                <span>Наши приложения</span>
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
            <h2 className="heading-lg text-white mb-4">Типы приложений</h2>
            <p className="subheading max-w-2xl mx-auto">
              Выбираем оптимальный подход для каждого проекта
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const colors = ['purple', 'blue', 'teal', 'orange'];
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
            <h2 className="heading-lg text-white mb-4">Технологии и возможности</h2>
            <p className="subheading max-w-2xl mx-auto">
              Современный стек технологий для мобильной разработки
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto mb-16">
            {[
              { name: 'React Native', color: 'from-blue-500 to-cyan-500' },
              { name: 'Flutter', color: 'from-blue-600 to-indigo-500' },
              { name: 'Swift', color: 'from-orange-500 to-red-500' },
              { name: 'Kotlin', color: 'from-green-500 to-emerald-500' },
              { name: 'Dart', color: 'from-blue-400 to-teal-500' },
              { name: 'Objective-C', color: 'from-gray-600 to-blue-600' },
              { name: 'Java', color: 'from-red-600 to-orange-600' },
              { name: 'Xamarin', color: 'from-purple-600 to-blue-600' },
              { name: 'Ionic', color: 'from-blue-500 to-indigo-600' },
              { name: 'Cordova', color: 'from-gray-700 to-gray-900' },
              { name: 'Firebase', color: 'from-yellow-500 to-orange-600' },
              { name: 'SQLite', color: 'from-blue-700 to-indigo-700' },
              { name: 'Realm', color: 'from-purple-500 to-pink-500' },
              { name: 'Core Data', color: 'from-gray-600 to-blue-500' },
              { name: 'Room', color: 'from-green-600 to-teal-600' }
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
          
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold text-white mb-6">Возможности приложений</h3>
            <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
              {[
                { name: 'Push-уведомления', color: 'from-yellow-500 to-orange-500' },
                { name: 'Геолокация', color: 'from-green-500 to-teal-500' },
                { name: 'Камера', color: 'from-purple-500 to-pink-500' },
                { name: 'Платежи', color: 'from-blue-500 to-indigo-500' },
                { name: 'Социальные сети', color: 'from-pink-500 to-red-500' },
                { name: 'Аналитика', color: 'from-indigo-500 to-purple-500' },
                { name: 'Биометрия', color: 'from-red-500 to-pink-500' },
                { name: 'Офлайн режим', color: 'from-gray-600 to-gray-800' },
                { name: 'Синхронизация', color: 'from-cyan-500 to-blue-500' },
                { name: 'AR/VR', color: 'from-purple-600 to-indigo-600' }
              ].map((feature, index) => (
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
                    px-3 py-2 rounded-lg font-medium text-white text-sm
                    bg-gradient-to-r ${feature.color}
                    transition-all duration-300
                    relative overflow-hidden
                  `}>
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                    <span className="relative z-10">{feature.name}</span>
                  </div>
                </motion.div>
              ))}
            </div>
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
            <h2 className="heading-lg text-white mb-4">Этапы разработки</h2>
            <p className="subheading max-w-2xl mx-auto">
              Структурированный подход к созданию мобильных приложений
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
            {[
              { step: '01', title: 'Исследование', description: 'Анализ рынка и пользователей', icon: Users, color: 'purple' },
              { step: '02', title: 'Прототип', description: 'UX/UI дизайн и wireframes', icon: Tablet, color: 'blue' },
              { step: '03', title: 'Разработка', description: 'Программирование функционала', icon: Code, color: 'teal' },
              { step: '04', title: 'Тестирование', description: 'QA и оптимизация', icon: Shield, color: 'orange' },
              { step: '05', title: 'Публикация', description: 'Релиз в App Store/Google Play', icon: Download, color: 'purple' }
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
                <div className="text-purple-500 font-bold text-lg mb-2">{process.step}</div>
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
            className="dimensional-card card-purple p-8 sm:p-12 text-center sm:text-left relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="sm:flex items-center justify-between">
              <div className="mb-8 sm:mb-0 sm:mr-8">
                <h2 className="heading-lg text-white mb-4">Создадим ваше мобильное приложение?</h2>
                <p className="subheading max-w-xl mb-0">
                  Превратим вашу идею в успешное мобильное приложение,
                  которое пользователи будут любить и рекомендовать друзьям
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/contacts"
                  className="modern-button button-purple inline-flex items-center justify-center text-base px-6 py-3"
                >
                  <span>Обсудить проект</span>
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Link>
                
                <Link
                  to="/portfolio"
                  className="modern-ghost-button inline-flex items-center justify-center text-base px-6 py-3"
                >
                  <span>Наши приложения</span>
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

export default MobileApps;
