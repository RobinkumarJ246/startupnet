'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Calendar, Users, Rocket, Star, BookOpen, Briefcase, Network, Award,
  Menu, Twitter, Linkedin, Github
} from 'lucide-react';
import Link from 'next/link';
import AnimCard from '../components/AnimatedCard';

const FeaturesPage = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  // Features with detailed benefits
  const features = [
    {
      icon: <BookOpen className="h-12 w-12 text-indigo-600" />,
      title: 'Project Creation & Leadership',
      description: 'Students can create, lead, and manage innovative projects, gaining real-world experience and building their portfolios.',
      benefits: [
        'Develop leadership skills',
        'Gain hands-on experience',
        'Build a professional portfolio',
        'Collaborate with peers and mentors'
      ]
    },
    {
      icon: <Rocket className="h-12 w-12 text-indigo-600" />,
      title: 'Startup Collaboration',
      description: 'Startups can connect with talented students, accessing fresh ideas and skills while offering mentorship and opportunities.',
      benefits: [
        'Access to innovative student talent',
        'Mentor the next generation of innovators',
        'Expand your network within the student community',
        'Find potential future hires'
      ]
    },
    {
      icon: <Network className="h-12 w-12 text-indigo-600" />,
      title: 'Community Networking',
      description: 'Join a vibrant community of innovators, attend events, and network with industry professionals and peers.',
      benefits: [
        'Connect with like-minded individuals',
        'Attend exclusive networking events',
        'Build lasting professional relationships',
        'Discover new opportunities'
      ]
    },
    {
      icon: <Calendar className="h-12 w-12 text-indigo-600" />,
      title: 'Exclusive Events',
      description: 'Participate in hackathons, pitch nights, and workshops designed to foster collaboration and growth.',
      benefits: [
        'Showcase your skills',
        'Learn from industry experts',
        'Win prizes and recognition',
        'Network with potential collaborators'
      ]
    },
    {
      icon: <Briefcase className="h-12 w-12 text-indigo-600" />,
      title: 'Dedicated Workspaces',
      description: 'Startups get a dedicated space to manage projects, track progress, and collaborate with student teams.',
      benefits: [
        'Centralized project management',
        'Real-time collaboration tools',
        'Track progress and milestones',
        'Secure and private workspace'
      ]
    },
    {
      icon: <Award className="h-12 w-12 text-indigo-600" />,
      title: 'Recognition & Rewards',
      description: 'Showcase your achievements, earn badges, and gain recognition within the community.',
      benefits: [
        'Earn badges for achievements',
        'Showcase your portfolio',
        'Gain visibility in the community',
        'Unlock special opportunities'
      ]
    }
  ];

  // Statistics for credibility
  const statistics = [
    { icon: <Calendar className="h-10 w-10 text-indigo-600" />, number: '500+', label: 'Active Projects' },
    { icon: <Users className="h-10 w-10 text-indigo-600" />, number: '1000+', label: 'Students' },
    { icon: <Rocket className="h-10 w-10 text-indigo-600" />, number: '200+', label: 'Startups' },
    { icon: <Award className="h-10 w-10 text-indigo-600" />, number: '50+', label: 'Success Stories' }
  ];

  // Testimonials for social proof
  const testimonials = [
    {
      quote: "StartupNet has been instrumental in connecting me with talented students who brought fresh perspectives to our projects.",
      name: "Jane Doe",
      role: "CEO, TechStartup"
    },
    {
      quote: "As a student, I was able to lead a project and gain invaluable experience. The mentorship from startups was fantastic.",
      name: "John Smith",
      role: "Computer Science Student"
    },
    {
      quote: "The platform's tools made it easy to manage our collaboration with students, and the community aspect is a game-changer.",
      name: "Alice Johnson",
      role: "Product Manager, InnovateNow"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar (consistent with landing page) */}
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
              <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium">
                Login
              </Link>
              <Link href="/register" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">
                Sign Up
              </Link>
            </div>
            <button
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden bg-white/90 backdrop-blur-sm">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="/pricing" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                Pricing
              </Link>
              <Link href="/contact" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                Contact
              </Link>
              <Link href="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                Login
              </Link>
              <Link href="/register" className="block px-3 py-2 rounded-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-indigo-50 to-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Discover Our Features
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Empowering students and startups to innovate, collaborate, and succeed together.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2 mt-8 md:mt-0"
          >
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
              alt="Team Collaboration"
              className="rounded-lg shadow-lg"
            />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our Features</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-center mb-6">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">{feature.title}</h3>
                <p className="text-gray-600 text-center mb-6">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center text-gray-600">
                      <Star className="h-5 w-5 text-indigo-500 mr-2" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statistics.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="flex justify-center mb-4">{stat.icon}</div>
                <div className="text-4xl font-bold text-indigo-600">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <p className="text-gray-600 mb-4">"{testimonial.quote}"</p>
                <div className="font-semibold">{testimonial.name}</div>
                <div className="text-gray-500">{testimonial.role}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Unique Selling Points Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose StartupNet?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Student-Startup Collaboration</h3>
              <p className="text-gray-600">Unique focus on connecting students with startups for mutual growth and innovation.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Comprehensive Tools</h3>
              <p className="text-gray-600">Advanced project management tools to streamline collaboration and productivity.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Vibrant Community</h3>
              <p className="text-gray-600">Join a thriving ecosystem of innovators, events, and networking opportunities.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Recognition & Rewards</h3>
              <p className="text-gray-600">Earn badges, showcase achievements, and gain recognition within the community.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl font-bold mb-4"
          >
            Start Your Journey Today
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl mb-8"
          >
            Join thousands of students and startups building the future.
          </motion.p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register-student"
              className="px-8 py-4 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 text-lg font-semibold transition-colors duration-200"
            >
              Join as a Student
            </Link>
            <Link
              href="/register-startup"
              className="px-8 py-4 border-2 border-white rounded-lg hover:bg-white hover:text-indigo-600 text-lg font-semibold transition-colors duration-200"
            >
              Join as a Startup
            </Link>
          </div>
        </div>
      </section>

      {/* Footer (optional enhancement) */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="mb-4">&copy; 2023 StartupNet. All rights reserved.</p>
          <div className="flex justify-center gap-6">
            <a href="https://twitter.com" className="hover:text-indigo-400"><Twitter className="h-6 w-6" /></a>
            <a href="https://linkedin.com" className="hover:text-indigo-400"><Linkedin className="h-6 w-6" /></a>
            <a href="https://github.com" className="hover:text-indigo-400"><Github className="h-6 w-6" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FeaturesPage;