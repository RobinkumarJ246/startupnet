'use client';

import React from 'react';
import { useState } from 'react';
import { Info } from 'lucide-react';

const RadioCardGroup = ({
  name,
  label,
  options = [],
  value,
  onChange,
  required = false,
  helpText = null,
  error = null,
  className = '',
  layout = 'horizontal', // 'horizontal', 'vertical', 'grid'
  tooltip = null,
  itemClassName = '',
  itemSize = 'default', // 'small', 'default', 'large'
  iconPosition = 'top', // 'top', 'left', 'right'
}) => {
  const handleChange = (selectedValue) => {
    onChange({
      target: {
        name,
        value: selectedValue,
      },
    });
  };

  // Layout classes
  const layoutClasses = {
    horizontal: 'flex flex-wrap gap-4',
    vertical: 'flex flex-col gap-3',
    grid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4',
  };

  // Item size classes
  const itemSizeClasses = {
    small: 'p-3',
    default: 'p-4',
    large: 'p-5',
  };

  // Icon position classes
  const iconPositionClasses = {
    top: 'flex flex-col items-center text-center',
    left: 'flex items-center',
    right: 'flex items-center justify-between',
  };

  const iconContainerClasses = {
    top: 'mb-3',
    left: 'mr-4',
    right: 'ml-4 order-2',
  };

  return (
    <div className={`radio-card-group ${className}`}>
      {label && (
        <div className="flex items-center mb-3">
          <span className="text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-indigo-500 ml-1">*</span>}
          </span>
          
          {tooltip && (
            <div className="group relative ml-1">
              <Info className="h-3 w-3 text-gray-400 cursor-help" />
              <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity absolute z-10 -top-1 left-full ml-2 w-64 bg-gray-900 text-white text-xs rounded-md py-1 px-2">
                {tooltip}
              </div>
            </div>
          )}
        </div>
      )}

      <div className={`${layoutClasses[layout]}`}>
        {options.map((option) => {
          const isSelected = value === option.value;
          
          return (
            <div
              key={option.value}
              className={`
                relative rounded-lg border-2 cursor-pointer transition-all duration-200
                ${isSelected 
                  ? 'border-indigo-500 bg-indigo-50 shadow-sm' 
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }
                ${itemSizeClasses[itemSize]}
                ${iconPositionClasses[iconPosition]}
                ${itemClassName}
              `}
              onClick={() => handleChange(option.value)}
            >
              {/* Radio circle indicator */}
              <div className="absolute top-3 right-3">
                <div 
                  className={`
                    w-5 h-5 rounded-full border flex items-center justify-center
                    ${isSelected ? 'border-indigo-500' : 'border-gray-300'}
                  `}
                >
                  {isSelected && (
                    <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                  )}
                </div>
              </div>
              
              {/* Icon */}
              {option.icon && (
                <div className={`text-indigo-600 ${iconContainerClasses[iconPosition]}`}>
                  {option.icon}
                </div>
              )}
              
              {/* Content */}
              <div className={iconPosition === 'right' ? 'order-1' : ''}>
                <h3 className={`font-medium ${isSelected ? 'text-indigo-700' : 'text-gray-900'}`}>
                  {option.label}
                </h3>
                
                {option.description && (
                  <p className={`text-sm mt-1 ${isSelected ? 'text-indigo-600' : 'text-gray-500'}`}>
                    {option.description}
                  </p>
                )}
                
                {/* Conditional content - only show when selected */}
                {isSelected && option.extraContent && (
                  <div className="mt-3 pt-2 border-t border-indigo-200">
                    {option.extraContent}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Error message */}
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
      
      {/* Help text */}
      {helpText && !error && (
        <p className="mt-2 text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
};

export default RadioCardGroup; 