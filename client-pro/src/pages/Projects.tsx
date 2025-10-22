import { useState } from 'react';
import { Plus, Search, ArrowRight, Clock, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEditMode } from '../contexts/EditModeContext';

// Типы для проектов
interface Project {
  id: number;
  name: string;
  description: string;
  category: string;
  budget: string;
  deadline: string;
  status: 'pending' | 'approved' | 'in_progress' | 'completed' | 'rejected';
  createdAt: string;
}

// Моковые данные проектов
const mockProjects: Project[] = [
  {
    id: 1,
    name: 'Интернет-магазин электроники',
    description: 'Разработка интернет-магазина с каталогом товаров, корзиной и личным кабинетом',
    category: 'Веб-разработка',
    budget: '300 000 ₽',
    deadline: '3 месяца',
    status: 'in_progress',
    createdAt: '2025-09-15T10:30:00Z'
  },
  {
    id: 2,
    name: 'Мобильное приложение для фитнеса',
    description: 'Создание приложения для отслеживания тренировок и питания с интеграцией с фитнес-трекерами',
    category: 'Мобильная разработка',
    budget: '450 000 ₽',
    deadline: '4 месяца',
    status: 'approved',
    createdAt: '2025-10-01T14:20:00Z'
  },
  {
    id: 3,
    name: 'Корпоративный сайт для строительной компании',
    description: 'Разработка представительского сайта с каталогом услуг и портфолио проектов',
    category: 'Веб-разработка',
    budget: '200 000 ₽',
    deadline: '2 месяца',
    status: 'pending',
    createdAt: '2025-10-18T09:15:00Z'
  },
  {
    id: 4,
    name: 'CRM система для автосервиса',
    description: 'Разработка системы управления клиентами и заказами для сети автосервисов',
    category: 'Бизнес-приложения',
    budget: '550 000 ₽',
    deadline: '5 месяцев',
    status: 'completed',
    createdAt: '2025-07-10T11:45:00Z'
  },
  {
    id: 5,
    name: 'Чат-бот для службы поддержки',
    description: 'Разработка AI-чат-бота для автоматизации ответов на типовые вопросы клиентов',
    category: 'AI и машинное обучение',
    budget: '280 000 ₽',
    deadline: '2.5 месяца',
    status: 'rejected',
    createdAt: '2025-09-25T16:30:00Z'
  }
];

// Функция для получения статуса проекта
const getStatusInfo = (status: Project['status']) => {
  switch (status) {
    case 'pending':
      return { label: 'На рассмотрении', color: 'bg-yellow-500', icon: <Clock className="w-4 h-4" /> };
    case 'approved':
      return { label: 'Одобрен', color: 'bg-blue-500', icon: <CheckCircle className="w-4 h-4" /> };
    case 'in_progress':
      return { label: 'В работе', color: 'bg-green-500', icon: <ArrowRight className="w-4 h-4" /> };
    case 'completed':
      return { label: 'Завершен', color: 'bg-purple-500', icon: <CheckCircle className="w-4 h-4" /> };
    case 'rejected':
      return { label: 'Отклонен', color: 'bg-red-500', icon: <XCircle className="w-4 h-4" /> };
    default:
      return { label: 'Неизвестно', color: 'bg-gray-500', icon: <AlertTriangle className="w-4 h-4" /> };
  }
};

// Функция для форматирования даты
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
};

export function Projects() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const navigate = useNavigate();
  const { handleNavigation } = useEditMode();

  // Фильтрация проектов
  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Получение уникальных категорий
  const categories = ['all', ...new Set(mockProjects.map(project => project.category))];

  // Обработчик для создания нового проекта
  const handleCreateProject = () => {
    handleNavigation('/projects/create');
  };

  // Обработчик для просмотра деталей проекта
  const handleViewProject = (projectId: number) => {
    handleNavigation(`/projects/${projectId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Мои проекты</h1>
          <p className="text-dark-300">Управление вашими проектами в KolTech</p>
        </div>
        <button 
          className="btn btn-primary flex items-center space-x-2"
          onClick={handleCreateProject}
        >
          <Plus className="w-5 h-5" />
          <span>Создать проект</span>
        </button>
      </div>

      {/* Фильтры и поиск */}
      <div className="card p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-dark-400" />
            </div>
            <input
              type="text"
              placeholder="Поиск проектов..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10 py-2 w-full"
            />
          </div>
          
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="form-select w-full"
            >
              <option value="all">Все категории</option>
              {categories.filter(cat => cat !== 'all').map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-select w-full"
            >
              <option value="all">Все статусы</option>
              <option value="pending">На рассмотрении</option>
              <option value="approved">Одобрен</option>
              <option value="in_progress">В работе</option>
              <option value="completed">Завершен</option>
              <option value="rejected">Отклонен</option>
            </select>
          </div>
        </div>
      </div>

      {/* Список проектов */}
      <div className="space-y-4">
        {filteredProjects.length > 0 ? (
          filteredProjects.map(project => {
            const statusInfo = getStatusInfo(project.status);
            
            return (
              <div 
                key={project.id} 
                className="card p-6 hover:border-primary-500/30 transition-all cursor-pointer"
                onClick={() => handleViewProject(project.id)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-xl font-semibold text-white">{project.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs text-white flex items-center space-x-1 ${statusInfo.color}`}>
                        {statusInfo.icon}
                        <span>{statusInfo.label}</span>
                      </span>
                    </div>
                    <p className="text-dark-300 mb-3 line-clamp-2">{project.description}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-dark-400">Категория</p>
                        <p className="text-sm text-white">{project.category}</p>
                      </div>
                      <div>
                        <p className="text-xs text-dark-400">Бюджет</p>
                        <p className="text-sm text-white">{project.budget}</p>
                      </div>
                      <div>
                        <p className="text-xs text-dark-400">Срок</p>
                        <p className="text-sm text-white">{project.deadline}</p>
                      </div>
                      <div>
                        <p className="text-xs text-dark-400">Создан</p>
                        <p className="text-sm text-white">{formatDate(project.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button className="btn btn-secondary">
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="card p-8 text-center">
            <p className="text-dark-300 mb-4">Проекты не найдены</p>
            <button 
              className="btn btn-primary inline-flex items-center space-x-2"
              onClick={handleCreateProject}
            >
              <Plus className="w-5 h-5" />
              <span>Создать новый проект</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
