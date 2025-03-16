'use client';
import { useState, useEffect } from 'react';
import { Globe, MapPin, AlertCircle, ChevronDown } from 'lucide-react';

export default function LocationSelector({ 
  formData, 
  onChange, 
  errors, 
  setFormErrors 
}) {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const [error, setError] = useState(null);

  // Fetch countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setIsLoadingCountries(true);
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) {
          throw new Error('Failed to fetch countries');
        }
        const data = await response.json();
        
        // Sort countries alphabetically
        const sortedCountries = data
          .map(country => ({
            name: country.name.common,
            code: country.cca2
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        
        // Ensure India is in the list (it should be, but just to be sure)
        const hasIndia = sortedCountries.some(country => country.name === 'India');
        if (!hasIndia) {
          sortedCountries.push({ name: 'India', code: 'IN' });
          sortedCountries.sort((a, b) => a.name.localeCompare(b.name));
        }
        
        setCountries(sortedCountries);
        setError(null);
      } catch (err) {
        console.error('Error fetching countries:', err);
        setError('Failed to load countries. Please try again later.');
      } finally {
        setIsLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  // Fetch states when country is set to India
  useEffect(() => {
    if (formData.country !== 'India') {
      setStates([]);
      return;
    }
    
    const fetchStates = async () => {
      try {
        setIsLoadingStates(true);
        const response = await fetch('/api/states-india');
        if (!response.ok) {
          throw new Error('Failed to fetch states');
        }
        const data = await response.json();
        setStates(data.states || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching states:', err);
        setError('Failed to load states. Please try again later.');
      } finally {
        setIsLoadingStates(false);
      }
    };

    fetchStates();
  }, [formData.country]);

  // Fetch districts when state is selected (for India)
  useEffect(() => {
    if (formData.country !== 'India' || !formData.state) {
      setDistricts([]);
      return;
    }
    
    const fetchDistricts = async () => {
      try {
        setIsLoadingDistricts(true);
        const response = await fetch(`/api/districts-india?state=${encodeURIComponent(formData.state)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch districts');
        }
        const data = await response.json();
        setDistricts(data.districts || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching districts:', err);
        setError('Failed to load districts. Please try again later.');
      } finally {
        setIsLoadingDistricts(false);
      }
    };

    fetchDistricts();
  }, [formData.country, formData.state]);

  const handleCountryChange = (e) => {
    const newCountry = e.target.value;
    
    // Create a modified event to send to the parent component
    const modifiedEvent = {
      target: {
        name: 'country',
        value: newCountry,
        type: 'select'
      }
    };
    
    // Clear state and district if changing country
    if (newCountry !== formData.country) {
      // Clear state selection
      const stateEvent = {
        target: {
          name: 'state',
          value: '',
          type: 'select'
        }
      };
      onChange(stateEvent);
      
      // Clear district selection
      const districtEvent = {
        target: {
          name: 'district',
          value: '',
          type: 'select'
        }
      };
      onChange(districtEvent);
      
      // Clear university and college as they depend on location
      const universityEvent = {
        target: {
          name: 'university',
          value: '',
          type: 'text'
        }
      };
      onChange(universityEvent);
      
      const collegeEvent = {
        target: {
          name: 'college',
          value: '',
          type: 'text'
        }
      };
      onChange(collegeEvent);
      
      // Clear related errors
      if (setFormErrors) {
        setFormErrors(prev => {
          const newErrors = {...prev};
          delete newErrors.state;
          delete newErrors.district;
          delete newErrors.university;
          delete newErrors.college;
          return newErrors;
        });
      }
    }
    
    onChange(modifiedEvent);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="country">
          Country
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <MapPin size={18} className="text-gray-500" />
          </div>
          <select
            id="country"
            name="country"
            className={`py-3 px-4 pl-10 pr-10 block w-full border ${errors?.country ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none`}
            value={formData.country}
            onChange={handleCountryChange}
            disabled={isLoadingCountries}
          >
            <option value="">Select your country</option>
            {countries.map(country => (
              <option key={country.code} value={country.name}>
                {country.name}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <ChevronDown size={18} className="text-gray-500" />
          </div>
        </div>
        {errors?.country && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle size={14} className="mr-1" />
            {errors.country}
          </p>
        )}
      </div>

      {formData.country === 'India' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="state">
            State
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <MapPin size={18} className="text-gray-500" />
            </div>
            <select
              id="state"
              name="state"
              className={`py-3 px-4 pl-10 pr-10 block w-full border ${errors?.state ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none`}
              value={formData.state}
              onChange={onChange}
              disabled={isLoadingStates}
            >
              <option value="">Select your state</option>
              {states.map(state => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown size={18} className="text-gray-500" />
            </div>
          </div>
          {errors?.state && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle size={14} className="mr-1" />
              {errors.state}
            </p>
          )}
        </div>
      )}

      {formData.country === 'India' && formData.state && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="district">
            District
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <MapPin size={18} className="text-gray-500" />
            </div>
            <select
              id="district"
              name="district"
              className={`py-3 px-4 pl-10 pr-10 block w-full border ${errors?.district ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none`}
              value={formData.district}
              onChange={onChange}
              disabled={isLoadingDistricts}
            >
              <option value="">Select your district</option>
              {districts.map(district => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown size={18} className="text-gray-500" />
            </div>
          </div>
          {errors?.district && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle size={14} className="mr-1" />
              {errors.district}
            </p>
          )}
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 rounded-lg border border-red-100">
          <p className="text-sm text-red-600 flex items-center">
            <AlertCircle size={14} className="mr-1" />
            {error}
          </p>
        </div>
      )}
    </div>
  );
} 