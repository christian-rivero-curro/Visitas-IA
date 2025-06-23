import React from 'react';

interface TextAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

const TextArea: React.FC<TextAreaProps> = ({
  value,
  onChange,
  placeholder = '',
  rows = 3,
  className = '',
  disabled = false,
  required = false
}) => {
  const baseClasses = 'border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200 resize-vertical';
  const disabledClasses = disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white';
  
  const classes = `${baseClasses} ${disabledClasses} ${className}`;

  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={classes}
      disabled={disabled}
      required={required}
    />
  );
};

export default TextArea;