import React from 'react';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  htmlFor?: string; // Optional because labels may not always be associated with a specific input
  className?: string;
}

export function Label({ children, htmlFor, className = '', ...props }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={`font-medium text-gray-700 ${className}`.trim()}
      {...props}
    >
      {children}
    </label>
  );
}
