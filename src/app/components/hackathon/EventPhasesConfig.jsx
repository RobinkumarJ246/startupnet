import React from 'react';
import { Calendar, Clock, CalendarRange, Award, Zap, Users, Filter, Send, HelpCircle, IndianRupee } from 'lucide-react';
import { FormSection, DateRangePicker, StylishInput, ToggleSwitch, RadioCardGroup, StylishTextarea, ModernSelect } from '../forms';

const EventPhasesConfig = ({ value = {
  // Default phases config
  enableShortlisting: false,
  enableResults: true,
  registrationPhase: {
    startDate: '',
    endDate: '',
    collectPayment: true
  },
  shortlistingPhase: {
    startDate: '',
    endDate: '',
    resultsDate: ''
  },
  eventPhase: {
    startDate: '',
    endDate: ''
  },
  resultsPhase: {
    announcementDate: '',
    publicResults: true
  },
  paymentTiming: 'registration'
}, onChange, error }) => {
  
  // Helper to update nested properties
  const updateNestedValue = (section, field, newValue) => {
    onChange({
      ...value,
      [section]: {
        ...(value[section] || {}),
        [field]: newValue
      }
    });
  };
  
  // Helper to set a simple top-level property
  const updateProperty = (property, newValue) => {
    onChange({
      ...value,
      [property]: newValue
    });
  };
  
  // Handle date range changes for phases
  const handleDateRangeChange = (section, dateRange) => {
    onChange({
      ...value,
      [section]: {
        ...(value[section] || {}),
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      }
    });
  };
  
  // Handle single date changes
  const handleDateChange = (section, field, newDate) => {
    updateNestedValue(section, field, newDate);
  };
  
  return (
    <div className="space-y-8">
      <FormSection
        title="Event Timeline Configuration"
        description="Set up the phases and timeline for your hackathon"
        icon={<CalendarRange className="h-5 w-5 text-indigo-600" />}
      >
        <div className="space-y-8">
          {/* Registration Phase */}
          <div className="border-l-4 border-indigo-500 pl-4 py-2">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <Users className="h-5 w-5 mr-2 text-indigo-600" />
              Registration Phase
            </h3>
            <p className="text-sm text-gray-600 mb-4">The period when participants can register for your event</p>
            
            <div className="space-y-4">
              <DateRangePicker
                id="registrationDates"
                name="registrationDates"
                label="Registration Period"
                startDate={value.registrationPhase?.startDate || ''}
                endDate={value.registrationPhase?.endDate || ''}
                onChange={(e) => handleDateRangeChange('registrationPhase', e.target.value)}
                required
                error={error?.registrationPhase?.dates}
                showTime
                minDate={new Date()}
                helpText="When participants can register for your hackathon"
              />
            </div>
          </div>
          
          {/* Shortlisting Phase (Optional) */}
          <div>
            <div className="mb-4">
              <ToggleSwitch
                id="enableShortlisting"
                name="enableShortlisting"
                label="Enable Shortlisting Phase"
                checked={value.enableShortlisting}
                onChange={(e) => updateProperty('enableShortlisting', e.target.checked)}
                helpText="Enable if you want to shortlist participants before the main event"
              />
            </div>
            
            {value.enableShortlisting && (
              <div className="border-l-4 border-yellow-500 pl-4 py-2">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Filter className="h-5 w-5 mr-2 text-yellow-600" />
                  Shortlisting Phase
                </h3>
                <p className="text-sm text-gray-600 mb-4">Review submissions and select participants who will proceed to the main event</p>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <StylishInput
                        id="shortlistingStart"
                        name="shortlistingStart"
                        type="datetime-local"
                        label="Shortlisting Start Date"
                        value={value.shortlistingPhase?.startDate || ''}
                        onChange={(e) => updateNestedValue('shortlistingPhase', 'startDate', e.target.value)}
                        required={value.enableShortlisting}
                        error={error?.shortlistingPhase?.startDate}
                        icon={Calendar}
                        helpText="When you'll start reviewing registrations"
                      />
                    </div>
                    
                    <div>
                      <StylishInput
                        id="shortlistingEnd"
                        name="shortlistingEnd"
                        type="datetime-local"
                        label="Shortlisting End Date"
                        value={value.shortlistingPhase?.endDate || ''}
                        onChange={(e) => updateNestedValue('shortlistingPhase', 'endDate', e.target.value)}
                        required={value.enableShortlisting}
                        error={error?.shortlistingPhase?.endDate}
                        icon={Calendar}
                        helpText="When you'll finish reviewing registrations"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <StylishInput
                      id="shortlistingResults"
                      name="shortlistingResults"
                      type="datetime-local"
                      label="Results Announcement Date"
                      value={value.shortlistingPhase?.resultsDate || ''}
                      onChange={(e) => updateNestedValue('shortlistingPhase', 'resultsDate', e.target.value)}
                      required={value.enableShortlisting}
                      error={error?.shortlistingPhase?.resultsDate}
                      icon={Send}
                      helpText="When participants will be notified about shortlisting results"
                    />
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex text-yellow-800">
                      <HelpCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                      <p className="text-sm">
                        Shortlisted participants will be notified automatically on the results date. Make sure to review all registrations before this date.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Event Phase */}
          <div className="border-l-4 border-green-500 pl-4 py-2">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <Zap className="h-5 w-5 mr-2 text-green-600" />
              Hackathon Event Phase
            </h3>
            <p className="text-sm text-gray-600 mb-4">The main hackathon event period</p>
            
            <div className="space-y-4">
              <DateRangePicker
                id="eventDates"
                name="eventDates"
                label="Event Period"
                startDate={value.eventPhase?.startDate || ''}
                endDate={value.eventPhase?.endDate || ''}
                onChange={(e) => handleDateRangeChange('eventPhase', e.target.value)}
                required
                error={error?.eventPhase?.dates}
                showTime
                minDate={new Date()}
                helpText="The actual hackathon event duration"
              />
            </div>
          </div>
          
          {/* Results Phase */}
          <div>
            <div className="mb-4">
              <ToggleSwitch
                id="enableResults"
                name="enableResults"
                label="Enable Results Phase"
                checked={value.enableResults}
                onChange={(e) => updateProperty('enableResults', e.target.checked)}
                helpText="Enable if you want to announce results on this platform"
              />
            </div>
            
            {value.enableResults && (
              <div className="border-l-4 border-purple-500 pl-4 py-2">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Award className="h-5 w-5 mr-2 text-purple-600" />
                  Results Phase
                </h3>
                <p className="text-sm text-gray-600 mb-4">Announce winners and distribute prizes</p>
                
                <div className="space-y-4">
                  <div>
                    <StylishInput
                      id="resultsAnnouncement"
                      name="resultsAnnouncement"
                      type="datetime-local"
                      label="Results Announcement Date"
                      value={value.resultsPhase?.announcementDate || ''}
                      onChange={(e) => updateNestedValue('resultsPhase', 'announcementDate', e.target.value)}
                      required={value.enableResults}
                      error={error?.resultsPhase?.announcementDate}
                      icon={Calendar}
                      helpText="When the winners will be announced"
                    />
                  </div>
                  
                  <div>
                    <ToggleSwitch
                      id="publicResults"
                      name="publicResults"
                      label="Make results publicly visible"
                      checked={value.resultsPhase?.publicResults}
                      onChange={(e) => updateNestedValue('resultsPhase', 'publicResults', e.target.checked)}
                      helpText="If enabled, results will be visible to everyone, not just participants"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </FormSection>
      
      {/* Payment Timing Configuration */}
      <FormSection
        title="Payment Configuration"
        description="Configure when participants will be required to pay"
        icon={<IndianRupee className="h-5 w-5 text-indigo-600" />}
        collapsible
      >
        <div>
          <RadioCardGroup
            id="paymentTiming"
            name="paymentTiming"
            label="Payment Collection Timing"
            value={value.paymentTiming}
            onChange={(e) => updateProperty('paymentTiming', e.target.value)}
            options={[
              { 
                value: 'registration', 
                label: 'During Registration', 
                description: 'Collect payment when participants register',
                icon: <Users className="h-5 w-5" />
              },
              { 
                value: 'after_shortlisting', 
                label: 'After Shortlisting', 
                description: 'Only shortlisted participants will pay',
                icon: <Filter className="h-5 w-5" />
              }
            ]}
            disabled={!value.enableShortlisting && value.paymentTiming === 'after_shortlisting'}
            error={value.paymentTiming === 'after_shortlisting' && !value.enableShortlisting ? 
              'Shortlisting must be enabled to collect payment after shortlisting' : ''}
            tooltip="Choose when you want to collect payment from participants"
          />
          
          {value.paymentTiming === 'after_shortlisting' && !value.enableShortlisting && (
            <div className="mt-4 bg-yellow-50 p-4 rounded-lg">
              <div className="flex text-yellow-800">
                <HelpCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                <p className="text-sm">
                  You've selected to collect payment after shortlisting, but shortlisting is not enabled. 
                  Please enable the shortlisting phase or change the payment timing.
                </p>
              </div>
            </div>
          )}
          
          {value.paymentTiming === 'after_shortlisting' && value.enableShortlisting && (
            <div className="mt-4 bg-blue-50 p-4 rounded-lg">
              <div className="flex text-blue-800">
                <HelpCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                <p className="text-sm">
                  Shortlisted participants will receive a payment link after the shortlisting results are announced.
                  They must complete payment to confirm their participation.
                </p>
              </div>
            </div>
          )}
        </div>
      </FormSection>
    </div>
  );
};

export default EventPhasesConfig; 