import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, Smartphone, Brain, Rocket, Users, Star } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const Home = () => {
  return (
    <div className="min-h-screen bg-dark-900">
      <Helmet>
        <title>KolTech | От мысли к действию</title>
        <meta name="description" content="KolTech - инновационная платформа для разработки веб-сайтов, мобильных приложений и AI-решений. Мы превращаем ваши идеи в революционные цифровые продукты." />
        <meta name="keywords" content="Корпоративные сайты, E-commerce решения, Веб-приложения, Backend системы, Нативные приложения, Кроссплатформенные, PWA приложения, Enterprise решения, React Native, Flutter, Swift, Kotlin, Dart, Objective-C, Java, Xamarin, Ionic, Cordova, Firebase, SQLite, Realm, Core Data, Room, React, Vue.js, Angular, Node.js, TypeScript, JavaScript, Python, PHP, Next.js, Nuxt.js, Express.js, Django, Laravel, MySQL, Docker, AWS, GraphQL, Чат-боты, CV, Компьютерное зрение, Аналитика, Обработка текста, TensorFlow, PyTorch, OpenAI GPT, Hugging Face, Scikit-learn, Keras, OpenCV, NLTK, spaCy, Pandas, NumPy, Matplotlib, Jupyter, MLflow, Docker, Kubernetes, AWS SageMaker, Google AI, Azure ML, Apache Spark, Elasticsearch, MongoDB, PostgreSQL, Redis, Стратегическое планирование, Техническое консультирование, Безопасность и соответствие, Цифровая трансформация, Бизнес-Акселератор, Быстрый старт, AI-powered решения, Экспертная команда, Глобальный охват, Точное попадание, Надежность, Стратегическое планирование, Техническая реализация, Масштабирование, KolTechLine, FLineHub, KolTechValley, KolTechBusiness, Будущее Цифрового Сотрудничества, " />
        <meta property="og:title" content="KolTech | От мысли к действию" />
        <meta property="og:description" content="KolTech - инновационная платформа для разработки веб-сайтов, мобильных приложений и AI-решений. Мы превращаем ваши идеи в революционные цифровые продукты." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://koltech.dev" />
      </Helmet>
      {/* Hero Section */}
      <section className="pt-20 sm:pt-24 pb-8 sm:pb-12 px-4 sm:px-6">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              Создаем
              <span className="gradient-text block mt-1 sm:mt-2">Будущее Технологий</span>
            </h1>
            <p className="text-base sm:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-2">
              KolTech - инновационная платформа для разработки веб-сайтов, мобильных приложений
              и AI-решений. Мы превращаем ваши идеи в революционные цифровые продукты.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link
                to="/contacts"
                className="ios-button inline-flex items-center justify-center text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4"
              >
                <span className="hidden sm:inline">Связаться с нами</span>
                <span className="sm:hidden">Связаться</span>
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <Link
                to="/portfolio"
                className="glass-effect text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold hover:bg-white/10 transition-all duration-300 text-sm sm:text-base"
              >
                <span className="hidden sm:inline">Посмотреть работы</span>
                <span className="sm:hidden">Работы</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 tech-pattern">
        <div className="container mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">Наши Услуги</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base px-2">
              Полный спектр IT-услуг для реализации ваших амбициозных проектов
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: Code,
                title: 'Веб-разработка',
                description: 'Современные веб-сайты и веб-приложения с использованием передовых технологий',
                color: 'from-primary-500 to-primary-600',
                link: '/web-development'
              },
              {
                icon: Smartphone,
                title: 'Мобильные приложения',
                description: 'Нативные и кроссплатформенные мобильные приложения для iOS и Android',
                color: 'from-accent-purple to-accent-pink',
                link: '/mobile-development'
              },
              {
                icon: Brain,
                title: 'AI-решения',
                description: 'Интеллектуальные системы и машинное обучение для автоматизации бизнеса',
                color: 'from-accent-green to-primary-500',
                link: '/ai-solutions'
              }
            ].map((service, index) => (
              <Link
                to={service.link}
                key={index}
                className="ios-card p-6 sm:p-8 rounded-3xl magnetic-hover group block slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:animate-pulse`}>
                  <service.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">{service.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm sm:text-base">{service.description}</p>
              </Link>
            ))}
          </div>

          {/* Additional Services */}
          <div className="mt-8 sm:mt-12 text-center">
            <Link
              to="/consulting"
              className="ios-card inline-block p-4 sm:p-6 rounded-2xl magnetic-hover slide-up max-w-md mx-auto"
              style={{ animationDelay: '0.4s' }}
            >
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-base sm:text-lg font-bold text-white">IT-консалтинг</h3>
                  <p className="text-gray-400 text-xs sm:text-sm">Экспертные консультации по цифровой трансформации</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-gradient-to-br from-dark-800 to-dark-900">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">О KolTech</h2>
              <p className="text-gray-300 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                Мы команда экспертов в области информационных технологий, объединенных общей целью -
                создавать инновационные решения, которые меняют мир к лучшему.
              </p>
              <p className="text-gray-300 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
                Наша платформа KolTechLine объединяет заказчиков, фрилансеров и стартаперов,
                создавая экосистему для воплощения самых смелых технологических идей.
              </p>
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {[
                  { number: '500+', label: 'Проектов' },
                  { number: '100+', label: 'Клиентов' },
                  { number: '50+', label: 'Экспертов' }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-primary-400">{stat.number}</div>
                    <div className="text-gray-400 text-xs sm:text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="w-full h-64 sm:h-80 md:h-96 bg-gradient-to-br from-primary-500/20 to-accent-purple/20 rounded-2xl flex items-center justify-center">
                <div className="text-center px-4">
                  <Rocket className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-primary-400 mx-auto mb-3 sm:mb-4 animate-float" />
                  <p className="text-white font-semibold text-sm sm:text-base">Инновации в действии</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto bg-gradient-to-br from-dark-800 to-dark-700 p-6 sm:p-8 md:p-12 rounded-3xl border border-dark-600">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
              Готовы начать ваш проект?
            </h2>
            <p className="text-gray-300 mb-6 sm:mb-8 text-sm sm:text-base">
              Присоединяйтесь к KolTech и получите доступ к лучшим специалистам и инновационным решениям
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link
                to="/contacts"
                className="ios-button inline-flex items-center justify-center text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4"
              >
                Связаться с нами
              </Link>
              <Link
                to="/contacts"
                className="glass-effect text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold hover:bg-white/10 transition-all duration-300 text-sm sm:text-base"
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