'use client';
import { useState, useEffect, useRef } from 'react';
import { Building, AlertCircle, Search, X, ChevronDown } from 'lucide-react';

export default function UniversitySelector({
  formData,
  onChange,
  errors,
  setFormErrors
}) {
  const [universities, setUniversities] = useState([]);
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const [isLoadingUniversities, setIsLoadingUniversities] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [useCustomUniversity, setUseCustomUniversity] = useState(false);
  const [error, setError] = useState(null);
  
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Fetch universities based on location
  useEffect(() => {
    // Reset everything when location changes
    setSearchTerm('');
    setShowDropdown(false);
    setFilteredUniversities([]);
    
    // Don't fetch if no country is selected
    if (!formData.country) {
      setUniversities([]);
      return;
    }
    
    const fetchUniversities = async () => {
      try {
        setIsLoadingUniversities(true);
        let endpoint;
        let requestOptions = {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        };
        
        // Different endpoints based on location
        if (formData.country === 'India') {
          // For India, use our local API with state/district filtering
          endpoint = '/api/universities?';
          if (formData.state) {
            endpoint += `state=${encodeURIComponent(formData.state)}&`;
          }
          if (formData.district) {
            endpoint += `district=${encodeURIComponent(formData.district)}&`;
          }
        } else {
          // For other countries, use HipoLabs API
          endpoint = `/api/global-universities?country=${encodeURIComponent(formData.country)}`;
        }
        
        const response = await fetch(endpoint, requestOptions);
        const data = await response.json();
        
        if (response.ok) {
          if (formData.country === 'India') {
            // Process the new university data format
            setUniversities(data.universities.map(uni => ({
              label: uni.id ? `${uni.name} (Id: ${uni.id})` : uni.name,
              value: uni.value || (uni.id ? `${uni.name} (Id: ${uni.id})` : uni.name)
            })));
          } else {
            // Format for international universities
            setUniversities(data.universities.map(uni => uni.name));
          }
        } else {
          console.error('Failed to fetch universities:', data.error);
          setUniversities([]);
        }
      } catch (error) {
        console.error('Error fetching universities:', error);
        setUniversities([]);
      } finally {
        setIsLoadingUniversities(false);
      }
    };
    
    fetchUniversities();
  }, [formData.country, formData.state, formData.district]);

  // Filter universities based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUniversities(universities);
    } else {
      const term = searchTerm.toLowerCase().trim();
      const filtered = universities.filter(university => 
        (typeof university === 'string' ? 
          university.toLowerCase().includes(term) : 
          university.label.toLowerCase().includes(term))
      );
      setFilteredUniversities(filtered);
    }
  }, [searchTerm, universities]);

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (!showDropdown) {
      setShowDropdown(true);
    }
    
    // Clear any errors when user starts typing
    if (errors?.university && setFormErrors) {
      setFormErrors(prev => {
        const newErrors = {...prev};
        delete newErrors.university;
        return newErrors;
      });
    }
  };

  const selectUniversity = (university) => {
    const value = typeof university === 'string' ? university : university.value;
    // Create a modified event to send to the parent component
    const event = {
      target: {
        name: 'university',
        value: value,
        type: 'text'
      }
    };
    onChange(event);
    
    setSearchTerm(typeof university === 'string' ? university : university.label);
    setShowDropdown(false);
    
    // Clear any errors
    if (errors?.university && setFormErrors) {
      setFormErrors(prev => {
        const newErrors = {...prev};
        delete newErrors.university;
        return newErrors;
      });
    }
    
    // Also clear the custom university flag
    setUseCustomUniversity(false);
  };

  const toggleCustomUniversity = () => {
    const newValue = !useCustomUniversity;
    setUseCustomUniversity(newValue);
    
    if (newValue) {
      // Focus the input for better user experience
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 100);
      
      // Clear the dropdown
      setShowDropdown(false);
    } else {
      // Reset the university value if turning off custom entry
      const event = {
        target: {
          name: 'university',
          value: '',
          type: 'text'
        }
      };
      onChange(event);
      setSearchTerm('');
    }
  };

  const handleCustomUniversityChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Update the form data directly
    const event = {
      target: {
        name: 'university',
        value: value,
        type: 'text'
      }
    };
    onChange(event);
    
    // Clear any errors when user types a valid value
    if (value && errors?.university && setFormErrors) {
      setFormErrors(prev => {
        const newErrors = {...prev};
        delete newErrors.university;
        return newErrors;
      });
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700" htmlFor="university">
          University
        </label>
        <button
          type="button"
          onClick={toggleCustomUniversity}
          className={`text-xs ${useCustomUniversity ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'} underline focus:outline-none`}
        >
          {useCustomUniversity ? "Select from list" : "My university is not listed"}
        </button>
      </div>
      
      <div className="relative" ref={dropdownRef}>
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Building size={18} className="text-gray-500" />
        </div>
        
        {useCustomUniversity ? (
          // Custom university input
          <input
            type="text"
            id="university"
            ref={searchInputRef}
            className={`py-3 px-4 pl-10 block w-full border ${errors?.university ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            placeholder="Enter your university name"
            value={searchTerm}
            onChange={handleCustomUniversityChange}
          />
        ) : (
          // University search with dropdown
          <>
            <div className="relative">
              <input
                type="text"
                id="universitySearch"
                ref={searchInputRef}
                className={`py-3 px-4 pl-10 pr-10 block w-full border ${errors?.university ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                placeholder={isLoadingUniversities ? "Loading universities..." : "Search for your university"}
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => setShowDropdown(true)}
                autoComplete="off"
                disabled={isLoadingUniversities}
              />
              
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                {isLoadingUniversities ? (
                  <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : searchTerm ? (
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={() => {
                      setSearchTerm('');
                      if (searchInputRef.current) {
                        searchInputRef.current.focus();
                      }
                    }}
                  >
                    <X size={16} />
                  </button>
                ) : (
                  <Search size={16} className="text-gray-400" />
                )}
              </div>
            </div>
            
            {showDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md max-h-60 overflow-auto">
                {filteredUniversities.length > 0 ? (
                  <ul className="py-1">
                    {filteredUniversities.map((university, index) => (
                      <li
                        key={index}
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer"
                        onClick={() => selectUniversity(university)}
                      >
                        {typeof university === 'string' ? university : university.label}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-500">
                    {isLoadingUniversities ? 
                      "Loading universities..." : 
                      universities.length > 0 ? 
                        "No universities match your search" : 
                        "No universities available"
                    }
                  </div>
                )}
              </div>
            )}
            
            {/* Hidden input to store the actual value */}
            <input
              type="hidden"
              id="university"
              name="university"
              value={formData.university}
            />
          </>
        )}
      </div>
      
      {errors?.university && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <AlertCircle size={14} className="mr-1" />
          {errors.university}
        </p>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-yellow-600 flex items-center">
          <AlertCircle size={14} className="mr-1" />
          {error}
        </p>
      )}
    </div>
  );
} 