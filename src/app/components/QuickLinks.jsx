'use client';

import Link from 'next/link';

const QuickLink = ({ href, icon, text }) => (
  <Link 
    href={href} 
    className="flex items-center text-gray-700 hover:text-indigo-600 transition-colors"
  >
    <span className="mr-3">{icon}</span> {text}
  </Link>
);

const QuickLinks = ({ userType }) => (
  <div className="bg-white rounded-lg p-4 shadow-sm">
    <h3 className="font-semibold mb-4">Quick Links</h3>
    <div className="space-y-3">
      {userType === 'student' ? (
        <>
          <QuickLink href="/my-projects" icon="📂" text="My Projects" />
          <QuickLink href="/applications" icon="📝" text="My Applications" />
          <QuickLink href="/skills" icon="🎯" text="Skills" />
          <QuickLink href="/learning" icon="📚" text="Learning Path" />
        </>
      ) : (
        <>
          <QuickLink href="/post-project" icon="➕" text="Post a Project" />
          <QuickLink href="/manage-projects" icon="📊" text="Manage Projects" />
          <QuickLink href="/candidates" icon="👥" text="Candidates" />
          <QuickLink href="/analytics" icon="📈" text="Analytics" />
        </>
      )}
    </div>
  </div>
);

export default QuickLinks;