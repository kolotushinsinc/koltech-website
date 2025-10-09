import { useState, useEffect } from 'react';
import { Plus, FolderKanban, Clock, CheckCircle, Pause, X, ExternalLink, Code, Smartphone, Brain, Star, ChevronLeft, ChevronRight, Edit } from 'lucide-react';
import axios from 'axios';
import { CreateProjectModal } from '../components/CreateProjectModal';
import { EditProjectModal } from '../components/EditProjectModal';

interface Project {
  _id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  technologies: string[];
  link: string;
  rating: number;
  featured: boolean;
  status: 'active' | 'completed' | 'on_hold';
  mainImage: string;
  previewImages: string[];
  createdAt: string;
  updatedAt: string;
}

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

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleProjects, setVisibleProjects] = useState<number[]>([]);

  // Загрузка проектов с сервера
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('https://api.koltech.dev/api/projects', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.data.success) {
          setProjects(response.data.projects);
          
          // Animate projects appearing one by one
          response.data.projects.forEach((_: any, index: number) => {
            setTimeout(() => {
              setVisibleProjects(prev => [...prev, index]);
            }, index * 200);
          });
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleCreateProject = async (projectData: any) => {
    try {
      const projectFormData = new FormData();
      projectFormData.append('title', projectData.title);
      projectFormData.append('shortDescription', projectData.shortDescription);
      projectFormData.append('fullDescription', projectData.fullDescription);
      projectFormData.append('category', projectData.category);
      projectFormData.append('technologies', JSON.stringify(projectData.technologies || []));
      projectFormData.append('link', projectData.link || '');
      projectFormData.append('rating', projectData.rating || '0');
      projectFormData.append('featured', projectData.featured || 'false');
      projectFormData.append('status', projectData.status || 'active');
      
      if (projectData.mainImage) {
        projectFormData.append('mainImage', projectData.mainImage);
      }
      
      projectData.previewImages.forEach((image: File) => {
        projectFormData.append('previewImages', image);
      });

      const response = await axios.post('https://api.koltech.dev/api/projects', projectFormData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        },
        // Увеличиваем таймаут для больших файлов
        timeout: 60000 // 60 секунд
      });

      if (response.data.success) {
        setProjects(prev => [response.data.project, ...prev]);
        setIsCreateModalOpen(false);
        alert('Проект успешно создан!');
      }
    } catch (error: any) {
      console.error('Error creating project:', error);
      if (error.response) {
        // Ошибка ответа от сервера
        if (error.response.status === 413) {
          alert('Ошибка: Размер файла превышает допустимый лимит (10MB). Пожалуйста, выберите файлы меньшего размера.');
        } else {
          alert(`Ошибка при создании проекта: ${error.response.data.message || 'Неизвестная ошибка'}`);
        }
      } else if (error.request) {
        // Ошибка запроса (нет ответа)
        alert('Ошибка: Не удалось подключиться к серверу. Пожалуйста, проверьте подключение к интернету.');
      } else {
        // Другая ошибка
        alert(`Ошибка: ${error.message}`);
      }
    }
  };

  const handleUpdateProject = async (projectData: any) => {
    try {
      setProjects(prev =>
        prev.map(project =>
          project._id === projectData._id ? projectData : project
        )
      );
      setEditingProject(null);
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

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
          <p className="mt-4 text-xl text-gray-300">Загрузка проектов...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark-900 min-h-screen">
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-6">
        <div className="container mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 bounce-in">
              Управление
              <span className="gradient-text block mt-2">Проектами</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl">
              Управляйте вашими проектами, создавайте новые и отслеживайте их статус
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-purple text-white font-semibold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 pulse-glow"
          >
            <Plus className="w-5 h-5 mr-2" />
            Создать проект
          </button>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="px-6 pb-20">
        <div className="container mx-auto">
          {projects.length === 0 ? (
            <div className="bg-dark-800 border border-dark-700 rounded-3xl p-12 text-center">
              <FolderKanban className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Нет проектов</h3>
              <p className="text-gray-400 mb-6">
                У вас пока нет проектов. Создайте первый проект, чтобы начать работу.
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-purple text-white font-semibold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 mx-auto"
              >
                <Plus className="w-5 h-5 mr-2" />
                Создать проект
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <div
                  key={project._id}
                  className={`bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden card-hover group transition-all duration-500 ${
                    visibleProjects.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  onClick={() => setSelectedProject(project)}
                >
                  {/* Project Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={project.mainImage ? (project.mainImage.startsWith('/uploads') ? `https://api.koltech.dev${project.mainImage}` : `https://api.koltech.dev/uploads${project.mainImage}`) : '/placeholder-image.jpg'}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
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
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProject(project);
                        }}
                        className="bg-white text-dark-900 px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 hover:bg-gray-100 hover:scale-105 transition-all duration-300"
                      >
                        <span>Подробнее</span>
                      </button>
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
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
                  
                  {/* Edit Button */}
                  <div className="mt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingProject(project);
                      }}
                      className="w-full flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Редактировать
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateProject={handleCreateProject}
      />
      
      <EditProjectModal
        isOpen={!!editingProject}
        onClose={() => setEditingProject(null)}
        onUpdateProject={handleUpdateProject}
        project={editingProject}
      />
    </div>
  );
}

function ProjectDetailModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-dark-800 rounded-xl max-w-4xl w-full border border-dark-700 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-dark-800 border-b border-dark-700 p-6 z-10 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">{project.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Image Carousel */}
          <div className="relative rounded-2xl overflow-hidden h-96 mb-8">
            <div className="relative w-full h-full">
              {project && project.previewImages && project.previewImages.length > 0 ? (
                <>
                  <img
                    src={`https://api.koltech.dev${currentImageIndex === 0 ? (project.mainImage || '') : (project.previewImages && project.previewImages[currentImageIndex - 1] ? project.previewImages[currentImageIndex - 1].startsWith('/uploads') ? project.previewImages[currentImageIndex - 1] : `/uploads${project.previewImages[currentImageIndex - 1]}` : '')}`}
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
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-dark-900/70 text-white p-2 rounded-full hover:bg-dark-900/90 transition z-10"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setCurrentImageIndex(prev => prev === project.previewImages.length ? 0 : prev + 1);
                        }}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-dark-900/70 text-white p-2 rounded-full hover:bg-dark-900/90 transition z-10"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                  {/* Image Indicators */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setCurrentImageIndex(0);
                      }}
                      className={`w-3 h-3 rounded-full ${currentImageIndex === 0 ? 'bg-white' : 'bg-white/50'}`}
                    />
                    {project.previewImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setCurrentImageIndex(index + 1);
                        }}
                        className={`w-3 h-3 rounded-full ${currentImageIndex === index + 1 ? 'bg-white' : 'bg-white/50'}`}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <img
                  src={project.mainImage ? (project.mainImage.startsWith('/uploads') ? `https://api.koltech.dev${project.mainImage}` : `https://api.koltech.dev/uploads${project.mainImage}`) : '/placeholder-image.jpg'}
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

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">Краткое описание</h3>
              <p className="text-white text-lg">{project.shortDescription}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">Полное описание</h3>
              <div className="text-gray-300 leading-relaxed whitespace-pre-line bg-dark-700/50 p-4 rounded-lg">
                {project.fullDescription}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">Технологии</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="bg-gradient-to-r from-primary-500/10 to-accent-purple/10 border border-primary-500/30 text-gray-300 px-3 py-2 rounded-lg font-medium hover:from-primary-500 hover:to-accent-purple hover:text-white transition-all duration-300 cursor-pointer shadow-lg hover:shadow-primary-500/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">Ссылка на проект</h3>
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-400 hover:text-primary-300 transition-colors flex items-center"
              >
                {project.link}
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Создан</h3>
                <p className="text-white">
                  {new Date(project.createdAt).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Обновлен</h3>
                <p className="text-white">
                  {new Date(project.updatedAt).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
