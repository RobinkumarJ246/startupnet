'use client';

export function ProfileSkeleton() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div className="h-8 w-40 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
      </div>
      
      {/* Skeleton Profile Header */}
      <div className="bg-white shadow rounded-xl overflow-hidden mb-8">
        {/* Cover Photo Skeleton */}
        <div className="h-40 md:h-56 bg-gray-200 animate-pulse relative"></div>

        {/* Profile Info Section */}
        <div className="relative px-6 pb-6">
          {/* Profile Photo Skeleton */}
          <div className="absolute -top-16 left-6">
            <div className="h-28 w-28 rounded-2xl bg-gray-300 animate-pulse border-4 border-white"></div>
          </div>

          {/* Profile Info Skeleton */}
          <div className="pt-20 pb-2">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div className="flex-1 mb-4 md:mb-0">
                <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
                
                {/* Bio Skeleton */}
                <div className="mt-4 bg-gray-100 p-4 rounded-lg">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-full"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                </div>
              </div>
            </div>

            {/* Skills Skeleton */}
            <div className="mt-5 border-t border-gray-100 pt-5">
              <div className="h-5 w-20 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-8 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Profile details skeleton */}
          <div className="mt-4 border-t border-gray-100 pt-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 mt-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-center">
                  <div className="h-5 w-5 bg-gray-300 rounded-full animate-pulse"></div>
                  <div className="ml-2 h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="ml-1 h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation Skeleton */}
      <div className="bg-white mb-8 rounded-xl overflow-hidden shadow">
        <div className="border-b border-gray-200">
          <div className="flex space-x-4 px-4 py-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
        
        {/* Tab Content Skeleton */}
        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 bg-gray-300 rounded-lg animate-pulse"></div>
                  <div className="ml-4">
                    <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CardSkeleton({ count = 1 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
          <div className="flex items-center mb-4">
            <div className="h-10 w-10 bg-gray-300 rounded-lg animate-pulse"></div>
            <div className="ml-4">
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function TextSkeleton({ lines = 3, width = 'full' }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i} 
          className={`h-4 bg-gray-200 rounded animate-pulse w-${width === 'full' ? 'full' : (i % 3 === 0 ? 'full' : i % 2 === 0 ? '3/4' : '1/2')}`}
        ></div>
      ))}
    </div>
  );
}

export default function SkeletonLoader({ type = 'profile', count = 1 }) {
  switch (type) {
    case 'profile':
      return <ProfileSkeleton />;
    case 'card':
      return <CardSkeleton count={count} />;
    case 'text':
      return <TextSkeleton lines={count} />;
    default:
      return <ProfileSkeleton />;
  }
} 