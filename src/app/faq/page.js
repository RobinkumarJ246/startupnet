'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, Search, User, CreditCard, HelpCircle, Briefcase, Users, BookOpen, Zap, MessageSquare, ChevronRight } from 'lucide-react';
import Navbar from '../components/landing/Navbar';

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('account');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedQuestions, setExpandedQuestions] = useState({});
  
  // FAQ categories and questions
  const faqCategories = [
    {
      id: 'account',
      name: 'Account & Registration',
      icon: <User className="h-5 w-5" />,
      color: 'from-blue-500 to-indigo-600',
      questions: [
        {
          id: 'account-1',
          question: 'How do I create an account on StartupsNet?',
          answer: 'Creating an account is simple! Click the "Sign Up" button on the homepage, select your account type (Student, Startup, or Club), fill in the registration form, and follow the verification process. Once verified, you can start using all platform features.'
        },
        {
          id: 'account-2',
          question: 'What are the different account types?',
          answer: 'StartupsNet offers three account types: Student (for university students), Startup (for new and established businesses), and Club (for university tech clubs and communities). Each account type has specific features tailored to their needs.'
        },
        {
          id: 'account-3',
          question: 'How can I recover my password?',
          answer: 'You can reset your password by clicking "Forgot password?" on the login page. Enter your email address, and we\'ll send you a password reset link. Follow the instructions in the email to create a new password.'
        },
        {
          id: 'account-4',
          question: 'Can I change my account type after registration?',
          answer: 'Currently, you cannot change your account type after registration. If you need to switch account types, please contact our support team for assistance.'
        }
      ]
    },
    {
      id: 'collaboration',
      name: 'Project Collaboration',
      icon: <BookOpen className="h-5 w-5" />,
      color: 'from-purple-500 to-pink-600',
      questions: [
        {
          id: 'collab-1',
          question: 'How can I start a new project?',
          answer: 'To start a new project, navigate to the Projects section and click "Create New Project." Fill in the project details, including title, description, required skills, and timeline. You can invite collaborators directly or open it for applications.'
        },
        {
          id: 'collab-2',
          question: 'Can I collaborate with people outside my university?',
          answer: 'Yes! StartupsNet is designed to facilitate collaboration between students from different universities, startups, and clubs. You can search for potential collaborators based on skills, interests, or location.'
        },
        {
          id: 'collab-3',
          question: 'How do project permissions work?',
          answer: 'Project creators automatically become project administrators with full control over the project. They can assign different roles to collaborators: Admin, Editor, or Viewer. Each role has different permissions for managing the project.'
        },
        {
          id: 'collab-4',
          question: 'Is there a limit to how many projects I can join?',
          answer: 'There is no strict limit to the number of projects you can join. However, we recommend focusing on a manageable number to ensure you can contribute effectively to each project.'
        }
      ]
    },
    {
      id: 'startups',
      name: 'Startups & Clubs',
      icon: <Briefcase className="h-5 w-5" />,
      color: 'from-emerald-500 to-teal-600',
      questions: [
        {
          id: 'startup-1',
          question: 'How can startups find student talent?',
          answer: 'Startups can browse student profiles, post projects or job opportunities, and connect with university clubs. Our advanced search filters help you find students with specific skills, experience levels, and interests relevant to your needs.'
        },
        {
          id: 'startup-2',
          question: 'What benefits do clubs get from the platform?',
          answer: 'Clubs gain a dedicated space to showcase their activities, recruit members, organize events, and collaborate with startups. They can also access resources, connect with other clubs, and build a stronger community presence.'
        },
        {
          id: 'startup-3',
          question: 'How is a university-affiliated club verified?',
          answer: 'University-affiliated clubs must provide documentation proving their official association with a university. Our verification team reviews these documents to ensure legitimacy before granting verified status.'
        },
        {
          id: 'startup-4',
          question: 'Can startups host events on the platform?',
          answer: 'Absolutely! Startups can create and promote events such as webinars, workshops, hackathons, or networking sessions. These events can be public or invitation-only, depending on your preferences.'
        }
      ]
    },
    {
      id: 'payment',
      name: 'Payment & Billing',
      icon: <CreditCard className="h-5 w-5" />,
      color: 'from-orange-500 to-red-600',
      questions: [
        {
          id: 'payment-1',
          question: 'Is there a fee to use StartupsNet?',
          answer: 'Basic access to StartupsNet is free for all users. However, we offer premium plans with additional features for startups and clubs. Students always have free access to all essential platform features.'
        },
        {
          id: 'payment-2',
          question: 'What payment methods are accepted?',
          answer: 'We accept major credit/debit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for premium subscriptions. All payments are securely processed through our payment partners.'
        },
        {
          id: 'payment-3',
          question: 'How can I upgrade to a premium account?',
          answer: 'To upgrade, go to your account settings and select "Upgrade to Premium." Choose the plan that best fits your needs, enter your payment information, and confirm the subscription. Your account will be upgraded immediately.'
        },
        {
          id: 'payment-4',
          question: 'Can I get a refund if I\'m not satisfied?',
          answer: 'Yes, we offer a 14-day money-back guarantee for all new premium subscriptions. If you\'re not satisfied with the premium features, contact our support team within 14 days of purchase for a full refund.'
        }
      ]
    },
    {
      id: 'platform',
      name: 'Platform Usage',
      icon: <Zap className="h-5 w-5" />,
      color: 'from-cyan-500 to-blue-600',
      questions: [
        {
          id: 'platform-1',
          question: 'How can I message other users?',
          answer: 'You can message other users through our built-in messaging system. Navigate to a user\'s profile and click the "Message" button, or use the Messages section to start new conversations and manage existing ones.'
        },
        {
          id: 'platform-2',
          question: 'Are there mobile apps available?',
          answer: 'We currently offer a responsive web application that works well on mobile devices. Native mobile apps for iOS and Android are under development and will be released soon.'
        },
        {
          id: 'platform-3',
          question: 'How can I report inappropriate content or users?',
          answer: 'To report inappropriate content or behavior, click the "Report" button available on user profiles, project pages, or messages. Provide details about the issue, and our moderation team will review it promptly.'
        },
        {
          id: 'platform-4',
          question: 'Can I integrate other tools with StartupsNet?',
          answer: 'Yes, StartupsNet supports integration with popular tools like GitHub, Trello, Slack, and Google Workspace. You can set up these integrations in your project settings to streamline your workflow.'
        }
      ]
    }
  ];
  
  // Toggle question expansion
  const toggleQuestion = (questionId) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };
  
  // Filter questions based on search query
  const filteredCategories = faqCategories.map(category => {
    const filteredQuestions = category.questions.filter(q => 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    return {
      ...category,
      questions: filteredQuestions,
      hasMatches: filteredQuestions.length > 0
    };
  });
  
  // Count total questions that match search
  const totalMatchingQuestions = filteredCategories.reduce(
    (total, category) => total + category.questions.length, 
    0
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-indigo-300 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-purple-300 rounded-full opacity-20 blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Find answers to common questions about using StartupsNet
            </p>
            
            {/* Search Input */}
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="py-4 px-4 pl-12 w-full border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/80 backdrop-blur-sm"
                placeholder="Search for a question..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <div className="absolute text-sm text-gray-500 right-4 top-1/2 transform -translate-y-1/2">
                  {totalMatchingQuestions} result{totalMatchingQuestions !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Content */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Category Sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
                <ul>
                  {faqCategories.map((category) => (
                    <li key={category.id}>
                      <button
                        className={`flex items-center w-full px-4 py-3 text-left transition-colors ${
                          activeCategory === category.id
                            ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => setActiveCategory(category.id)}
                      >
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${category.color} mr-3`}>
                          <div className="text-white">{category.icon}</div>
                        </div>
                        <span className="font-medium">{category.name}</span>
                        {searchQuery && category.hasMatches && (
                          <span className="ml-auto bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                            {category.questions.length}
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
                
                <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 mt-4">
                  <div className="flex items-start">
                    <HelpCircle className="h-5 w-5 text-indigo-600 mt-1 mr-2 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Need more help?</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Can't find what you're looking for? Contact our support team.
                      </p>
                      <Link 
                        href="/contact" 
                        className="inline-flex items-center mt-2 text-sm text-indigo-600 hover:text-indigo-800"
                      >
                        Contact Support <ChevronRight className="h-4 w-4 ml-1 rotate-270" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Questions and Answers */}
            <div className="lg:w-3/4">
              {filteredCategories.map((category) => (
                <div 
                  key={category.id} 
                  className={activeCategory === category.id || searchQuery ? 'block' : 'hidden'}
                >
                  {(category.questions.length > 0) && (
                    <>
                      {searchQuery && (
                        <h2 className="text-2xl font-bold mb-6 text-gray-900">{category.name}</h2>
                      )}
                      
                      <div className="space-y-4">
                        {category.questions.map((item) => (
                          <div 
                            key={item.id}
                            className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
                          >
                            <button
                              className="w-full text-left p-6 focus:outline-none"
                              onClick={() => toggleQuestion(item.id)}
                            >
                              <div className="flex justify-between items-center">
                                <h3 className="text-lg font-medium text-gray-900">{item.question}</h3>
                                <div className={`p-1 rounded-full transition-colors ${
                                  expandedQuestions[item.id] 
                                    ? 'bg-indigo-100 text-indigo-600' 
                                    : 'bg-gray-100 text-gray-500'
                                }`}>
                                  {expandedQuestions[item.id] ? (
                                    <ChevronUp className="h-5 w-5" />
                                  ) : (
                                    <ChevronDown className="h-5 w-5" />
                                  )}
                                </div>
                              </div>
                              
                              {expandedQuestions[item.id] && (
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                  <p className="text-gray-600">{item.answer}</p>
                                </div>
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  
                  {searchQuery && category.questions.length === 0 && (
                    <div className="hidden">
                      <h2 className="text-2xl font-bold mb-6 text-gray-900">{category.name}</h2>
                      <div className="bg-gray-50 rounded-xl p-8 text-center">
                        <p className="text-gray-500">No matching questions in this category.</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {searchQuery && totalMatchingQuestions === 0 && (
                <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
                  <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    We couldn't find any questions matching "{searchQuery}". Try using different keywords or contact our support team.
                  </p>
                  <Link 
                    href="/contact" 
                    className="inline-flex items-center mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Contact Support
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Community Section */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 md:p-12 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-x-16 -translate-y-16 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-x-16 translate-y-16 blur-3xl"></div>
            </div>
            
            <div className="relative z-10 md:flex items-center justify-between">
              <div className="md:max-w-xl mb-8 md:mb-0">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">Still have questions?</h2>
                <p className="text-indigo-100">
                  Join our community forum to connect with other users and get answers to your questions.
                  Our community is active and helpful!
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/stay_tuned" className="inline-flex items-center justify-center px-6 py-3 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors duration-300 shadow-sm font-medium">
                  Join Community Forum
                </Link>
                <Link href="/contact" className="inline-flex items-center justify-center px-6 py-3 bg-indigo-700/30 text-white border border-indigo-500/30 backdrop-blur-sm rounded-lg hover:bg-indigo-700/50 transition-colors duration-300 font-medium">
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 