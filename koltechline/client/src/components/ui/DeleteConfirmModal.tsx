import React, { useState } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import Modal from './Modal';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName?: string;
  loading?: boolean;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  loading = false
}) => {
  const [confirmText, setConfirmText] = useState('');
  const isConfirmValid = itemName ? confirmText === itemName : true;

  const handleConfirm = () => {
    if (isConfirmValid) {
      onConfirm();
    }
  };

  const handleClose = () => {
    setConfirmText('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
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
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-300 mb-6 leading-relaxed">
          {message}
        </p>

        {/* Confirmation Input */}
        {itemName && (
          <div className="mb-6 text-left">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Type "{itemName}" to confirm deletion:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="input-primary w-full"
              placeholder={itemName}
              disabled={loading}
            />
            {confirmText && confirmText !== itemName && (
              <p className="text-red-400 text-sm mt-2">
                Text doesn't match. Please type exactly: {itemName}
              </p>
            )}
          </div>
        )}

        {/* Warning Box */}
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 text-left">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-red-400 font-medium text-sm mb-1">Warning</h4>
              <p className="text-red-300 text-sm">
                This action cannot be undone. All associated data will be permanently deleted.
              </p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 justify-center">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-3 rounded-xl bg-dark-700 hover:bg-dark-600 text-gray-300 hover:text-white transition-all duration-200 font-medium border border-dark-600 hover:border-dark-500"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-6 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-all duration-200 font-medium shadow-lg hover:shadow-red-500/25 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !isConfirmValid}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;