import React from 'react';
import { CloseIcon, AlertTriangleIcon } from './Icons';
import { useLanguage } from '../context/LanguageContext';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
  confirmButtonText?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, title, children, confirmButtonText }) => {
  const { t } = useLanguage();
  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" 
        onClick={onClose}
        aria-modal="true"
        role="dialog"
    >
      <div 
        className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md border border-gray-700" 
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <AlertTriangleIcon className="w-6 h-6 text-yellow-400"/>
            {title}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label={t('fileManager.close_aria')}>
            <CloseIcon className="w-6 h-6"/>
          </button>
        </header>
        
        <div className="p-6 text-gray-300">
          {children}
        </div>

        <footer className="p-4 bg-gray-900/50 rounded-b-xl flex justify-end gap-3">
            <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-500"
            >
                {t('modal.confirm.cancel_button')}
            </button>
            <button
                onClick={onConfirm}
                className="px-4 py-2 bg-red-600 text-white font-bold rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500"
            >
                {confirmButtonText || t('modal.confirm.default_button')}
            </button>
        </footer>
      </div>
    </div>
  );
};

export default ConfirmModal;