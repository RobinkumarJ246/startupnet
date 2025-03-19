'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import React from 'react';

const FormSection = ({
  title,
  description,
  children,
  icon: Icon = null,
  collapsible = false,
  defaultOpen = true,
  className = '',
  titleClassName = '',
  contentClassName = '',
  badge = null,
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleOpen = () => {
    if (collapsible) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={`form-section border border-gray-200 rounded-xl overflow-hidden bg-white mb-6 ${className}`}>
      {/* Header */}
      <div 
        className={`
          px-6 py-4 bg-gradient-to-r from-gray-50 to-white 
          border-b border-gray-200 flex items-center 
          ${collapsible ? 'cursor-pointer hover:bg-gray-50' : ''}
          ${titleClassName}
        `}
        onClick={toggleOpen}
      >
        {/* Left side - Icon & Title */}
        <div className="flex items-center flex-1">
          {Icon && (
            <div className="mr-3 text-indigo-600">
              {React.isValidElement(Icon) ? (
                Icon
              ) : typeof Icon === 'function' ? (
                <Icon className="h-6 w-6" />
              ) : null}
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              {title}
              {required && <span className="text-indigo-500 ml-2 text-sm">(Required)</span>}
              
              {badge && (
                <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${badge.className || 'bg-indigo-100 text-indigo-800'}`}>
                  {badge.text}
                </span>
              )}
            </h3>
            
            {description && (
              <p className="text-sm text-gray-500 mt-0.5">{description}</p>
            )}
          </div>
        </div>
        
        {/* Right side - Collapse control */}
        {collapsible && (
          <div className="ml-4 text-gray-400">
            {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </div>
        )}
      </div>
      
      {/* Content */}
      {(!collapsible || isOpen) && (
        <div className={`p-6 ${contentClassName}`}>
          {children}
        </div>
      )}
    </div>
  );
};

export default FormSection; 