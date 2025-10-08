import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock, CheckCircle, User, MessageSquare, MessageCircle } from 'lucide-react';
import { contactService } from '../services/api';
import type { ContactFormData } from '../types';
import { Helmet } from 'react-helmet-async';

const Contacts = () => {
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
      <section className="pt-20 sm:pt-24 pb-8 sm:pb-12 px-4 sm:px-6">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto bounce-in">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              Свяжитесь
              <span className="gradient-text block mt-1 sm:mt-2">с нами</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed fade-in-delay">
              Готовы обсудить ваш проект? Наша команда экспертов поможет воплотить
              ваши идеи в инновационные цифровые решения.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-8 sm:py-12 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10 sm:mb-16">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="bg-dark-800 border border-dark-700 rounded-2xl p-4 sm:p-6 card-hover group slide-up flex flex-col h-full"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-500 to-accent-purple rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:animate-pulse">
                  <info.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">{info.title}</h3>
                <p className="text-primary-400 font-medium mb-1 text-sm sm:text-base break-words">{info.value}</p>
                <p className="text-gray-400 text-xs sm:text-sm mt-auto">{info.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-8 sm:py-12 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-12 items-start">
            {/* Form */}
            <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 sm:p-8 slide-up">
              <div className="mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Расскажите о проекте</h2>
                <p className="text-gray-400 text-sm sm:text-base">
                  Заполните форму, и мы свяжемся с вами в течение 24 часов
                </p>
              </div>

              {isSubmitted ? (
                <div className="text-center py-8 sm:py-12 bounce-in">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-accent-green to-primary-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Спасибо за обращение!</h3>
                  <p className="text-gray-300 text-sm sm:text-base">
                    Мы получили ваше сообщение и свяжемся с вами в ближайшее время.
                  </p>
                </div>
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
                    className={`w-full py-3 sm:py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base ${
                      isSubmitting
                        ? 'bg-dark-600 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-primary-500 to-accent-purple text-white hover:shadow-2xl hover:scale-105 pulse-glow'
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
            </div>

            {/* Additional Info */}
            <div className="space-y-6 sm:space-y-8 slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="bg-gradient-to-br from-primary-500/10 to-accent-purple/10 border border-primary-500/20 rounded-2xl p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Почему выбирают KolTech?</h3>
                <div className="space-y-3 sm:space-y-4">
                  {[
                    'Опыт работы с 500+ проектами',
                    'Команда из 50+ экспертов',
                    'Полный цикл разработки',
                    'Поддержка 24/7',
                    'Гарантия качества'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
                      <span className="text-gray-300 text-sm sm:text-base">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 sm:p-8">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Наши офисы</h3>
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
              </div>

              <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 sm:p-8">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Быстрый ответ</h3>
                <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">
                  Нужна срочная консультация? Напишите нам напрямую:
                </p>
                <div className="space-y-2 sm:space-y-3">
                  <a
                    href="mailto:kolotushintechnologies@gmail.com"
                    className="flex items-center space-x-3 text-primary-400 hover:text-primary-300 transition-colors text-sm sm:text-base"
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
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contacts;