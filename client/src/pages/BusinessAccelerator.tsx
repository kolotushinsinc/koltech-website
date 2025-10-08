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
  Lightbulb
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

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
      <section className="pt-20 sm:pt-24 pb-8 sm:pb-12 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight bounce-in">
                Бизнес-
                <span className="gradient-text block mt-1 sm:mt-2">Акселератор</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 leading-relaxed fade-in-delay">
                Превращаем революционные идеи в технологические прорывы. KolTech Business Accelerator -
                это не просто акселератор, это экосистема для создания будущего.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 slide-up">
                <Link
                  to="/contacts"
                  className="bg-gradient-to-r from-primary-500 to-accent-purple text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center pulse-glow text-sm sm:text-base"
                >
                  Начать проект
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
                <Link
                  to="/portfolio"
                  className="border-2 border-primary-500 text-primary-400 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:bg-primary-500 hover:text-white hover:scale-105 transition-all duration-300 text-sm sm:text-base"
                >
                  Наши проекты
                </Link>
              </div>
            </div>
            <div className="relative slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="w-full h-64 sm:h-80 md:h-96 bg-gradient-to-br from-primary-500/20 to-accent-purple/20 rounded-3xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 tech-pattern opacity-30" />
                <div className="text-center px-4">
                  <div className="relative">
                    <Lightbulb className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 text-primary-400 mx-auto mb-4 sm:mb-6" />
                  </div>
                  <p className="text-white font-semibold text-sm sm:text-base md:text-lg">Инновации без границ</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-dark-800/50">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="text-center slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-center mb-3 sm:mb-4 group">
                  <div className="p-3 sm:p-4 bg-gradient-to-br from-primary-500 to-accent-purple rounded-2xl group-hover:animate-pulse">
                    <achievement.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">{achievement.number}</div>
                <div className="text-gray-400 text-sm sm:text-base">{achievement.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4 bounce-in">Наши преимущества</h2>
            <p className="text-gray-400 max-w-2xl mx-auto fade-in-delay text-sm sm:text-base">
              Уникальный подход к развитию технологических проектов
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-dark-800 p-6 sm:p-8 rounded-2xl border border-dark-700 card-hover group slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-500 to-accent-purple rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm sm:text-base">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-gradient-to-br from-dark-800 to-dark-900">
        <div className="container mx-auto">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4 bounce-in">Наши услуги</h2>
            <p className="text-gray-400 max-w-3xl mx-auto fade-in-delay text-sm sm:text-base">
              Комплексный подход к развитию вашего бизнеса
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-dark-800 border border-dark-700 rounded-2xl p-6 sm:p-8 card-hover relative overflow-hidden slide-up flex flex-col"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className={`absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br ${service.color} rounded-full -translate-y-12 sm:-translate-y-16 translate-x-12 sm:translate-x-16 opacity-20`} />
                
                <div className="relative flex-grow">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">{service.title}</h3>
                  
                  <p className="text-gray-400 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
                    {service.description}
                  </p>
                </div>

                <Link
                  to="/contacts"
                  className={`w-full mt-auto bg-gradient-to-r ${service.color} text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 block text-center text-sm sm:text-base`}
                >
                  Узнать больше
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4 bounce-in">Процесс работы</h2>
            <p className="text-gray-400 max-w-2xl mx-auto fade-in-delay text-sm sm:text-base">
              От идеи до реализации за четыре простых шага
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { step: '01', title: 'Консультация', description: 'Анализ вашей идеи и определение стратегии' },
              { step: '02', title: 'Планирование', description: 'Создание детального плана реализации' },
              { step: '03', title: 'Разработка', description: 'Техническая реализация с постоянной обратной связью' },
              { step: '04', title: 'Запуск', description: 'Вывод продукта на рынок и дальнейшая поддержка' }
            ].map((process, index) => (
              <div
                key={index}
                className="text-center slide-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-500 to-accent-purple rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 hover:scale-110 transition-transform duration-300 cursor-pointer">
                  <span className="text-white font-bold text-sm sm:text-lg">{process.step}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">{process.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm sm:text-base">{process.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="bg-gradient-to-br from-dark-800 to-dark-700 p-6 sm:p-8 md:p-12 rounded-3xl border border-dark-600 text-center slide-up relative overflow-hidden">
            <div className="absolute inset-0 tech-pattern opacity-10" />
            <div className="relative">
              <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">
                Готовы создать будущее?
              </h2>
              <p className="text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base md:text-lg">
                Присоединяйтесь к KolTech Business Accelerator и превратите вашу идею
                в технологический прорыв нового поколения
              </p>
              <Link
                to="/contacts"
                className="bg-gradient-to-r from-primary-500 to-accent-purple text-white px-6 sm:px-8 md:px-12 py-3 sm:py-4 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 inline-flex items-center pulse-glow text-sm sm:text-base"
              >
                Начать сейчас
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BusinessAccelerator;