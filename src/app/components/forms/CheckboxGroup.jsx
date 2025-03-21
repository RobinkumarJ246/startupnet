'use client';

import React from 'react';
import { useState } from 'react';
import { AlertCircle, Info, Check } from 'lucide-react';

const CheckboxGroup = ({
  id,
  name,
  label,
  options = [],
  value = [],
  onChange,
  required = false,
  error = null,
  helpText = null,
  className = '',
  disabled = false,
  columns = 1,
  tooltip = null,
  direction = 'vertical', // 'vertical' or 'horizontal'
}) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleChange = (optionValue) => {
    if (disabled) return;
    
    const newValue = [...value];
    const index = newValue.indexOf(optionValue);
    
    if (index > -1) {
      newValue.splice(index, 1);
    } else {
      newValue.push(optionValue);
    }
    
    onChange({
      target: {
        name,
        value: newValue
      }
    });
  };
  
  const isChecked = (optionValue) => {
    return value && value.includes(optionValue);
  };
  
  // Calculate grid template columns based on the columns prop
  const gridTemplateColumns = 
    columns > 1 
      ? `grid-template-columns: repeat(${columns}, minmax(0, 1fr))`
      : '';
  
  // Direction classes
  const directionClasses = {
    vertical: 'flex-col space-y-2',
    horizontal: 'flex-row flex-wrap gap-4',
  };

  return (
    <div className={`checkbox-group ${className}`}>
      {label && (
        <div className="flex items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-indigo-500 ml-1">*</span>}
          </label>
          
          {tooltip && (
            <div className="group relative ml-1">
              <Info className="h-3 w-3 text-gray-400 cursor-help" />
              <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-150 absolute z-10 -top-1 left-full ml-2 w-64 bg-gray-900 text-white text-xs rounded-md py-1 px-2">
                {tooltip}
              </div>
            </div>
          )}
        </div>
      )}
      
      <div 
        className={`flex ${directionClasses[direction]}`}
        style={{ style: gridTemplateColumns }}
        role="group"
        aria-labelledby={`${id}-label`}
      >
        {options.map((option, index) => (
          <div 
            key={option.value}
            className={`
              flex items-center
              ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
            `}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => handleChange(option.value)}
          >
            <div className={`
              relative flex items-center justify-center w-5 h-5 mr-2
              border rounded transition-all duration-200
              ${isChecked(option.value) 
                ? 'bg-indigo-600 border-indigo-600' 
                : hoveredIndex === index && !disabled
                  ? 'border-indigo-400'
                  : 'border-gray-300'
              }
              ${disabled ? 'bg-gray-100' : ''}
            `}>
              {isChecked(option.value) && (
                <Check className="h-3.5 w-3.5 text-white" />
              )}
              
              <input
                type="checkbox"
                id={`${id}-${option.value}`}
                name={name}
                value={option.value}
                checked={isChecked(option.value)}
                onChange={() => {}} // Handled by the div click
                className="sr-only" // Hidden but accessible
                disabled={disabled}
                aria-describedby={helpText ? `${id}-description` : undefined}
              />
            </div>
            
            <label 
              htmlFor={`${id}-${option.value}`}
              className={`
                text-sm select-none
                ${disabled ? 'text-gray-500' : 'text-gray-700'}
              `}
            >
              {option.label}
              
              {option.description && (
                <p className="mt-0.5 text-xs text-gray-500">
                  {option.description}
                </p>
              )}
            </label>
          </div>
        ))}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600" id={`${id}-error`}>
          <AlertCircle className="inline-block h-3.5 w-3.5 mr-1" />
          {error}
        </p>
      )}
      
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500" id={`${id}-description`}>
          {helpText}
        </p>
      )}
    </div>
  );
};

export default CheckboxGroup; 