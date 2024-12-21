import React from 'react';

export function Textarea({ className = '', ...props }) {
  return (
    <textarea
      className={`px-3 py-2 border rounded w-full ${className}`}
      {...props}
    />
  );
}
