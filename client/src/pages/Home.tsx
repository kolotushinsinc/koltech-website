import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, Smartphone, Brain, Rocket, Users, Star } from 'lucide-react';

const Home = () => {
  return (
    <div className="bg-dark-900">
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-6">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Создаем
              <span className="gradient-text block mt-2">Будущее Технологий</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              KolTech - инновационная платформа для разработки веб-сайтов, мобильных приложений 
              и AI-решений. Мы превращаем ваши идеи в революционные цифровые продукты.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contacts"
                className="bg-gradient-to-r from-primary-500 to-accent-purple text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl transition-all duration-300 flex items-center justify-center neon-glow"
              >
                Связаться с нами
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

      {/* Services Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Наши Услуги</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Полный спектр IT-услуг для реализации ваших амбициозных проектов
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Code,
                title: 'Веб-разработка',
                description: 'Современные веб-сайты и веб-приложения с использованием передовых технологий',
                color: 'from-primary-500 to-primary-600'
              },
              {
                icon: Smartphone,
                title: 'Мобильные приложения',
                description: 'Нативные и кроссплатформенные мобильные приложения для iOS и Android',
                color: 'from-accent-purple to-accent-pink'
              },
              {
                icon: Brain,
                title: 'AI-решения',
                description: 'Интеллектуальные системы и машинное обучение для автоматизации бизнеса',
                color: 'from-accent-green to-primary-500'
              }
            ].map((service, index) => (
              <div
                key={index}
                className="bg-dark-800 p-8 rounded-2xl border border-dark-700"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center mb-6`}>
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{service.title}</h3>
                <p className="text-gray-400 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-dark-800 to-dark-900">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">О KolTech</h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Мы команда экспертов в области информационных технологий, объединенных общей целью - 
                создавать инновационные решения, которые меняют мир к лучшему.
              </p>
              <p className="text-gray-300 mb-8 leading-relaxed">
                Наша платформа KolTechLine объединяет заказчиков, фрилансеров и стартаперов, 
                создавая экосистему для воплощения самых смелых технологических идей.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { number: '500+', label: 'Проектов' },
                  { number: '100+', label: 'Клиентов' },
                  { number: '50+', label: 'Экспертов' }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-primary-400">{stat.number}</div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="w-full h-96 bg-gradient-to-br from-primary-500/20 to-accent-purple/20 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <Rocket className="w-24 h-24 text-primary-400 mx-auto mb-4" />
                  <p className="text-white font-semibold">Инновации в действии</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto bg-gradient-to-br from-dark-800 to-dark-700 p-12 rounded-3xl border border-dark-600">
            <h2 className="text-3xl font-bold text-white mb-4">
              Готовы начать ваш проект?
            </h2>
            <p className="text-gray-300 mb-8">
              Присоединяйтесь к KolTechLine и получите доступ к лучшим специалистам и инновационным решениям
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contacts"
                className="bg-gradient-to-r from-primary-500 to-accent-purple text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl transition-all duration-300"
              >
                Связаться с нами
              </Link>
              <Link
                to="/contacts"
                className="border-2 border-primary-500 text-primary-400 px-8 py-4 rounded-xl font-semibold hover:bg-primary-500 hover:text-white transition-all duration-300"
              >
                Узнать больше
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;