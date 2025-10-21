import { useState, useEffect } from 'react';
import { 
  Mail, User, Clock, CheckCircle, Reply, Send,
  ChevronRight, ArrowLeft, Edit, Save, AlertTriangle, Home,
  Trash2, MessageSquare
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { mockFeedback, type FeedbackMessage } from '../data/mockData';
import { Modal } from '../components/Modal';
import { useEditMode } from '../contexts/EditModeContext';

export function FeedbackDetail() {
  const { messageId } = useParams<{ messageId: string }>();
  const navigate = useNavigate();
  
  const [message, setMessage] = useState<FeedbackMessage | null>(null);
  const [showEditConfirmModal, setShowEditConfirmModal] = useState(false);
  const [showExitEditModal, setShowExitEditModal] = useState(false);
  const [showSaveConfirmModal, setShowSaveConfirmModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [editedMessage, setEditedMessage] = useState<FeedbackMessage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  
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
  
  // Fetch message data
  useEffect(() => {
    // In a real app, this would be an API call
    const foundMessage = mockFeedback.find(m => m.id === messageId);
    
    if (foundMessage) {
      // If the message is new, mark it as read
      const updatedMessage = foundMessage.status === 'new' 
        ? { ...foundMessage, status: 'read' as const } 
        : foundMessage;
      
      setMessage(updatedMessage);
      setEditedMessage(JSON.parse(JSON.stringify(updatedMessage))); // Deep copy for editing
    }
    
    setIsLoading(false);
  }, [messageId]);
  
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
    handleNavigation('/feedback');
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
    
    // Reset edited message to original
    if (message) {
      setEditedMessage(JSON.parse(JSON.stringify(message)));
    }
  };
  
  // Show save confirmation dialog
  const handleSaveClick = () => {
    setShowSaveConfirmModal(true);
  };
  
  // Handle saving edited message
  const saveMessage = () => {
    setShowSaveConfirmModal(false);
    
    // In a real app, you would save to backend here
    if (editedMessage) {
      setMessage(editedMessage);
      setIsEditMode(false);
    }
  };
  
  // Handle reply submission
  const handleReply = () => {
    if (!message || !replyText.trim()) return;
    
    // In a real app, you would send the reply to the backend
    // For now, just mark as replied and clear the reply text
    const updatedMessage = { ...message, status: 'replied' as const };
    setMessage(updatedMessage);
    setEditedMessage(updatedMessage);
    setReplyText('');
  };
  
  // Handle message deletion
  const handleDelete = () => {
    setShowDeleteConfirmModal(false);
    
    // In a real app, you would delete from backend here
    navigate('/feedback');
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'read':
        return 'bg-primary-500/20 text-primary-400 border-primary-500/30';
      case 'replied':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-dark-500/20 text-dark-300 border-dark-500/30';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new':
        return 'Новое';
      case 'read':
        return 'Прочитано';
      case 'replied':
        return 'Отвечено';
      default:
        return status;
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <Clock className="w-4 h-4 mr-1" />;
      case 'read':
        return <CheckCircle className="w-4 h-4 mr-1" />;
      case 'replied':
        return <Reply className="w-4 h-4 mr-1" />;
      default:
        return <MessageSquare className="w-4 h-4 mr-1" />;
    }
  };
  
  if (isLoading) {
    return <div className="p-8 text-center text-white">Загрузка...</div>;
  }
  
  if (!message || !editedMessage) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Сообщение не найдено</h2>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/feedback')}
        >
          Вернуться к списку сообщений
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
            <span className="cursor-pointer hover:text-white" onClick={() => handleNavigation('/feedback')}>Обратная связь</span>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="text-white">Сообщение от {message.name}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">Сообщение от {message.name}</h1>
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
              {getStatusIcon(message.status)}
              <span className={`badge ${getStatusColor(message.status)}`}>
                {getStatusLabel(message.status)}
              </span>
            </div>
            {isEditMode && (
              <select 
                className="form-select w-48"
                value={editedMessage.status}
                onChange={(e) => setEditedMessage({...editedMessage, status: e.target.value as 'new' | 'read' | 'replied'})}
              >
                <option value="new">Новое</option>
                <option value="read">Прочитано</option>
                <option value="replied">Отвечено</option>
              </select>
            )}
          </div>
          
          {/* Sender Info */}
          <div className="card p-6">
            <h3 className="text-sm font-medium text-dark-300 mb-4">Отправитель</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h4 className="text-xs text-dark-400 mb-1">Имя</h4>
                {isEditMode ? (
                  <input
                    type="text"
                    className="form-input"
                    value={editedMessage.name}
                    onChange={(e) => setEditedMessage({...editedMessage, name: e.target.value})}
                  />
                ) : (
                  <div className="flex items-center">
                    <User className="w-5 h-5 text-primary-400 mr-3" />
                    <p className="text-white">{message.name}</p>
                  </div>
                )}
              </div>
              <div>
                <h4 className="text-xs text-dark-400 mb-1">Email</h4>
                {isEditMode ? (
                  <input
                    type="email"
                    className="form-input"
                    value={editedMessage.email}
                    onChange={(e) => setEditedMessage({...editedMessage, email: e.target.value})}
                  />
                ) : (
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-primary-400 mr-3" />
                    <p className="text-white">{message.email}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Message */}
          <div className="card p-6">
            <h3 className="text-sm font-medium text-dark-300 mb-4">Сообщение</h3>
            {isEditMode ? (
              <textarea
                className="form-textarea"
                rows={6}
                value={editedMessage.message}
                onChange={(e) => setEditedMessage({...editedMessage, message: e.target.value})}
              />
            ) : (
              <p className="text-white whitespace-pre-wrap">{message.message}</p>
            )}
          </div>
          
          {/* Date */}
          <div className="card p-6">
            <h3 className="text-sm font-medium text-dark-300 mb-4">Дата получения</h3>
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-primary-400 mr-3" />
              <p className="text-white">
                {new Date(message.created_at).toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
          
          {/* Reply */}
          <div className="card p-6">
            <h3 className="text-sm font-medium text-dark-300 mb-4">Ответ</h3>
            <textarea
              className="form-textarea mb-4"
              rows={4}
              placeholder="Введите ваш ответ..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              disabled={isEditMode}
            />
            <div className="flex justify-end">
              <button
                className="btn btn-primary"
                onClick={handleReply}
                disabled={!replyText.trim() || isEditMode}
              >
                <Send className="w-4 h-4 mr-2" />
                Ответить
              </button>
            </div>
          </div>
          
          {/* Delete button */}
          {!isEditMode && (
            <div className="flex justify-center">
              <button
                className="btn btn-danger"
                onClick={() => setShowDeleteConfirmModal(true)}
              >
                <Trash2 className="w-5 h-5 mr-2" />
                Удалить сообщение
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
                  Вы уверены, что хотите перейти в режим редактирования сообщения?
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
                onClick={saveMessage}
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
                <h3 className="text-lg font-medium text-white">Удаление сообщения</h3>
                <p className="text-dark-300">
                  Вы уверены, что хотите удалить это сообщение? Это действие нельзя отменить.
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
