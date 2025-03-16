'use client';
import { useState, useEffect, useRef } from 'react';
import { Building, Search, AlertCircle, Plus, X } from 'lucide-react';

export default function CollegeSelector({ 
  formData, 
  onChange, 
  errors, 
  setFormErrors,
  isUniversityCollege
}) {
  const [colleges, setColleges] = useState([]);
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [isLoadingColleges, setIsLoadingColleges] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [useCustomCollege, setUseCustomCollege] = useState(false);
  const [error, setError] = useState(null);
  
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Skip college selection if university is also college
  if (isUniversityCollege) {
    return null;
  }

  // Fetch colleges when university changes (for India only)
  useEffect(() => {
    // Reset everything
    setSearchTerm('');
    setShowDropdown(false);
    setFilteredColleges([]);
    
    // Don't fetch if no university is selected
    if (!formData.university) {
      setColleges([]);
      return;
    }
    
    // Only fetch if country is India
    if (formData.country !== 'India') {
      setColleges([]);
      return;
    }
    
    const fetchColleges = async () => {
      try {
        setIsLoadingColleges(true);
        let endpoint = `/api/colleges?university=${encodeURIComponent(formData.university)}`;
        
        if (formData.state) {
          endpoint += `&state=${encodeURIComponent(formData.state)}`;
        }
        
        if (formData.district) {
          endpoint += `&district=${encodeURIComponent(formData.district)}`;
        }
        
        const response = await fetch(endpoint);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch colleges: ${response.statusText}`);
        }
        
        const data = await response.json();
        setColleges(data.colleges || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching colleges:', err);
        setError('Failed to load colleges. Please try again later.');
        setColleges([]);
      } finally {
        setIsLoadingColleges(false);
      }
    };
    
    fetchColleges();
  }, [formData.university, formData.country, formData.state, formData.district]);

  // Filter colleges based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredColleges(colleges);
    } else {
      const term = searchTerm.toLowerCase().trim();
      const filtered = colleges.filter(college => 
        college.toLowerCase().includes(term)
      );
      setFilteredColleges(filtered);
    }
  }, [searchTerm, colleges]);

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
    if (errors?.college && setFormErrors) {
      setFormErrors(prev => {
        const newErrors = {...prev};
        delete newErrors.college;
        return newErrors;
      });
    }
  };

  const selectCollege = (college) => {
    // Create a modified event to send to the parent component
    const event = {
      target: {
        name: 'college',
        value: college,
        type: 'text'
      }
    };
    onChange(event);
    
    setSearchTerm(college);
    setShowDropdown(false);
    
    // Clear any errors
    if (errors?.college && setFormErrors) {
      setFormErrors(prev => {
        const newErrors = {...prev};
        delete newErrors.college;
        return newErrors;
      });
    }
    
    // Also clear the custom college flag
    setUseCustomCollege(false);
  };

  const toggleCustomCollege = () => {
    const newValue = !useCustomCollege;
    setUseCustomCollege(newValue);
    
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
      // Reset the college value if turning off custom entry
      const event = {
        target: {
          name: 'college',
          value: '',
          type: 'text'
        }
      };
      onChange(event);
      setSearchTerm('');
    }
  };

  const handleCustomCollegeChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Update the form data directly
    const event = {
      target: {
        name: 'college',
        value: value,
        type: 'text'
      }
    };
    onChange(event);
    
    // Clear any errors when user types a valid value
    if (value && errors?.college && setFormErrors) {
      setFormErrors(prev => {
        const newErrors = {...prev};
        delete newErrors.college;
        return newErrors;
      });
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700" htmlFor="college">
          College/Department
        </label>
        <button
          type="button"
          onClick={toggleCustomCollege}
          className={`text-xs ${useCustomCollege ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'} underline focus:outline-none`}
        >
          {useCustomCollege ? "Select from list" : "My college is not listed"}
        </button>
      </div>
      
      <div className="relative" ref={dropdownRef}>
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Building size={18} className="text-gray-500" />
        </div>
        
        {useCustomCollege ? (
          // Custom college input
          <input
            type="text"
            id="college"
            ref={searchInputRef}
            className={`py-3 px-4 pl-10 block w-full border ${errors?.college ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            placeholder="Enter your college name"
            value={searchTerm}
            onChange={handleCustomCollegeChange}
          />
        ) : (
          // College search with dropdown
          <>
            <div className="relative">
              <input
                type="text"
                id="collegeSearch"
                ref={searchInputRef}
                className={`py-3 px-4 pl-10 pr-10 block w-full border ${errors?.college ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                placeholder={isLoadingColleges ? "Loading colleges..." : "Search for your college"}
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => setShowDropdown(true)}
                autoComplete="off"
                disabled={isLoadingColleges || !formData.university}
              />
              
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                {isLoadingColleges ? (
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
                {filteredColleges.length > 0 ? (
                  <ul className="py-1">
                    {filteredColleges.map((college, index) => (
                      <li
                        key={index}
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer"
                        onClick={() => selectCollege(college)}
                      >
                        {college}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-500">
                    {isLoadingColleges ? 
                      "Loading colleges..." : 
                      colleges.length > 0 ? 
                        "No colleges match your search" : 
                        formData.university ? 
                          "No colleges available for this university" : 
                          "Please select a university first"
                    }
                  </div>
                )}
              </div>
            )}
            
            {/* Hidden input to store the actual value */}
            <input
              type="hidden"
              id="college"
              name="college"
              value={formData.college}
            />
          </>
        )}
      </div>
      
      {errors?.college && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <AlertCircle size={14} className="mr-1" />
          {errors.college}
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