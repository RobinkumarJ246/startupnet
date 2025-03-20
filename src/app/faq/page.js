'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, Search, User, CreditCard, HelpCircle, Briefcase, Users, BookOpen, Zap, MessageSquare, ChevronRight, Calendar } from 'lucide-react';
import Navbar from '../components/landing/Navbar';

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('account');
  const [activeSubcategory, setActiveSubcategory] = useState('general');
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
    },
    {
      id: 'events',
      name: 'Events & Hosting',
      icon: <Calendar className="h-5 w-5" />,
      color: 'from-rose-500 to-pink-600',
      subcategories: [
        {
          id: 'general',
          name: 'General',
          questions: [
            {
              id: 'events-general-1',
              question: 'Who can host events on StartupsNet?',
              answer: 'Currently, only startups and university clubs can host events on StartupsNet. Students can participate in events but cannot host them. This ensures quality and legitimacy of events on the platform.'
            },
            {
              id: 'events-general-2',
              question: 'What types of events can I host?',
              answer: 'Currently, you can host hackathons on the platform. We are working on adding support for other event types like workshops, cultural events, and more. Stay tuned for updates!'
            },
            {
              id: 'events-general-3',
              question: 'How do I get started with hosting an event?',
              answer: 'To host an event, navigate to the "Host Event" section and select the event type you want to create. Follow the step-by-step form to provide all necessary details about your event.'
            }
          ]
        },
        {
          id: 'hackathons',
          name: 'Hackathons',
          questions: [
            {
              id: 'hackathon-1',
              question: 'What information do I need to provide for a hackathon?',
              answer: 'You\'ll need to provide: 1) Basic event details (title, description, mode, location), 2) Participant requirements (team size, eligibility), 3) Event phases (registration, shortlisting, main event, results), 4) Prizes and rewards, 5) Contact information, and 6) Additional publishing options (if any).'
            },
            {
              id: 'hackathon-2',
              question: 'How do I set up event phases for my hackathon?',
              answer: 'You can configure four main phases: 1) Registration - Set start/end dates and team size limits, 2) Shortlisting - Define criteria and dates for participant selection, 3) Main Event - Set the hackathon duration and requirements, 4) Results - Configure announcement dates and prize distribution.'
            },
            {
              id: 'hackathon-3',
              question: 'What are the payment options for hackathons?',
              answer: 'You can set up various payment options: 1) Free registration, 2) Paid registration with different tiers, 3) Early bird discounts, 4) Coupon codes, 5) Random discount system. You can also configure payment collection timing (before or after shortlisting).'
            },
            {
              id: 'hackathon-4',
              question: 'How can I collect submissions from participants?',
              answer: 'You can enable document submissions and configure requirements like: 1) Problem statement documents (PDF/Word), 2) Project files, 3) Custom forms with various question types (text, number, choice, etc.). You can also set up external form links for submissions.'
            },
            {
              id: 'hackathon-5',
              question: 'What communication channels can I set up for participants?',
              answer: 'You can provide multiple communication channels: 1) Primary contact email and phone, 2) Additional contact emails and phones, 3) Website URL, 4) WhatsApp group link, 5) Telegram group link, 6) Optional support space for host-registrant communication.'
            },
            {
              id: 'hackathon-6',
              question: 'How do I manage the shortlisting process?',
              answer: 'You can configure shortlisting by: 1) Setting shortlisting dates, 2) Defining shortlisting criteria, 3) Choosing whether to collect payments before or after shortlisting, 4) Setting up a results announcement date for shortlisted participants.'
            },
            {
              id: 'hackathon-7',
              question: 'What are the prize pool options?',
              answer: 'You can set up: 1) Total prize pool amount, 2) Multiple prize categories (1st, 2nd, 3rd place, etc.), 3) Special prizes (best innovation, best UI/UX, etc.), 4) Non-cash rewards like internships or mentorship opportunities.'
            },
            {
              id: 'hackathon-8',
              question: 'How can I promote my hackathon?',
              answer: 'You can use multiple channels: 1) Platform\'s built-in promotion, 2) Your website, 3) Social media links (WhatsApp, Telegram), 4) External form links, 5) Problem statement attachments, 6) Custom registration forms to collect participant information.'
            }
          ]
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
    if (category.subcategories) {
      // Handle categories with subcategories
      const filteredSubcategories = category.subcategories.map(subcategory => {
        const filteredQuestions = subcategory.questions.filter(q => 
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
          q.answer.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        return {
          ...subcategory,
          questions: filteredQuestions,
          hasMatches: filteredQuestions.length > 0
        };
      });
      
      return {
        ...category,
        subcategories: filteredSubcategories,
        hasMatches: filteredSubcategories.some(sub => sub.hasMatches)
      };
    } else {
      // Handle regular categories
      const filteredQuestions = category.questions.filter(q => 
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        q.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      return {
        ...category,
        questions: filteredQuestions,
        hasMatches: filteredQuestions.length > 0
      };
    }
  });
  
  // Count total questions that match search
  const totalMatchingQuestions = filteredCategories.reduce(
    (total, category) => {
      if (category.subcategories) {
        return total + category.subcategories.reduce(
          (subTotal, sub) => subTotal + sub.questions.length, 
          0
        );
      }
      return total + category.questions.length;
    }, 
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
                      
                      {/* Subcategories */}
                      {category.subcategories && activeCategory === category.id && (
                        <ul className="ml-8 mt-2 space-y-1">
                          {category.subcategories.map((sub) => (
                            <li key={sub.id}>
                              <button
                                className={`flex items-center w-full px-4 py-2 text-sm transition-colors ${
                                  activeSubcategory === sub.id
                                    ? 'text-indigo-700 bg-indigo-50'
                                    : 'text-gray-600 hover:bg-gray-50'
                                }`}
                                onClick={() => setActiveSubcategory(sub.id)}
                              >
                                <span>{sub.name}</span>
                                {searchQuery && sub.hasMatches && (
                                  <span className="ml-auto bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                                    {sub.questions.length}
                                  </span>
                                )}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
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
                  {category.subcategories ? (
                    // Handle categories with subcategories
                    category.subcategories.map((sub) => (
                      <div 
                        key={sub.id}
                        className={activeSubcategory === sub.id || searchQuery ? 'block' : 'hidden'}
                      >
                        <h2 className="text-2xl font-bold mb-6 text-gray-900">{sub.name}</h2>
                        <div className="space-y-4">
                          {sub.questions.map((item) => (
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
                      </div>
                    ))
                  ) : (
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