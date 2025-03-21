'use client';

import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { ChevronUp, ChevronDown, AlertCircle, Info } from 'lucide-react';

const NumberInput = ({
  id,
  name,
  label,
  value,
  onChange,
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  step = 1,
  required = false,
  error = null,
  helpText = null,
  placeholder = '',
  className = '',
  disabled = false,
  readOnly = false,
  size = 'default', // 'small', 'default', 'large'
  icon = null,
  tooltip = null,
  prefix = '',
  suffix = '',
  showControls = true,
  allowDecimals = true,
  format = null, // Function to format the displayed value
}) => {
  const [localValue, setLocalValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const incrementTimerRef = useRef(null);
  const decrementTimerRef = useRef(null);
  
  // Format for display
  const formatValue = (val) => {
    if (val === '' || val === null || val === undefined) return '';
    
    if (format) {
      return format(val);
    }
    
    if (!allowDecimals) {
      return parseInt(val).toString();
    }
    
    return val.toString();
  };
  
  // Parse value from string to number
  const parseInputValue = (val) => {
    if (val === '' || val === null) return '';
    
    if (!allowDecimals) {
      const parsed = parseInt(val);
      return isNaN(parsed) ? '' : parsed;
    }
    
    const parsed = parseFloat(val);
    return isNaN(parsed) ? '' : parsed;
  };
  
  // Update local value when prop value changes
  useEffect(() => {
    setLocalValue(formatValue(value));
  }, [value]);
  
  // Handle input change
  const handleChange = (e) => {
    if (disabled || readOnly) return;
    
    const inputValue = e.target.value;
    
    // Allow empty value, negative sign, or decimal point (if allowed)
    if (
      inputValue === '' || 
      inputValue === '-' || 
      (allowDecimals && inputValue === '.') ||
      (allowDecimals && inputValue === '-.') ||
      (allowDecimals && /^-?\d*\.?\d*$/.test(inputValue)) ||
      (!allowDecimals && /^-?\d*$/.test(inputValue))
    ) {
      setLocalValue(inputValue);
      
      // Only update parent if we have a valid number
      if (inputValue === '' || inputValue === '-' || inputValue === '.' || inputValue === '-.') {
        // Don't update parent value yet
      } else {
        const parsedValue = parseInputValue(inputValue);
        if (parsedValue !== value) {
          onChange({
            target: {
              name,
              value: parsedValue
            }
          });
        }
      }
    }
  };
  
  // Handle blur event - format and validate
  const handleBlur = () => {
    setIsFocused(false);
    
    if (localValue === '' || localValue === '-' || localValue === '.' || localValue === '-.') {
      setLocalValue('');
      onChange({
        target: {
          name,
          value: ''
        }
      });
      return;
    }
    
    let parsedValue = parseInputValue(localValue);
    
    // Clamp to min/max
    if (parsedValue !== '') {
      if (parsedValue < min) parsedValue = min;
      if (parsedValue > max) parsedValue = max;
    }
    
    // Format the value for display
    setLocalValue(formatValue(parsedValue));
    
    // Notify parent of change if needed
    if (parsedValue !== value) {
      onChange({
        target: {
          name,
          value: parsedValue
        }
      });
    }
  };
  
  // Handle focus event
  const handleFocus = () => {
    setIsFocused(true);
  };
  
  // Handle increment
  const handleIncrement = () => {
    if (disabled || readOnly) return;
    
    const currentValue = localValue === '' ? 0 : parseInputValue(localValue);
    let newValue = currentValue + step;
    
    // Round to avoid floating point issues
    if (allowDecimals) {
      const precision = Math.max(0, (step.toString().split('.')[1] || '').length);
      newValue = parseFloat(newValue.toFixed(precision));
    } else {
      newValue = Math.floor(newValue);
    }
    
    // Clamp to max
    if (newValue > max) newValue = max;
    
    setLocalValue(formatValue(newValue));
    onChange({
      target: {
        name,
        value: newValue
      }
    });
  };
  
  // Handle decrement
  const handleDecrement = () => {
    if (disabled || readOnly) return;
    
    const currentValue = localValue === '' ? 0 : parseInputValue(localValue);
    let newValue = currentValue - step;
    
    // Round to avoid floating point issues
    if (allowDecimals) {
      const precision = Math.max(0, (step.toString().split('.')[1] || '').length);
      newValue = parseFloat(newValue.toFixed(precision));
    } else {
      newValue = Math.floor(newValue);
    }
    
    // Clamp to min
    if (newValue < min) newValue = min;
    
    setLocalValue(formatValue(newValue));
    onChange({
      target: {
        name,
        value: newValue
      }
    });
  };
  
  // Handle long press start - increment
  const handleIncrementMouseDown = () => {
    if (disabled || readOnly) return;
    
    handleIncrement();
    
    // Set a timeout before starting rapid increment
    const timeoutId = setTimeout(() => {
      incrementTimerRef.current = setInterval(handleIncrement, 100);
    }, 500);
    
    // Clear the timeout if mouse up happens before it fires
    incrementTimerRef.current = timeoutId;
  };
  
  // Handle long press end - increment
  const handleIncrementMouseUp = () => {
    if (incrementTimerRef.current) {
      clearTimeout(incrementTimerRef.current);
      clearInterval(incrementTimerRef.current);
      incrementTimerRef.current = null;
    }
  };
  
  // Handle long press start - decrement
  const handleDecrementMouseDown = () => {
    if (disabled || readOnly) return;
    
    handleDecrement();
    
    // Set a timeout before starting rapid decrement
    const timeoutId = setTimeout(() => {
      decrementTimerRef.current = setInterval(handleDecrement, 100);
    }, 500);
    
    // Clear the timeout if mouse up happens before it fires
    decrementTimerRef.current = timeoutId;
  };
  
  // Handle long press end - decrement
  const handleDecrementMouseUp = () => {
    if (decrementTimerRef.current) {
      clearTimeout(decrementTimerRef.current);
      clearInterval(decrementTimerRef.current);
      decrementTimerRef.current = null;
    }
  };
  
  // Cleanup timers
  useEffect(() => {
    return () => {
      if (incrementTimerRef.current) {
        clearTimeout(incrementTimerRef.current);
        clearInterval(incrementTimerRef.current);
      }
      if (decrementTimerRef.current) {
        clearTimeout(decrementTimerRef.current);
        clearInterval(decrementTimerRef.current);
      }
    };
  }, []);
  
  // Size configuration
  const sizeClasses = {
    small: 'py-1 px-2 text-sm',
    default: 'py-2 px-3',
    large: 'py-2.5 px-4 text-lg',
  };
  
  const buttonSizeClasses = {
    small: 'h-4 w-4',
    default: 'h-5 w-5',
    large: 'h-6 w-6',
  };
  
  return (
    <div className={`number-input ${className}`}>
      {label && (
        <div className="flex items-center mb-1">
          <label htmlFor={id} className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-indigo-500 ml-1">*</span>}
          </label>
          
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
      
      <div className="relative">
        <div className={`
          flex rounded-md shadow-sm
          ${error ? 'ring-1 ring-red-500' : isFocused ? 'ring-2 ring-indigo-500' : ''}
        `}>
          {prefix && (
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
              {prefix}
            </span>
          )}
          
          <div className="relative flex-1">
            {icon && (
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {icon}
              </div>
            )}
            
            <input
              ref={inputRef}
              type="text"
              id={id}
              name={name}
              value={localValue}
              onChange={handleChange}
              onBlur={handleBlur}
              onFocus={handleFocus}
              placeholder={placeholder}
              disabled={disabled}
              readOnly={readOnly}
              className={`
                block w-full
                border-gray-300 focus:outline-none
                rounded-md sm:text-sm
                ${prefix ? 'rounded-l-none' : ''}
                ${suffix || showControls ? 'rounded-r-none' : ''}
                ${icon ? 'pl-10' : ''}
                ${error ? 'border-red-300 text-red-900 placeholder-red-300' : 'border-gray-300'}
                ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
                ${sizeClasses[size]}
              `}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={error ? `${id}-error` : helpText ? `${id}-description` : undefined}
            />
          </div>
          
          {suffix && (
            <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
              {suffix}
            </span>
          )}
          
          {showControls && (
            <div className="flex flex-col -ml-px">
              <button
                type="button"
                className={`
                  flex-1 flex items-center justify-center
                  text-gray-500 hover:text-gray-700
                  rounded-tr-md border border-gray-300
                  bg-gray-50 hover:bg-gray-100
                  ${disabled || value >= max ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
                tabIndex="-1"
                aria-label="Increment"
                onMouseDown={handleIncrementMouseDown}
                onMouseUp={handleIncrementMouseUp}
                onMouseLeave={handleIncrementMouseUp}
                onTouchStart={handleIncrementMouseDown}
                onTouchEnd={handleIncrementMouseUp}
                disabled={disabled || readOnly || value >= max}
              >
                <ChevronUp className={buttonSizeClasses[size]} />
              </button>
              
              <button
                type="button"
                className={`
                  flex-1 flex items-center justify-center
                  text-gray-500 hover:text-gray-700
                  rounded-br-md border border-t-0 border-gray-300
                  bg-gray-50 hover:bg-gray-100
                  ${disabled || value <= min ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
                tabIndex="-1"
                aria-label="Decrement"
                onMouseDown={handleDecrementMouseDown}
                onMouseUp={handleDecrementMouseUp}
                onMouseLeave={handleDecrementMouseUp}
                onTouchStart={handleDecrementMouseDown}
                onTouchEnd={handleDecrementMouseUp}
                disabled={disabled || readOnly || value <= min}
              >
                <ChevronDown className={buttonSizeClasses[size]} />
              </button>
            </div>
          )}
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
    </div>
  );
};

export default NumberInput; 