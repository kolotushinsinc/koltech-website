import { useState, useEffect } from 'react';
import { 
  DollarSign, Calendar, User, Briefcase, 
  ChevronRight, ArrowLeft, Edit, Save, AlertTriangle, Home
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { mockProProjects, mockClients, mockEmployees, type ProProject } from '../../data/mockData';
import { Modal } from '../../components/Modal';
import { useEditMode } from '../../contexts/EditModeContext';

export function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  
  const [project, setProject] = useState<ProProject | null>(null);
  const [showEditConfirmModal, setShowEditConfirmModal] = useState(false);
  const [showExitEditModal, setShowExitEditModal] = useState(false);
  const [showSaveConfirmModal, setShowSaveConfirmModal] = useState(false);
  const [editedProject, setEditedProject] = useState<ProProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Use our global edit mode context
  const { isEditMode, setIsEditMode, showExitWarning } = useEditMode();
  
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
    const foundProject = mockProProjects.find(p => p.id === projectId);
    
    if (foundProject) {
      setProject(foundProject);
      setEditedProject(JSON.parse(JSON.stringify(foundProject))); // Deep copy for editing
    }
    
    setIsLoading(false);
  }, [projectId]);
  
  const getClient = (id: string) => mockClients.find(c => c.id === id);
  const getEmployee = (id: string) => mockEmployees.find(e => e.id === id);
  
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
    handleNavigation('/pro-projects');
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
  
  // Cancel exit from edit mode
  const cancelExitEditMode = () => {
    setShowExitEditModal(false);
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
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'in_progress': return 'bg-primary-500/20 text-primary-400 border-primary-500/30';
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'on_hold': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-dark-500/20 text-dark-300 border-dark-500/30';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'planning': return 'Планирование';
      case 'in_progress': return 'В работе';
      case 'completed': return 'Завершен';
      case 'on_hold': return 'На паузе';
      default: return status;
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
          onClick={() => navigate('/pro-projects')}
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
            <span className="cursor-pointer hover:text-white" onClick={() => handleNavigation('/pro-projects')}>Проекты</span>
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
            <span className={`badge ${getStatusColor(project.status)}`}>
              {getStatusLabel(project.status)}
            </span>
            {isEditMode && (
              <select 
                className="form-select w-48"
                value={editedProject.status}
                onChange={(e) => setEditedProject({...editedProject, status: e.target.value as 'planning' | 'in_progress' | 'completed' | 'on_hold'})}
              >
                <option value="planning">Планирование</option>
                <option value="in_progress">В работе</option>
                <option value="on_hold">На паузе</option>
                <option value="completed">Завершен</option>
              </select>
            )}
          </div>
          
          {/* Description */}
          <div className="card p-6">
            <h3 className="text-sm font-medium text-dark-300 mb-2">Описание</h3>
            {isEditMode ? (
              <textarea
                className="form-textarea"
                rows={4}
                value={editedProject.description}
                onChange={(e) => setEditedProject({...editedProject, description: e.target.value})}
              />
            ) : (
              <p className="text-white">{project.description}</p>
            )}
          </div>
          
          {/* Client and Employee */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="text-sm font-medium text-dark-300 mb-4">Заказчик</h3>
              {isEditMode ? (
                <select 
                  className="form-select"
                  value={editedProject.client_id}
                  onChange={(e) => setEditedProject({...editedProject, client_id: e.target.value})}
                >
                  {mockClients.map(client => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
              ) : (
                <div className="flex items-center">
                  <Briefcase className="w-5 h-5 text-primary-400 mr-3" />
                  <p className="text-white text-lg">{getClient(project.client_id)?.name}</p>
                </div>
              )}
            </div>
            
            <div className="card p-6">
              <h3 className="text-sm font-medium text-dark-300 mb-4">Сотрудник</h3>
              {isEditMode ? (
                <select 
                  className="form-select"
                  value={editedProject.employee_id}
                  onChange={(e) => setEditedProject({...editedProject, employee_id: e.target.value})}
                >
                  {mockEmployees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                  ))}
                </select>
              ) : (
                <div className="flex items-center">
                  <User className="w-5 h-5 text-primary-400 mr-3" />
                  <p className="text-white text-lg">{getEmployee(project.employee_id)?.name}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Budget and Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="text-sm font-medium text-dark-300 mb-4">Бюджет</h3>
              {isEditMode ? (
                <input
                  type="number"
                  className="form-input"
                  value={editedProject.budget}
                  onChange={(e) => setEditedProject({...editedProject, budget: Number(e.target.value)})}
                />
              ) : (
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 text-primary-400 mr-3" />
                  <p className="text-white text-lg font-semibold">{project.budget.toLocaleString('ru-RU')} ₽</p>
                </div>
              )}
            </div>
            
            <div className="card p-6">
              <h3 className="text-sm font-medium text-dark-300 mb-4">Дедлайн</h3>
              {isEditMode ? (
                <input
                  type="date"
                  className="form-input"
                  value={new Date(editedProject.deadline).toISOString().split('T')[0]}
                  onChange={(e) => setEditedProject({...editedProject, deadline: new Date(e.target.value).toISOString()})}
                />
              ) : (
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-primary-400 mr-3" />
                  <p className="text-white text-lg">
                    {new Date(project.deadline).toLocaleDateString('ru-RU')}
                  </p>
                </div>
              )}
            </div>
          </div>
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
    </>
  );
}
