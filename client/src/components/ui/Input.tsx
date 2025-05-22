import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-neutral-700 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        
        <input
          id={inputId}
          className={`
            w-full rounded-md border ${error ? 'border-error-500' : 'border-neutral-300'} 
            py-2 ${icon ? 'pl-10' : 'pl-3'} pr-3
            text-neutral-900 placeholder-neutral-400
            focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400
            transition duration-150 ease-in-out
            ${className}
          `}
          {...props}
        />
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-error-500">{error}</p>
      )}
    </div>
  );
};