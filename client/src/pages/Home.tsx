import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Code, Smartphone, Brain, Rocket, 
  Users, Star, ChevronRight, Zap, Shield, Globe 
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="min-h-screen bg-dark-900">
      <Helmet>
        <title>KolTech | От мысли к действию</title>
        <meta name="description" content="KolTech - инновационная платформа для разработки веб-сайтов, мобильных приложений и AI-решений. Мы превращаем ваши идеи в революционные цифровые продукты." />
        <meta name="keywords" content="Корпоративные сайты, E-commerce решения, Веб-приложения, Backend системы, Нативные приложения, Кроссплатформенные, PWA приложения, Enterprise решения, React Native, Flutter, Swift, Kotlin, Dart, Objective-C, Java, Xamarin, Ionic, Cordova, Firebase, SQLite, Realm, Core Data, Room, React, Vue.js, Angular, Node.js, TypeScript, JavaScript, Python, PHP, Next.js, Nuxt.js, Express.js, Django, Laravel, MySQL, Docker, AWS, GraphQL, Чат-боты, CV, Компьютерное зрение, Аналитика, Обработка текста, TensorFlow, PyTorch, OpenAI GPT, Hugging Face, Scikit-learn, Keras, OpenCV, NLTK, spaCy, Pandas, NumPy, Matplotlib, Jupyter, MLflow, Docker, Kubernetes, AWS SageMaker, Google AI, Azure ML, Apache Spark, Elasticsearch, MongoDB, PostgreSQL, Redis, Стратегическое планирование, Техническое консультирование, Безопасность и соответствие, Цифровая трансформация, Бизнес-Акселератор, Быстрый старт, AI-powered решения, Экспертная команда, Глобальный охват, Точное попадание, Надежность, Стратегическое планирование, Техническая реализация, Масштабирование, KolTechLine, FLineHub, KolTechValley, KolTechBusiness, Будущее Цифрового Сотрудничества, " />
        <meta property="og:title" content="KolTech | От мысли к действию" />
        <meta property="og:description" content="KolTech - инновационная платформа для разработки веб-сайтов, мобильных приложений и AI-решений. Мы превращаем ваши идеи в революционные цифровые продукты." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://koltech.dev" />
      </Helmet>
      {/* Hero Section */}
      <section className="hero-with-video relative h-screen">
        <motion.video
          className="video-background object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <source src="/video1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </motion.video>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60 z-0"></div>
        
        <div className="container mx-auto px-4 sm:px-8 z-10 h-full flex flex-col justify-center relative">
          <motion.div 
            className="mx-auto text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <motion.h1 
              className="heading-xl text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Создаем
              <span className="block text-blue-500">
                Будущее Технологий
              </span>
            </motion.h1>
        
            <motion.p 
              className="subheading text-gray-300 mb-10 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              KolTech — инновационная платформа для разработки веб-сайтов, мобильных приложений
              и AI-решений. Мы превращаем ваши идеи в революционные цифровые продукты.
            </motion.p>
        
            <motion.div 
              className="flex flex-col sm:flex-row gap-5 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link
                to="/contacts"
                className="modern-button inline-flex items-center justify-center"
              >
                <span>Связаться с нами</span>
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
          </motion.div>
        </div>
      </section>

      {/* Services Section - Dark Theme Apple Style */}
      <section className="py-20 sm:py-28 bg-[#0c1222]">
        <div className="container mx-auto px-4 sm:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Наши Услуги</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-base sm:text-lg">
              Полный спектр IT-услуг для реализации ваших амбициозных проектов
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {/* Web Development */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-[#0f1e3c] to-[#162a54] rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              style={{
                boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <Link to="/web-development" className="block p-8 sm:p-10 text-center h-full relative">
                {/* Large background icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                  <Code className="w-64 h-64 text-[#3b82f6]" />
                </div>
                
                {/* Icon in circle */}
                <div className="relative z-10 mb-6">
                  <div className="w-16 h-16 rounded-full bg-[#3b82f6]/20 flex items-center justify-center mx-auto">
                    <Code className="w-8 h-8 text-[#3b82f6]" />
                  </div>
                </div>
                
                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-3xl font-semibold text-white mb-2">Веб-разработка</h3>
                  <p className="text-gray-400 mb-6 max-w-md mx-auto">
                    Современные веб-сайты и веб-приложения с использованием передовых технологий
                  </p>
                  
                  <div className="flex justify-center space-x-4 mt-auto">
                    <span className="text-[#3b82f6] font-medium flex items-center">
                      Подробнее
                      <ArrowRight className="ml-1 w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
            
            {/* Mobile Apps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-gradient-to-br from-[#1e1a3a] to-[#2a2550] rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              style={{
                boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <Link to="/mobile-development" className="block p-8 sm:p-10 text-center h-full relative">
                {/* Large background icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                  <Smartphone className="w-64 h-64 text-[#a855f7]" />
                </div>
                
                {/* Icon in circle */}
                <div className="relative z-10 mb-6">
                  <div className="w-16 h-16 rounded-full bg-[#a855f7]/20 flex items-center justify-center mx-auto">
                    <Smartphone className="w-8 h-8 text-[#a855f7]" />
                  </div>
                </div>
                
                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-3xl font-semibold text-white mb-2">Мобильные приложения</h3>
                  <p className="text-gray-400 mb-6 max-w-md mx-auto">
                    Нативные и кроссплатформенные мобильные приложения для iOS и Android
                  </p>
                  
                  <div className="flex justify-center space-x-4 mt-auto">
                    <span className="text-[#a855f7] font-medium flex items-center">
                      Подробнее
                      <ArrowRight className="ml-1 w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
            
            {/* AI Solutions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gradient-to-br from-[#0f2a2f] to-[#164954] rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              style={{
                boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <Link to="/ai-solutions" className="block p-8 sm:p-10 text-center h-full relative">
                {/* Large background icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                  <Brain className="w-64 h-64 text-[#14b8a6]" />
                </div>
                
                {/* Icon in circle */}
                <div className="relative z-10 mb-6">
                  <div className="w-16 h-16 rounded-full bg-[#14b8a6]/20 flex items-center justify-center mx-auto">
                    <Brain className="w-8 h-8 text-[#14b8a6]" />
                  </div>
                </div>
                
                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-3xl font-semibold text-white mb-2">AI-решения</h3>
                  <p className="text-gray-400 mb-6 max-w-md mx-auto">
                    Интеллектуальные системы и машинное обучение для автоматизации бизнеса
                  </p>
                  
                  <div className="flex justify-center space-x-4 mt-auto">
                    <span className="text-[#14b8a6] font-medium flex items-center">
                      Подробнее
                      <ArrowRight className="ml-1 w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
            
            {/* IT Consulting */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-gradient-to-br from-[#2c1a12] to-[#3d2a1d] rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              style={{
                boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <Link to="/consulting" className="block p-8 sm:p-10 text-center h-full relative">
                {/* Large background icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                  <Users className="w-64 h-64 text-[#f97316]" />
                </div>
                
                {/* Icon in circle */}
                <div className="relative z-10 mb-6">
                  <div className="w-16 h-16 rounded-full bg-[#f97316]/20 flex items-center justify-center mx-auto">
                    <Users className="w-8 h-8 text-[#f97316]" />
                  </div>
                </div>
                
                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-3xl font-semibold text-white mb-2">IT-консалтинг</h3>
                  <p className="text-gray-400 mb-6 max-w-md mx-auto">
                    Экспертные консультации по цифровой трансформации бизнеса
                  </p>
                  
                  <div className="flex justify-center space-x-4 mt-auto">
                    <span className="text-[#f97316] font-medium flex items-center">
                      Подробнее
                      <ArrowRight className="ml-1 w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="content-section section-gradient">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="heading-lg text-white mb-6">О KolTech</h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                KolTech — это не веб-студия, а инициатива независимых экспертов, выбирающих проекты по смыслу, а не по прибыли.
              </p>
              <p className="text-gray-300 mb-8 leading-relaxed">
                Мы объединяем тех, кто верит: технологии должны вдохновлять — а не просто работать.
              </p>
              
              <div className="grid grid-cols-3 gap-6 mb-8">
                {[
                  { number: '500+', label: 'Проектов' },
                  { number: '100+', label: 'Клиентов' },
                  { number: '50+', label: 'Экспертов' }
                ].map((stat, index) => (
                  <motion.div 
                    key={index} 
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  >
                    <div className="text-3xl font-bold text-blue-500 mb-1">{stat.number}</div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Link to="/contacts" className="modern-button button-blue inline-flex items-center">
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
              <div className="dimensional-card card-blue p-8 sm:p-12 flex items-center justify-center">
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
                    <Rocket className="w-20 h-20 sm:w-24 sm:h-24 text-blue-500 mx-auto" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-white mb-2">Инновации в действии</h3>
                  <p className="text-gray-400 text-sm">Создаем технологии будущего уже сегодня</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="content-section section-dark">
        <div className="container mx-auto px-4 sm:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="heading-lg text-white mb-4">Наши Преимущества</h2>
            <p className="subheading max-w-2xl mx-auto">
              Мы объединяем технологии, опыт и креативность для создания продуктов, которые превосходят ожидания
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {[
              {
                icon: Rocket,
                title: "Быстрый старт",
                description: "От идеи до запуска в кратчайшие сроки с сохранением высокого качества",
                color: "blue"
              },
              {
                icon: Shield,
                title: "Надежность",
                description: "Гарантируем безопасность, стабильность и долгосрочную поддержку решений",
                color: "purple"
              },
              {
                icon: Zap,
                title: "Высокая производительность",
                description: "Оптимизированные системы, обеспечивающие максимальную скорость и эффективность",
                color: "teal"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`dimensional-card card-${feature.color} p-6 sm:p-8 relative overflow-hidden`}
              >
                <div className={`icon-container icon-${feature.color} mb-6`}>
                  <feature.icon className="w-6 h-6 text-white relative z-10" />
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="content-section">
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
                <h2 className="heading-lg text-white mb-4">Готовы Начать?</h2>
                <p className="subheading max-w-xl mb-0">
                  Свяжитесь с нами сегодня, чтобы обсудить ваш проект и получить бесплатную консультацию
                </p>
              </div>
              
              <Link
                to="/contacts"
                className="modern-button inline-flex items-center justify-center text-base px-6 py-3"
              >
                <span>Связаться с нами</span>
                <ChevronRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
