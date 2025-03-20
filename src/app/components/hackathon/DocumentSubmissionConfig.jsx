import React from 'react';
import { FileText, Presentation, Check, HelpCircle } from 'lucide-react';
import { StylishCheckbox, ToggleSwitch, FormSection, FileUpload } from '../forms';

const DocumentSubmissionConfig = ({ 
  value = { 
    requireDocuments: false,
    requireAbstract: true,
    requirePresentation: false,
    abstractFileTypes: ['pdf', 'docx', 'txt'],
    presentationFileTypes: ['pdf', 'pptx'] 
  }, 
  onChange,
  error
}) => {
  const handleToggle = (name, checked) => {
    if (name === 'requireDocuments' && !checked) {
      // If turning off document requirements, update all related fields
      onChange({
        ...value,
        requireDocuments: false,
        requireAbstract: false,
        requirePresentation: false
      });
    } else if (name === 'requireDocuments' && checked) {
      // When enabling documents, enable at least abstract by default
      onChange({
        ...value,
        requireDocuments: true,
        requireAbstract: true
      });
    } else {
      // Handle other toggles
      onChange({
        ...value,
        [name]: checked
      });
    }
  };

  const handleFileTypeChange = (field, fileTypes) => {
    onChange({
      ...value,
      [field]: fileTypes
    });
  };

  return (
    <FormSection
      title="Document Submission Requirements"
      description="Configure what documents participants need to submit"
      icon={<FileText className="h-5 w-5 text-indigo-600" />}
      collapsible
    >
      <div className="space-y-6">
        <ToggleSwitch
          id="requireDocuments"
          name="requireDocuments"
          label="Require participants to submit documents"
          checked={value.requireDocuments}
          onChange={(e) => handleToggle('requireDocuments', e.target.checked)}
          helpText="Enable if you want participants to submit documents for evaluation"
        />

        {value.requireDocuments && (
          <div className="pl-8 space-y-6 border-l-2 border-indigo-100">
            <div className="space-y-3">
              <ToggleSwitch
                id="requireAbstract"
                name="requireAbstract"
                label="Require Abstract/Project Proposal"
                checked={value.requireAbstract}
                onChange={(e) => handleToggle('requireAbstract', e.target.checked)}
                error={error?.requireAbstract}
              />
              
              {value.requireAbstract && (
                <div className="pl-8 mt-2">
                  <div className="text-sm font-medium text-gray-700 mb-2">Accepted File Types:</div>
                  <div className="flex flex-wrap gap-2">
                    {['pdf', 'docx', 'txt', 'doc'].map(type => (
                      <label key={type} className="inline-flex items-center p-2 bg-white border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          checked={value.abstractFileTypes?.includes(type)}
                          onChange={(e) => {
                            const newTypes = e.target.checked
                              ? [...(value.abstractFileTypes || []), type]
                              : (value.abstractFileTypes || []).filter(t => t !== type);
                            handleFileTypeChange('abstractFileTypes', newTypes);
                          }}
                        />
                        <span className="ml-2 text-sm text-gray-600">.{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <ToggleSwitch
                id="requirePresentation"
                name="requirePresentation"
                label="Require Presentation"
                checked={value.requirePresentation}
                onChange={(e) => handleToggle('requirePresentation', e.target.checked)}
                error={error?.requirePresentation}
              />
              
              {value.requirePresentation && (
                <div className="pl-8 mt-2">
                  <div className="text-sm font-medium text-gray-700 mb-2">Accepted File Types:</div>
                  <div className="flex flex-wrap gap-2">
                    {['pdf', 'pptx', 'ppt'].map(type => (
                      <label key={type} className="inline-flex items-center p-2 bg-white border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          checked={value.presentationFileTypes?.includes(type)}
                          onChange={(e) => {
                            const newTypes = e.target.checked
                              ? [...(value.presentationFileTypes || []), type]
                              : (value.presentationFileTypes || []).filter(t => t !== type);
                            handleFileTypeChange('presentationFileTypes', newTypes);
                          }}
                        />
                        <span className="ml-2 text-sm text-gray-600">.{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center text-blue-800">
                <HelpCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                <p className="text-sm">
                  Participants will be able to upload these documents during registration or after shortlisting, depending on your event's configuration.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </FormSection>
  );
};

export default DocumentSubmissionConfig; 