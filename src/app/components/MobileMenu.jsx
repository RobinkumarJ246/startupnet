'use client';

import Link from 'next/link';

const MobileMenu = ({ userType, onClose }) => (
  <div className="fixed inset-0 z-50 md:hidden">
    <div className="fixed inset-0 bg-black/20" onClick={onClose} />
    <div className="fixed top-0 right-0 bottom-0 w-64 bg-white p-6">
      <div className="flex justify-between items-center mb-8">
        <span className="font-semibold">Menu</span>
        <button onClick={onClose} className="p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <nav className="space-y-4">
        <Link href="/feed" className="block py-2 text-gray-600 hover:text-gray-900">
          Home
        </Link>
        <Link href="/explore" className="block py-2 text-gray-600 hover:text-gray-900">
          Explore
        </Link>
        {userType === 'organization' && (
          <Link href="/talent" className="block py-2 text-gray-600 hover:text-gray-900">
            Talent Pool
          </Link>
        )}
        <Link href="/projects" className="block py-2 text-gray-600 hover:text-gray-900">
          Projects
        </Link>
        <Link href="/events" className="block py-2 text-gray-600 hover:text-gray-900">
          Events
        </Link>
      </nav>
    </div>
  </div>
);

export default MobileMenu;