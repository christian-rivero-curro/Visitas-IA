import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Seleccionar...',
  className = '',
  disabled = false,
  required = false
}) => {
  const baseClasses = 'border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200';
  const disabledClasses = disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white';
  
  const classes = `${baseClasses} ${disabledClasses} ${className}`;

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={classes}
      disabled={disabled}
      required={required}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;