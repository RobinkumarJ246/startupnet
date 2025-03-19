'use client';

import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight, AlertCircle, Info } from 'lucide-react';

const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

const DateRangePicker = ({
  id,
  name,
  label,
  startDate,
  endDate,
  onChange,
  required = false,
  error = null,
  helpText = null,
  className = '',
  disabled = false,
  showTime = false,
  minDate = null,
  maxDate = null,
  tooltip = null,
  singleDate = false,
  timeInterval = 30, // minutes
  disabledDates = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(
    startDate ? new Date(startDate) : new Date()
  );
  const [hoverDate, setHoverDate] = useState(null);
  const [activeInput, setActiveInput] = useState(singleDate ? 'single' : 'start');
  const [startTime, setStartTime] = useState(startDate ? new Date(startDate) : null);
  const [endTime, setEndTime] = useState(endDate ? new Date(endDate) : null);
  
  const containerRef = useRef(null);
  
  // Handle click outside to close the calendar
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
  
  // Get days in month for the calendar
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  // Get day of week for the first day of the month
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };
  
  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() - 1);
      return newMonth;
    });
  };
  
  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() + 1);
      return newMonth;
    });
  };
  
  // Check if a date is today
  const isToday = (year, month, day) => {
    const today = new Date();
    return (
      year === today.getFullYear() &&
      month === today.getMonth() &&
      day === today.getDate()
    );
  };
  
  // Check if a date is selected
  const isSelected = (year, month, day) => {
    if (!startDate && !endDate) return false;
    
    const date = new Date(year, month, day);
    
    if (singleDate && startDate) {
      const selected = new Date(startDate);
      return (
        date.getFullYear() === selected.getFullYear() &&
        date.getMonth() === selected.getMonth() &&
        date.getDate() === selected.getDate()
      );
    }
    
    if (startDate) {
      const start = new Date(startDate);
      if (
        date.getFullYear() === start.getFullYear() &&
        date.getMonth() === start.getMonth() &&
        date.getDate() === start.getDate()
      ) {
        return true;
      }
    }
    
    if (endDate) {
      const end = new Date(endDate);
      if (
        date.getFullYear() === end.getFullYear() &&
        date.getMonth() === end.getMonth() &&
        date.getDate() === end.getDate()
      ) {
        return true;
      }
    }
    
    return false;
  };
  
  // Check if a date is in the selected range
  const isInRange = (year, month, day) => {
    if (!startDate || !endDate) return false;
    
    const date = new Date(year, month, day);
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Reset time parts for comparison
    date.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    
    return date > start && date < end;
  };
  
  // Check if a date is the hovered date when selecting a range
  const isHovered = (year, month, day) => {
    if (!hoverDate || !startDate || endDate || activeInput !== 'end') return false;
    
    const date = new Date(year, month, day);
    const start = new Date(startDate);
    const hover = new Date(hoverDate);
    
    // Reset time parts for comparison
    date.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    hover.setHours(0, 0, 0, 0);
    
    return date > start && date <= hover;
  };
  
  // Check if a date is disabled
  const isDisabled = (year, month, day) => {
    const date = new Date(year, month, day);
    date.setHours(0, 0, 0, 0);
    
    // Check min date
    if (minDate) {
      const min = new Date(minDate);
      min.setHours(0, 0, 0, 0);
      if (date < min) return true;
    }
    
    // Check max date
    if (maxDate) {
      const max = new Date(maxDate);
      max.setHours(0, 0, 0, 0);
      if (date > max) return true;
    }
    
    // Check disabled dates
    return disabledDates.some(disabledDate => {
      const disabled = new Date(disabledDate);
      disabled.setHours(0, 0, 0, 0);
      return date.getTime() === disabled.getTime();
    });
  };
  
  // Handle date selection
  const handleSelectDate = (year, month, day) => {
    if (isDisabled(year, month, day)) return;
    
    const selectedDate = new Date(year, month, day);
    
    if (singleDate) {
      // If showing time, keep the same time for the selected date
      if (showTime && startDate) {
        const existing = new Date(startDate);
        selectedDate.setHours(existing.getHours(), existing.getMinutes());
      } else {
        selectedDate.setHours(0, 0, 0, 0);
      }
      
      handleChange(selectedDate, null);
      setIsOpen(false);
      return;
    }
    
    if (activeInput === 'start') {
      // If selecting start date and there's an end date before it,
      // clear the end date
      if (endDate && selectedDate > new Date(endDate)) {
        if (showTime) {
          selectedDate.setHours(
            startTime ? startTime.getHours() : 0,
            startTime ? startTime.getMinutes() : 0
          );
        } else {
          selectedDate.setHours(0, 0, 0, 0);
        }
        handleChange(selectedDate, null);
      } else {
        if (showTime) {
          selectedDate.setHours(
            startTime ? startTime.getHours() : 0,
            startTime ? startTime.getMinutes() : 0
          );
        } else {
          selectedDate.setHours(0, 0, 0, 0);
        }
        handleChange(selectedDate, endDate);
      }
      
      setActiveInput('end');
    } else {
      // If selecting end date before start date, update start date instead
      if (startDate && selectedDate < new Date(startDate)) {
        if (showTime) {
          selectedDate.setHours(
            startTime ? startTime.getHours() : 0,
            startTime ? startTime.getMinutes() : 0
          );
        } else {
          selectedDate.setHours(0, 0, 0, 0);
        }
        handleChange(selectedDate, null);
        setActiveInput('end');
      } else {
        if (showTime) {
          selectedDate.setHours(
            endTime ? endTime.getHours() : 23,
            endTime ? endTime.getMinutes() : 59
          );
        } else {
          selectedDate.setHours(23, 59, 59, 999);
        }
        handleChange(startDate, selectedDate);
        setIsOpen(false);
      }
    }
  };
  
  // Handle mouse hover on date
  const handleDateHover = (year, month, day) => {
    if (activeInput === 'end' && startDate) {
      setHoverDate(new Date(year, month, day));
    }
  };
  
  // Handle time change
  const handleTimeChange = (e, type) => {
    const value = e.target.value;
    const [hours, minutes] = value.split(':').map(Number);
    
    if (type === 'start') {
      const newStartTime = startDate ? new Date(startDate) : new Date();
      newStartTime.setHours(hours, minutes);
      setStartTime(newStartTime);
      
      handleChange(newStartTime, endDate);
    } else {
      const newEndTime = endDate ? new Date(endDate) : new Date();
      newEndTime.setHours(hours, minutes);
      setEndTime(newEndTime);
      
      handleChange(startDate, newEndTime);
    }
  };
  
  // Handle the overall change in dates
  const handleChange = (start, end) => {
    onChange({
      target: {
        name,
        value: {
          startDate: start,
          endDate: end
        }
      }
    });
  };
  
  // Toggle the calendar open/closed
  const toggleCalendar = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      
      // Set active input based on which dates are already selected
      if (!isOpen) {
        if (singleDate) {
          setActiveInput('single');
        } else if (!startDate) {
          setActiveInput('start');
        } else if (!endDate) {
          setActiveInput('end');
        } else {
          setActiveInput('start');
        }
      }
    }
  };
  
  // Generate time options for the time dropdowns
  const generateTimeOptions = () => {
    const options = [];
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 60; j += timeInterval) {
        const hour = i.toString().padStart(2, '0');
        const minute = j.toString().padStart(2, '0');
        options.push(`${hour}:${minute}`);
      }
    }
    return options;
  };
  
  // Format time value for input
  const formatTimeForInput = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };
  
  // Render the calendar
  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days = [];
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-9"></div>);
    }
    
    // Add day cells
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelectedDay = isSelected(year, month, day);
      const inRange = isInRange(year, month, day);
      const isHoveredDay = isHovered(year, month, day);
      const todayClass = isToday(year, month, day) ? 'border border-indigo-300' : '';
      const disabledClass = isDisabled(year, month, day) ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-indigo-100';
      
      let selectionClass = '';
      if (isSelectedDay) {
        selectionClass = 'bg-indigo-600 text-white hover:bg-indigo-700';
      } else if (inRange || isHoveredDay) {
        selectionClass = 'bg-indigo-100';
      }
      
      days.push(
        <div
          key={day}
          className={`flex items-center justify-center h-9 rounded-full text-sm cursor-pointer ${todayClass} ${selectionClass} ${disabledClass}`}
          onClick={() => !isDisabled(year, month, day) && handleSelectDate(year, month, day)}
          onMouseEnter={() => handleDateHover(year, month, day)}
        >
          {day}
        </div>
      );
    }
    
    return days;
  };
  
  const timeOptions = showTime ? generateTimeOptions() : [];
  
  return (
    <div className={`date-range-picker relative ${className}`} ref={containerRef}>
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
      
      <div className={`relative flex ${singleDate ? '' : 'space-x-2'}`}>
        {/* Start Date Input */}
        <div 
          className={`relative flex-1 flex items-center px-3 py-2 border rounded-md shadow-sm
            ${error ? 'border-red-300' : 'border-gray-300'}
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white cursor-pointer hover:border-indigo-500'}
            ${activeInput === 'start' && isOpen ? 'ring-2 ring-indigo-500 border-indigo-500' : ''}
          `}
          onClick={() => {
            if (!disabled) {
              toggleCalendar();
              setActiveInput(singleDate ? 'single' : 'start');
            }
          }}
        >
          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
          <input
            type="text"
            readOnly
            className="bg-transparent border-none focus:outline-none focus:ring-0 w-full text-sm"
            placeholder={singleDate ? "Select date" : "Start date"}
            value={startDate ? formatDate(startDate) : ''}
            disabled={disabled}
          />
        </div>
        
        {/* End Date Input (only for range selection) */}
        {!singleDate && (
          <div 
            className={`relative flex-1 flex items-center px-3 py-2 border rounded-md shadow-sm
              ${error ? 'border-red-300' : 'border-gray-300'}
              ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white cursor-pointer hover:border-indigo-500'}
              ${activeInput === 'end' && isOpen ? 'ring-2 ring-indigo-500 border-indigo-500' : ''}
            `}
            onClick={() => {
              if (!disabled) {
                toggleCalendar();
                setActiveInput('end');
              }
            }}
          >
            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
            <input
              type="text"
              readOnly
              className="bg-transparent border-none focus:outline-none focus:ring-0 w-full text-sm"
              placeholder="End date"
              value={endDate ? formatDate(endDate) : ''}
              disabled={disabled}
            />
          </div>
        )}
      </div>
      
      {/* Time inputs (if showTime is true) */}
      {showTime && startDate && (
        <div className={`flex mt-2 ${singleDate ? '' : 'space-x-2'}`}>
          <div className="relative flex-1">
            <div className="flex items-center px-3 py-2 border rounded-md shadow-sm border-gray-300 bg-white">
              <Clock className="h-4 w-4 text-gray-400 mr-2" />
              <select
                className="bg-transparent border-none focus:outline-none focus:ring-0 w-full text-sm"
                value={formatTimeForInput(startDate)}
                onChange={(e) => handleTimeChange(e, 'start')}
                disabled={disabled || !startDate}
              >
                {timeOptions.map(time => (
                  <option key={time} value={time}>
                    {new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {!singleDate && endDate && (
            <div className="relative flex-1">
              <div className="flex items-center px-3 py-2 border rounded-md shadow-sm border-gray-300 bg-white">
                <Clock className="h-4 w-4 text-gray-400 mr-2" />
                <select
                  className="bg-transparent border-none focus:outline-none focus:ring-0 w-full text-sm"
                  value={formatTimeForInput(endDate)}
                  onChange={(e) => handleTimeChange(e, 'end')}
                  disabled={disabled || !endDate}
                >
                  {timeOptions.map(time => (
                    <option key={time} value={time}>
                      {new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Calendar Dropdown */}
      {isOpen && (
        <div className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <button 
              type="button" 
              className="p-1 hover:bg-gray-100 rounded"
              onClick={prevMonth}
            >
              <ChevronLeft className="h-5 w-5 text-gray-500" />
            </button>
            
            <h3 className="text-sm font-medium">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h3>
            
            <button 
              type="button" 
              className="p-1 hover:bg-gray-100 rounded"
              onClick={nextMonth}
            >
              <ChevronRight className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div key={day} className="text-xs text-gray-400 font-medium text-center">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {renderCalendar()}
          </div>
          
          <div className="mt-3 text-xs text-gray-500">
            {singleDate ? 'Click to select a date' : activeInput === 'start' ? 'Select start date' : 'Select end date'}
          </div>
        </div>
      )}
      
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
      
      {startDate && endDate && !singleDate && (
        <div className="mt-1 text-xs text-gray-500">
          Duration: {formatDuration(startDate, endDate)}
        </div>
      )}
    </div>
  );
};

// Helper function to calculate and format duration between two dates
const formatDuration = (start, end) => {
  if (!start || !end) return '';
  
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffMs = endDate - startDate;
  
  // Calculate days, hours, minutes
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  let result = '';
  if (days > 0) result += `${days} day${days > 1 ? 's' : ''} `;
  if (hours > 0) result += `${hours} hour${hours > 1 ? 's' : ''} `;
  if (minutes > 0) result += `${minutes} minute${minutes > 1 ? 's' : ''}`;
  
  return result.trim();
};

export default DateRangePicker; 