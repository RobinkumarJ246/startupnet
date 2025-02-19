'use client';

import Link from 'next/link';

const NavLink = ({ href, children, active }) => (
  <Link
    href={href}
    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      active 
        ? 'text-indigo-600 bg-indigo-50'
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
    }`}
  >
    {children}
  </Link>
);

export default NavLink;