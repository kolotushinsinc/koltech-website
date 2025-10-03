import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Smartphone, Tablet, Watch, Apple, CheckCircle, Star, Users, Clock, Award, Zap } from 'lucide-react';

const MobileDevelopment = () => {
  const technologies = [
    'React Native', 'Flutter', 'Swift', 'Kotlin', 'Java',
    'Objective-C', 'Dart', 'Xamarin', 'Ionic', 'Firebase',
    'Redux', 'GraphQL', 'Node.js', 'MongoDB', 'AWS'
  ];

  const services = [
    {
      title: 'iOS приложения',
      description: 'Разработка нативных приложений для iPhone и iPad с использованием Swift и Objective-C',
      features: ['Оптимизация под iOS', 'Интеграция с App Store', 'Push-уведомления', 'AR/VR технологии']
    },
    {
      title: 'Android приложения',
      description: 'Создание нативных приложений для смартфонов и планшетов на Android',
      features: ['Адаптация под разные устройства', 'Google Play интеграция', 'Material Design', 'Фоновые сервисы']
    },
    {
      title: 'Кроссплатформенные решения',
      description: 'Разработка приложений для нескольких платформ с использованием React Native и Flutter',
      features: ['Единая кодовая база', 'Снижение стоимости', 'Быстрая разработка', 'Нативная производительность']
    },
    {
      title: 'Приложения для умных устройств',
      description: 'Создание приложений для носимых устройств и IoT-гаджетов',
      features: ['Apple Watch', 'Wear OS', 'Интеграция с IoT', 'Низкое энергопотребление']
    }
  ];

  const benefits = [
    {
      icon: Zap,
      title: 'Высокая производительность',
      description: 'Оптимизированный код и современные технологии обеспечивают быструю работу приложений'
    },
    {
      icon: Smartphone,
      title: 'Адаптивный дизайн',
      description: 'Ваше приложение будет отлично выглядеть на всех устройствах и размерах экранов'
    },
    {
      icon: CheckCircle,
      title: 'Качество и надежность',
      description: 'Гарантируем стабильную работу и безопасность вашего мобильного приложения'
    },
    {
      icon: Users,
      title: 'Команда экспертов',
      description: 'Работают опытные разработчики с глубокими знаниями в мобильной разработке'
    }
  ];

  return (
    <div className="bg-dark-900">
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-6">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Профессиональная разработка
              <span className="gradient-text block mt-2">Мобильных приложений</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Создаем современные мобильные решения для iOS и Android. 
              От нативных приложений до кроссплатформенных решений - воплощаем ваши идеи в мобильном мире.
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
            <h2 className="text-3xl font-bold text-white mb-4">Технологии и платформы</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Используем современные технологии для создания надежных мобильных решений
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
              Комплексные решения для мобильной разработки под любые задачи
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
              Почему выбирают нас для мобильной разработки
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

      {/* Platforms */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Платформы</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Разрабатываем для всех популярных мобильных платформ
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-dark-800 border border-dark-700 rounded-2xl p-8 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <Apple className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">iOS</h3>
              <p className="text-gray-400 mb-6">
                Разработка приложений для iPhone и iPad с использованием современных технологий Apple
              </p>
              <div className="space-y-2 text-left">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary-400" />
                  <span className="text-gray-300">Swift и Objective-C</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary-400" />
                  <span className="text-gray-300">SwiftUI и UIKit</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary-400" />
                  <span className="text-gray-300">App Store оптимизация</span>
                </div>
              </div>
            </div>
            
            <div className="bg-dark-800 border border-dark-700 rounded-2xl p-8 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Smartphone className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Android</h3>
              <p className="text-gray-400 mb-6">
                Создание приложений для смартфонов и планшетов на операционной системе Android
              </p>
              <div className="space-y-2 text-left">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary-400" />
                  <span className="text-gray-300">Kotlin и Java</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary-400" />
                  <span className="text-gray-300">Jetpack Compose</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary-400" />
                  <span className="text-gray-300">Google Play оптимизация</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 px-6 bg-gradient-to-br from-dark-800 to-dark-900">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Процесс работы</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Как мы создаем мобильные приложения от идеи до внедрения
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { step: '01', title: 'Анализ', description: 'Изучение требований и целевой аудитории' },
              { step: '02', title: 'Проектирование', description: 'Создание прототипов и UI/UX дизайн' },
              { step: '03', title: 'Разработка', description: 'Программирование и тестирование' },
              { step: '04', title: 'Запуск', description: 'Публикация и техническая поддержка' }
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
              Готовы создать мобильное приложение?
            </h2>
            <p className="text-gray-300 mb-8">
              Свяжитесь с нами для бесплатной консультации и расчета стоимости вашего проекта
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

export default MobileDevelopment;