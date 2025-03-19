'use client';

import React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';

const ToggleSwitch = ({
  id,
  name,
  label,
  checked = false,
  onChange,
  disabled = false,
  size = 'default', // 'small', 'default', 'large'
  onLabel = 'Yes',
  offLabel = 'No',
  showLabels = true,
  color = 'indigo', // 'indigo', 'blue', 'green', 'purple'
  tooltip = null,
  helpText = null,
  className = '',
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e) => {
    if (!disabled) {
      onChange({
        target: {
          name,
          type: 'checkbox',
          checked: !checked,
        },
      });
    }
  };

  const handleKeyPress = (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
      e.preventDefault();
      handleChange(e);
    }
  };

  const colorClasses = {
    indigo: {
      bg: 'bg-indigo-600',
      focusRing: 'focus-visible:ring-indigo-500',
      disabled: 'bg-indigo-300',
    },
    blue: {
      bg: 'bg-blue-600',
      focusRing: 'focus-visible:ring-blue-500',
      disabled: 'bg-blue-300',
    },
    green: {
      bg: 'bg-green-600',
      focusRing: 'focus-visible:ring-green-500',
      disabled: 'bg-green-300',
    },
    purple: {
      bg: 'bg-purple-600',
      focusRing: 'focus-visible:ring-purple-500',
      disabled: 'bg-purple-300',
    },
  };

  const sizeClasses = {
    small: {
      track: 'w-8 h-4',
      knob: 'w-3 h-3 translate-x-0.5',
      knobChecked: 'translate-x-4',
      labelText: 'text-xs',
    },
    default: {
      track: 'w-11 h-6',
      knob: 'w-5 h-5 translate-x-0.5',
      knobChecked: 'translate-x-5',
      labelText: 'text-sm',
    },
    large: {
      track: 'w-14 h-8',
      knob: 'w-6 h-6 translate-x-1',
      knobChecked: 'translate-x-7',
      labelText: 'text-base',
    },
  };

  return (
    <div className={`toggle-switch ${className}`}>
      <div className="flex items-center">
        {label && (
          <label 
            htmlFor={id} 
            className={`mr-3 ${sizeClasses[size].labelText} font-medium text-gray-700 flex items-center`}
          >
            {label}
            
            {tooltip && (
              <div className="group relative ml-1">
                <Info className="h-3 w-3 text-gray-400 cursor-help" />
                <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity absolute z-10 -top-1 left-full ml-2 w-64 bg-gray-900 text-white text-xs rounded-md py-1 px-2">
                  {tooltip}
                </div>
              </div>
            )}
          </label>
        )}
        
        <button
          type="button"
          id={id}
          role="switch"
          aria-checked={checked}
          onClick={handleChange}
          onKeyDown={handleKeyPress}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          className={`
            relative inline-flex shrink-0 cursor-pointer rounded-full 
            transition-colors duration-200 ease-in-out
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
            ${sizeClasses[size].track}
            ${
              disabled
                ? 'cursor-not-allowed opacity-70'
                : isFocused
                ? colorClasses[color].focusRing
                : ''
            }
            ${
              checked
                ? disabled
                  ? colorClasses[color].disabled
                  : colorClasses[color].bg
                : 'bg-gray-200'
            }
          `}
        >
          <span className="sr-only">{checked ? onLabel : offLabel}</span>
          
          <motion.span
            layout
            initial={false}
            animate={{
              translateX: checked ? sizeClasses[size].knobChecked : sizeClasses[size].knob.split(' ').pop(),
            }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={`
              inline-block rounded-full bg-white shadow-lg ring-0 
              ${sizeClasses[size].knob.split(' ').slice(0, 2).join(' ')}
            `}
          />
        </button>
        
        {showLabels && (
          <span 
            className={`ml-2 ${sizeClasses[size].labelText} text-gray-600 ${disabled ? 'opacity-70' : ''}`}
          >
            {checked ? onLabel : offLabel}
          </span>
        )}
      </div>
      
      {helpText && (
        <p className="mt-1 text-sm text-gray-500" id={`${id}-description`}>
          {helpText}
        </p>
      )}
    </div>
  );
};

export default ToggleSwitch; 