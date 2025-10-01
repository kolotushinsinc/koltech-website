import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock, CheckCircle, User, MessageSquare } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Contacts = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
    service: 'web-development'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
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
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'hello@koltech.com',
      description: 'Напишите нам в любое время'
    },
    {
      icon: Phone,
      title: 'Телефон',
      value: '+7 (999) 123-45-67',
      description: 'Звоните в рабочие часы'
    },
    {
      icon: MapPin,
      title: 'Офис',
      value: 'Москва, Россия',
      description: 'Встретимся лично'
    },
    {
      icon: Clock,
      title: 'Время работы',
      value: 'Пн-Пт 9:00-18:00',
      description: 'Московское время'
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
    <div className="min-h-screen bg-dark-900">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-6">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto bounce-in">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Свяжитесь
              <span className="gradient-text block mt-2">с нами</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed fade-in-delay">
              Готовы обсудить ваш проект? Наша команда экспертов поможет воплотить 
              ваши идеи в инновационные цифровые решения.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="bg-dark-800 border border-dark-700 rounded-2xl p-6 card-hover group slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-purple rounded-xl flex items-center justify-center mb-4 group-hover:animate-pulse">
                  <info.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">{info.title}</h3>
                <p className="text-primary-400 font-medium mb-1">{info.value}</p>
                <p className="text-gray-400 text-sm">{info.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-12 px-6">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Form */}
            <div className="bg-dark-800 border border-dark-700 rounded-2xl p-8 slide-up">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-4">Расскажите о проекте</h2>
                <p className="text-gray-400">
                  Заполните форму, и мы свяжемся с вами в течение 24 часов
                </p>
              </div>

              {isSubmitted ? (
                <div className="text-center py-12 bounce-in">
                  <div className="w-16 h-16 bg-gradient-to-br from-accent-green to-primary-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Спасибо за обращение!</h3>
                  <p className="text-gray-300">
                    Мы получили ваше сообщение и свяжемся с вами в ближайшее время.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Имя *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Ваше имя"
                        className="w-full bg-dark-700 border border-dark-600 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
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
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        className="w-full bg-dark-700 border border-dark-600 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
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
                      className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
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
                      className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
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
                      <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Расскажите подробнее о вашем проекте..."
                        rows={5}
                        className="w-full bg-dark-700 border border-dark-600 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                      isSubmitting
                        ? 'bg-dark-600 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-primary-500 to-accent-purple text-white hover:shadow-2xl hover:scale-105 pulse-glow'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                        <span>Отправляем...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Отправить сообщение</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Additional Info */}
            <div className="space-y-8 slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="bg-gradient-to-br from-primary-500/10 to-accent-purple/10 border border-primary-500/20 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-4">Почему выбирают KolTech?</h3>
                <div className="space-y-4">
                  {[
                    'Опыт работы с 500+ проектами',
                    'Команда из 50+ экспертов',
                    'Полный цикл разработки',
                    'Поддержка 24/7',
                    'Гарантия качества'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
                      <span className="text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-dark-800 border border-dark-700 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-4">Быстрый ответ</h3>
                <p className="text-gray-300 mb-4">
                  Нужна срочная консультация? Напишите нам напрямую:
                </p>
                <div className="space-y-3">
                  <a
                    href="mailto:hello@koltech.com"
                    className="flex items-center space-x-3 text-primary-400 hover:text-primary-300 transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                    <span>hello@koltech.com</span>
                  </a>
                  <a
                    href="tel:+79991234567"
                    className="flex items-center space-x-3 text-primary-400 hover:text-primary-300 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    <span>+7 (999) 123-45-67</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contacts;