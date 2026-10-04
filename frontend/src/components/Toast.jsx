import React from 'react';

// Inline message banner: type is "error", "success" or "info"
export default function Toast({ type = 'info', message }) {
  if (!message) return null;
  return <div className={`toast ${type}`} role={type === 'error' ? 'alert' : 'status'}>{message}</div>;
}
