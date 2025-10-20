import React, { useEffect } from 'react';
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
  Database,
  ChevronRight
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const AISolutions = () => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
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
      <section className="hero-with-video relative min-h-[70vh] flex items-center overflow-hidden pt-20 sm:pt-24">
        {/* Animated background elements */}
        <div className="absolute inset-0 z-0">
          {/* Animated circles */}
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full bg-green-500/5 blur-3xl"
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
            className="absolute w-[400px] h-[400px] rounded-full bg-teal-500/5 blur-3xl"
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
            className="absolute w-[300px] h-[300px] rounded-full bg-blue-500/5 blur-3xl"
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
              className="absolute w-1 h-1 bg-teal-400 rounded-full"
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
                className="absolute -left-10 -top-10 text-teal-500/10 text-9xl font-bold z-0 hidden sm:block"
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
                A
              </motion.span>
              AI-
              <span className="block text-teal-500 relative">
                решения
                <motion.div
                  className="absolute -bottom-2 left-0 h-1 bg-teal-500/50 rounded-full"
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
              Внедряем искусственный интеллект в ваш бизнес. От простых чат-ботов 
              до сложных систем машинного обучения - создаем умные решения будущего.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-5 justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link
                to="/contacts"
                className="modern-button button-teal inline-flex items-center justify-center"
              >
                <span>Внедрить AI</span>
                <ChevronRight className="ml-2 w-4 h-4" />
              </Link>
              
              <Link
                to="/portfolio"
                className="modern-ghost-button inline-flex items-center justify-center"
              >
                <span>AI проекты</span>
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
                className="dimensional-card card-teal p-6 text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="icon-container icon-teal">
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
            <h2 className="heading-lg text-white mb-4">AI услуги</h2>
            <p className="subheading max-w-2xl mx-auto">
              Комплексные решения на основе искусственного интеллекта
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const colors = ['teal', 'blue', 'purple', 'orange'];
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

      {/* Use Cases Section */}
      <section className="content-section section-dark py-20 sm:py-28 bg-[#0c1222]">
        <div className="container mx-auto px-4 sm:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="heading-lg text-white mb-4">Применение AI</h2>
            <p className="subheading max-w-2xl mx-auto">
              Реальные кейсы использования искусственного интеллекта в бизнесе
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => {
              const colors = ['teal', 'purple', 'blue', 'teal', 'purple', 'blue'];
              let color = colors[index % colors.length];
              
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
                      <useCase.icon className="w-5 h-5 text-white relative z-10" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{useCase.title}</h3>
                  <p className="text-gray-400 text-sm">{useCase.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="content-section section-dark py-20 sm:py-28 bg-[#0c1222]">
        <div className="container mx-auto px-4 sm:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="heading-lg text-white mb-4">Процесс внедрения AI</h2>
            <p className="subheading max-w-2xl mx-auto">
              Пошаговый подход к интеграции искусственного интеллекта
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Анализ данных', description: 'Изучение ваших данных и задач', icon: Database, color: 'teal' },
              { step: '02', title: 'Выбор модели', description: 'Подбор оптимального AI решения', icon: Brain, color: 'purple' },
              { step: '03', title: 'Обучение', description: 'Тренировка модели на ваших данных', icon: Cpu, color: 'blue' },
              { step: '04', title: 'Интеграция', description: 'Внедрение в ваши системы', icon: Zap, color: 'teal' }
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
                <div className="text-white font-bold text-lg mb-2">{process.step}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{process.title}</h3>
                <p className="text-gray-400 text-sm">{process.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="content-section section-gradient py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-8">
          <motion.div 
            className="dimensional-card card-teal p-8 sm:p-12 text-center sm:text-left relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="sm:flex items-center justify-between">
              <div className="mb-8 sm:mb-0 sm:mr-8">
                <h2 className="heading-lg text-white mb-4">Готовы внедрить AI в ваш бизнес?</h2>
                <p className="subheading max-w-xl mb-0">
                  Автоматизируйте процессы, повысьте эффективность и получите 
                  конкурентное преимущество с помощью искусственного интеллекта
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/contacts"
                  className="modern-button button-teal inline-flex items-center justify-center text-base px-6 py-3"
                >
                  <span>Обсудить AI проект</span>
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Link>
                
                <Link
                  to="/portfolio"
                  className="modern-ghost-button inline-flex items-center justify-center text-base px-6 py-3"
                >
                  <span>AI проекты</span>
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

export default AISolutions;
