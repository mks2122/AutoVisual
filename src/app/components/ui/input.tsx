// src/components/ui/input.tsx
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Input({ className = '', type, onChange, ...props }: InputProps) {
  return (
    <input
      type={type}
      onChange={onChange}
      className={`px-3 py-2 border rounded w-full ${className}`}
      {...props}
    />
  );
}
