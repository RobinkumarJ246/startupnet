'use client';

import React from 'react';

export default function SkeletonLoader() {
  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-8 animate-pulse">
      {/* Header area */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
        <div className="h-8 bg-gray-200 rounded-lg w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-200 w-full my-6"></div>

      {/* Content area */}
      <div className="space-y-6">
        <div className="flex flex-col space-y-3">
          <div className="h-5 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>

        <div className="flex flex-col space-y-3">
          <div className="h-5 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
        
        <div className="flex flex-col space-y-3">
          <div className="h-5 bg-gray-200 rounded w-2/5"></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      {/* CTA area */}
      <div className="mt-8 flex justify-center">
        <div className="h-12 bg-gray-200 rounded-lg w-1/3"></div>
      </div>

      {/* Countdown */}
      <div className="mt-6 flex justify-center">
        <div className="h-6 bg-gray-200 rounded w-2/5"></div>
      </div>
    </div>
  );
} 