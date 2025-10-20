import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Code, Smartphone, Brain, Star, Calendar, ChevronLeft, ChevronRight, ChevronRight as ChevronRightIcon, Download, ZoomIn } from 'lucide-react';
import { projectService } from '../services/api';
import type { Project } from '../types';
import ImageWithLoader from '../components/ImageWithLoader';
import { ImageModal } from '../components/ImageModal';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        return <Code className="w-5 h-5 text-white" />;
      case 'Мобильная разработка':
        return <Smartphone className="w-5 h-5 text-white" />;
      case 'AI-решения':
        return <Brain className="w-5 h-5 text-white" />;
      default:
        return <Code className="w-5 h-5 text-white" />;
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
          <Link
            to="/portfolio"
            className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="mr-2 w-5 h-5" />
            Вернуться к портфолио
          </Link>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-2/3">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative rounded-2xl overflow-hidden h-80 sm:h-96 dimensional-card card-blue p-0"
              >
                {/* Image Carousel */}
                <div className="relative w-full h-full">
                  {project && project.previewImages && project.previewImages.length > 0 ? (
                    <>
                      <div 
                        className="w-full h-full cursor-pointer"
                        onClick={() => setIsModalOpen(true)}
                      >
                        <ImageWithLoader
                          key={currentImageIndex}
                          src={`http://localhost:5006${currentImageIndex === 0 ? project.mainImage : project.previewImages[currentImageIndex - 1]}`}
                          alt={`${project.title} изображение ${currentImageIndex + 1}`}
                          className="w-full h-full object-cover"
                          skeletonClassName="bg-dark-800/80 backdrop-blur-sm"
                        />
                        
                        {/* Zoom Icon Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-dark-900/30">
                          <div className="bg-dark-900/80 p-3 rounded-full">
                            <ZoomIn className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      </div>
                      
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
                            aria-label="Предыдущее изображение"
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
                            aria-label="Следующее изображение"
                          >
                            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        </>
                      )}
                      
                      {/* Image Indicators and Download Button */}
                      <div className="absolute bottom-0 inset-x-0 flex justify-between items-center p-2 sm:p-4 bg-gradient-to-t from-dark-900/80 to-transparent z-10">
                        {/* Image Indicators */}
                        <div className="flex space-x-1.5 sm:space-x-2 overflow-x-auto scrollbar-hide">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setCurrentImageIndex(0);
                            }}
                            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0 ${currentImageIndex === 0 ? 'bg-white' : 'bg-white/50'}`}
                            aria-label="Показать главное изображение"
                          />
                          {project.previewImages.map((_, index) => (
                            <button
                              key={index}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setCurrentImageIndex(index + 1);
                              }}
                              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0 ${currentImageIndex === index + 1 ? 'bg-white' : 'bg-white/50'}`}
                              aria-label={`Показать изображение ${index + 2}`}
                            />
                          ))}
                        </div>
                        
                        {/* Download Button */}
                        <a
                          href={`http://localhost:5006${currentImageIndex === 0 ? project.mainImage : project.previewImages[currentImageIndex - 1]}`}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="bg-dark-900/70 text-white p-1.5 sm:p-2 rounded-full hover:bg-dark-900/90 transition"
                          aria-label="Скачать изображение"
                        >
                          <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                        </a>
                      </div>
                    </>
                  ) : (
                    <div 
                      className="w-full h-full cursor-pointer"
                      onClick={() => setIsModalOpen(true)}
                    >
                      <ImageWithLoader
                        key="main-image"
                        src={`http://localhost:5006${project.mainImage}`}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        skeletonClassName="bg-dark-800/80 backdrop-blur-sm"
                      />
                      
                      {/* Zoom Icon Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-dark-900/30">
                        <div className="bg-dark-900/80 p-3 rounded-full">
                          <ZoomIn className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      
                      {/* Download Button */}
                      <div className="absolute bottom-0 inset-x-0 flex justify-end p-2 sm:p-4 bg-gradient-to-t from-dark-900/80 to-transparent">
                        <a
                          href={`http://localhost:5006${project.mainImage}`}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="bg-dark-900/70 text-white p-1.5 sm:p-2 rounded-full hover:bg-dark-900/90 transition"
                          aria-label="Скачать изображение"
                        >
                          <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                        </a>
                      </div>
                    </div>
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
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="md:w-1/3"
            >
              <h1 className="heading-xl text-white mb-4">{project.title}</h1>
              <p className="subheading mb-6">{project.shortDescription}</p>
              
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
                className="modern-button button-blue inline-flex items-center justify-center"
              >
                <span>Посмотреть проект</span>
                <ExternalLink className="ml-2 w-4 h-4" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="content-section section-dark py-20 sm:py-28 bg-[#0c1222]">
        <div className="container mx-auto px-4 sm:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="heading-lg text-white mb-4">Технологии</h2>
            <p className="subheading max-w-2xl mx-auto">
              Стек технологий, использованных в проекте
            </p>
          </motion.div>
          
          <div className="flex flex-wrap gap-3 justify-center">
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
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.05 * index }}
                  whileHover={{ scale: 1.05 }}
                  className="group px-5 py-2.5 rounded-xl font-medium text-white bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                  <span className="relative z-10">
                    {tech}
                  </span>
                </motion.span>
              ));
            })()}
          </div>
        </div>
      </section>

      {/* Detailed Description Section */}
      <section className="content-section section-gradient py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="heading-lg text-white mb-4">О проекте</h2>
            <p className="subheading max-w-2xl mx-auto">
              Подробное описание и детали реализации
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="dimensional-card card-blue p-8 relative overflow-hidden"
          >
            <div className="text-gray-300 leading-relaxed whitespace-pre-line mb-8">
              {project.fullDescription}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="dimensional-card card-purple p-6 text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="icon-container icon-purple">
                    {getCategoryIcon(project.category)}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Категория</h3>
                <p className="text-gray-300">{project.category}</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="dimensional-card card-blue p-6 text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="icon-container icon-blue">
                    <Star className="w-5 h-5 text-white relative z-10" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Рейтинг</h3>
                <p className="text-gray-300">{project.rating}/5</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="dimensional-card card-teal p-6 text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="icon-container icon-teal">
                    <Star className="w-5 h-5 text-white relative z-10" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Статус</h3>
                <p className="text-gray-300">{project.featured ? 'Избранный проект' : 'Стандартный проект'}</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="content-section py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-8">
          <motion.div 
            className="dimensional-card card-blue p-8 sm:p-12 text-center sm:text-left relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="sm:flex items-center justify-between">
              <div className="mb-8 sm:mb-0 sm:mr-8">
                <h2 className="heading-lg text-white mb-4">Готовы создать что-то удивительное?</h2>
                <p className="subheading max-w-xl mb-0">
                  Наша команда экспертов поможет воплотить ваши идеи в инновационные цифровые решения
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/contacts"
                  className="modern-button button-blue inline-flex items-center justify-center text-base px-6 py-3"
                >
                  <span>Начать проект</span>
                  <ChevronRightIcon className="ml-2 w-5 h-5" />
                </Link>
                
                <Link
                  to="/portfolio"
                  className="modern-ghost-button inline-flex items-center justify-center text-base px-6 py-3"
                >
                  <span>Другие проекты</span>
                  <ArrowLeft className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Image Modal */}
      {project && (
        <ImageModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          images={[project.mainImage, ...(project.previewImages || [])]}
          initialIndex={currentImageIndex}
          baseUrl="http://localhost:5006"
        />
      )}
    </div>
  );
};

export default ProjectDetail;
