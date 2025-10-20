import React from 'react';
import { Link } from 'react-router-dom';
import {
  Rocket,
  Users,
  TrendingUp,
  Target,
  Brain,
  Zap,
  ArrowRight,
  Star,
  Globe,
  Shield,
  Lightbulb,
  ChevronRight
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const BusinessAccelerator = () => {
  const features = [
    {
      icon: Rocket,
      title: 'Быстрый старт',
      description: 'От идеи до MVP за 30 дней с полной технической поддержкой'
    },
    {
      icon: Brain,
      title: 'AI-powered решения',
      description: 'Интеграция искусственного интеллекта в каждый проект'
    },
    {
      icon: Users,
      title: 'Экспертная команда',
      description: 'Более 50 специалистов в области высоких технологий'
    },
    {
      icon: Globe,
      title: 'Глобальный охват',
      description: 'Выход на международные рынки с первого дня'
    },
    {
      icon: Target,
      title: 'Точное попадание',
      description: 'Фокус на решениях, которые действительно нужны рынку'
    },
    {
      icon: Shield,
      title: 'Надежность',
      description: 'Гарантированная поддержка на всех этапах развития'
    }
  ];

  const achievements = [
    {
      number: '50+',
      label: 'Успешных проектов',
      icon: Star
    },
    {
      number: '100%',
      label: 'Довольных клиентов',
      icon: Users
    },
    {
      number: '24/7',
      label: 'Техническая поддержка',
      icon: Shield
    },
    {
      number: '3+',
      label: 'Стран присутствия',
      icon: Globe
    }
  ];

  const services = [
    {
      title: 'Стратегическое планирование',
      description: 'Разработка долгосрочной стратегии развития бизнеса с учетом современных технологических трендов',
      color: 'from-primary-500 to-accent-purple'
    },
    {
      title: 'Техническая реализация',
      description: 'Полный цикл разработки от концепции до запуска с использованием передовых технологий',
      color: 'from-accent-purple to-accent-pink'
    },
    {
      title: 'Масштабирование',
      description: 'Помощь в росте и расширении бизнеса на новые рынки и сегменты',
      color: 'from-accent-green to-primary-500'
    }
  ];

  return (
    <div className="bg-dark-900">
      <Helmet>
        <title>Бизнес-Акселератор | KolTech</title>
        <meta name="description" content="Превращаем революционные идеи в технологические прорывы. KolTech Business Accelerator - это не просто акселератор, это экосистема для создания будущего." />
        <meta name="keywords" content="Бизнес-Акселератор, Быстрый старт, AI-powered решения, Экспертная команда, Глобальный охват, Точное попадание, Надежность" />
        <meta property="og:title" content="Бизнес-Акселератор | KolTech" />
        <meta property="og:description" content="Превращаем революционные идеи в технологические прорывы. KolTech Business Accelerator - это не просто акселератор, это экосистема для создания будущего." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://koltech.dev/business-accelerator" />
      </Helmet>
      {/* Hero Section */}
      <section className="hero-with-video relative min-h-[70vh] flex items-center overflow-hidden">
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
        </div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-dark-900/80 tech-pattern z-0"></div>
        
        <div className="container mx-auto px-4 sm:px-8 z-10 py-20 sm:py-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
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
                  B
                </motion.span>
                Бизнес-
                <span className="block text-blue-500 relative">
                  Акселератор
                  <motion.div
                    className="absolute -bottom-2 left-0 h-1 bg-blue-500/50 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1.5, delay: 1 }}
                  />
                </span>
              </motion.h1>
              
              <motion.p 
                className="subheading text-gray-300 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Превращаем революционные идеи в технологические прорывы. KolTech Business Accelerator -
                это не просто акселератор, это экосистема для создания будущего.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-5"
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
                  <span>Наши проекты</span>
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </motion.div>
            </motion.div>
            
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
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
                    <Lightbulb className="w-20 h-20 sm:w-24 sm:h-24 text-blue-500 mx-auto" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-white mb-2">Инновации без границ</h3>
                  <p className="text-gray-400 text-sm">Создаем технологии будущего уже сегодня</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 bg-[#0c1222]">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex justify-center mb-4">
                  <div className={`icon-container icon-${index === 0 ? 'blue' : index === 1 ? 'purple' : index === 2 ? 'teal' : 'orange'}`}>
                    <achievement.icon className="w-6 h-6 text-white relative z-10" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{achievement.number}</div>
                <div className="text-gray-400 text-sm">{achievement.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="content-section section-gradient">
        <div className="container mx-auto px-4 sm:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="heading-lg text-white mb-4">Наши преимущества</h2>
            <p className="subheading max-w-2xl mx-auto">
              Уникальный подход к развитию технологических проектов
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`dimensional-card card-${index % 3 === 0 ? 'blue' : index % 3 === 1 ? 'purple' : 'teal'} p-6 sm:p-8 relative overflow-hidden`}
              >
                {/* Background icon */}
                <div className="absolute right-4 bottom-4 opacity-5 pointer-events-none">
                  <feature.icon className="w-32 h-32" />
                </div>
                
                <div className={`icon-container icon-${index % 3 === 0 ? 'blue' : index % 3 === 1 ? 'purple' : 'teal'} mb-6`}>
                  <feature.icon className="w-6 h-6 text-white relative z-10" />
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="content-section section-dark">
        <div className="container mx-auto px-4 sm:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="heading-lg text-white mb-4">Наши услуги</h2>
            <p className="subheading max-w-3xl mx-auto">
              Комплексный подход к развитию вашего бизнеса
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const colors = ['blue', 'purple', 'teal'];
              const color = colors[index % colors.length];
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className={`dimensional-card card-${color} p-8 relative overflow-hidden flex flex-col h-full`}
                >
                  {/* Background icon */}
                  <div className="absolute right-4 bottom-4 opacity-5 pointer-events-none">
                    {index === 0 ? <Target className="w-32 h-32" /> : 
                     index === 1 ? <Zap className="w-32 h-32" /> : 
                     <TrendingUp className="w-32 h-32" />}
                  </div>
                  
                  <div className="relative flex-grow">
                    <h3 className="text-2xl font-semibold text-white mb-4">{service.title}</h3>
                    <p className="text-gray-400 mb-8 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  <Link
                    to="/contacts"
                    className={`modern-button button-${color} inline-flex items-center justify-center mt-auto`}
                  >
                    <span>Узнать больше</span>
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="content-section section-gradient">
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
              От идеи до реализации за четыре простых шага
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Консультация', description: 'Анализ вашей идеи и определение стратегии' },
              { step: '02', title: 'Планирование', description: 'Создание детального плана реализации' },
              { step: '03', title: 'Разработка', description: 'Техническая реализация с постоянной обратной связью' },
              { step: '04', title: 'Запуск', description: 'Вывод продукта на рынок и дальнейшая поддержка' }
            ].map((process, index) => {
              const colors = ['blue', 'purple', 'teal', 'orange'];
              const color = colors[index % colors.length];
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="text-center"
                >
                  <motion.div 
                    className={`w-16 h-16 bg-gradient-to-br from-[#0f1e3c] to-[#162a54] rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10`}
                    whileHover={{ scale: 1.05 }}
                    style={{
                      boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    <span className="text-white font-bold text-lg">{process.step}</span>
                  </motion.div>
                  <h3 className="text-xl font-semibold text-white mb-3">{process.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{process.description}</p>
                </motion.div>
              );
            })}
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
                <h2 className="heading-lg text-white mb-4">Готовы создать будущее?</h2>
                <p className="subheading max-w-xl mb-0">
                  Присоединяйтесь к KolTech Business Accelerator и превратите вашу идею
                  в технологический прорыв нового поколения
                </p>
              </div>
              
              <Link
                to="/contacts"
                className="modern-button inline-flex items-center justify-center text-base px-6 py-3"
              >
                <span>Начать сейчас</span>
                <ChevronRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default BusinessAccelerator;
