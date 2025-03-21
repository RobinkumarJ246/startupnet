import React, { useState } from 'react';
import { FormSection, StylishInput, StylishTextarea, StylishSelect, StylishCheckbox, ModernSelect, ToggleSwitch } from '../forms';
import { 
  FormInput, AlignLeft, CheckSquare, List, Plus, Trash2, GripVertical, 
  HelpCircle, Copy, MoveUp, MoveDown, PenSquare, SquareAsterisk
} from 'lucide-react';

// Available question types
const questionTypes = [
  { value: 'short_text', label: 'Short Text', icon: <FormInput className="h-4 w-4" /> },
  { value: 'long_text', label: 'Long Text', icon: <AlignLeft className="h-4 w-4" /> },
  { value: 'multiple_choice', label: 'Multiple Choice', icon: <CheckSquare className="h-4 w-4" /> },
  { value: 'dropdown', label: 'Dropdown', icon: <List className="h-4 w-4" /> }
];

// Form templates
const formTemplates = [
  { 
    value: 'basic', 
    label: 'Basic Information', 
    description: 'Simple form with team name, problem statement, and solution approach',
    questions: [
      { id: 'q1', type: 'short_text', label: 'Team Name', required: true, placeholder: 'Enter your team name' },
      { id: 'q2', type: 'long_text', label: 'Problem Statement', required: true, placeholder: 'Describe the problem you are solving' },
      { id: 'q3', type: 'long_text', label: 'Solution Approach', required: true, placeholder: 'Explain your approach to solving the problem' }
    ]
  },
  { 
    value: 'detailed', 
    label: 'Detailed Project Information', 
    description: 'Comprehensive form including technical details, implementation plan, and business model',
    questions: [
      { id: 'q1', type: 'short_text', label: 'Project Title', required: true, placeholder: 'Enter your project title' },
      { id: 'q2', type: 'long_text', label: 'Problem Statement', required: true, placeholder: 'Describe the problem you are solving' },
      { id: 'q3', type: 'long_text', label: 'Solution Overview', required: true, placeholder: 'Provide an overview of your solution' },
      { id: 'q4', type: 'long_text', label: 'Technical Implementation', required: true, placeholder: 'Describe the technologies and implementation approach' },
      { id: 'q5', type: 'multiple_choice', label: 'Target Domain', required: true, options: ['Healthcare', 'Education', 'Finance', 'Environment', 'Social Impact', 'Other'] },
      { id: 'q6', type: 'long_text', label: 'Business Model', required: false, placeholder: 'Explain the potential business model or impact' }
    ]
  },
  { 
    value: 'ai_focus', 
    label: 'AI Project Form', 
    description: 'Specialized form for AI and ML focused hackathons',
    questions: [
      { id: 'q1', type: 'short_text', label: 'Project Title', required: true, placeholder: 'Enter your project title' },
      { id: 'q2', type: 'long_text', label: 'Problem Statement', required: true, placeholder: 'Describe the problem you are solving' },
      { id: 'q3', type: 'dropdown', label: 'AI/ML Approach', required: true, options: ['Supervised Learning', 'Unsupervised Learning', 'Reinforcement Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'Other'] },
      { id: 'q4', type: 'long_text', label: 'Dataset Description', required: true, placeholder: 'Describe your dataset and data processing approach' },
      { id: 'q5', type: 'long_text', label: 'Model Architecture', required: true, placeholder: 'Describe your model architecture' },
      { id: 'q6', type: 'long_text', label: 'Evaluation Metrics', required: true, placeholder: 'What metrics will you use to evaluate your model?' }
    ]
  },
  { 
    value: 'custom', 
    label: 'Custom Form', 
    description: 'Build your own custom form from scratch',
    questions: []
  }
];

// Question component to render in the form builder
const QuestionItem = ({ question, index, onUpdate, onDelete, onMove, totalQuestions }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleInputChange = (field, value) => {
    onUpdate(index, { ...question, [field]: value });
  };
  
  const handleAddOption = () => {
    const options = [...(question.options || []), ''];
    onUpdate(index, { ...question, options });
  };
  
  const handleOptionChange = (optionIndex, value) => {
    const options = [...(question.options || [])];
    options[optionIndex] = value;
    onUpdate(index, { ...question, options });
  };
  
  const handleDeleteOption = (optionIndex) => {
    const options = [...(question.options || [])];
    options.splice(optionIndex, 1);
    onUpdate(index, { ...question, options });
  };
  
  return (
    <div className="border border-gray-200 rounded-lg mb-4 bg-white overflow-hidden">
      <div className="flex items-center bg-gray-50 p-3 border-b border-gray-200">
        <div className="cursor-move text-gray-400 mr-2">
          <GripVertical className="h-5 w-5" />
        </div>
        
        <div className="flex-1">
          <span className="font-medium text-gray-700">{question.label || 'Untitled Question'}</span>
          <span className="ml-2 text-sm text-gray-500">({questionTypes.find(t => t.value === question.type)?.label || 'Unknown'})</span>
        </div>
        
        <div className="flex items-center gap-1">
          <button 
            type="button" 
            onClick={() => onMove(index, index - 1)} 
            disabled={index === 0}
            className={`p-1 rounded-full ${index === 0 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            <MoveUp className="h-4 w-4" />
          </button>
          
          <button 
            type="button" 
            onClick={() => onMove(index, index + 1)} 
            disabled={index === totalQuestions - 1}
            className={`p-1 rounded-full ${index === totalQuestions - 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            <MoveDown className="h-4 w-4" />
          </button>
          
          <button 
            type="button" 
            onClick={() => setIsExpanded(!isExpanded)} 
            className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
          >
            <PenSquare className="h-4 w-4" />
          </button>
          
          <button 
            type="button" 
            onClick={() => onDelete(index)} 
            className="p-1 rounded-full text-red-500 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StylishInput
              label="Question Label"
              value={question.label || ''}
              onChange={(e) => handleInputChange('label', e.target.value)}
              placeholder="Enter question label"
            />
            
            <ModernSelect
              label="Question Type"
              value={question.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              options={questionTypes.map(type => ({
                value: type.value,
                label: type.label,
                icon: type.icon
              }))}
            />
          </div>
          
          <StylishInput
            label="Placeholder Text"
            value={question.placeholder || ''}
            onChange={(e) => handleInputChange('placeholder', e.target.value)}
            placeholder="Enter placeholder text"
          />
          
          {(question.type === 'multiple_choice' || question.type === 'dropdown') && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Options
              </label>
              
              {(question.options || []).map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center">
                  <StylishInput
                    value={option}
                    onChange={(e) => handleOptionChange(optionIndex, e.target.value)}
                    placeholder={`Option ${optionIndex + 1}`}
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteOption(optionIndex)}
                    className="ml-2 p-1 text-red-500 hover:bg-red-50 rounded-full"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={handleAddOption}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add Option
              </button>
            </div>
          )}
          
          <div className="pt-2">
            <ToggleSwitch
              label="Required Question"
              checked={question.required || false}
              onChange={(e) => handleInputChange('required', e.target.checked)}
              helpText="Toggle if this question requires an answer"
            />
          </div>
        </div>
      )}
    </div>
  );
};

const CustomFormBuilder = ({ value = { useCustomForm: false, template: 'basic', questions: [] }, onChange, error }) => {
  // Handle template selection
  const handleTemplateChange = (templateValue) => {
    // Find the selected template
    const selectedTemplate = formTemplates.find(t => t.value === templateValue);
    
    // If it's custom, keep existing questions, otherwise use template questions
    const newQuestions = templateValue === 'custom' 
      ? (value.questions || [])
      : (selectedTemplate?.questions || []);
    
    onChange({
      ...value,
      template: templateValue,
      questions: newQuestions
    });
  };
  
  // Add a new question to the form
  const handleAddQuestion = () => {
    const newQuestion = {
      id: `q${Date.now()}`,
      type: 'short_text',
      label: 'New Question',
      required: false,
      placeholder: ''
    };
    
    onChange({
      ...value,
      questions: [...(value.questions || []), newQuestion]
    });
  };
  
  // Update a question
  const handleUpdateQuestion = (index, updatedQuestion) => {
    const newQuestions = [...(value.questions || [])];
    newQuestions[index] = updatedQuestion;
    
    onChange({
      ...value,
      questions: newQuestions
    });
  };
  
  // Delete a question
  const handleDeleteQuestion = (index) => {
    const newQuestions = [...(value.questions || [])];
    newQuestions.splice(index, 1);
    
    onChange({
      ...value,
      questions: newQuestions
    });
  };
  
  // Move a question up or down
  const handleMoveQuestion = (fromIndex, toIndex) => {
    // Check if the move is valid
    if (toIndex < 0 || toIndex >= (value.questions || []).length) return;
    
    const newQuestions = [...(value.questions || [])];
    const [movedItem] = newQuestions.splice(fromIndex, 1);
    newQuestions.splice(toIndex, 0, movedItem);
    
    onChange({
      ...value,
      questions: newQuestions
    });
  };
  
  return (
    <FormSection
      title="Registration Form Builder"
      description="Create a custom form for participants to fill out during registration"
      icon={<FormInput className="h-5 w-5 text-indigo-600" />}
      collapsible
    >
      <div className="space-y-6">
        <ToggleSwitch
          id="useCustomForm"
          name="useCustomForm"
          label="Collect additional information from participants"
          checked={value.useCustomForm}
          onChange={(e) => onChange({ ...value, useCustomForm: e.target.checked })}
          helpText="Enable to create a custom registration form with questions"
        />
        
        {value.useCustomForm && (
          <div className="pl-8 space-y-6 border-l-2 border-indigo-100">
            {/* Template selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose a Template (Click to select)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formTemplates.map((template) => (
                  <div
                    key={template.value}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      value.template === template.value
                        ? 'border-indigo-500 bg-indigo-50 shadow-sm'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                    onClick={() => handleTemplateChange(template.value)}
                  >
                    <div className="font-medium text-gray-800 mb-1">{template.label}</div>
                    <div className="text-sm text-gray-600">{template.description}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Question builder (only show if custom template or if we have questions) */}
            {(value.template === 'custom' || (value.questions || []).length > 0) && (
              <>
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Form Questions</h3>
                    <button
                      type="button"
                      onClick={handleAddQuestion}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Question
                    </button>
                  </div>
                  
                  {(value.questions || []).length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
                      <FormInput className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">No questions added yet. Click "Add Question" to begin.</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {(value.questions || []).map((question, index) => (
                        <QuestionItem
                          key={question.id || index}
                          question={question}
                          index={index}
                          onUpdate={handleUpdateQuestion}
                          onDelete={handleDeleteQuestion}
                          onMove={handleMoveQuestion}
                          totalQuestions={(value.questions || []).length}
                        />
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center text-blue-800">
                    <HelpCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                    <p className="text-sm">
                      These questions will be shown to participants during the registration process. Make sure to collect all information needed for evaluating submissions.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </FormSection>
  );
};

export default CustomFormBuilder; 