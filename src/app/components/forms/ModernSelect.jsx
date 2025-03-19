'use client';

import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, AlertCircle, Info } from 'lucide-react';

const ModernSelect = ({
  id,
  name,
  label,
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  required = false,
  error = null,
  helpText = null,
  icon = null,
  className = '',
  disabled = false,
  size = 'default', // 'small', 'default', 'large'
  tooltip = null,
  searchable = false,
  multiple = false,
  clearable = false,
  maxHeight = '250px',
  optionRenderer = null, // custom renderer for options
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);
  
  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setSearchTerm('');
    }
  };
  
  const handleSelect = (option) => {
    if (multiple) {
      const newValue = Array.isArray(value) ? [...value] : [];
      const index = newValue.findIndex(v => v === option.value);
      
      if (index > -1) {
        newValue.splice(index, 1);
      } else {
        newValue.push(option.value);
      }
      
      onChange({
        target: {
          name,
          value: newValue
        }
      });
    } else {
      onChange({
        target: {
          name,
          value: option.value
        }
      });
      setIsOpen(false);
    }
  };
  
  const handleClear = (e) => {
    e.stopPropagation();
    onChange({
      target: {
        name,
        value: multiple ? [] : ''
      }
    });
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const filteredOptions = searchTerm
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (option.searchTerms && option.searchTerms.some(term => 
          term.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      )
    : options;
  
  const getSelectedLabel = () => {
    if (multiple && Array.isArray(value) && value.length > 0) {
      if (value.length === 1) {
        const selectedOption = options.find(o => o.value === value[0]);
        return selectedOption ? selectedOption.label : placeholder;
      }
      return `${value.length} selected`;
    }
    
    const selectedOption = options.find(o => o.value === value);
    return selectedOption ? selectedOption.label : placeholder;
  };
  
  const isOptionSelected = (optionValue) => {
    if (multiple && Array.isArray(value)) {
      return value.includes(optionValue);
    }
    return value === optionValue;
  };
  
  // Size configuration
  const sizeClasses = {
    small: 'py-1.5 pl-3 pr-8 text-sm',
    default: 'py-2 pl-3 pr-10',
    large: 'py-3 pl-4 pr-12 text-lg',
  };
  
  const buttonSizeClasses = {
    small: 'h-8',
    default: 'h-10',
    large: 'h-12',
  };
  
  const iconSizeClasses = {
    small: 'h-4 w-4',
    default: 'h-5 w-5',
    large: 'h-6 w-6',
  };
  
  return (
    <div className={`modern-select relative ${className}`} ref={containerRef}>
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
        <button
          type="button"
          id={id}
          className={`
            flex items-center justify-between w-full rounded-md border shadow-sm 
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
            transition-colors duration-200
            ${buttonSizeClasses[size]}
            ${sizeClasses[size]}
            ${icon ? 'pl-9' : ''}
            ${error 
              ? 'border-red-300 text-red-900 placeholder-red-300' 
              : 'border-gray-300 text-gray-700'
            }
            ${disabled 
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
              : 'bg-white hover:bg-gray-50'
            }
          `}
          onClick={handleToggle}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          disabled={disabled}
        >
          {icon && (
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              {icon}
            </span>
          )}
          
          <span className={`block truncate text-left ${!value ? 'text-gray-400' : ''}`}>
            {getSelectedLabel()}
          </span>
          
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            {error ? (
              <AlertCircle className={`${iconSizeClasses[size]} text-red-500`} />
            ) : clearable && (multiple ? (value && value.length > 0) : value) ? (
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={handleClear}
              >
                <span className="sr-only">Clear</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            ) : (
              <ChevronDown className={`${iconSizeClasses[size]} text-gray-400`} />
            )}
          </span>
        </button>
        
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {searchable && (
              <div className="p-2 border-b border-gray-200">
                <input
                  ref={searchInputRef}
                  type="text"
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Search options..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
            
            <ul 
              className={`py-1 overflow-auto max-h-[${maxHeight}]`}
              role="listbox"
              tabIndex={-1}
            >
              {filteredOptions.length === 0 ? (
                <li className="text-center py-2 px-3 text-sm text-gray-500">
                  No options found
                </li>
              ) : (
                filteredOptions.map(option => {
                  const selected = isOptionSelected(option.value);
                  
                  return (
                    <li
                      key={option.value}
                      className={`
                        cursor-pointer select-none relative py-2 pl-3 pr-9 
                        ${selected ? 'bg-indigo-50 text-indigo-900' : 'text-gray-900'}
                        hover:bg-indigo-50 transition-colors duration-100
                      `}
                      role="option"
                      aria-selected={selected}
                      onClick={() => handleSelect(option)}
                    >
                      {optionRenderer ? (
                        optionRenderer(option, selected)
                      ) : (
                        <>
                          <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                            {option.label}
                          </span>
                          
                          {selected && (
                            <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600">
                              <Check className="h-5 w-5" />
                            </span>
                          )}
                        </>
                      )}
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600" id={`${id}-error`}>
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

export default ModernSelect; 