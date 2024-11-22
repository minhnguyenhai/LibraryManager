import React from 'react';
import './confirmation_dialog.css'
const ConfirmationDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "", 
  message = "",
  confirmLabel = "",
  cancelLabel = ""
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-inform" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
        </div>
        
        <div className="modal-body">
          {message}
        </div>
        
        <div className="modal-footer">
          <button 
            className="modal-button cancel-button"
            onClick={onClose}
          >
            {cancelLabel}
          </button>
          <button 
            className="modal-button confirm-button"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;