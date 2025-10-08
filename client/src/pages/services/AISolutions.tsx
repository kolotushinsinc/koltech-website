import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  Bot, 
  Eye, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  MessageSquare,
  BarChart3,
  Image,
  FileText,
  Users,
  Star,
  Clock,
  Shield,
  Cpu,
  Database
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const AISolutions = () => {
  const [visibleElements, setVisibleElements] = useState<number[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      Array.from({ length: 100 }).forEach((_, index) => {
        setTimeout(() => {
          setVisibleElements(prev => [...prev, index]);
        }, index * 80);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const services = [
    {
      icon: MessageSquare,
      title: 'Чат-боты',
      description: 'Умные боты для автоматизации клиентского сервиса и поддержки',
      features: ['NLP обработка', 'Многоязычность', 'Интеграция с CRM', 'Обучение на данных']
    },
    {
      icon: Eye,
      title: 'CV',
      description: 'Компьютерное зрение. Анализ изображений и видео для автоматизации процессов',
      features: ['Распознавание объектов', 'Анализ лиц', 'OCR технологии', 'Видеоаналитика']
    },
    {
      icon: BarChart3,
      title: 'Аналитика',
      description: 'Прогнозирование трендов и поведения на основе данных',
      features: ['Машинное обучение', 'Анализ данных', 'Прогнозы', 'Визуализация']
    },
    {
      icon: FileText,
      title: 'Обработка текста',
      description: 'Автоматический анализ и обработка текстовых данных',
      features: ['Анализ тональности', 'Извлечение сущностей', 'Суммаризация', 'Классификация']
    }
  ];

  const technologies = [
    { name: 'TensorFlow', level: 95, color: 'from-orange-500 to-red-500' },
    { name: 'PyTorch', level: 90, color: 'from-red-500 to-pink-500' },
    { name: 'OpenAI GPT', level: 88, color: 'from-green-500 to-emerald-500' },
    { name: 'Computer Vision', level: 85, color: 'from-blue-500 to-cyan-500' },
    { name: 'NLP', level: 92, color: 'from-purple-500 to-indigo-500' },
    { name: 'MLOps', level: 87, color: 'from-yellow-500 to-orange-500' }
  ];

  const stats = [
    { number: '100+', label: 'AI проектов', icon: Brain },
    { number: '95%', label: 'Точность моделей', icon: BarChart3 },
    { number: '50TB+', label: 'Обработанных данных', icon: Database },
    { number: '24/7', label: 'Мониторинг', icon: Shield }
  ];

  const useCases = [
    { 
      title: 'Автоматизация документооборота', 
      description: 'Извлечение и обработка данных из документов',
      icon: FileText
    },
    { 
      title: 'Персонализация контента', 
      description: 'Рекомендательные системы для e-commerce',
      icon: Users
    },
    { 
      title: 'Качество продукции', 
      description: 'Автоматический контроль качества на производстве',
      icon: Eye
    },
    { 
      title: 'Финансовая аналитика', 
      description: 'Анализ рисков и прогнозирование в финансах',
      icon: BarChart3
    },
    { 
      title: 'Медицинская диагностика', 
      description: 'Анализ медицинских изображений и данных',
      icon: Shield
    },
    { 
      title: 'Умные города', 
      description: 'Оптимизация городской инфраструктуры',
      icon: Cpu
    }
  ];

  return (
    <div className="min-h-screen bg-dark-900">
      <Helmet>
          <title>AI-решения | KolTech</title>
          <meta name="description" content="Внедряем искусственный интеллект в ваш бизнес. От простых чат-ботов до сложных систем машинного обучения - создаем умные решения будущего." />
          <meta name="keywords" content="Чат-боты, CV, Компьютерное зрение, Аналитика, Обработка текста" />
          <meta property="og:title" content="AI-решения | KolTech" />
          <meta property="og:description" content="Внедряем искусственный интеллект в ваш бизнес. От простых чат-ботов до сложных систем машинного обучения - создаем умные решения будущего." />
          <meta property="og:type" content="website" />
          <link rel="canonical" href="https://koltech.dev/ai-solutions" />
      </Helmet>
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6 hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 tech-pattern opacity-20" />
        <div className="container mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="bounce-in">
              <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
                AI-
                <span className="text-shimmer block">решения</span>
              </h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed fade-in-delay">
                Внедряем искусственный интеллект в ваш бизнес. От простых чат-ботов 
                до сложных систем машинного обучения - создаем умные решения будущего.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 slide-up">
                <Link
                  to="/contacts"
                  className="ios-button inline-flex items-center justify-center"
                >
                  Внедрить AI
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  to="/portfolio"
                  className="glass-effect text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/10 transition-all duration-300 text-center"
                >
                  AI проекты
                </Link>
              </div>
            </div>
            <div className="relative slide-up floating-elements" style={{ animationDelay: '0.3s' }}>
              <div className="ios-card p-8 rounded-3xl">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[Brain, Bot, Eye, BarChart3].map((Icon, index) => (
                    <div
                      key={index}
                      className={`p-6 glass-effect rounded-2xl text-center magnetic-hover ${
                        visibleElements.includes(index) ? 'stagger-animation' : 'opacity-0'
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <Icon className="w-8 h-8 text-primary-400 mx-auto mb-2" />
                      <p className="text-white text-sm font-medium">
                        {['ML', 'Боты', 'CV', 'Аналитика'][index]}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary-500 to-accent-purple rounded-3xl flex items-center justify-center mb-4 magnetic-hover">
                    <Brain className="w-16 h-16 text-white animate-pulse" />
                  </div>
                  <p className="text-white font-semibold">Искусственный интеллект</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-dark-800/50">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className={`text-center ios-card p-6 rounded-2xl magnetic-hover ${
                  visibleElements.includes(index + 4) ? 'stagger-animation' : 'opacity-0'
                }`}
                style={{ animationDelay: `${(index + 4) * 0.1}s` }}
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gradient-to-br from-primary-500 to-accent-purple rounded-2xl">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-4 bounce-in">AI услуги</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto fade-in-delay">
              Комплексные решения на основе искусственного интеллекта
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="ios-card p-8 rounded-3xl magnetic-hover slide-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-500 to-accent-purple rounded-2xl flex items-center justify-center mr-3 sm:mr-4 mb-3 sm:mb-0">
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">{service.title}</h3>
                </div>
                
                <p className="text-gray-300 mb-6 leading-relaxed text-lg">
                  {service.description}
                </p>
                
                <div className="grid grid-cols-2 gap-3">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-accent-green flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-dark-800 to-dark-900">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-4 bounce-in">Применение AI</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto fade-in-delay">
              Реальные кейсы использования искусственного интеллекта в бизнесе
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <div
                key={index}
                className={`ios-card p-6 rounded-2xl text-center magnetic-hover ${
                  visibleElements.includes(index + 8) ? 'stagger-animation' : 'opacity-0'
                }`}
                style={{ animationDelay: `${(index + 8) * 0.1}s` }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-purple rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <useCase.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{useCase.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-4 bounce-in">AI технологии</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto fade-in-delay">
              Используем передовые фреймворки и библиотеки
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 max-w-6xl mx-auto">
            {[
              { name: 'TensorFlow', color: 'from-orange-500 to-red-500' },
              { name: 'PyTorch', color: 'from-red-500 to-pink-500' },
              { name: 'OpenAI GPT', color: 'from-green-500 to-emerald-500' },
              { name: 'Hugging Face', color: 'from-yellow-500 to-orange-500' },
              { name: 'Scikit-learn', color: 'from-blue-500 to-cyan-500' },
              { name: 'Keras', color: 'from-red-600 to-orange-600' },
              { name: 'OpenCV', color: 'from-blue-600 to-indigo-600' },
              { name: 'NLTK', color: 'from-green-600 to-teal-600' },
              { name: 'spaCy', color: 'from-purple-500 to-indigo-500' },
              { name: 'Pandas', color: 'from-blue-700 to-purple-600' },
              { name: 'NumPy', color: 'from-blue-500 to-blue-700' },
              { name: 'Matplotlib', color: 'from-orange-600 to-red-600' },
              { name: 'Jupyter', color: 'from-orange-500 to-yellow-500' },
              { name: 'MLflow', color: 'from-blue-600 to-cyan-600' },
              { name: 'Docker', color: 'from-blue-500 to-cyan-500' },
              { name: 'Kubernetes', color: 'from-blue-600 to-indigo-600' },
              { name: 'AWS SageMaker', color: 'from-orange-500 to-yellow-600' },
              { name: 'Google AI', color: 'from-blue-500 to-green-500' },
              { name: 'Azure ML', color: 'from-blue-600 to-cyan-600' },
              { name: 'Apache Spark', color: 'from-orange-600 to-red-600' },
              { name: 'Elasticsearch', color: 'from-yellow-500 to-orange-500' },
              { name: 'MongoDB', color: 'from-green-600 to-green-800' },
              { name: 'PostgreSQL', color: 'from-blue-700 to-indigo-600' },
              { name: 'Redis', color: 'from-red-600 to-red-800' }
            ].map((tech, index) => (
              <div
                key={index}
                className={`group cursor-pointer ${
                  visibleElements.includes(index + 14) ? 'stagger-animation' : 'opacity-0'
                }`}
                style={{ animationDelay: `${(index + 14) * 0.03}s` }}
              >
                <div className={`
                  px-5 py-2.5 rounded-xl font-medium text-white
                  bg-gradient-to-r ${tech.color}
                  hover:scale-105 hover:shadow-xl hover:shadow-primary-500/20
                  transition-all duration-300 ease-out
                  relative overflow-hidden
                  group-hover:animate-pulse
                `}>
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                  <span className="relative z-10">{tech.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-dark-800 to-dark-900">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-4 bounce-in">Процесс внедрения AI</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto fade-in-delay">
              Пошаговый подход к интеграции искусственного интеллекта
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Анализ данных', description: 'Изучение ваших данных и задач', icon: Database },
              { step: '02', title: 'Выбор модели', description: 'Подбор оптимального AI решения', icon: Brain },
              { step: '03', title: 'Обучение', description: 'Тренировка модели на ваших данных', icon: Cpu },
              { step: '04', title: 'Интеграция', description: 'Внедрение в ваши системы', icon: Zap }
            ].map((process, index) => (
              <div 
                key={index} 
                className="text-center slide-up magnetic-hover"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="ios-card p-8 rounded-3xl h-full">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-purple rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <process.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-primary-400 font-bold text-lg mb-2">{process.step}</div>
                  <h3 className="text-xl font-bold text-white mb-4">{process.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{process.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="ios-card p-12 rounded-3xl text-center slide-up relative overflow-hidden">
            <div className="absolute inset-0 hero-gradient opacity-10" />
            <div className="relative">
              <h2 className="text-4xl font-bold text-white mb-4">
                Готовы внедрить AI в ваш бизнес?
              </h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-lg">
                Автоматизируйте процессы, повысьте эффективность и получите 
                конкурентное преимущество с помощью искусственного интеллекта
              </p>
              <Link
                to="/contacts"
                className="ios-button inline-flex items-center"
              >
                Обсудить AI проект
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AISolutions;