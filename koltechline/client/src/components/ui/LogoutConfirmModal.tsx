import React from 'react';
import { LogOut, AlertTriangle } from 'lucide-react';
import Modal from './Modal';

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      showCloseButton={true}
    >
      <div className="text-center">
        {/* Icon */}
        <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 border border-red-500/30 mb-6">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-3">
          Confirm Logout
        </h3>

        {/* Description */}
        <p className="text-gray-300 mb-8 leading-relaxed">
          Are you sure you want to log out of your KolTech account? You will need to sign in again to access your profile and projects.
        </p>

        {/* Buttons */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-dark-700 hover:bg-dark-600 text-gray-300 hover:text-white transition-all duration-200 font-medium border border-dark-600 hover:border-dark-500"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-all duration-200 font-medium shadow-lg hover:shadow-red-500/25 flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default LogoutConfirmModal;