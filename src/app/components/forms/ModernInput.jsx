'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { AlertCircle, Info } from 'lucide-react';

const ModernInput = ({
  id,
  name,
  type = 'text',
  label,
  value,
  onChange,
  placeholder = '',
  required = false,
  error = null,
  helpText = null,
  icon = null,
  className = '',
  min,
  max,
  step,
  disabled = false,
  prefix = null,
  suffix = null,
  autoComplete = 'on',
  validationPattern = null,
  maxLength,
  showCharCount = false,
  onFocus = null,
  onBlur = null,
  tooltip = null,
  size = 'default', // 'small', 'default', 'large'
}) => {
  const [focused, setFocused] = useState(false);
  const [charCount, setCharCount] = useState(value?.length || 0);
  const [customError, setCustomError] = useState(null);
  
  // Update character count when value changes
  useEffect(() => {
    if (maxLength) {
      setCharCount(value?.length || 0);
    }
  }, [value, maxLength]);
  
  const handleFocus = (e) => {
    setFocused(true);
    if (onFocus) onFocus(e);
  };
  
  const handleBlur = (e) => {
    setFocused(false);
    if (onBlur) onBlur(e);
    
    // Custom validation on blur
    if (validationPattern && value) {
      const pattern = new RegExp(validationPattern.pattern);
      if (!pattern.test(value)) {
        setCustomError(validationPattern.message);
      } else {
        setCustomError(null);
      }
    }
  };
  
  const displayedError = error || customError;
  const hasError = !!displayedError;
  
  const sizeClasses = {
    small: 'py-1 px-2 text-sm',
    default: 'py-2 px-3',
    large: 'py-3 px-4 text-lg',
  };
  
  const labelSizeClasses = {
    small: 'text-xs',
    default: 'text-sm',
    large: 'text-base',
  };
  
  return (
    <div className={`modern-input ${className}`}>
      {label && (
        <div className="flex items-center justify-between mb-1">
          <label 
            htmlFor={id}
            className={`${labelSizeClasses[size]} font-medium text-gray-700 flex items-center`}
          >
            {label}
            {required && <span className="text-indigo-500 ml-1">*</span>}
            
            {tooltip && (
              <div className="group relative ml-1">
                <Info className="h-3 w-3 text-gray-400 cursor-help" />
                <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity absolute z-10 -top-1 left-full ml-2 w-64 bg-gray-900 text-white text-xs rounded-md py-1 px-2">
                  {tooltip}
                </div>
              </div>
            )}
          </label>
          
          {maxLength && showCharCount && (
            <span className={`text-xs ${charCount > maxLength ? 'text-red-500' : 'text-gray-500'}`}>
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      )}
      
      <div className={`relative rounded-md shadow-sm transition-all duration-150
        ${hasError ? 'shadow-red-100' : (focused ? 'shadow-indigo-100' : '')}
      `}>
        {prefix && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">{prefix}</span>
          </div>
        )}
        
        {icon && !prefix && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          maxLength={maxLength}
          autoComplete={autoComplete}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`block w-full transition-colors duration-200 
            ${icon || prefix ? 'pl-10' : ''}
            ${suffix ? 'pr-10' : ''}
            ${sizeClasses[size]}
            ${hasError 
              ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
            }
            ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'}
            rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 
          `}
        />
        
        {suffix && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">{suffix}</span>
          </div>
        )}
        
        {hasError && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <AlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
          </div>
        )}
      </div>
      
      {/* Error display */}
      {hasError && (
        <p className="mt-1 text-sm text-red-600" id={`${id}-error`}>
          {displayedError}
        </p>
      )}
      
      {/* Help text - only shown when no error */}
      {helpText && !hasError && (
        <p className="mt-1 text-sm text-gray-500" id={`${id}-description`}>
          {helpText}
        </p>
      )}
    </div>
  );
};

export default ModernInput; 