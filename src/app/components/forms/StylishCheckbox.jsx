'use client';

import React from 'react';
import { Check } from 'lucide-react';

const StylishCheckbox = ({ 
  id, 
  name, 
  label,
  checked,
  onChange,
  disabled = false,
  error,
  className = '',
  helpText
}) => {
  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center">
        <div className="relative">
          <input
            id={id}
            name={name}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className="opacity-0 absolute h-6 w-6 cursor-pointer"
          />
          <div className={`
            border-2 rounded-md w-6 h-6 flex flex-shrink-0 justify-center items-center mr-2
            ${checked ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-gray-300'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            ${error ? 'border-red-500' : ''}
            transition-colors duration-200 ease-in-out
          `}>
            {checked && <Check className="h-3 w-3 text-white" />}
          </div>
        </div>
        <div>
          <label 
            htmlFor={id} 
            className={`text-sm cursor-pointer select-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {label}
          </label>
          
          {helpText && (
            <p className="text-xs text-gray-500 mt-0.5">
              {helpText}
            </p>
          )}
        </div>
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default StylishCheckbox; 