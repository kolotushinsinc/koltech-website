import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, Clock, CheckCircle, User, MessageSquare, MessageCircle, ChevronRight, ArrowRight } from 'lucide-react';
import { contactService } from '../services/api';
import type { ContactFormData } from '../types';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Contacts = () => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    company: '',
    message: '',
    service: 'web-development'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      await contactService.submitForm(formData);
      setIsSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: '',
          email: '',
          company: '',
          message: '',
          service: 'web-development'
        });
      }, 3000);
    } catch (err) {
      console.error('Failed to submit form:', err);
      setError('Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'kolotushintechnologies@gmail.com',
      description: 'Напишите нам в любое время'
    },
    {
      icon: Phone,
      title: 'Телефон',
      value: '+79217747097',
      description: 'Звоните в рабочие часы'
    },
    {
      icon: MapPin,
      title: 'Офисы',
      value: 'Санкт-Петербург, Владивосток, Находка',
      description: 'Встретимся лично'
    },
    {
      icon: Clock,
      title: 'Время работы',
      value: 'МСК: Пн-Пт 9:00-18:00\nVLAT: Пн-Пт 20:00-5:00',
      description: 'Московское и Владивостокское время'
    }
  ];

  const services = [
    { value: 'web-development', label: 'Веб-разработка' },
    { value: 'mobile-development', label: 'Мобильная разработка' },
    { value: 'ai-solutions', label: 'AI-решения' },
    { value: 'business-accelerator', label: 'Бизнес-акселератор' },
    { value: 'consulting', label: 'Консалтинг' },
    { value: 'other', label: 'Другое' }
  ];

  return (
    <div className="bg-dark-900">
      <Helmet>
        <title>Свяжитесь с нами | KolTech</title>
        <meta name="description" content="Готовы обсудить ваш проект? Наша команда экспертов поможет воплотить ваши идеи в инновационные цифровые решения." />
        <meta name="keywords" content="Корпоративные сайты, E-commerce решения, Веб-приложения, Backend системы, Нативные приложения, Кроссплатформенные, PWA приложения, Enterprise решения, React Native, Flutter, Swift, Kotlin, Dart, Objective-C, Java, Xamarin, Ionic, Cordova, Firebase, SQLite, Realm, Core Data, Room, React, Vue.js, Angular, Node.js, TypeScript, JavaScript, Python, PHP, Next.js, Nuxt.js, Express.js, Django, Laravel, MySQL, Docker, AWS, GraphQL, Чат-боты, CV, Компьютерное зрение, Аналитика, Обработка текста, TensorFlow, PyTorch, OpenAI GPT, Hugging Face, Scikit-learn, Keras, OpenCV, NLTK, spaCy, Pandas, NumPy, Matplotlib, Jupyter, MLflow, Docker, Kubernetes, AWS SageMaker, Google AI, Azure ML, Apache Spark, Elasticsearch, MongoDB, PostgreSQL, Redis, Стратегическое планирование, Техническое консультирование, Безопасность и соответствие, Цифровая трансформация, Бизнес-Акселератор, Быстрый старт, AI-powered решения, Экспертная команда, Глобальный охват, Точное попадание, Надежность, Стратегическое планирование, Техническая реализация, Масштабирование, KolTechLine, FLineHub, KolTechValley, KolTechBusiness, Будущее Цифрового Сотрудничества, " />
        <meta property="og:title" content="Свяжитесь с нами | KolTech" />
        <meta property="og:description" content="Готовы обсудить ваш проект? Наша команда экспертов поможет воплотить ваши идеи в инновационные цифровые решения." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://koltech.dev/contacts" />
      </Helmet>
      {/* Hero Section */}
      <section className="hero-with-video relative min-h-[60vh] flex items-center overflow-hidden pt-20 sm:pt-24">
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
                C
              </motion.span>
              Свяжитесь
              <span className="block text-blue-500 relative">
                с нами
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
              Готовы обсудить ваш проект? Наша команда экспертов поможет воплотить
              ваши идеи в инновационные цифровые решения.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-5 justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <a
                href="#contact-form"
                className="modern-button button-blue inline-flex items-center justify-center"
              >
                <span>Отправить сообщение</span>
                <ChevronRight className="ml-2 w-4 h-4" />
              </a>
              
              <Link
                to="/portfolio"
                className="modern-ghost-button inline-flex items-center justify-center"
              >
                <span>Наши проекты</span>
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="content-section section-dark py-20 sm:py-28 bg-[#0c1222]">
        <div className="container mx-auto px-4 sm:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="heading-lg text-white mb-4">Как с нами связаться</h2>
            <p className="subheading max-w-2xl mx-auto">
              Выберите удобный для вас способ коммуникации
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
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
                    <info.icon className="w-5 h-5 text-white relative z-10" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{info.title}</h3>
                <p className="text-blue-300 font-medium mb-2 text-sm break-words">{info.value}</p>
                <p className="text-gray-400 text-xs">{info.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact-form" className="content-section section-gradient py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="dimensional-card card-blue p-6 sm:p-8 relative overflow-hidden"
            >
              <div className="mb-6 sm:mb-8">
                <h2 className="heading-lg text-white mb-4">Расскажите о проекте</h2>
                <p className="subheading mb-0">
                  Заполните форму, и мы свяжемся с вами в течение 24 часов
                </p>
              </div>

              {isSubmitted ? (
                <motion.div 
                  className="text-center py-8 sm:py-12"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="icon-container icon-green mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-white relative z-10" />
                  </div>
                  <h3 className="heading-md text-white mb-4">Спасибо за обращение!</h3>
                  <p className="subheading mb-0">
                    Мы получили ваше сообщение и свяжемся с вами в ближайшее время.
                  </p>
                </motion.div>
              ) : (
               <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                 {error && (
                   <div className="bg-red-50 border-l-4 border-red-500 p-4">
                     <div className="flex">
                       <div className="ml-3">
                         <p className="text-sm text-red-700">{error}</p>
                       </div>
                     </div>
                   </div>
                 )}
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Имя *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Ваше имя"
                        className="w-full bg-dark-700 border border-dark-600 rounded-xl pl-9 sm:pl-10 pr-4 py-2 sm:py-3 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all text-sm sm:text-base"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        className="w-full bg-dark-700 border border-dark-600 rounded-xl pl-9 sm:pl-10 pr-4 py-2 sm:py-3 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all text-sm sm:text-base"
                        required
                      />
                    </div>
                  </div>

                  {/* Company */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Компания
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="Название компании"
                      className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-2 sm:py-3 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all text-sm sm:text-base"
                    />
                  </div>

                  {/* Service */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Интересующая услуга
                    </label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-2 sm:py-3 text-white focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all text-sm sm:text-base"
                    >
                      {services.map(service => (
                        <option key={service.value} value={service.value}>
                          {service.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Сообщение *
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-2 sm:top-3 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Расскажите подробнее о вашем проекте..."
                        rows={5}
                        className="w-full bg-dark-700 border border-dark-600 rounded-xl pl-9 sm:pl-10 pr-4 py-2 sm:py-3 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all resize-none text-sm sm:text-base"
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`modern-button button-blue w-full py-3 sm:py-4 px-6 flex items-center justify-center space-x-2 text-sm sm:text-base ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                        <span>Отправляем...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Отправить сообщение</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>

            {/* Additional Info */}
            <div className="space-y-6 sm:space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="dimensional-card card-blue p-6 sm:p-8 relative overflow-hidden"
              >
                <h3 className="heading-md text-white mb-4">Почему выбирают KolTech?</h3>
                <div className="space-y-3 sm:space-y-4">
                  {[
                    'Опыт работы с 500+ проектами',
                    'Команда из 50+ экспертов',
                    'Полный цикл разработки',
                    'Поддержка 24/7',
                    'Гарантия качества'
                  ].map((item, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-center space-x-3"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                    >
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-gray-300 text-sm sm:text-base">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="dimensional-card card-purple p-6 sm:p-8 relative overflow-hidden"
              >
                <h3 className="heading-md text-white mb-4">Наши офисы</h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="text-gray-300">
                    <p className="font-semibold text-white mb-1 text-sm sm:text-base">Санкт-Петербург</p>
                    <p className="text-xs sm:text-sm">Россия, наб. канала Грибоедова, 19</p>
                  </div>
                  <div className="text-gray-300">
                    <p className="font-semibold text-white mb-1 text-sm sm:text-base">Владивосток</p>
                    <p className="text-xs sm:text-sm">Россия, Светланская ул., 33, (этаж 3)</p>
                  </div>
                  <div className="text-gray-300">
                    <p className="font-semibold text-white mb-1 text-sm sm:text-base">Находка</p>
                    <p className="text-xs sm:text-sm">«ПризмаТим Интернет-маркетинг». Адрес: ул. Арсеньева, 14</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="dimensional-card card-teal p-6 sm:p-8 relative overflow-hidden"
              >
                <h3 className="heading-md text-white mb-4">Быстрый ответ</h3>
                <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">
                  Нужна срочная консультация? Напишите нам напрямую:
                </p>
                <div className="space-y-2 sm:space-y-3">
                  <a
                    href="mailto:kolotushintechnologies@gmail.com"
                    className="flex items-center space-x-3 text-blue-400 hover:text-blue-300 transition-colors text-sm sm:text-base"
                  >
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>kolotushintechnologies@gmail.com</span>
                  </a>
                  <a
                    href="mailto:siriusdark999@yandex.ru"
                    className="flex items-center space-x-3 text-primary-400 hover:text-primary-300 transition-colors text-sm sm:text-base"
                  >
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>siriusdark999@yandex.ru</span>
                  </a>
                  <a
                    href="mailto:wearedev-studio@yandex.ru"
                    className="flex items-center space-x-3 text-primary-400 hover:text-primary-300 transition-colors text-sm sm:text-base"
                  >
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>wearedev-studio@yandex.ru</span>
                  </a>
                  <a
                    href="tel:+79217747097"
                    className="flex items-center space-x-3 text-primary-400 hover:text-primary-300 transition-colors text-sm sm:text-base"
                  >
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>+79217747097</span>
                  </a>
                  <a
                    href="https://t.me/Kolotushin"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 text-primary-400 hover:text-primary-300 transition-colors text-sm sm:text-base"
                  >
                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Kolotushin</span>
                  </a>
                  <a
                    href="https://t.me/alekseevsmm"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 text-primary-400 hover:text-primary-300 transition-colors text-sm sm:text-base"
                  >
                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Alekseev</span>
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contacts;
