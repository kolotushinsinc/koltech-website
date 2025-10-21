import { useState, useEffect } from 'react';
import { 
  Plus, FolderKanban, Clock, CheckCircle, Pause, X, Search, Filter, 
  Edit, Trash2, MoreVertical, Calendar, ArrowUpDown, Download,
  Home, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockProjects, type Project } from '../data/mockData';
import { Modal } from '../components/Modal';

export function Projects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'title' | 'created_at' | 'status'>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Filter and sort projects
  const filteredProjects = projects
    .filter(project => {
      // Apply search filter
      if (searchTerm && !project.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !project.description.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Apply status filter
      if (statusFilter && project.status !== statusFilter) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Apply sorting
      if (sortBy === 'title') {
        return sortDirection === 'asc' 
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else if (sortBy === 'created_at') {
        return sortDirection === 'asc'
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (sortBy === 'status') {
        return sortDirection === 'asc'
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      }
      return 0;
    });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock className="w-5 h-5" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5" />;
      case 'on_hold':
        return <Pause className="w-5 h-5" />;
      default:
        return <FolderKanban className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'completed':
        return 'bg-primary-500/20 text-primary-400 border-primary-500/30';
      case 'on_hold':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default:
        return 'bg-dark-500/20 text-dark-300 border-dark-500/30';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Активный';
      case 'completed':
        return 'Завершен';
      case 'on_hold':
        return 'На паузе';
      default:
        return status;
    }
  };

  const handleSort = (field: 'title' | 'created_at' | 'status') => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
    setShowDeleteConfirm(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center text-dark-400 text-sm mb-2">
            <Home className="w-4 h-4 mr-1" />
            <span className="cursor-pointer hover:text-white" onClick={() => navigate('/')}>Главная</span>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="text-white">Проекты</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Проекты</h1>
          <p className="text-dark-300">Управляйте вашими проектами</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary px-6 py-3"
        >
          <Plus className="w-5 h-5 mr-2" />
          Создать проект
        </button>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-dark-400" />
          </div>
          <input
            type="text"
            placeholder="Поиск проектов..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-10"
          />
        </div>
        
        <div className="flex gap-3">
          <select 
            value={statusFilter || ''} 
            onChange={(e) => setStatusFilter(e.target.value || null)}
            className="form-select"
          >
            <option value="">Все статусы</option>
            <option value="active">Активные</option>
            <option value="completed">Завершенные</option>
            <option value="on_hold">На паузе</option>
          </select>
          
          <button 
            onClick={() => handleSort('created_at')}
            className="btn btn-secondary flex items-center"
          >
            <Calendar className="w-5 h-5 mr-2" />
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Projects grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className={`card p-6 cursor-pointer group ${isLoading ? 'opacity-0' : 'animate-scale'}`}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => navigate(`/projects/${project.id}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`${getStatusColor(project.status).split(' ')[0]} p-3 rounded-lg`}>
                  {getStatusIcon(project.status)}
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`badge ${getStatusColor(project.status)}`}>
                    {getStatusLabel(project.status)}
                  </span>
                  <div className="relative">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDeleteConfirm(project.id);
                      }}
                      className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-dark-700 transition-opacity"
                    >
                      <MoreVertical className="w-5 h-5 text-dark-300" />
                    </button>
                    
                    {showDeleteConfirm === project.id && (
                      <div className="dropdown-menu animate-fade-in">
                        <button className="dropdown-item">
                          <Edit className="w-4 h-4 mr-2" />
                          <span>Редактировать</span>
                        </button>
                        <button 
                          className="dropdown-item text-red-400 hover:bg-red-500/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProject(project.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          <span>Удалить</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <h3 className="card-title mb-2">{project.title}</h3>
              <p className="text-dark-300 text-sm line-clamp-2 mb-4">
                {project.description || 'Нет описания'}
              </p>
              <div className="flex items-center text-dark-400 text-xs">
                <Calendar className="w-4 h-4 mr-1" />
                <span>{new Date(project.created_at).toLocaleDateString('ru-RU')}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-12 flex flex-col items-center justify-center text-center">
          <FolderKanban className="w-16 h-16 text-dark-500 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Проекты не найдены</h3>
          <p className="text-dark-300 mb-6">
            {searchTerm || statusFilter 
              ? 'Попробуйте изменить параметры поиска или фильтры'
              : 'Создайте свой первый проект, нажав кнопку "Создать проект"'}
          </p>
          {(searchTerm || statusFilter) && (
            <button 
              onClick={() => {
                setSearchTerm('');
                setStatusFilter(null);
              }}
              className="btn btn-secondary"
            >
              Сбросить фильтры
            </button>
          )}
        </div>
      )}


      {/* Create project modal */}
      {showCreateModal && (
        <CreateProjectModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}


function CreateProjectModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal isOpen={true} onClose={onClose} title="Новый проект" maxWidth="xl">
      <form className="space-y-4">
          <div className="form-group">
            <label className="form-label">Название проекта</label>
            <input
              type="text"
              className="form-input"
              placeholder="Введите название проекта"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Описание</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Подробное описание проекта..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Статус</label>
            <select className="form-select">
              <option value="active">Активный</option>
              <option value="on_hold">На паузе</option>
              <option value="completed">Завершен</option>
            </select>
          </div>

          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onClose}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Создать проект
            </button>
          </div>
        </form>
    </Modal>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case 'active':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'completed':
      return 'bg-primary-500/20 text-primary-400 border-primary-500/30';
    case 'on_hold':
      return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    default:
      return 'bg-dark-500/20 text-dark-300 border-dark-500/30';
  }
}
