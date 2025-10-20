import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Code, Smartphone, Brain, Star, ArrowRight, ChevronRight } from 'lucide-react';
import { projectService } from '../services/api';
import type { Project } from '../types';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

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
      <section className="hero-with-video relative min-h-[50vh] flex items-center overflow-hidden">
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
        </div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-dark-900/80 tech-pattern z-0"></div>
        
        <div className="container mx-auto px-4 sm:px-8 z-10 py-20 sm:py-28">
          <motion.div 
            className="mx-auto text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
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
                P
              </motion.span>
              Наше
              <span className="block text-blue-500 relative">
                Портфолио
                <motion.div
                  className="absolute -bottom-2 left-0 h-1 bg-blue-500/50 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.5, delay: 1 }}
                />
              </span>
            </motion.h1>
        
            <motion.p 
              className="subheading text-gray-300 mb-10 max-w-3xl mx-auto relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Изучите наши лучшие проекты, которые демонстрируют инновационные решения
              в веб-разработке, мобильных приложениях и AI-технологиях
            </motion.p>
            
            {/* Floating icons */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div 
                className="absolute text-blue-500/10"
                style={{ top: '20%', left: '10%' }}
                animate={{ 
                  y: [0, -20, 0],
                  rotate: [0, 10, 0]
                }}
                transition={{ 
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Code className="w-20 h-20" />
              </motion.div>
              
              <motion.div 
                className="absolute text-purple-500/10"
                style={{ bottom: '15%', right: '15%' }}
                animate={{ 
                  y: [0, 20, 0],
                  rotate: [0, -15, 0]
                }}
                transition={{ 
                  duration: 12,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Smartphone className="w-16 h-16" />
              </motion.div>
              
              <motion.div 
                className="absolute text-teal-500/10"
                style={{ top: '40%', right: '25%' }}
                animate={{ 
                  y: [0, 15, 0],
                  x: [0, 10, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{ 
                  duration: 14,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Brain className="w-24 h-24" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="px-4 sm:px-8 mb-12 sm:mb-16 bg-[#0c1222] py-8">
        <div className="container mx-auto">
          <motion.div 
            className="flex flex-wrap justify-center gap-3 sm:gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {['Все проекты', 'Веб-разработка', 'Мобильная разработка', 'AI-решения'].map((category, index) => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`px-5 sm:px-6 py-3 sm:py-3 rounded-xl font-medium text-sm sm:text-base transition-all duration-300 hover:scale-105 ${
                  selectedCategory === category
                    ? 'modern-button'
                    : 'modern-ghost-button'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="px-4 sm:px-8 pb-20 sm:pb-28 bg-[#0c1222]">
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
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={visibleProjects.includes(index) ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gradient-to-br from-[#0f1e3c] to-[#162a54] rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
                style={{
                  boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                {/* Project Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={`http://localhost:5006${project.mainImage}`}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f1e3c]/90 to-transparent" />
                  
                  {/* Category Badge */}
                  <div className={`absolute top-4 left-4 bg-gradient-to-r ${getCategoryColor(project.category)} px-3 py-1 rounded-full flex items-center space-x-2 shadow-lg`}>
                    {getCategoryIcon(project.category)}
                    <span className="text-white text-xs font-medium">{project.category}</span>
                  </div>

                  {/* Rating */}
                  <div className="absolute top-4 right-4 bg-[#0f1e3c]/80 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1 shadow-lg border border-white/10">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-white text-xs">{project.rating}</span>
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-[#0f1e3c]/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                    <Link
                      to={`/project/${project._id}`}
                      className="modern-button px-4 py-2 text-sm flex items-center space-x-2"
                    >
                      <span>Подробнее</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="modern-ghost-button px-4 py-2 text-sm flex items-center"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      <span>Сайт</span>
                    </a>
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-6 relative">
                  {/* Background icon */}
                  <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none">
                    {getCategoryIcon(project.category)}
                  </div>
                  
                  <h3 className="text-2xl font-semibold text-white mb-3">{project.title}</h3>
                  <p className="text-gray-400 mb-5 leading-relaxed text-sm">{project.shortDescription}</p>
                  
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
                          className="bg-[#3b82f6]/10 border border-[#3b82f6]/30 text-gray-300 px-2 py-1 rounded text-xs font-medium hover:bg-[#3b82f6]/20 hover:text-white transition-all duration-300 cursor-pointer shadow-sm"
                        >
                          {tech}
                        </span>
                      ));
                    })()}
                  </div>
                </div>
              </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="content-section">
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
              
              <Link
                to="/contacts"
                className="modern-button inline-flex items-center justify-center text-base px-6 py-3"
              >
                <span>Начать проект</span>
                <ChevronRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;
