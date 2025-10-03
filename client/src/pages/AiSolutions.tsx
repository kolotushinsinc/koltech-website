import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Brain, Cpu, Database, BarChart3, CheckCircle, Star, Users, Clock, Award, Zap, Target, Lightbulb } from 'lucide-react';

const AiSolutions = () => {
  const technologies = [
    'TensorFlow', 'PyTorch', 'Scikit-learn', 'Keras', 'OpenAI',
    'Natural Language Processing', 'Computer Vision', 'Deep Learning',
    'Neural Networks', 'Machine Learning', 'Data Science', 'Predictive Analytics',
    'Chatbots', 'Recommendation Systems', 'Image Recognition'
  ];

  const services = [
    {
      title: 'Машинное обучение',
      description: 'Разработка моделей машинного обучения для анализа данных и прогнозирования',
      features: ['Предиктивная аналитика', 'Классификация данных', 'Регрессионный анализ', 'Обучение с учителем и без']
    },
    {
      title: 'Нейронные сети и глубокое обучение',
      description: 'Создание сложных нейронных сетей для решения нестандартных задач',
      features: ['Сверточные сети', 'Рекуррентные сети', 'Трансформеры', 'Генеративные модели']
    },
    {
      title: 'Компьютерное зрение',
      description: 'Распознавание и анализ изображений и видео с помощью ИИ',
      features: ['Распознавание объектов', 'Обработка видео', 'Аугментация реальности', 'Анализ медицинских изображений']
    },
    {
      title: 'Обработка естественного языка',
      description: 'Анализ и генерация текста на естественных языках',
      features: ['Чат-боты', 'Анализ тональности', 'Перевод текста', 'Извлечение информации']
    }
  ];

  const benefits = [
    {
      icon: Zap,
      title: 'Автоматизация процессов',
      description: 'ИИ решения оптимизируют бизнес-процессы и сокращают ручной труд'
    },
    {
      icon: Brain,
      title: 'Интеллектуальный анализ',
      description: 'Получение глубоких инсайтов из больших объемов данных'
    },
    {
      icon: Target,
      title: 'Повышение точности',
      description: 'Минимизация ошибок и повышение качества принятия решений'
    },
    {
      icon: Users,
      title: 'Персонализация',
      description: 'Создание персонализированного опыта для клиентов и пользователей'
    }
  ];

  const industries = [
    {
      title: 'Финансы',
      description: 'Оценка кредитных рисков, выявление мошенничества, алгоритмическая торговля',
      icon: BarChart3
    },
    {
      title: 'Здравоохранение',
      description: 'Диагностика заболеваний, анализ медицинских изображений, прогнозирование эпидемий',
      icon: Heart
    },
    {
      title: 'Ритейл',
      description: 'Прогнозирование спроса, управление запасами, персонализированные рекомендации',
      icon: ShoppingBag
    },
    {
      title: 'Производство',
      description: 'Предиктивное обслуживание, контроль качества, оптимизация цепочек поставок',
      icon: Cpu
    }
  ];

  return (
    <div className="bg-dark-900">
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-6">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Инновационные
              <span className="gradient-text block mt-2">AI-решения</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Разрабатываем интеллектуальные системы на базе искусственного интеллекта и машинного обучения. 
              От анализа данных до автоматизации бизнес-процессов - создаем решения, которые меняют правила игры.
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
                Посмотреть работы
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="py-16 px-6 bg-dark-800/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Технологии ИИ</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Используем передовые технологии искусственного интеллекта и машинного обучения
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {technologies.map((tech, index) => (
              <span 
                key={index}
                className="px-4 py-2 bg-dark-700 border border-dark-600 rounded-full text-primary-400 text-sm font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Наши услуги</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Комплексные AI-решения для вашего бизнеса
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
            <h2 className="text-4xl font-bold text-white mb-4">Преимущества AI-решений</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Как искусственный интеллект может трансформировать ваш бизнес
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

      {/* Industries */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Индустрии применения</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              ИИ-решения для различных отраслей бизнеса
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {industries.map((industry, index) => (
              <div
                key={index}
                className="bg-dark-800 border border-dark-700 rounded-2xl p-6 text-center"
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

      {/* Process */}
      <section className="py-20 px-6 bg-gradient-to-br from-dark-800 to-dark-900">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Процесс разработки</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Как мы создаем AI-решения от идеи до внедрения
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { step: '01', title: 'Анализ данных', description: 'Сбор и подготовка данных для обучения моделей' },
              { step: '02', title: 'Разработка модели', description: 'Создание и обучение алгоритмов машинного обучения' },
              { step: '03', title: 'Тестирование', description: 'Валидация и оптимизация моделей' },
              { step: '04', title: 'Внедрение', description: 'Интеграция в бизнес-процессы и поддержка' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-purple rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold text-white">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
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
              Готовы внедрить AI в ваш бизнес?
            </h2>
            <p className="text-gray-300 mb-8">
              Свяжитесь с нами для бесплатной консультации и разработки стратегии внедрения ИИ
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

// Дополнительные иконки для индустрий
const Heart = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5Z"/>
    <path d="M12 5L8.21 1.75a1 1 0 0 0-1.41.25l-1 1.36a1 1 0 0 0 .25 1.41L10 8"/>
  </svg>
);

const ShoppingBag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
    <path d="M3 6h18"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);

export default AiSolutions;