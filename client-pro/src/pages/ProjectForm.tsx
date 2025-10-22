import { useState, useEffect } from 'react';
import { 
  ArrowLeft, Save, AlertTriangle, Trash2, Calendar, 
  Clock, CheckCircle, AlertCircle, Home, ChevronRight
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Modal } from '../components/Modal';
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

// Моковые данные проектов (те же, что и в Projects.tsx)
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

// Категории проектов
const projectCategories = [
  'Веб-разработка',
  'Мобильная разработка',
  'Бизнес-приложения',
  'AI и машинное обучение',
  'Дизайн и UX/UI',
  'Интеграция систем',
  'Консалтинг',
  'Другое'
];

// Функция для получения статуса проекта
const getStatusInfo = (status: Project['status']) => {
  switch (status) {
    case 'pending':
      return { label: 'На рассмотрении', color: 'bg-yellow-500', icon: <Clock className="w-4 h-4" /> };
    case 'approved':
      return { label: 'Одобрен', color: 'bg-blue-500', icon: <CheckCircle className="w-4 h-4" /> };
    case 'in_progress':
      return { label: 'В работе', color: 'bg-green-500', icon: <Clock className="w-4 h-4" /> };
    case 'completed':
      return { label: 'Завершен', color: 'bg-purple-500', icon: <CheckCircle className="w-4 h-4" /> };
    case 'rejected':
      return { label: 'Отклонен', color: 'bg-red-500', icon: <AlertCircle className="w-4 h-4" /> };
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

export function ProjectForm() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const isCreateMode = projectId === 'create';
  
  // Используем контекст режима редактирования
  const { isEditMode, setIsEditMode, handleNavigation } = useEditMode();
  
  // Состояния для проекта и модальных окон
  const [project, setProject] = useState<Project | null>(null);
  const [editedProject, setEditedProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSaveConfirmModal, setShowSaveConfirmModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showExitConfirmModal, setShowExitConfirmModal] = useState(false);
  
  // Загрузка данных проекта
  useEffect(() => {
    if (isCreateMode) {
      // Создаем новый проект
      const newProject: Project = {
        id: Math.max(...mockProjects.map(p => p.id)) + 1,
        name: '',
        description: '',
        category: projectCategories[0],
        budget: '',
        deadline: '',
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      setProject(newProject);
      setEditedProject(JSON.parse(JSON.stringify(newProject)));
      setIsEditMode(true);
    } else if (projectId) {
      // Загружаем существующий проект
      const foundProject = mockProjects.find(p => p.id === parseInt(projectId));
      
      if (foundProject) {
        setProject(foundProject);
        setEditedProject(JSON.parse(JSON.stringify(foundProject)));
      }
    }
    
    setIsLoading(false);
  }, [projectId, isCreateMode, setIsEditMode]);
  
  // Обработчик навигации назад
  const handleBack = () => {
    handleNavigation('/projects');
  };
  
  // Обработчик выхода из режима редактирования
  const handleExitEditMode = () => {
    setShowExitConfirmModal(false);
    setIsEditMode(false);
    
    // Сбрасываем изменения
    if (project) {
      setEditedProject(JSON.parse(JSON.stringify(project)));
    }
    
    // Если это создание нового проекта, возвращаемся к списку
    if (isCreateMode) {
      navigate('/projects');
    }
  };
  
  // Обработчик сохранения проекта
  const handleSave = () => {
    setShowSaveConfirmModal(false);
    
    // В реальном приложении здесь был бы запрос к API
    if (editedProject) {
      setProject(editedProject);
      setIsEditMode(false);
      
      // Если это создание нового проекта, возвращаемся к списку
      if (isCreateMode) {
        navigate('/projects');
      }
    }
  };
  
  // Обработчик удаления проекта
  const handleDelete = () => {
    setShowDeleteConfirmModal(false);
    
    // В реальном приложении здесь был бы запрос к API
    navigate('/projects');
  };
  
  // Обработчик изменения полей проекта
  const handleChange = (field: keyof Project, value: string) => {
    if (editedProject) {
      setEditedProject({
        ...editedProject,
        [field]: value
      });
    }
  };
  
  if (isLoading) {
    return <div className="p-8 text-center text-white">Загрузка...</div>;
  }
  
  if (!editedProject) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Проект не найден</h2>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/projects')}
        >
          Вернуться к списку проектов
        </button>
      </div>
    );
  }
  
  return (
    <>
      <div className="space-y-6 animate-fade-in">
        {/* Хлебные крошки */}
          <div className="flex items-center text-dark-400 text-sm mb-2">
            <Home className="w-4 h-4 mr-1" />
            <span className="cursor-pointer hover:text-white" onClick={() => handleNavigation('/')}>Главная</span>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="cursor-pointer hover:text-white" onClick={() => handleNavigation('/projects')}>Проекты</span>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="text-white">{isCreateMode ? 'Новый проект' : editedProject.name}</span>
          </div>
        
        {/* Заголовок */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">
            {isCreateMode ? 'Создание проекта' : editedProject.name}
          </h1>
          <div className="flex space-x-2">
            {isEditMode ? (
              <>
                <button 
                  className="btn btn-secondary"
                  onClick={() => setShowExitConfirmModal(true)}
                >
                  Отменить
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowSaveConfirmModal(true)}
                >
                  <Save className="w-5 h-5 mr-2" />
                  Сохранить
                </button>
              </>
            ) : (
              <>
                <button 
                  className="btn btn-secondary"
                  onClick={handleBack}
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Назад
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={() => setIsEditMode(true)}
                >
                  Редактировать
                </button>
              </>
            )}
          </div>
        </div>
        
        {/* Содержимое формы */}
        <div className="space-y-6">
          {/* Название проекта */}
          <div className="card p-6">
            <h3 className="text-sm font-medium text-dark-300 mb-4">Название проекта</h3>
            {isEditMode ? (
              <input
                type="text"
                className="form-input w-full"
                value={editedProject.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Введите название проекта"
              />
            ) : (
              <p className="text-white">{editedProject.name}</p>
            )}
          </div>
          
          {/* Описание проекта */}
          <div className="card p-6">
            <h3 className="text-sm font-medium text-dark-300 mb-4">Описание проекта</h3>
            {isEditMode ? (
              <textarea
                className="form-textarea w-full"
                rows={6}
                value={editedProject.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Опишите ваш проект подробно"
              />
            ) : (
              <p className="text-white whitespace-pre-wrap">{editedProject.description || 'Нет описания'}</p>
            )}
          </div>
          
          {/* Категория и бюджет */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="text-sm font-medium text-dark-300 mb-4">Категория</h3>
              {isEditMode ? (
                <select
                  className="form-select w-full"
                  value={editedProject.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                >
                  {projectCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              ) : (
                <p className="text-white">{editedProject.category}</p>
              )}
            </div>
            
            <div className="card p-6">
              <h3 className="text-sm font-medium text-dark-300 mb-4">Бюджет</h3>
              {isEditMode ? (
                <input
                  type="text"
                  className="form-input w-full"
                  value={editedProject.budget}
                  onChange={(e) => handleChange('budget', e.target.value)}
                  placeholder="Например: 300 000 ₽"
                />
              ) : (
                <p className="text-white">{editedProject.budget}</p>
              )}
            </div>
          </div>
          
          {/* Срок и статус */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="text-sm font-medium text-dark-300 mb-4">Срок выполнения</h3>
              {isEditMode ? (
                <input
                  type="text"
                  className="form-input w-full"
                  value={editedProject.deadline}
                  onChange={(e) => handleChange('deadline', e.target.value)}
                  placeholder="Например: 3 месяца"
                />
              ) : (
                <p className="text-white">{editedProject.deadline}</p>
              )}
            </div>
            
            <div className="card p-6">
              <h3 className="text-sm font-medium text-dark-300 mb-4">Статус</h3>
              {isEditMode && !isCreateMode ? (
                <select
                  className="form-select w-full"
                  value={editedProject.status}
                  onChange={(e) => handleChange('status', e.target.value as Project['status'])}
                >
                  <option value="pending">На рассмотрении</option>
                  <option value="approved">Одобрен</option>
                  <option value="in_progress">В работе</option>
                  <option value="completed">Завершен</option>
                  <option value="rejected">Отклонен</option>
                </select>
              ) : (
                <div className="flex items-center">
                  {getStatusInfo(editedProject.status).icon}
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs text-white ${getStatusInfo(editedProject.status).color}`}>
                    {getStatusInfo(editedProject.status).label}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Дата создания */}
          <div className="card p-6">
            <h3 className="text-sm font-medium text-dark-300 mb-4">Дата создания</h3>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-primary-400 mr-3" />
              <p className="text-white">{formatDate(editedProject.createdAt)}</p>
            </div>
          </div>
          
          {/* Кнопка удаления */}
          {!isCreateMode && !isEditMode && (
            <div className="flex justify-center mt-8">
              <button
                className="btn btn-danger"
                onClick={() => setShowDeleteConfirmModal(true)}
              >
                <Trash2 className="w-5 h-5 mr-2" />
                Удалить проект
              </button>
            </div>
          )}
          
          {/* Кнопка отправки на рассмотрение */}
          {isCreateMode && isEditMode && (
            <div className="flex justify-center mt-8">
              <button
                className="btn btn-primary"
                onClick={() => setShowSaveConfirmModal(true)}
              >
                Отправить на рассмотрение
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Модальное окно подтверждения сохранения */}
      {showSaveConfirmModal && (
        <Modal isOpen={true} onClose={() => setShowSaveConfirmModal(false)} title="Подтверждение" maxWidth="md">
          <div className="space-y-4">
            <div className="flex items-center space-x-4 text-center">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0">
                <Save className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-lg font-medium text-white">
                  {isCreateMode ? 'Отправка проекта на рассмотрение' : 'Сохранение изменений'}
                </h3>
                <p className="text-dark-300">
                  {isCreateMode 
                    ? 'Вы уверены, что хотите отправить проект на рассмотрение? После отправки вы сможете отслеживать статус проекта в списке проектов.'
                    : 'Вы уверены, что хотите сохранить внесенные изменения?'}
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowSaveConfirmModal(false)}
              >
                Отмена
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleSave}
              >
                {isCreateMode ? 'Отправить' : 'Сохранить'}
              </button>
            </div>
          </div>
        </Modal>
      )}
      
      {/* Модальное окно подтверждения выхода */}
      {showExitConfirmModal && (
        <Modal isOpen={true} onClose={() => setShowExitConfirmModal(false)} title="Подтверждение" maxWidth="md">
          <div className="space-y-4">
            <div className="flex items-center space-x-4 text-center">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100 sm:mx-0">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-lg font-medium text-white">Выход без сохранения</h3>
                <p className="text-dark-300">
                  Вы уверены, что хотите выйти без сохранения? Все внесенные изменения будут потеряны.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowExitConfirmModal(false)}
              >
                Отмена
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleExitEditMode}
              >
                Выйти
              </button>
            </div>
          </div>
        </Modal>
      )}
      
      {/* Модальное окно подтверждения удаления */}
      {showDeleteConfirmModal && (
        <Modal isOpen={true} onClose={() => setShowDeleteConfirmModal(false)} title="Подтверждение удаления" maxWidth="md">
          <div className="space-y-4">
            <div className="flex items-center space-x-4 text-center">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-lg font-medium text-white">Удаление проекта</h3>
                <p className="text-dark-300">
                  Вы уверены, что хотите удалить этот проект? Это действие нельзя отменить.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowDeleteConfirmModal(false)}
              >
                Отмена
              </button>
              <button 
                className="btn btn-danger" 
                onClick={handleDelete}
              >
                Удалить
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
