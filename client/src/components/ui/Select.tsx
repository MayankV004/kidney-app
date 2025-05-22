import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  options: SelectOption[];
  error?: string;
  onChange?: (value: string) => void;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  className = '',
  id,
  onChange,
  ...props
}) => {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };
  
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-neutral-700 mb-1">
          {label}
        </label>
      )}
      
      <select
        id={selectId}
        className={`
          w-full rounded-md border ${error ? 'border-error-500' : 'border-neutral-300'} 
          py-2 px-3 text-neutral-900 bg-white
          focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400
          transition duration-150 ease-in-out
          ${className}
        `}
        onChange={handleChange}
        {...props}
      >
        <option value="" disabled>Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <p className="mt-1 text-sm text-error-500">{error}</p>
      )}
    </div>
  );
};