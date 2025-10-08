import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Code, Smartphone, Brain, Star, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { projectService } from '../services/api';
import type { Project } from '../types';
import ImageWithLoader from '../components/ImageWithLoader';
import { Helmet } from 'react-helmet-async';

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      
      try {
        const data = await projectService.getProject(id);
        setProject(data);
      } catch (err) {
        console.error('Failed to fetch project:', err);
        setError('Проект не найден');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id]);

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


  if (isLoading) {
    return (
      <div className="bg-dark-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
          <p className="mt-4 text-xl text-gray-300">Загрузка проекта...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="bg-dark-900 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold text-white mb-4">Проект не найден</h1>
          <p className="text-xl text-gray-300 mb-8">{error || 'Запрашиваемый проект не существует'}</p>
          <Link
            to="/portfolio"
            className="inline-flex items-center bg-gradient-to-r from-primary-500 to-accent-purple text-white px-6 py-3 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <ArrowLeft className="mr-2 w-5 h-5" />
            Вернуться к портфолио
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark-900 min-h-screen">
      <Helmet>
        <title>{project.title} | KolTech</title>
        <meta name="description" content={project.shortDescription} />
        <meta name="keywords" content="Корпоративные сайты, E-commerce решения, Веб-приложения, Backend системы, Нативные приложения, Кроссплатформенные, PWA приложения, Enterprise решения, React Native, Flutter, Swift, Kotlin, Dart, Objective-C, Java, Xamarin, Ionic, Cordova, Firebase, SQLite, Realm, Core Data, Room, React, Vue.js, Angular, Node.js, TypeScript, JavaScript, Python, PHP, Next.js, Nuxt.js, Express.js, Django, Laravel, MySQL, Docker, AWS, GraphQL, Чат-боты, CV, Компьютерное зрение, Аналитика, Обработка текста, TensorFlow, PyTorch, OpenAI GPT, Hugging Face, Scikit-learn, Keras, OpenCV, NLTK, spaCy, Pandas, NumPy, Matplotlib, Jupyter, MLflow, Docker, Kubernetes, AWS SageMaker, Google AI, Azure ML, Apache Spark, Elasticsearch, MongoDB, PostgreSQL, Redis, Стратегическое планирование, Техническое консультирование, Безопасность и соответствие, Цифровая трансформация, Бизнес-Акселератор, Быстрый старт, AI-powered решения, Экспертная команда, Глобальный охват, Точное попадание, Надежность, Стратегическое планирование, Техническая реализация, Масштабирование, KolTechLine, FLineHub, KolTechValley, KolTechBusiness, Будущее Цифрового Сотрудничества, " />
        <meta property="og:description" content={project.shortDescription} />
        <meta property="og:type" content="website" />
      </Helmet>
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-6">
        <div className="container mx-auto">
          <Link
            to="/portfolio"
            className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="mr-2 w-5 h-5" />
            Вернуться к портфолио
          </Link>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-2/3">
              <div className="relative rounded-2xl overflow-hidden h-80 sm:h-96">
                {/* Image Carousel */}
                <div className="relative w-full h-full">
                  {project && project.previewImages && project.previewImages.length > 0 ? (
                    <>
                      <ImageWithLoader
                        key={currentImageIndex}
                        src={`https://api.koltech.dev${currentImageIndex === 0 ? project.mainImage : project.previewImages[currentImageIndex - 1]}`}
                        alt={`${project.title} изображение ${currentImageIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {/* Navigation Arrows */}
                      {project.previewImages.length > 0 && (
                        <>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setCurrentImageIndex(prev => prev === 0 ? project.previewImages.length : prev - 1);
                            }}
                            className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-dark-900/70 text-white p-1.5 sm:p-2 rounded-full hover:bg-dark-900/90 transition z-10"
                          >
                            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setCurrentImageIndex(prev => prev === project.previewImages.length ? 0 : prev + 1);
                            }}
                            className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-dark-900/70 text-white p-1.5 sm:p-2 rounded-full hover:bg-dark-900/90 transition z-10"
                          >
                            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        </>
                      )}
                      {/* Image Indicators */}
                      <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1.5 sm:space-x-2 z-10">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setCurrentImageIndex(0);
                          }}
                          className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${currentImageIndex === 0 ? 'bg-white' : 'bg-white/50'}`}
                        />
                        {project.previewImages.map((_, index) => (
                          <button
                            key={index}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setCurrentImageIndex(index + 1);
                            }}
                            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${currentImageIndex === index + 1 ? 'bg-white' : 'bg-white/50'}`}
                          />
                        ))}
                      </div>
                    </>
                  ) : (
                    <ImageWithLoader
                      key="main-image"
                      src={`https://api.koltech.dev${project.mainImage}`}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  )}
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
                </div>
              </div>
            </div>
            
            <div className="md:w-1/3">
              <h1 className="text-4xl font-bold text-white mb-4">{project.title}</h1>
              <p className="text-xl text-gray-300 mb-6">{project.shortDescription}</p>
              
              <div className="flex items-center mb-6">
                <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-gray-400">
                  {new Date(project.createdAt).toLocaleDateString('ru-RU', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-gradient-to-r from-primary-500 to-accent-purple text-white px-6 py-3 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 mb-8"
              >
                Посмотреть проект
                <ExternalLink className="ml-2 w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="px-6 pb-12">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-white mb-6">Технологии</h2>
          <div className="flex flex-wrap gap-3">
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
                  className="bg-gradient-to-r from-primary-500/10 to-accent-purple/10 border border-primary-500/30 text-gray-300 px-4 py-2 rounded-lg font-medium hover:from-primary-500 hover:to-accent-purple hover:text-white transition-all duration-300 cursor-pointer shadow-lg hover:shadow-primary-500/20"
                >
                  {tech}
                </span>
              ));
            })()}
          </div>
        </div>
      </section>

      {/* Detailed Description Section */}
      <section className="px-6 pb-20">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-white mb-6">О проекте</h2>
          <div className="bg-dark-800 border border-dark-700 rounded-2xl p-8">
            <div className="text-gray-300 leading-relaxed whitespace-pre-line">
              {project.fullDescription}
            </div>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-dark-700 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-2">Категория</h3>
                <div className="flex items-center">
                  {getCategoryIcon(project.category)}
                  <span className="ml-2 text-gray-300">{project.category}</span>
                </div>
              </div>
              
              <div className="bg-dark-700 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-2">Рейтинг</h3>
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                  <span className="text-gray-300">{project.rating}/5</span>
                </div>
              </div>
              
              <div className="bg-dark-700 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-2">Статус</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  project.featured 
                    ? 'bg-green-900/30 text-green-400 border border-green-800' 
                    : 'bg-blue-900/30 text-blue-400 border border-blue-800'
                }`}>
                  {project.featured ? 'Избранный проект' : 'Стандартный проект'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 pb-20">
        <div className="container mx-auto">
          <div className="bg-gradient-to-br from-dark-800 to-dark-700 p-12 rounded-3xl border border-dark-600 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Готовы создать что-то удивительное?
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Наша команда экспертов поможет воплотить ваши идеи в инновационные цифровые решения
            </p>
            <Link
              to="/contacts"
              className="inline-flex items-center bg-gradient-to-r from-primary-500 to-accent-purple text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Начать проект
              <ExternalLink className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default ProjectDetail;