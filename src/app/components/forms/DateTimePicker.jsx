'use client';

import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, ChevronDown, AlertCircle } from 'lucide-react';

const DateTimePicker = ({
  id,
  name,
  label,
  value,
  onChange,
  required = false,
  error = null,
  placeholder = 'Select date and time',
  disabled = false,
  min,
  max,
  helpText = null,
  size = 'default', // 'small', 'default', 'large'
  showIcon = true,
  className = '',
  minDate = null,
  maxDate = null,
}) => {
  const [focused, setFocused] = useState(false);
  const [localValue, setLocalValue] = useState(value || '');
  const inputRef = useRef(null);
  
  useEffect(() => {
    // Keep local value in sync with prop
    setLocalValue(value || '');
  }, [value]);
  
  const handleFocus = () => {
    setFocused(true);
  };
  
  const handleBlur = () => {
    setFocused(false);
  };
  
  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange({
      target: {
        name,
        value: newValue
      }
    });
  };
  
  const handleClear = (e) => {
    e.stopPropagation();
    setLocalValue('');
    onChange({
      target: {
        name,
        value: ''
      }
    });
  };
  
  const handleIconClick = () => {
    if (!disabled) {
      inputRef.current.showPicker();
    }
  };
  
  const hasError = !!error;
  
  const sizeClasses = {
    small: 'py-1 pl-8 pr-10 text-sm',
    default: 'py-2 pl-9 pr-10',
    large: 'py-3 pl-10 pr-10 text-lg',
  };
  
  const iconSizeClasses = {
    small: 'h-4 w-4',
    default: 'h-5 w-5',
    large: 'h-6 w-6',
  };
  
  const labelSizeClasses = {
    small: 'text-xs',
    default: 'text-sm',
    large: 'text-base',
  };
  
  return (
    <div className={`date-time-picker ${className}`}>
      {label && (
        <label 
          htmlFor={id}
          className={`block ${labelSizeClasses[size]} font-medium text-gray-700 mb-1`}
        >
          {label}
          {required && <span className="text-indigo-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <div 
          className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ${
            disabled ? 'opacity-50' : ''
          }`}
        >
          {showIcon && <Calendar className={`${iconSizeClasses[size]} text-gray-400`} />}
        </div>
        
        <input
          ref={inputRef}
          id={id}
          name={name}
          type="datetime-local"
          value={localValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          min={minDate || min}
          max={maxDate || max}
          className={`block w-full rounded-md shadow-sm transition-all duration-200
            ${sizeClasses[size]}
            ${hasError 
              ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
            }
            ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'}
            ${focused ? (hasError ? 'shadow-red-100' : 'shadow-indigo-100') : ''}
          `}
        />
        
        <div 
          className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
          onClick={handleIconClick}
        >
          {localValue && !disabled ? (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
              tabIndex="-1"
            >
              <span className="sr-only">Clear</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ) : hasError ? (
            <AlertCircle className="h-5 w-5 text-red-500" />
          ) : (
            <ChevronDown className={`${iconSizeClasses[size]} text-gray-400`} />
          )}
        </div>
      </div>
      
      {hasError && (
        <p className="mt-1 text-sm text-red-600" id={`${id}-error`}>
          {error}
        </p>
      )}
      
      {helpText && !hasError && (
        <p className="mt-1 text-sm text-gray-500" id={`${id}-description`}>
          {helpText}
        </p>
      )}
    </div>
  );
};

export default DateTimePicker; 