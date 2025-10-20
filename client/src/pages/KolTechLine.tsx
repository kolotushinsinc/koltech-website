import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight, Clock, Star, Users, ChevronRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const KolTechLine = () => {
  return (
    <div className="bg-dark-900 flex flex-col">
      <Helmet>
        <title>KolTechLine | KolTech</title>
        <meta name="description" content="Мы создаем революционную платформу, которая объединит фрилансеров, заказчиков, стартаперов и инвесторов в единой экосистеме." />
        <meta name="keywords" content="Корпоративные сайты, E-commerce решения, Веб-приложения, Backend системы, Нативные приложения, Кроссплатформенные, PWA приложения, Enterprise решения, React Native, Flutter, Swift, Kotlin, Dart, Objective-C, Java, Xamarin, Ionic, Cordova, Firebase, SQLite, Realm, Core Data, Room, React, Vue.js, Angular, Node.js, TypeScript, JavaScript, Python, PHP, Next.js, Nuxt.js, Express.js, Django, Laravel, MySQL, Docker, AWS, GraphQL, Чат-боты, CV, Компьютерное зрение, Аналитика, Обработка текста, TensorFlow, PyTorch, OpenAI GPT, Hugging Face, Scikit-learn, Keras, OpenCV, NLTK, spaCy, Pandas, NumPy, Matplotlib, Jupyter, MLflow, Docker, Kubernetes, AWS SageMaker, Google AI, Azure ML, Apache Spark, Elasticsearch, MongoDB, PostgreSQL, Redis, Стратегическое планирование, Техническое консультирование, Безопасность и соответствие, Цифровая трансформация, Бизнес-Акселератор, Быстрый старт, AI-powered решения, Экспертная команда, Глобальный охват, Точное попадание, Надежность, Стратегическое планирование, Техническая реализация, Масштабирование, KolTechLine, FLineHub, KolTechValley, KolTechBusiness, Будущее Цифрового Сотрудничества, " />
        <meta property="og:title" content="KolTechLine | KolTech" />
        <meta property="og:description" content="Мы создаем революционную платформу, которая объединит фрилансеров, заказчиков, стартаперов и инвесторов в единой экосистеме." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://koltech.dev/koltechline" />
      </Helmet>
      {/* Hero Section */}
      <section className="hero-with-video relative flex items-center overflow-hidden pt-16 pb-16">
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
            className="absolute w-[400px] h-[400px] rounded-full bg-purple-500/5 blur-3xl"
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
        
        <div className="container mx-auto px-4 sm:px-8 z-10 py-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Logo/Icon */}
            <motion.div 
              className="flex justify-center mb-4 mt-4"
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
                  <Zap className="w-16 h-16 text-purple-500" />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Main heading */}
            <motion.h1 
              className="heading-xl text-white mb-4 relative"
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
              KolTech
              <span className="block text-purple-500 relative">
                Line
                <motion.div
                  className="absolute -bottom-2 left-0 h-1 bg-purple-500/50 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.5, delay: 1 }}
                />
              </span>
            </motion.h1>

            {/* Status message */}
            <motion.div 
              className="dimensional-card card-purple p-6 sm:p-8 mb-6 relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="flex items-center justify-center space-x-3 mb-4">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Clock className="w-5 h-5 text-purple-500" />
                </motion.div>
                <h2 className="text-xl font-bold text-white">В разработке</h2>
              </div>
              
              <p className="text-base text-gray-300 mb-4 max-w-2xl mx-auto">
                Мы создаем революционную платформу, которая объединит фрилансеров,
                заказчиков, стартаперов и инвесторов в единой экосистеме.
              </p>
              
              {/* Features preview */}
              <div className="grid md:grid-cols-3 gap-3 mb-4">
                {[
                  { icon: Users, title: 'FLineHub', description: 'Найдите лучших специалистов', color: 'blue' },
                  { icon: Star, title: 'KolTechValley', description: 'Краудфандинг для стартапов', color: 'purple' },
                  { icon: Zap, title: 'KolTechBusiness', description: 'Связь с инвесторами', color: 'teal' }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className={`dimensional-card card-${feature.color} p-6 relative overflow-hidden`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  >
                    {/* Background icon */}
                    <div className="absolute right-4 bottom-4 opacity-5 pointer-events-none">
                      <feature.icon className="w-32 h-32" />
                    </div>
                    
                    <div className={`icon-container icon-${feature.color} mb-4`}>
                      <feature.icon className="w-5 h-5 text-white relative z-10" />
                    </div>
                    
                    <h3 className="text-base font-semibold text-white mb-1">{feature.title}</h3>
                    <p className="text-gray-400 text-xs">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
              
              {/* CTA Buttons */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-3 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
              >
                <Link
                  to="/koltechline-article"
                  className="modern-button inline-flex items-center justify-center text-sm py-2 px-4"
                >
                  <span>Подробнее о KolTechLine</span>
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
                
                <Link
                  to="/contacts"
                  className="modern-ghost-button inline-flex items-center justify-center text-sm py-2 px-4"
                >
                  <span>Связаться с нами</span>
                  <ChevronRight className="ml-2 w-4 h-4" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default KolTechLine;
