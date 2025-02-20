'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calendar, Users, Rocket, Star, BookOpen, Briefcase, Network, Award,
  Menu, Twitter, Linkedin, Github, ChevronsRight
} from 'lucide-react';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-sm z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-2xl font-bold text-indigo-600">
                StartupNet
              </Link>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900 font-medium">
                Pricing
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900 font-medium">
                Contact
              </Link>
              <Link href="/login" className="px-4 py-2 rounded-lg text-gray-600 hover:text-gray-900 font-medium">
                Login
              </Link>
              <Link href="/register" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">
                Sign Up
              </Link>
            </div>
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/90 backdrop-blur-sm">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                href="/pricing"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Pricing
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Contact
              </Link>
              <Link
                href="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="block px-3 py-2 rounded-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </nav>
      

      {/* Hero Section */}
      <section className="pt-20 pb-20 px-4">
              {/* Marquee for Latest Updates */}
      <div className="bg-indigo-600 text-white py-4 overflow-hidden flex items-center">
        <div className="flex-shrink-0 bg-indigo-600 px-4 font-semibold text-lg flex items-center">
          <ChevronsRight className="h-6 w-6 text-white mr-2" />
          Updates
        </div>
        <div className="relative flex-1 overflow-hidden">
          <div className="marquee">
            <span>
              Startup Pitch Night on Jan 15 | New Startups Joined: TechHub, InnovateNow | Student Hackathon Feb 10
            </span>
          </div>
          {/* Gradient mask for gradual fade effect */}
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-indigo-600 to-transparent pointer-events-none"></div>
        </div>
      </div>
        <div className="max-w-7xl mx-auto text-center animate-fade-in mt-10">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Where Talent Meets Opportunity
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect students with startups to build innovative projects and grow together in a vibrant ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-lg font-semibold"
            >
              Join Now
            </Link>
            <Link
              href="/explore"
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-50 text-lg font-semibold"
            >
              Explore
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 animate-fade-in">What We Offer</h2>
          <div className="grid md:grid-cols-2 gap-12">
            {/* For Students */}
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <BookOpen className="h-12 w-12 text-indigo-600 mr-4" />
                <h3 className="text-2xl font-bold">For Students</h3>
              </div>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-center">
                  <Star className="h-6 w-6 text-indigo-500 mr-2" />
                  Create and lead innovative projects
                </li>
                <li className="flex items-center">
                  <Star className="h-6 w-6 text-indigo-500 mr-2" />
                  Build your portfolio with real-world experience
                </li>
                <li className="flex items-center">
                  <Star className="h-6 w-6 text-indigo-500 mr-2" />
                  Collaborate with startup mentors
                </li>
                <li className="flex items-center">
                  <Star className="h-6 w-6 text-indigo-500 mr-2" />
                  Join exclusive events and workshops
                </li>
              </ul>
            </div>

            {/* For Startups */}
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <Rocket className="h-12 w-12 text-indigo-600 mr-4" />
                <h3 className="text-2xl font-bold">For Startups</h3>
              </div>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-center">
                  <Star className="h-6 w-6 text-indigo-500 mr-2" />
                  Access a pool of talented students
                </li>
                <li className="flex items-center">
                  <Star className="h-6 w-6 text-indigo-500 mr-2" />
                  Dedicated organization workspace
                </li>
                <li className="flex items-center">
                  <Star className="h-6 w-6 text-indigo-500 mr-2" />
                  Leverage project management tools
                </li>
                <li className="flex items-center">
                  <Star className="h-6 w-6 text-indigo-500 mr-2" />
                  Network with other startups
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
          <h2 className="text-3xl font-bold mb-8">Our Thriving Community</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <Calendar className="h-10 w-10 text-indigo-600 mx-auto mb-2" />
              <div className="text-4xl font-bold text-indigo-600 mb-2">500+</div>
              <div className="text-gray-600">Active Projects</div>
            </div>
            <div>
              <Users className="h-10 w-10 text-indigo-600 mx-auto mb-2" />
              <div className="text-4xl font-bold text-indigo-600 mb-2">1000+</div>
              <div className="text-gray-600">Students</div>
            </div>
            <div>
              <Rocket className="h-10 w-10 text-indigo-600 mx-auto mb-2" />
              <div className="text-4xl font-bold text-indigo-600 mb-2">200+</div>
              <div className="text-gray-600">Startups</div>
            </div>
            <div>
              <Award className="h-10 w-10 text-indigo-600 mx-auto mb-2" />
              <div className="text-4xl font-bold text-indigo-600 mb-2">50+</div>
              <div className="text-gray-600">Success Stories</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8">Whether you're a student or a startup, join us to innovate, collaborate, and succeed.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register-student"
              className="px-8 py-4 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 text-lg font-semibold"
            >
              Join as a Student
            </Link>
            <Link
              href="/register-startup"
              className="px-8 py-4 border-2 border-white rounded-lg hover:bg-white hover:text-indigo-600 text-lg font-semibold"
            >
              Join as a Startup
            </Link>
          </div>
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
              <div className="flex gap-4">
                <Link href="/twitter" className="text-gray-600 hover:text-indigo-600">
                  <Twitter className="h-6 w-6" />
                </Link>
                <Link href="/linkedin" className="text-gray-600 hover:text-indigo-600">
                  <Linkedin className="h-6 w-6" />
                </Link>
                <Link href="/github" className="text-gray-600 hover:text-indigo-600">
                  <Github className="h-6 w-6" />
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-gray-600">
            <p>© 2025 StartupNet. All rights reserved.</p>
          </div>
        </div>
      </footer>

            {/* Custom Styles */}
            <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 1s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .marquee {
          display: inline-block;
          white-space: nowrap;
          animation: marquee 20s linear infinite;
        }
        .marquee span {
          padding-right: 50px;
        }
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        @media (max-width: 640px) {
          .marquee {
            animation: marquee 15s linear infinite;
          }
        }
      `}</style>
      </div>
  );
};

export default LandingPage;