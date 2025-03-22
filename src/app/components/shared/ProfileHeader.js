import React from 'react';
import { UserType } from '@/app/lib/types';
import Image from 'next/image';

const ProfileHeader = ({ user, userType }) => {
  const hasProfilePic = user?.hasProfilePic ?? false;
  const imageAlt = `${user?.fullName || user?.companyName || user?.clubName || 'User'}'s profile picture`;

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200">
        {hasProfilePic ? (
          <Image
            src={`/api/profile/image/${user._id}`}
            alt={imageAlt}
            width={64}
            height={64}
            className="h-full w-full object-cover"
            unoptimized={true}
            onError={(e) => {
              console.error('Failed to load profile image, falling back to default');
              e.target.style.display = 'none';
              if (e.target.parentElement) {
                const iconContainer = e.target.parentElement.querySelector('div');
                if (iconContainer) {
                  iconContainer.style.display = 'flex';
                } else {
                  console.warn('Icon container not found');
                  // Create a fallback container if it doesn't exist
                  const fallbackContainer = document.createElement('div');
                  fallbackContainer.className = 'h-full w-full flex items-center justify-center';
                  
                  // Add appropriate icon based on user type
                  if (userType === 'student') {
                    fallbackContainer.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-8 w-8 text-gray-400"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
                  } else if (userType === 'startup') {
                    fallbackContainer.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-8 w-8 text-gray-400"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12" y2="18"></line></svg>';
                  } else {
                    fallbackContainer.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-8 w-8 text-gray-400"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>';
                  }
                  
                  e.target.parentElement.appendChild(fallbackContainer);
                }
              }
            }}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            {userType === UserType.STUDENT && (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-gray-400">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            )}
            {userType === UserType.STARTUP && (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-gray-400">
                <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                <line x1="12" y1="18" x2="12" y2="18"></line>
              </svg>
            )}
            {userType === UserType.CLUB && (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-gray-400">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            )}
          </div>
        )}
      </div>
      <div className="mt-4 text-center">
        <h1 className="text-xl font-semibold">
          {userType === UserType.STUDENT && user?.fullName}
          {userType === UserType.STARTUP && user?.companyName}
          {userType === UserType.CLUB && user?.clubName}
        </h1>
        <p className="text-gray-600">
          {userType === UserType.STUDENT && user?.major}
          {userType === UserType.STARTUP && user?.industry}
          {userType === UserType.CLUB && user?.university}
        </p>
      </div>
    </div>
  );
};

export default ProfileHeader; 