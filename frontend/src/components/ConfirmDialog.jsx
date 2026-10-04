import React from 'react';

export default function ConfirmDialog({ open, title, body, confirmLabel = 'Confirm', busy, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="modal-back" onClick={onCancel}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p className="muted">{body}</p>
        <div className="modal-actions">
          <button className="btn ghost" onClick={onCancel} disabled={busy}>Keep it</button>
          <button className="btn danger" onClick={onConfirm} disabled={busy}>{busy ? 'Working…' : confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
