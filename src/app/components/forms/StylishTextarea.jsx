'use client';

import React from 'react';

const StylishTextarea = ({ 
  id, 
  name, 
  label,
  placeholder,
  value,
  onChange,
  required = false,
  error,
  icon: Icon,
  className = '',
  rows = 4,
  disabled = false,
  helpText,
  maxLength
}) => {
  return (
    <div className={`relative ${className}`}>
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-gray-700 mb-1 transition-all duration-200 ease-in-out"
        >
          {label} {required && <span className="text-indigo-500">*</span>}
        </label>
      )}
      
      <div className="relative rounded-md shadow-sm">
        {Icon && (
          <div className="absolute top-3 left-3 flex items-start pointer-events-none">
            {React.isValidElement(Icon) ? (
              Icon
            ) : typeof Icon === 'function' ? (
              <Icon className="h-5 w-5 text-gray-400" />
            ) : null}
          </div>
        )}
        
        <textarea
          id={id}
          name={name}
          rows={rows}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          disabled={disabled}
          className={`
            block w-full rounded-md shadow-sm transition-all duration-200
            ${Icon ? 'pl-10' : 'pl-4'}
            ${error 
              ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-300'}
            ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}
            py-2.5 text-base resize-y
          `}
          placeholder={placeholder}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600" id={`${id}-error`}>
          {error}
        </p>
      )}
      
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500">
          {helpText}
        </p>
      )}
      
      {maxLength && (
        <div className="mt-1 text-xs text-right text-gray-500">
          {value.length}/{maxLength} characters
        </div>
      )}
    </div>
  );
};

export default StylishTextarea; 