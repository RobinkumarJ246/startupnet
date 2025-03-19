'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';

const StylishSelect = ({ 
  id, 
  name, 
  label,
  value,
  onChange,
  options = [],
  required = false,
  error,
  icon: Icon,
  className = '',
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
        
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            block w-full rounded-md shadow-sm transition-all duration-200 appearance-none
            ${Icon ? 'pl-10' : 'pl-4'}
            ${error 
              ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-300'}
            ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}
            py-2.5 pr-10 text-base
          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : undefined}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ChevronDown className="h-5 w-5 text-gray-400" />
        </div>
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

export default StylishSelect; 