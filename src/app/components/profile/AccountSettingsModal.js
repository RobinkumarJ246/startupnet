import { useState } from 'react';
import { X, Lock, AlertTriangle, Eye, EyeOff, Check, Trash } from 'lucide-react';

export default function AccountSettingsModal({ isOpen, onClose, onPasswordChanged, onAccountDeleted }) {
  const [activeTab, setActiveTab] = useState('password');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Account deletion state
  const [deleteData, setDeleteData] = useState({
    password: '',
    confirmText: ''
  });
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };
  
  const handleDeleteChange = (e) => {
    const { name, value } = e.target;
    setDeleteData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };
  
  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (!passwordData.currentPassword) {
      setError('Current password is required');
      return;
    }
    
    if (!passwordData.newPassword) {
      setError('New password is required');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setError('New password must be at least 8 characters long');
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        const errorMessage = data.error || data.details || 'Failed to change password';
        console.error('Password change error response:', data);
        setError(errorMessage);
        return;
      }
      
      // Clear form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setSuccess('Password changed successfully!');
      
      // Notify parent component
      if (onPasswordChanged) {
        onPasswordChanged();
      }
      
      // Auto close after a few seconds
      setTimeout(() => {
        if (success === 'Password changed successfully!') {
          onClose();
        }
      }, 3000);
      
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Password change error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    
    // Validate input
    if (!deleteData.password) {
      setError('Password is required');
      return;
    }
    
    if (deleteData.confirmText !== 'DELETE') {
      setError('Please type DELETE to confirm account deletion');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/auth/delete-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: deleteData.password,
          confirmText: deleteData.confirmText
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        const errorMessage = data.error || data.details || 'Failed to delete account';
        console.error('Account deletion error response:', data);
        setError(errorMessage);
        return;
      }
      
      setSuccess('Account deleted successfully!');
      
      // Clear user data from localStorage
      localStorage.removeItem('user');
      
      // Notify parent component
      if (onAccountDeleted) {
        onAccountDeleted();
      }
      
      // Show success message briefly before redirecting
      setTimeout(() => {
        // Hard redirect to home page
        window.location.href = '/';
      }, 1500);
      
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Account deletion error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Account Settings</h3>
              <button
                onClick={onClose}
                className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  className={`mr-8 py-4 text-sm font-medium ${
                    activeTab === 'password'
                      ? 'border-b-2 border-indigo-500 text-indigo-600'
                      : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => {
                    setActiveTab('password');
                    setError('');
                    setSuccess('');
                  }}
                >
                  Change Password
                </button>
                <button
                  className={`py-4 text-sm font-medium ${
                    activeTab === 'delete'
                      ? 'border-b-2 border-red-500 text-red-600'
                      : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => {
                    setActiveTab('delete');
                    setError('');
                    setSuccess('');
                  }}
                >
                  Delete Account
                </button>
              </nav>
            </div>
            
            {/* Status messages */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            )}
            
            {success && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <div className="flex">
                  <Check className="h-5 w-5 text-green-400 mr-2" />
                  <p className="text-sm text-green-600">{success}</p>
                </div>
              </div>
            )}
            
            {/* Tab Content */}
            <div className="mt-6">
              {activeTab === 'password' && (
                <form onSubmit={handleChangePassword}>
                  <div className="space-y-4">
                    {/* Current Password */}
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock size={16} className="text-gray-500" />
                        </div>
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          id="currentPassword"
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          className="pl-10 pr-10 py-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="Enter your current password"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? (
                            <EyeOff size={16} className="text-gray-400" />
                          ) : (
                            <Eye size={16} className="text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    {/* New Password */}
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock size={16} className="text-gray-500" />
                        </div>
                        <input
                          type={showNewPassword ? "text" : "password"}
                          id="newPassword"
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className="pl-10 pr-10 py-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="Enter your new password"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <EyeOff size={16} className="text-gray-400" />
                          ) : (
                            <Eye size={16} className="text-gray-400" />
                          )}
                        </button>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Password must be at least 8 characters long
                      </p>
                    </div>
                    
                    {/* Confirm New Password */}
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock size={16} className="text-gray-500" />
                        </div>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          id="confirmPassword"
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className="pl-10 pr-10 py-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="Confirm your new password"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={16} className="text-gray-400" />
                          ) : (
                            <Eye size={16} className="text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-6">
                      <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        {loading ? 'Changing Password...' : 'Change Password'}
                      </button>
                    </div>
                  </div>
                </form>
              )}
              
              {activeTab === 'delete' && (
                <div>
                  <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-md">
                    <div className="flex">
                      <AlertTriangle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0" />
                      <div>
                        <h3 className="text-sm font-medium text-red-800">Warning: This action cannot be undone</h3>
                        <p className="mt-1 text-sm text-red-700">
                          Deleting your account will permanently remove all your data from our system. This includes your profile information, connections, and activity history.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <form onSubmit={handleDeleteAccount}>
                    <div className="space-y-4">
                      {/* Password */}
                      <div>
                        <label htmlFor="deletePassword" className="block text-sm font-medium text-gray-700 mb-1">
                          Enter your password to confirm
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock size={16} className="text-gray-500" />
                          </div>
                          <input
                            type="password"
                            id="deletePassword"
                            name="password"
                            value={deleteData.password}
                            onChange={handleDeleteChange}
                            className="pl-10 py-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                            placeholder="Enter your password"
                          />
                        </div>
                      </div>
                      
                      {/* Confirmation text */}
                      <div>
                        <label htmlFor="confirmText" className="block text-sm font-medium text-gray-700 mb-1">
                          Type DELETE to confirm
                        </label>
                        <input
                          type="text"
                          id="confirmText"
                          name="confirmText"
                          value={deleteData.confirmText}
                          onChange={handleDeleteChange}
                          className="py-2 px-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                          placeholder="DELETE"
                        />
                      </div>
                      
                      <div className="flex justify-end mt-6">
                        <button
                          type="button"
                          onClick={onClose}
                          disabled={loading}
                          className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={loading || deleteData.confirmText !== 'DELETE'}
                          className={`flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                            loading || deleteData.confirmText !== 'DELETE' ? 'opacity-70 cursor-not-allowed' : ''
                          }`}
                        >
                          <Trash size={16} className="mr-2" />
                          {loading ? 'Deleting Account...' : 'Delete Account'}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 