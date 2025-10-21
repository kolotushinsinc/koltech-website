import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Modal } from './Modal';

interface LogoutConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LogoutConfirmationModal({ isOpen, onClose }: LogoutConfirmationModalProps) {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // In a real app, you would handle logout logic here (clear tokens, etc.)
    navigate('/login');
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm" showCloseButton={false}>
      <div className="p-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
            <LogOut className="w-8 h-8 text-red-400" />
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">Выход из системы</h3>
          <p className="text-dark-300 mb-6">
            Вы уверены, что хотите выйти из системы? Все несохраненные данные будут потеряны.
          </p>
          
          <div className="flex space-x-4 w-full">
            <button 
              className="btn btn-secondary flex-1"
              onClick={onClose}
            >
              Отмена
            </button>
            <button 
              className="btn flex-1 bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg hover:shadow-glow-sm focus:ring-red-500"
              onClick={handleLogout}
            >
              Выйти
            </button>
          </div>
        </div>
    </Modal>
  );
}
