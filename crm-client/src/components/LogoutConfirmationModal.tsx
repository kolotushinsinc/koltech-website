import { X, LogOut } from 'lucide-react';

interface LogoutConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutConfirmationModal({ isOpen, onClose, onConfirm }: LogoutConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Подтверждение выхода</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-red-500/20 p-3 rounded-full">
              <LogOut className="w-8 h-8 text-red-400" />
            </div>
          </div>
          <p className="text-slate-300 text-center">
            Вы уверены, что хотите выйти из системы KolTech CRM?
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition"
          >
            Отмена
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg hover:from-red-600 hover:to-red-700 transition flex items-center"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Да, выйти
          </button>
        </div>
      </div>
    </div>
  );
}