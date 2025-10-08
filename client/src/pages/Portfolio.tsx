import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Code, Smartphone, Brain, Star, ArrowRight } from 'lucide-react';
import { projectService } from '../services/api';
import type { Project } from '../types';
import { Helmet } from 'react-helmet-async';

const SkeletonCard = () => (
  <div className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden">
    <div className="h-48 skeleton" />
    <div className="p-6">
      <div className="h-6 skeleton rounded mb-3" />
      <div className="h-4 skeleton rounded mb-2" />
      <div className="h-4 skeleton rounded w-3/4 mb-4" />
      <div className="flex space-x-2">
        <div className="h-6 w-16 skeleton rounded" />
        <div className="h-6 w-20 skeleton rounded" />
        <div className="h-6 w-18 skeleton rounded" />
      </div>
    </div>
  </div>
);

const Portfolio = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [visibleProjects, setVisibleProjects] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Все проекты');
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectService.getProjects();
        const data = Array.isArray(response) ? response : [];
        setProjects(data);
        setFilteredProjects(data); // Изначально показываем все проекты
        
        // Animate projects appearing one by one
        data.forEach((_, index) => {
          setTimeout(() => {
            setVisibleProjects(prev => [...prev, index]);
          }, index * 200);
        });
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        // В случае ошибки используем заглушку
        setProjects([]);
        setFilteredProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    // Сбрасываем видимые проекты перед фильтрацией
    setVisibleProjects([]);
    
    // Фильтруем проекты по выбранной категории
    if (selectedCategory === 'Все проекты') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(project => project.category === selectedCategory));
    }
    
    // Анимируем появление отфильтрованных проектов
    setTimeout(() => {
      const currentFilteredProjects = selectedCategory === 'Все проекты'
        ? projects
        : projects.filter(project => project.category === selectedCategory);
      
      currentFilteredProjects.forEach((_, index) => {
        setTimeout(() => {
          setVisibleProjects(prev => [...prev, index]);
        }, index * 200);
      });
    }, 100);
  }, [selectedCategory, projects]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Веб-разработка':
        return <Code className="w-5 h-5" />;
      case 'Мобильная разработка':
        return <Smartphone className="w-5 h-5" />;
      case 'AI-решения':
        return <Brain className="w-5 h-5" />;
      default:
        return <Code className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Веб-разработка':
        return 'from-primary-500 to-primary-600';
      case 'Мобильная разработка':
        return 'from-accent-purple to-accent-pink';
      case 'AI-решения':
        return 'from-accent-green to-primary-500';
      default:
        return 'from-primary-500 to-primary-600';
    }
  };

  return (
    <div className="bg-dark-900">
      <Helmet>
        <title>Наше Портфолио | KolTech</title>
        <meta name="description" content="Изучите наши лучшие проекты, которые демонстрируют инновационные решения в веб-разработке, мобильных приложениях и AI-технологиях" />
        <meta name="keywords" content="Корпоративные сайты, E-commerce решения, Веб-приложения, Backend системы, Нативные приложения, Кроссплатформенные, PWA приложения, Enterprise решения, React Native, Flutter, Swift, Kotlin, Dart, Objective-C, Java, Xamarin, Ionic, Cordova, Firebase, SQLite, Realm, Core Data, Room, React, Vue.js, Angular, Node.js, TypeScript, JavaScript, Python, PHP, Next.js, Nuxt.js, Express.js, Django, Laravel, MySQL, Docker, AWS, GraphQL, Чат-боты, CV, Компьютерное зрение, Аналитика, Обработка текста, TensorFlow, PyTorch, OpenAI GPT, Hugging Face, Scikit-learn, Keras, OpenCV, NLTK, spaCy, Pandas, NumPy, Matplotlib, Jupyter, MLflow, Docker, Kubernetes, AWS SageMaker, Google AI, Azure ML, Apache Spark, Elasticsearch, MongoDB, PostgreSQL, Redis, Стратегическое планирование, Техническое консультирование, Безопасность и соответствие, Цифровая трансформация, Бизнес-Акселератор, Быстрый старт, AI-powered решения, Экспертная команда, Глобальный охват, Точное попадание, Надежность, Стратегическое планирование, Техническая реализация, Масштабирование, KolTechLine, FLineHub, KolTechValley, KolTechBusiness, Будущее Цифрового Сотрудничества, " />
        <meta property="og:title" content="Наше Портфолио | KolTech" />
        <meta property="og:description" content="Изучите наши лучшие проекты, которые демонстрируют инновационные решения в веб-разработке, мобильных приложениях и AI-технологиях" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://koltech.dev/portfolio" />
      </Helmet>
      {/* Hero Section */}
      <section className="pt-20 sm:pt-24 pb-8 sm:pb-12 px-4 sm:px-6">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 sm:mb-6 bounce-in">
            Наше
            <span className="gradient-text block mt-1 sm:mt-2">Портфолио</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto fade-in-delay leading-relaxed">
            Изучите наши лучшие проекты, которые демонстрируют инновационные решения
            в веб-разработке, мобильных приложениях и AI-технологиях
          </p>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="px-4 sm:px-6 mb-8 sm:mb-12">
        <div className="container mx-auto">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 slide-up">
            {['Все проекты', 'Веб-разработка', 'Мобильная разработка', 'AI-решения'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium text-sm sm:text-base transition-all duration-300 hover:scale-105 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-primary-500 to-accent-purple text-white pulse-glow'
                    : 'bg-dark-800 border border-dark-700 text-gray-300 hover:text-white hover:border-primary-500'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="px-4 sm:px-6 pb-16 sm:pb-20">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {isLoading ? (
              // Show skeleton cards while loading
              Array.from({ length: 6 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))
            ) : filteredProjects.length === 0 ? (
              // Show message when no projects found in the selected category
              <div className="col-span-3 text-center py-12">
                <div className="bg-dark-800 border border-dark-700 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-white mb-4">Проекты не найдены</h3>
                  <p className="text-gray-400 mb-6">
                    В категории "{selectedCategory}" пока нет проектов.
                  </p>
                  <button
                    onClick={() => setSelectedCategory('Все проекты')}
                    className="inline-flex items-center bg-gradient-to-r from-primary-500 to-accent-purple text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    Смотреть все проекты
                  </button>
                </div>
              </div>
            ) : (
              filteredProjects.map((project, index) => (
              <div
                key={project._id}
                className={`bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden card-hover group transition-all duration-500 ${
                  visibleProjects.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                {/* Project Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={`https://api.koltech.dev${project.mainImage}`}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent" />
                  
                  {/* Category Badge */}
                  <div className={`absolute top-4 left-4 bg-gradient-to-r ${getCategoryColor(project.category)} px-3 py-1 rounded-full flex items-center space-x-2`}>
                    {getCategoryIcon(project.category)}
                    <span className="text-white text-xs font-medium">{project.category}</span>
                  </div>

                  {/* Rating */}
                  <div className="absolute top-4 right-4 bg-dark-900/80 px-2 py-1 rounded-full flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-white text-xs">{project.rating}</span>
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-dark-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
                    <Link
                      to={`/project/${project._id}`}
                      className="bg-white text-dark-900 px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 hover:bg-gray-100 hover:scale-105 transition-all duration-300"
                    >
                      <span>Подробнее</span>
                    </Link>
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-dark-800 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 hover:bg-dark-700 hover:scale-105 transition-all duration-300"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Сайт</span>
                    </a>
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3">{project.title}</h3>
                  <p className="text-gray-400 mb-4 leading-relaxed">{project.shortDescription}</p>
                  
                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2">
                    {(() => {
                      let techArray: string[] = [];
                      const techs = project.technologies;
                      
                      if (Array.isArray(techs)) {
                        // If it's already an array, process each element to remove quotes and brackets
                        techArray = techs.map(tech => {
                          if (typeof tech === 'string') {
                            return tech.replace(/[\[\]"]/g, '').trim();
                          }
                          return String(tech).replace(/[\[\]"]/g, '').trim();
                        });
                      } else if (techs && typeof techs === 'string') {
                        try {
                          // Try to parse as JSON if it's a string representation of array
                          const parsed = JSON.parse(techs);
                          if (Array.isArray(parsed)) {
                            // Process each element to remove quotes and brackets
                            techArray = parsed.map(tech => {
                              if (typeof tech === 'string') {
                                return tech.replace(/[\[\]"]/g, '').trim();
                              }
                              return String(tech).replace(/[\[\]"]/g, '').trim();
                            });
                          } else {
                            techArray = [];
                          }
                        } catch (e) {
                          // If parsing fails, treat as comma-separated string
                          const cleanedString = String(techs).replace(/[\[\]"]/g, '');
                          techArray = cleanedString
                            .split(',')
                            .map((tech: string) => tech.trim())
                            .filter((tech: string) => tech.length > 0);
                        }
                      }
                      
                      return techArray.map((tech: string, index: number) => (
                        <span
                          key={index}
                          className="bg-gradient-to-r from-primary-500/10 to-accent-purple/10 border border-primary-500/30 text-gray-300 px-2 py-1 rounded text-xs font-medium hover:from-primary-500 hover:to-accent-purple hover:text-white transition-all duration-300 cursor-pointer shadow-sm hover:shadow-primary-500/20"
                        >
                          {tech}
                        </span>
                      ));
                    })()}
                  </div>
                </div>
              </div>
              ))
            )}
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
                Готовы создать что-то удивительное?
              </h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-lg">
                Наша команда экспертов поможет воплотить ваши идеи в инновационные цифровые решения
              </p>
              <Link
                to="/contacts"
                className="ios-button inline-flex items-center"
              >
                Начать проект
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;