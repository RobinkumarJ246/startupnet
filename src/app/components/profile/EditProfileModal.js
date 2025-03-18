'use client';

import { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Briefcase, 
  Building, 
  GraduationCap, 
  FileText, 
  Link as LinkIcon,
  Users,
  Phone,
  Globe,
  MessageSquare,
  Save,
  Image as ImageIcon,
  Upload
} from 'lucide-react';
import Image from 'next/image';

export default function EditProfileModal({ isOpen, onClose, user, onSave }) {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Use effect to initialize form data when the user changes
  useEffect(() => {
    if (!user) return;
    
    const initialData = { ...user };
    
    // Handle any array fields that might be stringified
    ['skills', 'interests', 'hiringRoles', 'focusAreas'].forEach(field => {
      if (initialData[field]) {
        if (typeof initialData[field] === 'string') {
          try {
            // Try to parse JSON string to array
            initialData[field] = JSON.parse(initialData[field]);
          } catch (e) {
            // If not valid JSON, try to split by comma
            initialData[field] = initialData[field].split(',').map(item => item.trim());
          }
        }
      }
    });
    
    // Handle location if it's a string that contains JSON
    if (initialData.location && typeof initialData.location === 'string' && 
        initialData.location.startsWith('{') && initialData.location.endsWith('}')) {
      try {
        initialData.location = JSON.parse(initialData.location);
      } catch (e) {
        // Keep as is if not valid JSON
      }
    }
    
    setFormData(initialData);
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('File must be an image');
        return;
      }
      
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      setError('');
    }
  };

  const uploadProfileImage = async () => {
    if (!imageFile) return null;
    
    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append('userId', user._id);
      formData.append('userType', user.type);
      formData.append('file', imageFile);
      
      console.log('Uploading profile image for user:', user._id, user.type);
      
      const response = await fetch('/api/profile/image/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload image');
      }
      
      const data = await response.json();
      console.log('Profile image upload successful:', data);
      
      setSuccessMessage('Profile image updated successfully');
      return true;
    } catch (err) {
      console.error('Error uploading profile image:', err);
      setError('Failed to upload profile image: ' + err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      setSuccessMessage('');
      
      // First upload the image if there is one
      let imageUploaded = false;
      if (imageFile) {
        console.log('Uploading profile image...');
        imageUploaded = await uploadProfileImage();
        if (!imageUploaded) {
          console.warn('Image upload failed, but continuing with profile update');
        }
      }
      
      // Process the form data to ensure arrays are sent correctly
      const processedData = { ...formData };
      
      // Ensure user type and ID are included
      processedData.type = user.type;
      processedData.email = user.email;
      
      console.log('Saving profile data:', processedData);
      
      // Update the profile data
      await onSave(processedData);
      
      setSuccessMessage(imageUploaded 
        ? 'Profile and image updated successfully' 
        : 'Profile updated successfully');
      
      // Close the modal after a brief delay to show the success message
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Failed to save: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Render different form fields based on user type
  const renderUserSpecificFields = () => {
    switch (user?.type) {
      case 'student':
        return (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="university" className="block text-sm font-medium text-gray-700">
                  University
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <GraduationCap className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="university"
                    id="university"
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Your University"
                    value={formData.university || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="major" className="block text-sm font-medium text-gray-700">
                  Major
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="major"
                    id="major"
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Your Major"
                    value={formData.major || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-700">
                  Graduation Year
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="graduationYear"
                    id="graduationYear"
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Expected Graduation Year"
                    value={formData.graduationYear || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="location"
                    id="location"
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Your Location"
                    value={formData.location || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
                Skills (comma separated)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="skills"
                  id="skills"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Python, JavaScript, Design, Marketing..."
                  value={formData.skills || ''}
                  onChange={handleChange}
                />
              </div>
            </div>
          </>
        );

      case 'startup':
        return (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                  Company Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="companyName"
                    id="companyName"
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Startup Name"
                    value={formData.companyName || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                  Industry
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Briefcase className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="industry"
                    id="industry"
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Your Industry"
                    value={formData.industry || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="stage" className="block text-sm font-medium text-gray-700">
                  Startup Stage
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    name="stage"
                    id="stage"
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={formData.stage || ''}
                    onChange={handleChange}
                  >
                    <option value="">Select Stage</option>
                    <option value="Idea">Idea Stage</option>
                    <option value="Pre-seed">Pre-seed</option>
                    <option value="Seed">Seed</option>
                    <option value="Series A">Series A</option>
                    <option value="Series B">Series B</option>
                    <option value="Series C+">Series C+</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="location"
                    id="location"
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Your Location"
                    value={formData.location || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="foundingDate" className="block text-sm font-medium text-gray-700">
                Founding Date
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  name="foundingDate"
                  id="foundingDate"
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.foundingDate || ''}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="teamSize" className="block text-sm font-medium text-gray-700">
                Team Size
              </label>
              <input
                type="number"
                name="teamSize"
                id="teamSize"
                min="1"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Number of team members"
                value={formData.teamSize || ''}
                onChange={handleChange}
              />
            </div>
          </>
        );

      case 'club':
        return (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="clubName" className="block text-sm font-medium text-gray-700">
                  Club Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="clubName"
                    id="clubName"
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Club Name"
                    value={formData.clubName || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="parentOrganization" className="block text-sm font-medium text-gray-700">
                  Parent Organization
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="parentOrganization"
                    id="parentOrganization"
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="University/Organization"
                    value={formData.parentOrganization || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="memberCount" className="block text-sm font-medium text-gray-700">
                  Member Count
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="memberCount"
                    id="memberCount"
                    min="1"
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Number of members"
                    value={formData.memberCount || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="location"
                    id="location"
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Club Location"
                    value={formData.location || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="foundedYear" className="block text-sm font-medium text-gray-700">
                Founded Year
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  name="foundedYear"
                  id="foundedYear"
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Year founded"
                  value={formData.foundedYear || ''}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="focusAreas" className="block text-sm font-medium text-gray-700">
                Focus Areas (comma separated)
              </label>
              <input
                type="text"
                name="focusAreas"
                id="focusAreas"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Entrepreneurship, Technology, Arts..."
                value={formData.focusAreas || ''}
                onChange={handleChange}
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  // Check if user has a profile picture
  const hasProfilePic = user?.profilePicture || user?.avatar || user?.profileImage;
  const profilePicUrl = hasProfilePic 
    ? `/api/profile/image/${user._id}` 
    : null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          {successMessage && (
            <div className="mb-4 bg-green-50 border border-green-100 text-green-700 px-4 py-3 rounded">
              {successMessage}
            </div>
          )}

          {/* Profile Image */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Picture
            </label>
            <div className="flex items-center space-x-4">
              <div className="h-24 w-24 rounded-xl overflow-hidden border-2 border-gray-200 flex items-center justify-center bg-gray-50">
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Profile Preview" 
                    className="w-full h-full object-cover"
                  />
                ) : profilePicUrl ? (
                  <Image 
                    src={profilePicUrl} 
                    alt="Profile" 
                    width={96} 
                    height={96} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-12 w-12 text-gray-400" />
                )}
              </div>
              <div>
                <label className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleImageChange}
                  />
                </label>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
              </div>
            </div>
          </div>

          {/* Common Fields */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="bio">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              rows="3"
              value={formData.bio || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Tell us about yourself..."
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="location">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="City, Country"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="phoneNumber">
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          {/* User Type Specific Fields */}
          {renderUserSpecificFields()}

          {/* Social Links */}
          <div className="border-t border-gray-200 pt-4 mb-4 mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Social Links</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="website">
                Website
              </label>
              <div className="flex items-center">
                <Globe className="h-5 w-5 text-gray-400 mr-2" />
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="https://example.com"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="linkedIn">
                LinkedIn
              </label>
              <div className="flex items-center">
                <LinkIcon className="h-5 w-5 text-gray-400 mr-2" />
                <input
                  type="url"
                  id="linkedIn"
                  name="linkedIn"
                  value={formData.linkedIn || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="twitter">
                Twitter
              </label>
              <div className="flex items-center">
                <LinkIcon className="h-5 w-5 text-gray-400 mr-2" />
                <input
                  type="url"
                  id="twitter"
                  name="twitter"
                  value={formData.twitter || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="https://twitter.com/username"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-200 pt-4 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 