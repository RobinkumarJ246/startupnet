'use client';

import React from 'react';
import { useState, useRef, useCallback } from 'react';
import { Upload, X, AlertCircle, FileText, Image, File, Info } from 'lucide-react';

const FileUpload = ({
  id,
  name,
  label,
  value = [],
  onChange,
  accept = '*/*',
  maxFiles = 5,
  maxSize = 5, // in MB
  required = false,
  error = null,
  helpText = null,
  className = '',
  disabled = false,
  showPreview = true,
  previewType = 'grid', // 'grid' or 'list'
  tooltip = null,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  
  // Convert accept prop to array of file types
  const acceptedTypes = accept.split(',').map(type => type.trim());
  
  // Format file size for display
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Check if file type is image
  const isImage = (fileType) => {
    return fileType.startsWith('image/');
  };
  
  // Get icon based on file type
  const getFileIcon = (file) => {
    if (isImage(file.type)) {
      return <Image className="h-6 w-6 text-indigo-500" />;
    } else if (file.type.includes('pdf')) {
      return <FileText className="h-6 w-6 text-red-500" />;
    } else {
      return <File className="h-6 w-6 text-gray-500" />;
    }
  };
  
  // Handle file drop
  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      
      if (disabled) return;
      
      const droppedFiles = Array.from(e.dataTransfer.files);
      handleFiles(droppedFiles);
    },
    [disabled, value]
  );
  
  // Handle drag events
  const handleDrag = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (disabled) return;
      
      if (e.type === 'dragenter' || e.type === 'dragover') {
        setIsDragging(true);
      } else if (e.type === 'dragleave') {
        setIsDragging(false);
      }
    },
    [disabled]
  );
  
  // Handle file input change
  const handleFileChange = (e) => {
    if (disabled) return;
    
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Process files
  const handleFiles = (files) => {
    // Filter files by type
    const filteredByType = files.filter(file => {
      // If accept is */* accept all files
      if (accept === '*/*') return true;
      
      return acceptedTypes.some(type => {
        // Handle wildcards like image/*
        if (type.endsWith('/*')) {
          const category = type.split('/')[0];
          return file.type.startsWith(`${category}/`);
        }
        return file.type === type;
      });
    });
    
    // Filter by size limit
    const filteredBySize = filteredByType.filter(
      file => file.size <= maxSize * 1024 * 1024
    );
    
    // Get files that can be added (respect maxFiles limit)
    const remainingSlots = maxFiles - (value ? value.length : 0);
    const filesToAdd = filteredBySize.slice(0, remainingSlots);
    
    if (filesToAdd.length > 0) {
      // Create unique IDs for new files
      const filesWithIds = filesToAdd.map(file => ({
        file,
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        size: file.size,
        type: file.type,
        preview: isImage(file.type) ? URL.createObjectURL(file) : null,
      }));
      
      const newValue = [...(value || []), ...filesWithIds];
      
      onChange({
        target: {
          name,
          value: newValue
        }
      });
    }
  };
  
  // Handle file removal
  const handleRemove = (id) => {
    if (disabled) return;
    
    const newValue = value.filter(file => file.id !== id);
    
    // Revoke object URL for image previews
    const removedFile = value.find(file => file.id === id);
    if (removedFile && removedFile.preview) {
      URL.revokeObjectURL(removedFile.preview);
    }
    
    onChange({
      target: {
        name,
        value: newValue
      }
    });
  };
  
  // Handle click on the drop zone
  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Render file previews
  const renderPreviews = () => {
    if (!showPreview || !value || value.length === 0) return null;
    
    return (
      <div className={`mt-4 ${previewType === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4' : 'space-y-3'}`}>
        {value.map((file) => (
          <div
            key={file.id}
            className={`
              relative group
              ${previewType === 'grid'
                ? 'border border-gray-200 rounded-md p-3 hover:border-indigo-400 transition-colors'
                : 'flex items-center border border-gray-200 rounded-md p-3 hover:border-indigo-400 transition-colors'
              }
            `}
          >
            {previewType === 'grid' ? (
              <>
                <div className="aspect-square w-full flex items-center justify-center bg-gray-50 rounded mb-2 overflow-hidden">
                  {file.preview ? (
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    getFileIcon(file)
                  )}
                </div>
                <div className="text-xs truncate" title={file.name}>
                  {file.name}
                </div>
                <div className="text-xs text-gray-500">
                  {formatFileSize(file.size)}
                </div>
              </>
            ) : (
              <>
                {file.preview ? (
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="h-10 w-10 object-cover rounded"
                  />
                ) : (
                  <div className="h-10 w-10 flex items-center justify-center bg-gray-100 rounded">
                    {getFileIcon(file)}
                  </div>
                )}
                <div className="ml-3 flex-1">
                  <div className="text-sm truncate" title={file.name}>
                    {file.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </div>
                </div>
              </>
            )}
            
            <button
              type="button"
              onClick={() => handleRemove(file.id)}
              className="absolute top-1 right-1 p-1 rounded-full bg-white border border-gray-200 shadow-sm text-gray-400 hover:text-red-500 focus:outline-none transition-colors"
              disabled={disabled}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove file</span>
            </button>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className={`file-upload w-full ${className}`}>
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
      
      <div
        className={`
          border-2 border-dashed rounded-md p-6
          transition-colors duration-150
          ${isDragging ? 'border-indigo-400 bg-indigo-50' : 'border-gray-300 bg-gray-50'}
          ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-100'}
        `}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <Upload className={`h-8 w-8 mb-2 ${isDragging ? 'text-indigo-500' : 'text-gray-400'}`} />
          
          <p className="text-sm font-medium text-gray-700">
            {isDragging ? 'Drop files here' : 'Drag and drop files here'}
          </p>
          
          <p className="mt-1 text-xs text-gray-500">
            or <span className="text-indigo-500 font-medium">browse files</span>
          </p>
          
          <p className="mt-2 text-xs text-gray-500">
            {`Accepted formats: ${accept === '*/*' ? 'All files' : acceptedTypes.join(', ')}`}
          </p>
          
          <p className="text-xs text-gray-500">
            {`Maximum file size: ${maxSize} MB`}
          </p>
          
          {maxFiles > 0 && (
            <p className="text-xs text-gray-500">
              {`${value ? value.length : 0} of ${maxFiles} files selected`}
            </p>
          )}
        </div>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        id={id}
        name={name}
        onChange={handleFileChange}
        multiple={maxFiles !== 1}
        accept={accept}
        disabled={disabled || (value && value.length >= maxFiles)}
        className="sr-only"
        aria-hidden="true"
      />
      
      {renderPreviews()}
      
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
  );
};

export default FileUpload; 