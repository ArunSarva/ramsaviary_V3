import React from 'react';
import { Trash2, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, title, description, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-0">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal panel */}
      <div className="relative w-full max-w-sm glass-strong rounded-3xl p-6 shadow-2xl border border-white/20 animate-modal">
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-white/40 hover:text-white/70 active:scale-90 transition-all"
        >
          <X size={18} />
        </button>

        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center mx-auto mb-4">
          <Trash2 size={24} className="text-rose-400" />
        </div>

        {/* Text */}
        <h3 className="text-white font-semibold text-lg text-center mb-2">{title}</h3>
        <p className="text-white/50 text-sm text-center mb-6 leading-relaxed">{description}</p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-2xl text-sm font-semibold text-white/70 glass border border-white/15 active:scale-95 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-rose-600 to-pink-600 shadow-lg shadow-rose-900/40 active:scale-95 transition-all"
          >
            Delete
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modal-in {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        .animate-modal { animation: modal-in 0.2s ease-out both; }
      `}</style>
    </div>
  );
};

export default ConfirmModal;
