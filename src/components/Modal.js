import React from 'react';

export const Modal = ({ title, onClose, children, actions }) => (
  <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
    <div className="modal">
      <h2 className="modal-title">{title}</h2>
      {children}
      {actions && <div className="modal-actions">{actions}</div>}
    </div>
  </div>
);

export const ConfirmModal = ({ message, onConfirm, onCancel }) => (
  <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onCancel()}>
    <div className="modal confirm-modal">
      <p className="confirm-text">{message}</p>
      <div className="modal-actions">
        <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button className="btn btn-success" onClick={onConfirm}>Confirm</button>
      </div>
    </div>
  </div>
);
