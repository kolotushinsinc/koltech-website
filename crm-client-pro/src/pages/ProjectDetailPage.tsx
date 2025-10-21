import { useState, useEffect } from 'react';
import { 
  Calendar, FolderKanban, Clock, CheckCircle, Pause,
  ChevronRight, ArrowLeft, Edit, Save, AlertTriangle, Home,
  Trash2, Download
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { mockProjects, type Project } from '../data/mockData';
import { Modal } from '../components/Modal';
import { useEditMode } from '../contexts/EditModeContext';

export function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  
  const [project, setProject] = useState<Project | null>(null);
  const [showEditConfirmModal, setShowEditConfirmModal] = useState(false);
  const [showExitEditModal, setShowExitEditModal] = useState(false);
  const [showSaveConfirmModal, setShowSaveConfirmModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [editedProject, setEditedProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Use our global edit mode context
  const { isEditMode, setIsEditMode } = useEditMode();
  
  // Handle beforeunload event (page reload/close)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isEditMode) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isEditMode]);
  
  // Fetch project data
  useEffect(() => {
    // In a real app, this would be an API call
    const foundProject = mockProjects.find(p => p.id === projectId);
    
    if (foundProject) {
      setProject(foundProject);
      setEditedProject(JSON.parse(JSON.stringify(foundProject))); // Deep copy for editing
    }
    
    setIsLoading(false);
  }, [projectId]);
  
  // Handle navigation with confirmation if in edit mode
  const handleNavigation = (path: string) => {
    if (isEditMode) {
      setShowExitEditModal(true);
      return;
    }
    
    navigate(path);
  };
  
  // Handle back navigation
  const handleBack = () => {
    handleNavigation('/projects');
  };
  
  // Handle entering edit mode
  const enterEditMode = () => {
    setShowEditConfirmModal(false);
    setIsEditMode(true);
  };
  
  // Handle exiting edit mode
  const handleExitEditMode = () => {
    setShowExitEditModal(false);
    setIsEditMode(false);
    
    // Reset edited project to original
    if (project) {
      setEditedProject(JSON.parse(JSON.stringify(project)));
    }
  };
  
  // Show save confirmation dialog
  const handleSaveClick = () => {
    setShowSaveConfirmModal(true);
  };
  
  // Handle saving edited project
  const saveProject = () => {
    setShowSaveConfirmModal(false);
    
    // In a real app, you would save to backend here
    if (editedProject) {
      setProject(editedProject);
      setIsEditMode(false);
    }
  };
  
  // Handle project deletion
  const handleDelete = () => {
    setShowDeleteConfirmModal(false);
    
    // In a real app, you would delete from backend here
    navigate('/projects');
  };
  
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
  
  if (isLoading) {
    return <div className="p-8 text-center text-white">Загрузка...</div>;
  }
  
  if (!project || !editedProject) {
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
        {/* Header */}
        <div>
          <div className="flex items-center text-dark-400 text-sm mb-2">
            <Home className="w-4 h-4 mr-1" />
            <span className="cursor-pointer hover:text-white" onClick={() => handleNavigation('/')}>Главная</span>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="cursor-pointer hover:text-white" onClick={() => handleNavigation('/projects')}>Проекты</span>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="text-white">{project.title}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">{project.title}</h1>
            <div className="flex space-x-2">
              {isEditMode ? (
                <>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => setShowExitEditModal(true)}
                  >
                    Отменить
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={handleSaveClick}
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
                    onClick={() => setShowEditConfirmModal(true)}
                  >
                    <Edit className="w-5 h-5 mr-2" />
                    Редактировать
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {getStatusIcon(project.status)}
              <span className={`badge ml-2 ${getStatusColor(project.status)}`}>
                {getStatusLabel(project.status)}
              </span>
            </div>
            {isEditMode && (
              <select 
                className="form-select w-48"
                value={editedProject.status}
                onChange={(e) => setEditedProject({...editedProject, status: e.target.value as 'active' | 'completed' | 'on_hold'})}
              >
                <option value="active">Активный</option>
                <option value="completed">Завершен</option>
                <option value="on_hold">На паузе</option>
              </select>
            )}
          </div>
          
          {/* Description */}
          <div className="card p-6">
            <h3 className="text-sm font-medium text-dark-300 mb-4">Описание</h3>
            {isEditMode ? (
              <textarea
                className="form-textarea"
                rows={6}
                value={editedProject.description}
                onChange={(e) => setEditedProject({...editedProject, description: e.target.value})}
              />
            ) : (
              <p className="text-white whitespace-pre-wrap">{project.description || 'Нет описания'}</p>
            )}
          </div>
          
          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="text-sm font-medium text-dark-300 mb-4">Создан</h3>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-primary-400 mr-3" />
                <p className="text-white">
                  {new Date(project.created_at).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
            
            <div className="card p-6">
              <h3 className="text-sm font-medium text-dark-300 mb-4">Обновлен</h3>
              {isEditMode ? (
                <input
                  type="date"
                  className="form-input"
                  value={new Date(editedProject.updated_at).toISOString().split('T')[0]}
                  onChange={(e) => setEditedProject({...editedProject, updated_at: new Date(e.target.value).toISOString()})}
                />
              ) : (
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-primary-400 mr-3" />
                  <p className="text-white">
                    {new Date(project.updated_at).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Title */}
          <div className="card p-6">
            <h3 className="text-sm font-medium text-dark-300 mb-4">Название проекта</h3>
            {isEditMode ? (
              <input
                type="text"
                className="form-input"
                value={editedProject.title}
                onChange={(e) => setEditedProject({...editedProject, title: e.target.value})}
              />
            ) : (
              <p className="text-white">{project.title}</p>
            )}
          </div>
          
          {/* Export button */}
          {!isEditMode && (
            <div className="flex justify-end">
              <button className="btn btn-secondary">
                <Download className="w-5 h-5 mr-2" />
                Экспорт
              </button>
            </div>
          )}
          
          {/* Delete button */}
          {!isEditMode && (
            <div className="flex justify-center">
              <button
                className="btn btn-danger"
                onClick={() => setShowDeleteConfirmModal(true)}
              >
                <Trash2 className="w-5 h-5 mr-2" />
                Удалить проект
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Edit confirmation modal */}
      {showEditConfirmModal && (
        <Modal isOpen={true} onClose={() => setShowEditConfirmModal(false)} title="Подтверждение" maxWidth="md">
          <div className="space-y-4">
            <div className="flex items-center space-x-4 text-center">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100 sm:mx-0">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-lg font-medium text-white">Режим редактирования</h3>
                <p className="text-dark-300">
                  Вы уверены, что хотите перейти в режим редактирования проекта?
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowEditConfirmModal(false)}
              >
                Отмена
              </button>
              <button 
                className="btn btn-primary" 
                onClick={enterEditMode}
              >
                Редактировать
              </button>
            </div>
          </div>
        </Modal>
      )}
      
      {/* Exit edit mode confirmation modal */}
      {showExitEditModal && (
        <Modal isOpen={true} onClose={() => setShowExitEditModal(false)} title="Подтверждение" maxWidth="md">
          <div className="space-y-4">
            <div className="flex items-center space-x-4 text-center">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100 sm:mx-0">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-lg font-medium text-white">Выход из режима редактирования</h3>
                <p className="text-dark-300">
                  Вы уверены, что хотите выйти из режима редактирования? Все несохраненные изменения будут потеряны.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowExitEditModal(false)}
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
      
      {/* Save confirmation modal */}
      {showSaveConfirmModal && (
        <Modal isOpen={true} onClose={() => setShowSaveConfirmModal(false)} title="Подтверждение" maxWidth="md">
          <div className="space-y-4">
            <div className="flex items-center space-x-4 text-center">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0">
                <Save className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-lg font-medium text-white">Сохранение изменений</h3>
                <p className="text-dark-300">
                  Вы уверены, что хотите сохранить внесенные изменения?
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
                onClick={saveProject}
              >
                Сохранить
              </button>
            </div>
          </div>
        </Modal>
      )}
      
      {/* Delete confirmation modal */}
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
