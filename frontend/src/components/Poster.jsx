import React from 'react';

export default function Poster({ src, alt, className = '' }) {
  return (
    <img
      className={className}
      src={src || '/posters/placeholder.svg'}
      alt={alt}
      loading="lazy"
      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/posters/placeholder.svg'; }}
    />
  );
}
