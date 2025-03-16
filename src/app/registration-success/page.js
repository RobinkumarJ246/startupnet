'use client'
import { Suspense } from 'react';
import RegistrationSuccessContent from './RegistrationSuccessContent';
import SkeletonLoader from '../components/SkeletonLoader';

export default function RegistrationSuccess() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <Suspense fallback={<SkeletonLoader />}>
        <RegistrationSuccessContent />
      </Suspense>
    </div>
  );
} 