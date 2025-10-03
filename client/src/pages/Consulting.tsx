import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, Users, TrendingUp, CheckCircle, Star, Clock, Award, Zap, Target, Lightbulb, BarChart3, FileText } from 'lucide-react';

const Consulting = () => {
  const services = [
    {
      title: 'IT-стратегия',
      description: 'Разработка долгосрочной стратегии развития ИТ-инфраструктуры компании',
      features: ['Анализ текущего состояния', 'Определение целей', 'Планирование трансформации', 'Бюджетирование']
    },
    {
      title: 'Цифровая трансформация',
      description: 'Полное переосмысление бизнес-процессов с использованием цифровых технологий',
      features: ['Оптимизация процессов', 'Внедрение новых технологий', 'Обучение персонала', 'Измерение результатов']
    },
    {
      title: 'Управление проектами',
      description: 'Комплексное управление ИТ-проектами на всех этапах жизненного цикла',
      features: ['Планирование проектов', 'Управление рисками', 'Контроль сроков', 'Управление ресурсами']
    },
    {
      title: 'Технический консалтинг',
      description: 'Экспертная поддержка при выборе и внедрении технологических решений',
      features: ['Подбор технологий', 'Аудит инфраструктуры', 'Оптимизация систем', 'Техническая поддержка']
    }
  ];

  const benefits = [
    {
      icon: Target,
      title: 'Стратегическое видение',
      description: 'Помогаем определить долгосрочные цели и пути их достижения'
    },
    {
      icon: TrendingUp,
      title: 'Рост эффективности',
      description: 'Оптимизация процессов приводит к повышению производительности'
    },
    {
      icon: Zap,
      title: 'Инновации',
      description: 'Внедряем передовые технологии для конкурентного преимущества'
    },
    {
      icon: Users,
      title: 'Экспертиза',
      description: 'Работают опытные консультанты с глубокими знаниями в различных отраслях'
    }
  ];

  const process = [
    {
      step: '01',
      title: 'Анализ',
      description: 'Глубокое изучение бизнеса, процессов и технологий компании',
      icon: BarChart3
    },
    {
      step: '02',
      title: 'Диагностика',
      description: 'Выявление проблемных зон и возможностей для улучшений',
      icon: Search
    },
    {
      step: '03',
      title: 'Разработка решения',
      description: 'Создание индивидуальной стратегии и плана внедрения',
      icon: Lightbulb
    },
    {
      step: '04',
      title: 'Внедрение',
      description: 'Поддержка на всех этапах реализации изменений',
      icon: CheckCircle
    }
  ];

  const industries = [
    {
      title: 'Финансовый сектор',
      description: 'Цифровизация банковских услуг, оптимизация процессов, управление рисками',
      icon: Briefcase
    },
    {
      title: 'Ритейл и e-commerce',
      description: 'Оптимизация логистики, внедрение CRM, персонализация клиентского опыта',
      icon: ShoppingCart
    },
    {
      title: 'Производство',
      description: 'Автоматизация производства, внедрение ERP, управление цепочками поставок',
      icon: Settings
    },
    {
      title: 'Телекоммуникации',
      description: 'Оптимизация сетевой инфраструктуры, внедрение 5G, развитие цифровых сервисов',
      icon: Radio
    }
  ];

  return (
    <div className="bg-dark-900">
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-6">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Профессиональный
              <span className="gradient-text block mt-2">IT-консалтинг</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Предоставляем экспертную поддержку в области информационных технологий. 
              От разработки стратегии до внедрения решений - помогаем бизнесу эффективно использовать технологии для роста.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contacts"
                className="bg-gradient-to-r from-primary-500 to-accent-purple text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl transition-all duration-300 flex items-center justify-center"
              >
                Обсудить проект
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/portfolio"
                className="border-2 border-primary-500 text-primary-400 px-8 py-4 rounded-xl font-semibold hover:bg-primary-500 hover:text-white transition-all duration-300"
              >
                Посмотреть кейсы
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Наши услуги</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Комплексные консалтинговые решения для вашего бизнеса
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-dark-800 border border-dark-700 rounded-2xl p-8"
              >
                <h3 className="text-2xl font-bold text-white mb-4">{service.title}</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">{service.description}</p>
                <div className="space-y-3">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-primary-400" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-6 bg-gradient-to-br from-dark-800 to-dark-900">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Наши преимущества</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Почему выбирают нас для IT-консалтинга
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-dark-800/50 border border-dark-700 rounded-2xl p-6 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-purple rounded-xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                <p className="text-gray-400 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Процесс работы</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Как мы предоставляем консалтинговые услуги
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {process.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-purple rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold text-white">
                  {item.step}
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500/20 to-accent-purple/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-6 h-6 text-primary-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-20 px-6 bg-gradient-to-br from-dark-800 to-dark-900">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Отрасли экспертизы</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Опыт работы в различных отраслях экономики
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {industries.map((industry, index) => (
              <div
                key={index}
                className="bg-dark-800/50 border border-dark-700 rounded-2xl p-6 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-purple rounded-xl flex items-center justify-center mx-auto mb-4">
                  <industry.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{industry.title}</h3>
                <p className="text-gray-400 text-sm">{industry.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Наш подход</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Принципы, которыми мы руководствуемся в работе
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: 'Индивидуальный подход',
                description: 'Разрабатываем решения, учитывающие специфику вашего бизнеса и отраслевые особенности'
              },
              {
                title: 'Практическая направленность',
                description: 'Фокусируемся на решениях, которые приносят измеримую пользу и окупаемость инвестиций'
              },
              {
                title: 'Долгосрочное партнерство',
                description: 'Строим отношения с клиентами на основе доверия и взаимной выгоды'
              }
            ].map((item, index) => (
              <div
                key={index}
                className="bg-dark-800 border border-dark-700 rounded-2xl p-8 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-purple rounded-xl flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto bg-gradient-to-br from-dark-800 to-dark-700 p-12 rounded-3xl border border-dark-600">
            <h2 className="text-3xl font-bold text-white mb-4">
              Готовы оптимизировать ваш бизнес?
            </h2>
            <p className="text-gray-300 mb-8">
              Свяжитесь с нами для бесплатной консультации и разработки стратегии развития
            </p>
            <Link
              to="/contacts"
              className="bg-gradient-to-r from-primary-500 to-accent-purple text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl transition-all duration-300 inline-flex items-center"
            >
              Обсудить проект
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

// Дополнительные иконки
const Search = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
);

const ShoppingCart = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/>
    <circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);

const Settings = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const Radio = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 9a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2"/>
    <path d="M20 9a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2"/>
    <rect x="8" y="5" width="8" height="14" rx="1"/>
    <path d="M8 11h8"/>
  </svg>
);

export default Consulting;