import { useState, useEffect } from 'react';
import { 
  Mail, Phone, Briefcase, Calendar, User, 
  ChevronRight, ArrowLeft, Edit, Save, AlertTriangle, Home
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { mockEmployees, type Employee } from '../../data/mockData';
import { Modal } from '../../components/Modal';
import { useEditMode } from '../../contexts/EditModeContext';

export function EmployeeDetail() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();
  
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [showEditConfirmModal, setShowEditConfirmModal] = useState(false);
  const [showExitEditModal, setShowExitEditModal] = useState(false);
  const [showSaveConfirmModal, setShowSaveConfirmModal] = useState(false);
  const [editedEmployee, setEditedEmployee] = useState<Employee | null>(null);
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
  
  // Fetch employee data
  useEffect(() => {
    // In a real app, this would be an API call
    const foundEmployee = mockEmployees.find(e => e.id === employeeId);
    
    if (foundEmployee) {
      setEmployee(foundEmployee);
      setEditedEmployee(JSON.parse(JSON.stringify(foundEmployee))); // Deep copy for editing
    }
    
    setIsLoading(false);
  }, [employeeId]);
  
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
    handleNavigation('/pro-employees');
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
    
    // Reset edited employee to original
    if (employee) {
      setEditedEmployee(JSON.parse(JSON.stringify(employee)));
    }
  };
  
  // Show save confirmation dialog
  const handleSaveClick = () => {
    setShowSaveConfirmModal(true);
  };
  
  // Handle saving edited employee
  const saveEmployee = () => {
    setShowSaveConfirmModal(false);
    
    // In a real app, you would save to backend here
    if (editedEmployee) {
      setEmployee(editedEmployee);
      setIsEditMode(false);
    }
  };
  
  if (isLoading) {
    return <div className="p-8 text-center text-white">Загрузка...</div>;
  }
  
  if (!employee || !editedEmployee) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Сотрудник не найден</h2>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/pro-employees')}
        >
          Вернуться к списку сотрудников
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
            <span className="cursor-pointer hover:text-white" onClick={() => handleNavigation('/pro-employees')}>Сотрудники</span>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="text-white">{employee.name}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">{employee.name}</h1>
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
              employee.status === 'active' 
                ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                : 'bg-orange-500/20 text-orange-400 border-orange-500/30'
            }`}>
              {employee.status === 'active' ? 'Активен' : 'Неактивен'}
            </span>
            {isEditMode && (
              <select 
                className="form-select w-48"
                value={editedEmployee.status}
                onChange={(e) => setEditedEmployee({...editedEmployee, status: e.target.value as 'active' | 'inactive'})}
              >
                <option value="active">Активен</option>
                <option value="inactive">Неактивен</option>
              </select>
            )}
          </div>
          
          {/* Employee Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="text-sm font-medium text-dark-300 mb-4">Имя</h3>
              {isEditMode ? (
                <input
                  type="text"
                  className="form-input"
                  value={editedEmployee.name}
                  onChange={(e) => setEditedEmployee({...editedEmployee, name: e.target.value})}
                />
              ) : (
                <div className="flex items-center">
                  <User className="w-5 h-5 text-primary-400 mr-3" />
                  <p className="text-white text-lg">{employee.name}</p>
                </div>
              )}
            </div>
            
            <div className="card p-6">
              <h3 className="text-sm font-medium text-dark-300 mb-4">Должность</h3>
              {isEditMode ? (
                <input
                  type="text"
                  className="form-input"
                  value={editedEmployee.position}
                  onChange={(e) => setEditedEmployee({...editedEmployee, position: e.target.value})}
                />
              ) : (
                <div className="flex items-center">
                  <User className="w-5 h-5 text-primary-400 mr-3" />
                  <p className="text-white text-lg">{employee.position}</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="text-sm font-medium text-dark-300 mb-4">Отдел</h3>
              {isEditMode ? (
                <select 
                  className="form-select"
                  value={editedEmployee.department}
                  onChange={(e) => setEditedEmployee({...editedEmployee, department: e.target.value})}
                >
                  <option value="Разработка">Разработка</option>
                  <option value="Дизайн">Дизайн</option>
                  <option value="Управление">Управление</option>
                  <option value="Инфраструктура">Инфраструктура</option>
                </select>
              ) : (
                <div className="flex items-center">
                  <Briefcase className="w-5 h-5 text-primary-400 mr-3" />
                  <p className="text-white text-lg">{employee.department}</p>
                </div>
              )}
            </div>
            
            <div className="card p-6">
              <h3 className="text-sm font-medium text-dark-300 mb-4">Дата присоединения</h3>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-primary-400 mr-3" />
                <p className="text-white text-lg">
                  {new Date(employee.joined_at).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="text-sm font-medium text-dark-300 mb-4">Email</h3>
              {isEditMode ? (
                <input
                  type="email"
                  className="form-input"
                  value={editedEmployee.email}
                  onChange={(e) => setEditedEmployee({...editedEmployee, email: e.target.value})}
                />
              ) : (
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-primary-400 mr-3" />
                  <p className="text-white text-lg">{employee.email}</p>
                </div>
              )}
            </div>
            
            <div className="card p-6">
              <h3 className="text-sm font-medium text-dark-300 mb-4">Телефон</h3>
              {isEditMode ? (
                <input
                  type="tel"
                  className="form-input"
                  value={editedEmployee.phone}
                  onChange={(e) => setEditedEmployee({...editedEmployee, phone: e.target.value})}
                />
              ) : (
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-primary-400 mr-3" />
                  <p className="text-white text-lg">{employee.phone}</p>
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
                  Вы уверены, что хотите перейти в режим редактирования сотрудника?
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
                onClick={saveEmployee}
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
