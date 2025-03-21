'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { AlertCircle, DollarSign, Info, Indian } from 'lucide-react';

// Custom Rupee icon component since Lucide doesn't have a built-in one
const RupeeIcon = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M18 7H9.5a3.5 3.5 0 0 0 0 7h.5"></path>
    <path d="M18 14H9.6a3.5 3.5 0 0 0 0 7H18"></path>
    <path d="M6 7h12"></path>
  </svg>
);

const PriceInput = ({
  id,
  name,
  label,
  value,
  onChange,
  required = false,
  error = null,
  helpText = null,
  className = '',
  disabled = false,
  readOnly = false,
  min = 0,
  max = Number.MAX_SAFE_INTEGER,
  placeholder = '0.00',
  size = 'default', // 'small', 'default', 'large'
  tooltip = null,
  currency = 'USD',
  showCurrencySymbol = true,
  precision = 2,
  step = 0.01,
  allowNegative = false,
  showControl = false,
  isFree = false, // Option to mark as "Free" instead of 0
}) => {
  const [localValue, setLocalValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  
  // Get currency symbol
  const getCurrencySymbol = () => {
    if (!showCurrencySymbol) return '';
    
    // Handle specific currency symbols
    if (currency === 'INR') return '₹';
    
    // Default approach using Intl.NumberFormat
    return new Intl.NumberFormat('en', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(0).replace(/[0-9]/g, '').trim();
  };
  
  // Format for display
  const formatForDisplay = (val) => {
    if (val === '' || val === null || val === undefined) return '';
    if (val === 0 && isFree) return 'Free';
    
    const formatter = new Intl.NumberFormat(undefined, {
      style: showCurrencySymbol ? 'currency' : 'decimal',
      currency: showCurrencySymbol ? currency : undefined,
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
    });
    
    return formatter.format(val);
  };
  
  // Format for editing
  const formatForEditing = (val) => {
    if (val === '' || val === null || val === undefined) return '';
    if (val === 0 && isFree) return 'Free';
    
    return Number(val).toFixed(precision);
  };
  
  // Parse value from string to number
  const parseValueToNumber = (val) => {
    if (val === '' || val === null || val === 'Free') return '';
    
    // Remove currency symbol and non-numeric characters except decimal point and minus
    const cleaned = val.replace(getCurrencySymbol(), '').replace(/[^\d.-]/g, '');
    
    // Handle negative values
    if (!allowNegative && cleaned.startsWith('-')) {
      return 0;
    }
    
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? '' : parsed;
  };
  
  // Update local value when prop value changes
  useEffect(() => {
    if (isFocused) {
      setLocalValue(formatForEditing(value));
    } else {
      setLocalValue(formatForDisplay(value));
    }
    
    setIsEmpty(value === '' || value === null || value === undefined);
  }, [value, isFocused]);
  
  // Handle input change
  const handleChange = (e) => {
    if (disabled || readOnly) return;
    
    let inputValue = e.target.value;
    
    // Allow "Free" text if isFree is enabled
    if (isFree && (inputValue === 'F' || inputValue === 'Fr' || inputValue === 'Fre' || inputValue === 'Free')) {
      setLocalValue(inputValue);
      
      if (inputValue === 'Free') {
        onChange({
          target: {
            name,
            value: 0
          }
        });
      }
      return;
    }
    
    // Replace any non-numeric/decimal/minus with empty string
    const regex = allowNegative ? /^-?\d*\.?\d*$/ : /^\d*\.?\d*$/;
    
    if (inputValue === '' || inputValue === '.' || inputValue === '-' || regex.test(inputValue)) {
      setLocalValue(inputValue);
      
      if (inputValue === '' || inputValue === '.' || inputValue === '-') {
        // Don't update parent yet
      } else {
        const parsedValue = parseFloat(inputValue);
        if (!isNaN(parsedValue) && parsedValue !== value) {
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
  
  // Handle focus
  const handleFocus = () => {
    setIsFocused(true);
    // Convert to editable format on focus
    setLocalValue(formatForEditing(value));
  };
  
  // Handle blur
  const handleBlur = () => {
    setIsFocused(false);
    
    if (localValue === '' || localValue === '.' || localValue === '-') {
      setLocalValue('');
      onChange({
        target: {
          name,
          value: ''
        }
      });
      setIsEmpty(true);
      return;
    }
    
    if (localValue === 'Free' && isFree) {
      onChange({
        target: {
          name,
          value: 0
        }
      });
      return;
    }
    
    let parsedValue = parseValueToNumber(localValue);
    
    // Clamp to min/max
    if (parsedValue !== '') {
      if (parsedValue < min) parsedValue = min;
      if (parsedValue > max) parsedValue = max;
    }
    
    // Set to formatted display value
    setLocalValue(formatForDisplay(parsedValue));
    
    // Notify parent of change if needed
    if (parsedValue !== value) {
      onChange({
        target: {
          name,
          value: parsedValue
        }
      });
    }
    
    setIsEmpty(parsedValue === '' || parsedValue === null || parsedValue === undefined);
  };
  
  // Toggle free
  const toggleFree = () => {
    if (disabled || readOnly) return;
    
    if (value === 0) {
      // If currently free, set to min value or step
      const newValue = min > 0 ? min : step;
      setLocalValue(formatForDisplay(newValue));
      onChange({
        target: {
          name,
          value: newValue
        }
      });
    } else {
      // Set to free (0)
      setLocalValue('Free');
      onChange({
        target: {
          name,
          value: 0
        }
      });
    }
  };
  
  // Size configuration
  const sizeClasses = {
    small: 'py-1 px-2 text-sm',
    default: 'py-2 px-3',
    large: 'py-2.5 px-4 text-lg',
  };
  
  return (
    <div className={`price-input ${className}`}>
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
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {currency === 'INR' ? <RupeeIcon className="h-5 w-5 text-gray-400" /> : <DollarSign className="h-5 w-5 text-gray-400" />}
            </div>
            
            <input
              type="text"
              id={id}
              name={name}
              value={localValue}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={placeholder}
              disabled={disabled}
              readOnly={readOnly}
              className={`
                block w-full pl-10
                border-gray-300 focus:outline-none
                rounded-md sm:text-sm
                ${error ? 'border-red-300 text-red-900 placeholder-red-300' : 'border-gray-300'}
                ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
                ${sizeClasses[size]}
                ${showControl ? 'rounded-r-none' : ''}
              `}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={error ? `${id}-error` : helpText ? `${id}-description` : undefined}
            />
          </div>
          
          {isFree && showControl && (
            <button
              type="button"
              onClick={toggleFree}
              className={`
                inline-flex items-center px-3 py-2
                border border-l-0 border-gray-300
                bg-gray-50 text-gray-500 text-sm
                rounded-r-md hover:bg-gray-100
                focus:outline-none focus:ring-1 focus:ring-indigo-500
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                transition-colors
              `}
              disabled={disabled || readOnly}
            >
              {value === 0 ? 'Paid' : 'Free'}
            </button>
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

export default PriceInput; 