'use client';
import { useState } from 'react';
import { AlertCircle, Check, Paperclip, X } from 'lucide-react';

export default function RequestForm({ activeType, onSubmit, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSubmit({
      type: activeType,
      title,
      description,
      priority,
      files,
      date: new Date().toISOString()
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => ({
        name: file.name,
        size: file.size,
        type: file.type
      }));
      setFiles([...files, ...newFiles]);
    }
  };

  const removeFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-xl p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {activeType.title}
      </h2>
      
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          id="title"
          placeholder="Provide a clear title for your request"
          className={`w-full px-4 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.title}
          </p>
        )}
      </div>
      
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          rows="5"
          placeholder="Describe your request in detail"
          className={`w-full px-4 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        {errors.description && (
          <p className="mt-1 text-sm text-red-500 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.description}
          </p>
        )}
      </div>
      
      <div className="mb-4">
        <span className="block text-sm font-medium text-gray-700 mb-2">Priority</span>
        <div className="flex gap-3">
          {['low', 'medium', 'high'].map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setPriority(level)}
              className={`px-4 py-2 rounded-lg capitalize text-sm font-medium ${
                priority === level
                  ? level === 'low' 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : level === 'medium'
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : 'bg-red-100 text-red-800 border border-red-200'
                  : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Attachments
        </label>
        
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-gray-50 px-4 py-6 items-center justify-center">
            <div className="flex flex-col items-center justify-center">
              <Paperclip className="w-8 h-8 text-gray-400 mb-1" />
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-indigo-600">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, PDF up to 10MB
              </p>
            </div>
            <input 
              type="file" 
              className="hidden"
              accept=".jpg,.jpeg,.png,.pdf,.zip" 
              multiple
              onChange={handleFileChange}
            />
          </label>
        </div>
        
        {files.length > 0 && (
          <div className="mt-3">
            <p className="text-sm font-medium text-gray-700 mb-2">Uploaded files:</p>
            <ul className="space-y-2">
              {files.map((file, index) => (
                <li key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-2 text-sm">
                  <div className="flex items-center">
                    <Paperclip className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-gray-800">{file.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-lg text-white shadow-sm hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit Request
        </button>
      </div>
    </form>
  );
} 