'use client';

import React from 'react';

const StylishInput = ({ 
  id, 
  name, 
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  required = false,
  error,
  icon: Icon,
  className = '',
  min,
  max,
  step,
  disabled = false,
  helpText
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
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className={`
            block w-full rounded-md shadow-sm transition-all duration-200
            ${Icon ? 'pl-10' : 'pl-4'}
            ${error 
              ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-300'}
            ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}
            py-2.5 text-base
          `}
          placeholder={placeholder}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        )}
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
    </div>
  );
};

export default StylishInput; 