import React from 'react';

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'number' | 'email' | 'password' | 'date';
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder = '',
  type = 'text',
  className = '',
  disabled = false,
  required = false
}) => {
  const baseClasses = 'border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200';
  const disabledClasses = disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white';
  
  const classes = `${baseClasses} ${disabledClasses} ${className}`;

  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={classes}
      disabled={disabled}
      required={required}
    />
  );
};

export default Input;