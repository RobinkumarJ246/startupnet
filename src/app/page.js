import React from 'react';
import Link from 'next/link';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
<nav className="fixed w-full bg-white/80 backdrop-blur-sm z-50 border-b">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between h-16 items-center">
      <div className="flex items-center gap-8">
        <div className="flex-shrink-0">
          <Link href="/" className="text-2xl font-bold text-indigo-600">
            StartupNet
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-4">
      <Link 
          href="/pricing"
          className="hidden md:block text-gray-600 hover:text-gray-900 font-medium mr-4"
        >
          Pricing
        </Link>
        <Link 
          href="/contact"
          className="hidden md:block text-gray-600 hover:text-gray-900 font-medium"
        >
          Contact
        </Link>
        <Link 
          href="/login"
          className="px-4 py-2 rounded-lg text-gray-600 hover:text-gray-900 font-medium"
        >
          Login
        </Link>
        <Link 
          href="/register"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
        >
          Sign up
        </Link>
        {/* Mobile menu button */}
        <button className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100">
          <svg 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Where Talent Meets Opportunity
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect with startups, build amazing projects, and grow your career in the most vibrant tech ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/register"
              className="px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-lg font-semibold"
            >
              Join the Community
            </Link>
            <Link 
              href="/explore"
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 text-lg font-semibold"
            >
              Learn more
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid - Updated */}
<section className="py-20 bg-gray-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="text-3xl font-bold text-center mb-12">Empowering Innovation Through Collaboration</h2>
    <div className="grid md:grid-cols-2 gap-12">
      {/* For Students */}
      <div className="bg-white p-8 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
        <div className="h-16 w-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6">
          <span className="text-4xl text-white">🎓</span>
        </div>
        <h3 className="text-2xl font-bold mb-4">For Students</h3>
        <ul className="space-y-3 text-gray-600">
          <li className="flex items-center">
            <span className="h-5 w-5 text-indigo-500 mr-2">✦</span>
            Create and lead innovative projects
          </li>
          <li className="flex items-center">
            <span className="h-5 w-5 text-indigo-500 mr-2">✦</span>
            Build your portfolio with real startup experience
          </li>
          <li className="flex items-center">
            <span className="h-5 w-5 text-indigo-500 mr-2">✦</span>
            Collaborate with industry professionals
          </li>
          <li className="flex items-center">
            <span className="h-5 w-5 text-indigo-500 mr-2">✦</span>
            Access mentorship opportunities
          </li>
        </ul>
      </div>

      {/* For Startups */}
      <div className="bg-white p-8 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
        <div className="h-16 w-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6">
          <span className="text-4xl text-white">🚀</span>
        </div>
        <h3 className="text-2xl font-bold mb-4">For Startups</h3>
        <ul className="space-y-3 text-gray-600">
        <li className="flex items-center">
            <span className="h-5 w-5 text-indigo-500 mr-2">✦</span>
            Connect with other startups in the ecosystem
          </li>
          <li className="flex items-center">
            <span className="h-5 w-5 text-indigo-500 mr-2">✦</span>
            Access a pool of talented, motivated students
          </li>
          <li className="flex items-center">
            <span className="h-5 w-5 text-indigo-500 mr-2">✦</span>
            Dedicated organization space
          </li>
          <li className="flex items-center">
            <span className="h-5 w-5 text-indigo-500 mr-2">✦</span>
            Utilize our project management tools
          </li>
        </ul>
      </div>
    </div>
  </div>
</section>

      {/* Social Proof Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-8">Join Our Growing Community</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">500+</div>
              <div className="text-gray-600">Active Projects</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">1000+</div>
              <div className="text-gray-600">Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">200+</div>
              <div className="text-gray-600">Startups</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">50+</div>
              <div className="text-gray-600">Success Stories</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            Ready to Start Your Journey?
          </h2>
          <Link 
            href="/register"
            className="px-8 py-4 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 text-lg font-semibold inline-block"
          >
            Create Your Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link></li>
                <li><Link href="/features" className="text-gray-600 hover:text-gray-900">Features</Link></li>
                <li><Link href="/pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="/blog" className="text-gray-600 hover:text-gray-900">Blog</Link></li>
                <li><Link href="/guides" className="text-gray-600 hover:text-gray-900">Guides</Link></li>
                <li><Link href="/help" className="text-gray-600 hover:text-gray-900">Help Center</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-gray-600 hover:text-gray-900">Privacy</Link></li>
                <li><Link href="/terms" className="text-gray-600 hover:text-gray-900">Terms</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2">
                <li><Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link></li>
                <li><Link href="/twitter" className="text-gray-600 hover:text-gray-900">Twitter</Link></li>
                <li><Link href="/linkedin" className="text-gray-600 hover:text-gray-900">LinkedIn</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-gray-600">
            <p>&copy; 2025 StartupSync. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;