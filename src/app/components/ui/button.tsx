import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  size?: 'default' | 'icon';
  className?: string;
}

export function Button({ children, size = 'default', className = '', ...props }: ButtonProps) {
  // Base classes for styling
  const baseClasses =
    'px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2';

  // Adjust size classes based on the size prop
  const sizeClasses = size === 'icon' ? 'p-2' : '';

  // Combine all classes safely
  const combinedClasses = `${baseClasses} ${sizeClasses} ${className}`.trim();

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
}
