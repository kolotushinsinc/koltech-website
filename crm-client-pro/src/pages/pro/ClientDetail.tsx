import { useState, useEffect } from 'react';
import { 
  Mail, Phone, Building, Calendar, User, Briefcase, 
  ChevronRight, ArrowLeft, Edit, Save, AlertTriangle, Home,
  FileText
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { mockClients, mockProProjects, type Client, type ProProject } from '../../data/mockData';
import { Modal } from '../../components/Modal';
import { useEditMode } from '../../contexts/EditModeContext';

export function ClientDetail() {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  
  const [client, setClient] = useState<Client | null>(null);
  const [showEditConfirmModal, setShowEditConfirmModal] = useState(false);
  const [showExitEditModal, setShowExitEditModal] = useState(false);
  const [showSaveConfirmModal, setShowSaveConfirmModal] = useState(false);
  const [editedClient, setEditedClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'info' | 'projects'>('info');
  
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
  
  // Fetch client data
  useEffect(() => {
    // In a real app, this would be an API call
    const foundClient = mockClients.find(c => c.id === clientId);
    
    if (foundClient) {
      setClient(foundClient);
      setEditedClient(JSON.parse(JSON.stringify(foundClient))); // Deep copy for editing
    }
    
    setIsLoading(false);
  }, [clientId]);
  
  // Get client projects
  const getClientProjects = (clientId: string) => {
    return mockProProjects.filter(project => project.client_id === clientId);
  };
  
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
    handleNavigation('/pro-clients');
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
    
    // Reset edited client to original
    if (client) {
      setEditedClient(JSON.parse(JSON.stringify(client)));
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
  
  // Handle saving edited client
  const saveClient = () => {
    setShowSaveConfirmModal(false);
    
    // In a real app, you would save to backend here
    if (editedClient) {
      setClient(editedClient);
      setIsEditMode(false);
    }
  };
  
  if (isLoading) {
    return <div className="p-8 text-center text-white">Загрузка...</div>;
  }
  
  if (!client || !editedClient) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Заказчик не найден</h2>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/pro-clients')}
        >
          Вернуться к списку заказчиков
        </button>
      </div>
    );
  }
  
  const clientProjects = getClientProjects(client.id);
  
  return (
    <>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <div className="flex items-center text-dark-400 text-sm mb-2">
            <Home className="w-4 h-4 mr-1" />
            <span className="cursor-pointer hover:text-white" onClick={() => handleNavigation('/')}>Главная</span>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="cursor-pointer hover:text-white" onClick={() => handleNavigation('/pro-clients')}>Заказчики</span>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="text-white">{client.name}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">{client.name}</h1>
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
            <span className={`badge ${
              client.status === 'active' 
                ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                : 'bg-orange-500/20 text-orange-400 border-orange-500/30'
            }`}>
              {client.status === 'active' ? 'Активен' : 'Неактивен'}
            </span>
            {isEditMode && (
              <select 
                className="form-select w-48"
                value={editedClient.status}
                onChange={(e) => setEditedClient({...editedClient, status: e.target.value as 'active' | 'inactive'})}
              >
                <option value="active">Активен</option>
                <option value="inactive">Неактивен</option>
              </select>
            )}
          </div>
          
          {/* Tabs */}
          <div className="flex border-b border-dark-700 mb-6">
            <button
              onClick={() => setActiveTab('info')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'info'
                  ? 'text-primary-400 border-b-2 border-primary-500'
                  : 'text-dark-300 hover:text-white'
              }`}
            >
              Информация
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'projects'
                  ? 'text-primary-400 border-b-2 border-primary-500'
                  : 'text-dark-300 hover:text-white'
              }`}
            >
              Проекты
            </button>
          </div>
          
          {/* Tab content */}
          {activeTab === 'info' ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="card p-6">
                  <h3 className="text-sm font-medium text-dark-300 mb-4">Компания</h3>
                  {isEditMode ? (
                    <input
                      type="text"
                      className="form-input"
                      value={editedClient.company}
                      onChange={(e) => setEditedClient({...editedClient, company: e.target.value})}
                    />
                  ) : (
                    <div className="flex items-center">
                      <Building className="w-5 h-5 text-primary-400 mr-3" />
                      <p className="text-white text-lg">{client.company}</p>
                    </div>
                  )}
                </div>
                
                <div className="card p-6">
                  <h3 className="text-sm font-medium text-dark-300 mb-4">Имя</h3>
                  {isEditMode ? (
                    <input
                      type="text"
                      className="form-input"
                      value={editedClient.name}
                      onChange={(e) => setEditedClient({...editedClient, name: e.target.value})}
                    />
                  ) : (
                    <div className="flex items-center">
                      <User className="w-5 h-5 text-primary-400 mr-3" />
                      <p className="text-white text-lg">{client.name}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="card p-6">
                  <h3 className="text-sm font-medium text-dark-300 mb-4">Email</h3>
                  {isEditMode ? (
                    <input
                      type="email"
                      className="form-input"
                      value={editedClient.email}
                      onChange={(e) => setEditedClient({...editedClient, email: e.target.value})}
                    />
                  ) : (
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-primary-400 mr-3" />
                      <p className="text-white text-lg">{client.email}</p>
                    </div>
                  )}
                </div>
                
                <div className="card p-6">
                  <h3 className="text-sm font-medium text-dark-300 mb-4">Телефон</h3>
                  {isEditMode ? (
                    <input
                      type="tel"
                      className="form-input"
                      value={editedClient.phone}
                      onChange={(e) => setEditedClient({...editedClient, phone: e.target.value})}
                    />
                  ) : (
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-primary-400 mr-3" />
                      <p className="text-white text-lg">{client.phone}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="card p-6">
                <h3 className="text-sm font-medium text-dark-300 mb-4">Дата создания</h3>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-primary-400 mr-3" />
                  <p className="text-white text-lg">
                    {new Date(client.created_at).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-white">Проекты заказчика</h3>
                <span className="badge bg-primary-500/20 text-primary-400 border-primary-500/30">
                  {clientProjects.length} проектов
                </span>
              </div>
              
              {clientProjects.length > 0 ? (
                <div className="space-y-4">
                  {clientProjects.map(project => (
                    <div 
                      key={project.id} 
                      className="card p-4 hover:border-primary-500/30 transition-colors cursor-pointer"
                      onClick={() => handleNavigation(`/pro-projects/${project.id}`)}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="text-white font-medium">{project.title}</h4>
                        <span className={`badge ${
                          project.status === 'in_progress' 
                            ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                            : project.status === 'completed'
                            ? 'bg-green-500/20 text-green-400 border-green-500/30'
                            : project.status === 'planning'
                            ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                            : 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                        }`}>
                          {project.status === 'planning' && 'Планирование'}
                          {project.status === 'in_progress' && 'В работе'}
                          {project.status === 'completed' && 'Завершен'}
                          {project.status === 'on_hold' && 'На паузе'}
                        </span>
                      </div>
                      <p className="text-dark-300 text-sm mt-1 mb-3">{project.description}</p>
                      <div className="flex justify-between text-xs text-dark-400">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>Дедлайн: {new Date(project.deadline).toLocaleDateString('ru-RU')}</span>
                        </div>
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 mr-1" />
                          <span>{project.budget.toLocaleString('ru-RU')} ₽</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card p-8 flex flex-col items-center justify-center text-center">
                  <Briefcase className="w-12 h-12 text-dark-500 mb-3" />
                  <h4 className="text-lg font-medium text-white mb-2">Нет проектов</h4>
                  <p className="text-dark-300 mb-4">У этого заказчика пока нет проектов</p>
                </div>
              )}
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
                  Вы уверены, что хотите перейти в режим редактирования заказчика?
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
                onClick={saveClient}
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
