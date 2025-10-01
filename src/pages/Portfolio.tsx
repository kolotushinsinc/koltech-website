import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Code, Smartphone, Brain, Star } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

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
  const [visibleProjects, setVisibleProjects] = useState<number[]>([]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Animate projects appearing one by one
      projects.forEach((_, index) => {
        setTimeout(() => {
          setVisibleProjects(prev => [...prev, index]);
        }, index * 200);
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const projects = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      description: 'Современная платформа электронной коммерции с AI-рекомендациями',
      category: 'Веб-разработка',
      image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'AI/ML'],
      link: '#',
      rating: 5
    },
    {
      id: 2,
      title: 'FinTech Mobile App',
      description: 'Мобильное приложение для управления финансами с блокчейн интеграцией',
      category: 'Мобильная разработка',
      image: 'https://images.pexels.com/photos/867464/pexels-photo-867464.jpeg',
      technologies: ['React Native', 'Blockchain', 'TypeScript'],
      link: '#',
      rating: 5
    },
    {
      id: 3,
      title: 'AI Assistant Platform',
      description: 'Интеллектуальная платформа с машинным обучением для бизнес-аналитики',
      category: 'AI-решения',
      image: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg',
      technologies: ['Python', 'TensorFlow', 'FastAPI', 'Docker'],
      link: '#',
      rating: 5
    },
    {
      id: 4,
      title: 'Healthcare Management System',
      description: 'Комплексная система управления медицинскими данными',
      category: 'Веб-разработка',
      image: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg',
      technologies: ['Vue.js', 'Django', 'PostgreSQL'],
      link: '#',
      rating: 5
    },
    {
      id: 5,
      title: 'Smart IoT Dashboard',
      description: 'Панель управления IoT устройствами в реальном времени',
      category: 'Веб-разработка',
      image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg',
      technologies: ['Angular', 'Socket.io', 'MongoDB'],
      link: '#',
      rating: 5
    },
    {
      id: 6,
      title: 'AR Shopping Experience',
      description: 'Мобильное приложение с дополненной реальностью для покупок',
      category: 'Мобильная разработка',
      image: 'https://images.pexels.com/photos/3761018/pexels-photo-3761018.jpeg',
      technologies: ['Unity', 'ARKit', 'C#'],
      link: '#',
      rating: 4
    }
  ];

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
    <div className="min-h-screen bg-dark-900">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-6">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 bounce-in">
            Наше
            <span className="gradient-text block mt-2">Портфолио</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto fade-in-delay">
            Изучите наши лучшие проекты, которые демонстрируют инновационные решения 
            в веб-разработке, мобильных приложениях и AI-технологиях
          </p>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="px-6 mb-12">
        <div className="container mx-auto">
          <div className="flex flex-wrap justify-center gap-4 slide-up">
            {['Все проекты', 'Веб-разработка', 'Мобильная разработка', 'AI-решения'].map((category) => (
              <button
                key={category}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${
                  category === 'Все проекты'
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
      <section className="px-6 pb-20">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              // Show skeleton cards while loading
              Array.from({ length: 6 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))
            ) : (
              projects.map((project, index) => (
              <div
                key={project.id}
                className={`bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden card-hover group transition-all duration-500 ${
                  visibleProjects.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                {/* Project Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={project.image}
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
                  <div className="absolute inset-0 bg-dark-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <a
                      href={project.link}
                      className="bg-white text-dark-900 px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 hover:bg-gray-100 hover:scale-105 transition-all duration-300"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Посмотреть</span>
                    </a>
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3">{project.title}</h3>
                  <p className="text-gray-400 mb-4 leading-relaxed">{project.description}</p>
                  
                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="bg-dark-700 text-gray-300 px-2 py-1 rounded text-xs font-medium hover:bg-primary-500 hover:text-white transition-colors cursor-pointer"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 pb-20">
        <div className="container mx-auto">
          <div className="bg-gradient-to-br from-dark-800 to-dark-700 p-12 rounded-3xl border border-dark-600 text-center slide-up">
            <h2 className="text-3xl font-bold text-white mb-4">
              Готовы создать что-то удивительное?
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Наша команда экспертов поможет воплотить ваши идеи в инновационные цифровые решения
            </p>
            <Link
              to="/contacts"
              className="inline-flex items-center bg-gradient-to-r from-primary-500 to-accent-purple text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 pulse-glow"
            >
              Начать проект
              <ExternalLink className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Portfolio;