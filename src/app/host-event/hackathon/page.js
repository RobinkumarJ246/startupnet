'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Calendar, Users, MapPin, Search, Star, Clock, 
  Sparkles, Globe2, Filter, ChevronDown, Share2, 
  CalendarRange, Code, Presentation, Target, Laptop, Megaphone, 
  Briefcase, UserPlus, Music, Heart, ChevronLeft, ChevronRight, 
  Ticket, Bell, Building, School, Coffee, ArrowRight, Plus, BadgeCheck, Tag,
  User, ArrowLeft, Check, CheckCircle2, Pencil, Hash, DollarSign, Award,
  ListChecks, Mail, Phone, Link, Info, Sparkle, Percent, Trophy, Send, IndianRupee, Settings,
  FileText, Layers, Workflow, Instagram, Youtube, Facebook, Linkedin, ExternalLink, FileUp, HelpCircle, X, MessageSquare
} from 'lucide-react';
import { FaWhatsapp,FaTelegram } from "react-icons/fa";
import Navbar from '../../components/landing/Navbar';
import EnhancedMarkdownEditor from '../../components/editor/EnhancedMarkdownEditor';
import {
  StylishInput,
  StylishSelect,
  StylishTextarea,
  StylishCheckbox,
  FormSection,
  DateRangePicker,
  NumberInput,
  PriceInput,
  FileUpload,
  CheckboxGroup,
  ModernSelect,
  ToggleSwitch,
  RadioCardGroup
} from '../../components/forms';

// Import the new hackathon-specific components
import {
  DocumentSubmissionConfig,
  CustomFormBuilder,
  EventPhasesConfig
} from '../../components/hackathon';

// CSS animation keyframes
const fadeInAnimation = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out forwards;
  }
`;

// Beta Badge Component
const BetaBadge = ({ className = '' }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800 ${className}`}>
    BETA
  </span>
);

const HostEventPage = () => {
  const router = useRouter();
  const [userType, setUserType] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7; // Keep total steps the same
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail: null,
    startDate: '',
    endDate: '',
    venue: '',
    mode: 'in-person',
    maxParticipants: 100,
    noParticipantLimit: false,
    isFree: true,
    price: 0,
    hasFood: false,
    hasAccommodation: false,
    hasWifi: false,
    hasParking: false,
    hasPowerStations: false,
    hasRefreshments: false,
    duration: '24',
    prizePool: '',
    hasPrizePool: true,
    technicalRequirements: '',
    prizes: '',
    judgingCriteria: '',
    mentors: '',
    resources: '',
    tags: [],
    
    // Team configuration
    participationType: 'team', // 'individual' or 'team'
    minTeamSize: 2,
    maxTeamSize: 4,
    
    // Contact and visibility
    contactInfo: {
      primaryEmail: '',
      additionalEmails: [],
      primaryPhone: '',
      additionalPhones: [],
      websiteUrl: '',
      socialMedia: {
        instagram: '',
        whatsapp: '',
        telegram: '',
        linkedin: ''
      },
      shareContactWithParticipants: true,
      enableSupportSpace: false
    },
    
    // Pricing and coupons
    pricingType: 'per-team', // 'per-team' or 'per-person'
    couponCode: '',
    couponDiscount: 10,
    enableRandomDiscounts: false,
    randomDiscountPercentage: 5,
    randomDiscountChance: 10,
    
    // New fields for document submission
    documentSubmission: {
      requireDocuments: false,
      requireAbstract: true,
      requirePresentation: false,
      abstractFileTypes: ['pdf', 'docx', 'txt'],
      presentationFileTypes: ['pdf', 'pptx']
    },
    
    // Custom form fields
    customForm: {
      useCustomForm: false,
      template: 'basic',
      questions: []
    },
    
    // Event phases configuration
    eventPhases: {
      enableShortlisting: false,
      enableResults: true,
      registrationPhase: {
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        collectPayment: true
      },
      shortlistingPhase: {
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        resultsDate: '',
        resultsTime: ''
      },
      eventPhase: {
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: ''
      },
      resultsPhase: {
        announcementDate: '',
        announcementTime: '',
        publicResults: true
      },
      paymentTiming: 'registration'
    },
    
    // Add these new fields for Event Details (Step 2)
    additionalPublishingModes: false,
    problemStatementUrl: '',
    problemStatementFile: null,
    externalFormUrl: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Get user type from localStorage
  useEffect(() => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUserType(parsedUser.type);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle price input specially
    if (name === 'price') {
      setFormData(prev => ({
        ...prev,
        price: value,
        isFree: value === 0
      }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      startDate: value.startDate,
      endDate: value.endDate
    }));
  };

  const handleFileUpload = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value && value.length > 0 ? value[0] : null
    }));
  };

  const handleDescriptionChange = (value) => {
    setFormData(prev => ({
      ...prev,
      description: value || ''
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Basic required fields
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    
    // Mode and venue validation
    if (!formData.mode) newErrors.mode = 'Mode is required';
    if (formData.mode !== 'virtual' && !formData.venue) {
      newErrors.venue = 'Venue is required for in-person or hybrid events';
    }
    
    // Participants validation
    if (!formData.noParticipantLimit && !formData.maxParticipants) {
      newErrors.maxParticipants = 'Maximum participants is required';
    }
    
    // Team configuration
    if (formData.participationType === 'team') {
      if (!formData.minTeamSize) newErrors.minTeamSize = 'Minimum team size is required';
      if (!formData.maxTeamSize) newErrors.maxTeamSize = 'Maximum team size is required';
      if (formData.minTeamSize > formData.maxTeamSize) {
        newErrors.minTeamSize = 'Minimum team size cannot be greater than maximum';
      }
    }
    
    // Prize validation
    if (formData.hasPrizePool && !formData.prizePool) {
      newErrors.prizePool = 'Prize pool is required if enabled';
    }
    
    // Price validation
    if (!formData.isFree && !formData.price) {
      newErrors.price = 'Price is required for paid events';
    }
    
    // Coupon validation
    if (formData.couponCode && formData.couponCode.length > 10) {
      newErrors.couponCode = 'Coupon code must be 10 characters or less';
    }
    
    // Contact validation
    if (formData.contactInfo.primaryEmail && !/\S+@\S+\.\S+/.test(formData.contactInfo.primaryEmail)) {
      newErrors.primaryEmail = 'Please enter a valid email address';
    }
    
    if (formData.contactInfo.primaryPhone && !/^\d{10}$/.test(formData.contactInfo.primaryPhone)) {
      newErrors.primaryPhone = 'Please enter a valid 10-digit phone number';
    }
    
    // Validate document submission
    if (formData.documentSubmission.requireDocuments) {
      if (!formData.documentSubmission.requireAbstract && !formData.documentSubmission.requirePresentation) {
        newErrors.documentSubmission = 'At least one document type must be required if document submission is enabled';
      }
      
      if (formData.documentSubmission.requireAbstract && 
          (!formData.documentSubmission.abstractFileTypes || formData.documentSubmission.abstractFileTypes.length === 0)) {
        newErrors.abstractFileTypes = 'At least one file type must be selected for abstract submissions';
      }
      
      if (formData.documentSubmission.requirePresentation && 
          (!formData.documentSubmission.presentationFileTypes || formData.documentSubmission.presentationFileTypes.length === 0)) {
        newErrors.presentationFileTypes = 'At least one file type must be selected for presentation submissions';
      }
    }
    
    // Validate custom form
    if (formData.customForm.useCustomForm && 
        formData.customForm.template === 'custom' && 
        (!formData.customForm.questions || formData.customForm.questions.length === 0)) {
      newErrors.customForm = 'Custom form must contain at least one question';
    }
    
    // Validate event phases
    const { eventPhases } = formData;
    
    // Registration phase validation
    if (!eventPhases.registrationPhase.startDate) {
      newErrors.registrationStartDate = 'Registration start date is required';
    }
    if (!eventPhases.registrationPhase.startTime) {
      newErrors.registrationStartTime = 'Registration start time is required';
    }
    if (!eventPhases.registrationPhase.endDate) {
      newErrors.registrationEndDate = 'Registration end date is required';
    }
    if (!eventPhases.registrationPhase.endTime) {
      newErrors.registrationEndTime = 'Registration end time is required';
    }
    
    // Event phase validation
    if (!eventPhases.eventPhase.startDate) {
      newErrors.eventStartDate = 'Event start date is required';
    }
    if (!eventPhases.eventPhase.startTime) {
      newErrors.eventStartTime = 'Event start time is required';
    }
    if (!eventPhases.eventPhase.endDate) {
      newErrors.eventEndDate = 'Event end date is required';
    }
    if (!eventPhases.eventPhase.endTime) {
      newErrors.eventEndTime = 'Event end time is required';
    }
    
    // Shortlisting phase validation (if enabled)
    if (eventPhases.enableShortlisting) {
      if (!eventPhases.shortlistingPhase.startDate) {
        newErrors.shortlistingStartDate = 'Shortlisting start date is required';
      }
      if (!eventPhases.shortlistingPhase.startTime) {
        newErrors.shortlistingStartTime = 'Shortlisting start time is required';
      }
      if (!eventPhases.shortlistingPhase.endDate) {
        newErrors.shortlistingEndDate = 'Shortlisting end date is required';
      }
      if (!eventPhases.shortlistingPhase.endTime) {
        newErrors.shortlistingEndTime = 'Shortlisting end time is required';
      }
      if (!eventPhases.shortlistingPhase.resultsDate) {
        newErrors.shortlistingResultsDate = 'Shortlisting results date is required';
      }
      if (!eventPhases.shortlistingPhase.resultsTime) {
        newErrors.shortlistingResultsTime = 'Shortlisting results time is required';
      }
      
      // Validate date sequence
      const regEnd = new Date(`${eventPhases.registrationPhase.endDate}T${eventPhases.registrationPhase.endTime}`);
      const shortlistStart = new Date(`${eventPhases.shortlistingPhase.startDate}T${eventPhases.shortlistingPhase.startTime}`);
      
      if (shortlistStart < regEnd) {
        newErrors.shortlistingStartDate = 'Shortlisting must start after registration ends';
      }
    }
    
    // Results phase validation (if enabled)
    if (eventPhases.enableResults) {
      if (!eventPhases.resultsPhase.announcementDate) {
        newErrors.resultsDate = 'Results announcement date is required';
      }
      if (!eventPhases.resultsPhase.announcementTime) {
        newErrors.resultsTime = 'Results announcement time is required';
      }
    }
    
    // Payment timing validation
    if (eventPhases.paymentTiming === 'after_shortlisting' && !eventPhases.enableShortlisting) {
      newErrors.paymentTiming = 'Cannot collect payment after shortlisting if shortlisting is not enabled';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields only on final submission
    const newErrors = validateForm();
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      // Scroll to first error
      const firstErrorId = Object.keys(newErrors)[0];
      const element = document.getElementById(firstErrorId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

      setLoading(true);
      
    try {
      // Process and prepare the form data for submission
      const processedData = {
        ...formData,
        
        // Connect event phases dates with event dates
        startDate: formData.eventPhases.eventPhase.startDate,
        endDate: formData.eventPhases.eventPhase.endDate,
        
        // Registration period
        registrationPeriod: {
          startDate: formData.eventPhases.registrationPhase.startDate,
          endDate: formData.eventPhases.registrationPhase.endDate
        },
        
        // Include social media and contact info in a structured way
        contactInfo: {
          ...formData.contactInfo,
          primaryEmail: formData.contactInfo.primaryEmail,
          primaryPhone: formData.contactInfo.primaryPhone,
          website: formData.contactInfo.websiteUrl || null,
          socialMedia: {
            instagram: formData.contactInfo.socialMedia.instagram || null,
            whatsapp: formData.contactInfo.socialMedia.whatsapp || null,
            telegram: formData.contactInfo.socialMedia.telegram || null,
            linkedin: formData.contactInfo.socialMedia.linkedin || null
          },
          shareWithParticipants: formData.contactInfo.shareContactWithParticipants
        },
        
        // Include additional publishing modes
        additionalPublishing: formData.additionalPublishingModes ? {
          enabled: true,
          problemStatementUrl: formData.problemStatementUrl || null,
          problemStatementFile: formData.problemStatementFile || null,
          externalFormUrl: formData.externalFormUrl || null
        } : { enabled: false },
        
        // Create phases object to track event progress
        phases: {
          registration: {
            active: true,
            startDate: formData.eventPhases.registrationPhase.startDate,
            endDate: formData.eventPhases.registrationPhase.endDate,
            collectPayment: formData.eventPhases.paymentTiming === 'registration'
          },
          shortlisting: formData.eventPhases.enableShortlisting ? {
            active: true,
            startDate: formData.eventPhases.shortlistingPhase.startDate,
            endDate: formData.eventPhases.shortlistingPhase.endDate,
            resultsDate: formData.eventPhases.shortlistingPhase.resultsDate,
            collectPayment: formData.eventPhases.paymentTiming === 'after_shortlisting'
          } : { active: false },
          event: {
            active: true,
            startDate: formData.eventPhases.eventPhase.startDate,
            endDate: formData.eventPhases.eventPhase.endDate
          },
          results: formData.eventPhases.enableResults ? {
            active: true,
            announcementDate: formData.eventPhases.resultsPhase.announcementDate,
            publicResults: formData.eventPhases.resultsPhase.publicResults
          } : { active: false }
        },
        
        // Create submission requirements object
        submissionRequirements: formData.documentSubmission.requireDocuments ? {
          requireDocuments: true,
          abstract: formData.documentSubmission.requireAbstract ? {
            required: true,
            allowedFileTypes: formData.documentSubmission.abstractFileTypes
          } : { required: false },
          presentation: formData.documentSubmission.requirePresentation ? {
            required: true,
            allowedFileTypes: formData.documentSubmission.presentationFileTypes
          } : { required: false }
        } : { requireDocuments: false },
        
        // Custom registration form
        registrationForm: formData.customForm.useCustomForm ? {
          enabled: true,
          template: formData.customForm.template,
          questions: formData.customForm.questions
        } : { enabled: false }
      };
      
      // Submit the processed form data to the server
      const response = await fetch('/api/events/hackathons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(processedData),
      });

      if (!response.ok) {
        throw new Error('Failed to create event');
      }

      setSuccess(true);
        router.push('/events');
    } catch (error) {
      console.error('Error creating event:', error);
      setErrors({ submit: 'Failed to create event. Please try again.' });
    } finally {
      setLoading(false);
    }
  };
  
  // Navigation functions
  const goToNextStep = () => {
    // Partial validation based on current step
    const newErrors = validateCurrentStepFields();
    setErrors(prevErrors => ({ ...prevErrors, ...newErrors }));
    
    // Even with errors, allow navigation
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };
  
  const validateCurrentStepFields = () => {
    const newErrors = {};
    
    // Validate only the fields in the current step
    switch (currentStep) {
      case 1: // Basic Info
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (formData.tags.length === 0) newErrors.tags = 'At least one tag is required';
        break;
        
      case 2: // Event Details
        if (!formData.startDate) newErrors.startDate = 'Start date is required';
        if (!formData.endDate) newErrors.endDate = 'End date is required';
        if (!formData.mode) newErrors.mode = 'Mode is required';
        if (formData.mode !== 'virtual' && !formData.venue) {
          newErrors.venue = 'Venue is required for in-person or hybrid events';
        }
        
        // Validate additional publishing modes fields
        if (formData.additionalPublishingModes) {
          // Validate URL formats if provided
          if (formData.problemStatementUrl && !formData.problemStatementUrl.match(/^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/)) {
            newErrors.problemStatementUrl = 'Please enter a valid URL';
          }
          
          if (formData.externalFormUrl && !formData.externalFormUrl.match(/^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/)) {
            newErrors.externalFormUrl = 'Please enter a valid URL';
          }
        }
        break;
        
      case 3: // Event Phases
        const { eventPhases } = formData;
        
        // Registration phase validation
        if (!eventPhases.registrationPhase.startDate) {
          newErrors.registrationStartDate = 'Registration start date is required';
        }
        if (!eventPhases.registrationPhase.startTime) {
          newErrors.registrationStartTime = 'Registration start time is required';
        }
        if (!eventPhases.registrationPhase.endDate) {
          newErrors.registrationEndDate = 'Registration end date is required';
        }
        if (!eventPhases.registrationPhase.endTime) {
          newErrors.registrationEndTime = 'Registration end time is required';
        }
        
        // Event phase validation
        if (!eventPhases.eventPhase.startDate) {
          newErrors.eventStartDate = 'Event start date is required';
        }
        if (!eventPhases.eventPhase.startTime) {
          newErrors.eventStartTime = 'Event start time is required';
        }
        if (!eventPhases.eventPhase.endDate) {
          newErrors.eventEndDate = 'Event end date is required';
        }
        if (!eventPhases.eventPhase.endTime) {
          newErrors.eventEndTime = 'Event end time is required';
        }
        
        // Shortlisting phase validation (if enabled)
        if (eventPhases.enableShortlisting) {
          if (!eventPhases.shortlistingPhase.startDate) {
            newErrors.shortlistingStartDate = 'Shortlisting start date is required';
          }
          if (!eventPhases.shortlistingPhase.startTime) {
            newErrors.shortlistingStartTime = 'Shortlisting start time is required';
          }
          if (!eventPhases.shortlistingPhase.endDate) {
            newErrors.shortlistingEndDate = 'Shortlisting end date is required';
          }
          if (!eventPhases.shortlistingPhase.endTime) {
            newErrors.shortlistingEndTime = 'Shortlisting end time is required';
          }
          if (!eventPhases.shortlistingPhase.resultsDate) {
            newErrors.shortlistingResultsDate = 'Shortlisting results date is required';
          }
          if (!eventPhases.shortlistingPhase.resultsTime) {
            newErrors.shortlistingResultsTime = 'Shortlisting results time is required';
          }
          
          // Validate date sequence
          const regEnd = new Date(`${eventPhases.registrationPhase.endDate}T${eventPhases.registrationPhase.endTime}`);
          const shortlistStart = new Date(`${eventPhases.shortlistingPhase.startDate}T${eventPhases.shortlistingPhase.startTime}`);
          
          if (shortlistStart < regEnd) {
            newErrors.shortlistingStartDate = 'Shortlisting must start after registration ends';
          }
        }
        
        // Results phase validation (if enabled)
        if (eventPhases.enableResults) {
          if (!eventPhases.resultsPhase.announcementDate) {
            newErrors.resultsDate = 'Results announcement date is required';
          }
          if (!eventPhases.resultsPhase.announcementTime) {
            newErrors.resultsTime = 'Results announcement time is required';
          }
        }
        
        // Payment timing validation
        if (eventPhases.paymentTiming === 'after_shortlisting' && !eventPhases.enableShortlisting) {
          newErrors.paymentTiming = 'Cannot collect payment after shortlisting if shortlisting is not enabled';
        }
        break;
        
      case 4: // Participants
        if (!formData.noParticipantLimit && !formData.maxParticipants) {
          newErrors.maxParticipants = 'Maximum participants is required';
        }
        
        if (formData.participationType === 'team') {
          if (!formData.minTeamSize) newErrors.minTeamSize = 'Minimum team size is required';
          if (!formData.maxTeamSize) newErrors.maxTeamSize = 'Maximum team size is required';
          if (formData.minTeamSize > formData.maxTeamSize) {
            newErrors.minTeamSize = 'Minimum team size cannot be greater than maximum';
          }
        }
        break;
        
      case 5: // Technical & Prizes
        if (!formData.technicalRequirements.trim()) newErrors.technicalRequirements = 'Technical requirements are required';
        if (!formData.judgingCriteria.trim()) newErrors.judgingCriteria = 'Judging criteria are required';
        if (!formData.hasPrizePool) newErrors.hasPrizePool = 'Prize pool is required if enabled';
        break;
        
      case 6: // Contact & Visibility
        if (!formData.contactInfo.primaryEmail) {
          newErrors.primaryEmail = 'Primary contact email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.contactInfo.primaryEmail)) {
          newErrors.primaryEmail = 'Please enter a valid email address';
        }
        
        if (!formData.contactInfo.primaryPhone) {
          newErrors.primaryPhone = 'Primary contact phone is required';
        } else if (!/^\d{10}$/.test(formData.contactInfo.primaryPhone)) {
          newErrors.primaryPhone = 'Please enter a valid 10-digit phone number';
        }
        
        // Validate additional emails if provided
        formData.contactInfo.additionalEmails.forEach((email, index) => {
          if (email && !/\S+@\S+\.\S+/.test(email)) {
            newErrors[`additionalEmail${index}`] = 'Please enter a valid email address';
          }
        });
        
        // Validate additional phones if provided
        formData.contactInfo.additionalPhones.forEach((phone, index) => {
          if (phone && !/^\d{10}$/.test(phone)) {
            newErrors[`additionalPhone${index}`] = 'Please enter a valid 10-digit phone number';
          }
        });
        
        if (!formData.contactInfo.shareContactWithParticipants) {
          newErrors.shareContactWithParticipants = 'Contact sharing is required';
        }
        if (!formData.contactInfo.visibility) {
          newErrors.visibility = 'Event visibility is required';
        }
        break;
        
      case 7: // Pricing
        if (!formData.isFree && !formData.price) {
          newErrors.price = 'Price is required for paid events';
        }
        
        if (formData.couponCode && formData.couponCode.length > 10) {
          newErrors.couponCode = 'Coupon code must be 10 characters or less';
        }
        break;
    }
    
    return newErrors;
  };
  
  const generateRandomCouponCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setFormData(prev => ({ ...prev, couponCode: result }));
  };

  // Fix how we render icons for different components
  const renderIcon = (Icon, size = "h-5 w-5", asJSX = true) => {
    if (asJSX) {
      // For components that expect a JSX element, like ModernSelect
      return <Icon className={size} />;
    } else {
      // For components that expect a component reference, like StylishInput
      return Icon;
    }
  };

  // Add these new handlers for the new components

  // Handle document submission config changes
  const handleDocumentSubmissionChange = (newDocumentSubmission) => {
    setFormData(prev => ({
      ...prev,
      documentSubmission: newDocumentSubmission
    }));
  };
  
  // Handle custom form builder changes
  const handleCustomFormChange = (newCustomForm) => {
    setFormData(prev => ({
      ...prev,
      customForm: newCustomForm
    }));
  };
  
  // Handle event phases config changes
  const handleEventPhasesChange = (newEventPhases) => {
    setFormData(prev => ({
      ...prev,
      eventPhases: newEventPhases
    }));
  };

  if (!userType || (userType !== 'startup' && userType !== 'club')) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
        <Navbar forceLight={true} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-8">Only startups and clubs can host events.</p>
            <button
              onClick={() => router.push('/events')}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar forceLight={true} />
      
      {/* Apply animations */}
      <style dangerouslySetInnerHTML={{ __html: fadeInAnimation }} />
      
      {/* Hero Section with Landing Page Theme */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-blue-800 to-indigo-900 text-white pt-24 pb-14">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute top-1/2 -left-24 w-80 h-80 bg-blue-500 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-indigo-400 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-8">
            <button
              onClick={() => router.push('/host-event')}
              className="inline-flex items-center text-indigo-200 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Event Types
            </button>
            <h1 className="text-3xl font-bold text-white mt-4">Host a Hackathon</h1>
            <p className="text-indigo-200 mt-2">Connect with passionate technologists and foster innovation</p>
        </div>
        
          {/* Step Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-medium 
                      ${currentStep > index + 1 ? 'bg-green-500 text-white' : 
                       currentStep === index + 1 ? 'bg-indigo-600 text-white border-2 border-white' : 
                       'bg-indigo-800/50 text-indigo-200 border border-indigo-500'}`}
                  >
                    {currentStep > index + 1 ? <Check className="w-5 h-5" /> : index + 1}
            </div>
                  <span className={`text-xs mt-1 ${currentStep === index + 1 ? 'text-white font-medium' : 'text-indigo-200'}`}>
                    {index === 0 ? 'Basic Info' : 
                     index === 1 ? 'Event Details' : 
                     index === 2 ? 'Event Phases' : 
                     index === 3 ? 'Participants' : 
                     index === 4 ? 'Technical & Prizes' : 
                     index === 5 ? 'Contact Info' :
                     'Pricing'}
                  </span>
          </div>
              ))}
              
              {/* Progress Line */}
              <div className="absolute left-0 right-0 h-0.5 bg-indigo-800" style={{ top: '20px', zIndex: -1 }}>
                <div 
                  className="h-full bg-indigo-400 transition-all duration-300"
                  style={{ width: `${(currentStep - 1) * 100 / (totalSteps - 1)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-gray-50 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
          
          {success ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center shadow-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-green-800 mb-2">Hackathon Created Successfully!</h2>
              <p className="text-green-700 mb-4">Your hackathon has been published. Redirecting to events page...</p>
              <button
                onClick={() => router.push('/events')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                View All Events
              </button>
            </div>
          ) : (
            <div className="bg-white shadow-xl rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  {currentStep === 1 && <Pencil className="w-5 h-5 mr-2 text-indigo-600" />}
                  {currentStep === 2 && <Calendar className="w-5 h-5 mr-2 text-indigo-600" />}
                  {currentStep === 3 && <Workflow className="w-5 h-5 mr-2 text-indigo-600" />}
                  {currentStep === 4 && <Users className="w-5 h-5 mr-2 text-indigo-600" />}
                  {currentStep === 5 && <Trophy className="w-5 h-5 mr-2 text-indigo-600" />}
                  {currentStep === 6 && <Mail className="w-5 h-5 mr-2 text-indigo-600" />}
                  {currentStep === 7 && <DollarSign className="w-5 h-5 mr-2 text-indigo-600" />}
                  {currentStep === 1 ? 'Basic Information' : 
                   currentStep === 2 ? 'Event Details' : 
                   currentStep === 3 ? 'Event Phases & Timeline' : 
                   currentStep === 4 ? 'Participant Information' : 
                   currentStep === 5 ? 'Technical Requirements & Prizes' : 
                   currentStep === 6 ? 'Contact & Visibility' : 
                   'Pricing & Discounts'}
                </h2>
                <p className="text-gray-600 text-sm mt-1 ml-7">
                  {currentStep === 1 ? 'Provide the basic details about your hackathon' : 
                   currentStep === 2 ? 'Set the mode and location details' : 
                   currentStep === 3 ? 'Define the phases and timeline for your hackathon' : 
                   currentStep === 4 ? 'Configure participation options and team settings' : 
                   currentStep === 5 ? 'Specify technical requirements and prize details' : 
                   currentStep === 6 ? 'Set contact information and visibility options' : 
                   'Configure pricing and discount options'}
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-8">
                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                  <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <StylishInput
                  id="title"
                  name="title"
                  label="Event Title"
                  placeholder="e.g., TechHacks 2024"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  error={errors.title}
                  icon={renderIcon(Pencil, "h-5 w-5", false)}
                />
                
                      <div className="md:col-span-2">
                        <FileUpload
                  id="thumbnail"
                  name="thumbnail"
                          label="Event Thumbnail"
                          accept="image/*"
                  value={formData.thumbnail}
                          onChange={(value) => setFormData(prev => ({ ...prev, thumbnail: value }))}
                          maxSize={5}
                          previewEnabled
                          helpText="Recommended size: 1200x630px, max 5MB"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-indigo-500">*</span>
                </label>
                  <EnhancedMarkdownEditor
                        id="description"
                    value={formData.description}
                        onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                        height={300}
                        error={errors.description}
                      />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>
                    
                    <div>
                      <ModernSelect
                        id="tags"
                        name="tags"
                        label="Event Tags"
                        value={formData.tags}
                        onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                        options={[
                          { value: 'ai', label: 'Artificial Intelligence' },
                          { value: 'web', label: 'Web Development' },
                          { value: 'mobile', label: 'Mobile App Development' },
                          { value: 'blockchain', label: 'Blockchain' },
                          { value: 'cloud', label: 'Cloud Computing' },
                          { value: 'fintech', label: 'FinTech' },
                          { value: 'edtech', label: 'EdTech' },
                          { value: 'healthcare', label: 'Healthcare' },
                          { value: 'sustainability', label: 'Sustainability' },
                          { value: 'security', label: 'Cybersecurity' },
                          { value: 'beginner', label: 'Beginner Friendly' },
                          { value: 'gaming', label: 'Gaming' }
                        ]}
                        icon={renderIcon(Tag, "h-5 w-5", true)}
                        multiple={true}
                        searchable={true}
                        maxHeight={200}
                        error={errors.tags}
                        helpText="Select tags to help participants find your event"
                      />
                    </div>
                  </div>
                )}
                
                {/* Step 2: Event Details */}
                {currentStep === 2 && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="grid grid-cols-1 gap-6">
                      <ModernSelect
                        id="duration"
                        name="duration"
                        label="Duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        options={[
                          { value: '24', label: '24 Hours' },
                          { value: '36', label: '36 Hours' },
                          { value: '48', label: '48 Hours' },
                          { value: '72', label: '72 Hours' },
                          { value: 'custom', label: 'Custom Duration' }
                        ]}
                        icon={renderIcon(Clock, "h-5 w-5", true)}
                        tooltip="How long will your hackathon run?"
                      />

                      <ModernSelect
                        id="mode"
                        name="mode"
                        label="Event Mode"
                        value={formData.mode}
                        onChange={handleInputChange}
                        options={[
                          { value: 'in-person', label: 'In-Person', searchTerms: ['onsite', 'physical'] },
                          { value: 'virtual', label: 'Virtual', searchTerms: ['online', 'remote'] },
                          { value: 'hybrid', label: 'Hybrid', searchTerms: ['mixed', 'both'] }
                        ]}
                        icon={renderIcon(Globe2, "h-5 w-5", true)}
                        tooltip="Select whether your event will be in-person, virtual, or hybrid"
                      />

                      {formData.mode !== 'virtual' && (
                        <StylishInput
                          id="venue"
                          name="venue"
                          label="Venue"
                          placeholder="e.g., Tech Hub, Building A"
                          value={formData.venue}
                          onChange={handleInputChange}
                          required={formData.mode !== 'virtual'}
                          error={errors.venue}
                          icon={renderIcon(MapPin, "h-5 w-5", false)}
                          tooltip="Physical location where your event will take place"
                        />
                      )}
                    </div>

                    {/* Additional Publishing Modes */}
                    <FormSection 
                      title="Additional Publishing Modes"
                      description="Optional ways to share event details or collect responses"
                      icon={renderIcon(ExternalLink, "h-5 w-5 text-indigo-600", false)}
                      collapsible
                    >
                      <div className="space-y-6">
                        <ToggleSwitch
                          id="additionalPublishingModes"
                          name="additionalPublishingModes"
                          label="Use additional publishing modes"
                          checked={formData.additionalPublishingModes}
                          onChange={(e) => setFormData({...formData, additionalPublishingModes: e.target.checked})}
                          helpText="Enable to provide additional ways for participants to access event details"
                        />
                        
                        {formData.additionalPublishingModes && (
                          <div className="pl-8 space-y-4 border-l-2 border-indigo-100">
                    <StylishInput
                              id="problemStatementUrl"
                              name="problemStatementUrl"
                              label="Problem Statement URL"
                              placeholder="https://example.com/problem-statement"
                              value={formData.problemStatementUrl}
                              onChange={(e) => setFormData({...formData, problemStatementUrl: e.target.value})}
                              icon={renderIcon(Link, "h-5 w-5", false)}
                              helpText="External link to problem statements or event details"
                            />
                            
                            <FileUpload
                              id="problemStatementFile"
                              name="problemStatementFile"
                              label="Problem Statement Document"
                              value={formData.problemStatementFile}
                              onChange={(files) => setFormData({...formData, problemStatementFile: files})}
                              accept=".pdf,.doc,.docx,.ppt,.pptx"
                              maxFiles={1}
                              maxSize={5}
                              helpText="Upload PDF, Word, or PowerPoint files (max 5MB)"
                              icon={renderIcon(FileUp, "h-5 w-5", false)}
                              showPreview
                            />
                            
                    <StylishInput
                              id="externalFormUrl"
                              name="externalFormUrl"
                              label="External Response Form URL"
                              placeholder="https://forms.google.com/... or https://forms.office.com/..."
                              value={formData.externalFormUrl}
                              onChange={(e) => setFormData({...formData, externalFormUrl: e.target.value})}
                              icon={renderIcon(Link, "h-5 w-5", false)}
                              helpText="Link to an external form for collecting responses (Google Forms, Microsoft Forms, etc.)"
                            />
                            
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <div className="flex items-center text-blue-800">
                                <HelpCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                                <p className="text-sm">
                                  These additional publishing modes are optional and will complement the information on our platform. 
                                  Participants will still register through our platform.
                                </p>
                </div>
                            </div>
                          </div>
                        )}
              </div>
            </FormSection>
                  </div>
                )}

                {/* Step 3: Event Phases & Timeline */}
                {currentStep === 3 && (
                  <div className="space-y-8 animate-fadeIn">
                    {/* Event Phases Configuration */}
                    <EventPhasesConfig 
                      value={formData.eventPhases}
                      onChange={handleEventPhasesChange}
                      error={errors}
                    />
                    
                    {/* Document Submission Requirements */}
                    <DocumentSubmissionConfig 
                      value={formData.documentSubmission}
                      onChange={handleDocumentSubmissionChange}
                      error={errors}
                    />
                    
                    {/* Custom Form Builder */}
                    <CustomFormBuilder 
                      value={formData.customForm}
                      onChange={handleCustomFormChange}
                      error={errors}
                    />
                  </div>
                )}
                
                {/* Step 4: Participant Information */}
                {currentStep === 4 && (
                  <div className="space-y-6 animate-fadeIn">
              <FormSection 
                      title="Participation Type" 
                      description="Choose how participants will register for your hackathon"
                    >
                      <div className="max-w-xl mx-auto">
                        <RadioCardGroup
                          id="participationType"
                          name="participationType"
                          label="Participation Type"
                          value={formData.participationType}
                      onChange={handleInputChange}
                          options={[
                            { 
                              value: 'individual', 
                              label: 'Individual', 
                              description: 'Participants work alone',
                              icon: renderIcon(User, "h-5 w-5", true)
                            },
                            { 
                              value: 'team', 
                              label: 'Team', 
                              description: 'Participants work in teams',
                              icon: renderIcon(Users, "h-5 w-5", true)
                            }
                          ]}
                          tooltip="Choose whether participants will work individually or in teams"
                          layout="horizontal"
                        />
                  </div>
            </FormSection>

                    {formData.participationType === 'team' && (
            <FormSection 
                        title="Team Configuration" 
                        description="Set the team size requirements for your hackathon"
                        icon={renderIcon(Users, "h-5 w-5 text-indigo-600", false)}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <NumberInput
                            id="minTeamSize"
                            name="minTeamSize"
                            label="Minimum Team Size"
                            min={1}
                            max={10}
                            value={formData.minTeamSize}
                      onChange={handleInputChange}
                            required
                            error={errors.minTeamSize}
                            icon={renderIcon(Users, "h-5 w-5", true)}
                            tooltip="Minimum number of members allowed in a team"
                            showControls={true}
                          />
                          
                          <NumberInput
                            id="maxTeamSize"
                            name="maxTeamSize"
                            label="Maximum Team Size"
                            min={formData.minTeamSize}
                            max={10}
                            value={formData.maxTeamSize}
                        onChange={handleInputChange}
                            required
                            error={errors.maxTeamSize}
                            icon={renderIcon(Users, "h-5 w-5", true)}
                            tooltip="Maximum number of members allowed in a team"
                            showControls={true}
                          />
                </div>
              </FormSection>
            )}

            <FormSection 
                      title="Capacity" 
                      description="Set the maximum number of participants for your hackathon"
                      icon={renderIcon(Users, "h-5 w-5 text-indigo-600", false)}
                    >
                      <div className="mb-4">
                        <ToggleSwitch
                    id="noParticipantLimit"
                    name="noParticipantLimit"
                          label="No limit on participants"
                    checked={formData.noParticipantLimit}
                onChange={handleInputChange}
                          helpText="Turn this on if you don't want to limit the number of participants"
                  />
                      </div>

                  {!formData.noParticipantLimit && (
                        <div className="max-w-xs">
                          <NumberInput
                      id="maxParticipants"
                      name="maxParticipants"
                      label="Maximum Participants"
                            min={1}
                            max={10000}
                      value={formData.maxParticipants}
                onChange={handleInputChange}
                      required={!formData.noParticipantLimit}
                      error={errors.maxParticipants}
                            icon={renderIcon(Users, "h-5 w-5", true)}
                            tooltip="Maximum number of participants allowed to register"
                            showControls={true}
                    />
                </div>
                      )}
            </FormSection>

            {formData.mode !== 'virtual' && (
            <FormSection 
                title="Amenities" 
                        description="Select what amenities you'll provide to participants"
                        icon={renderIcon(Coffee, "h-5 w-5 text-indigo-600", false)}
                      >
                        <CheckboxGroup
                          id="amenities"
                          label="Available Amenities"
                          options={[
                            { value: 'food', label: 'Food', description: 'Meals will be provided during the event' },
                            { value: 'accommodation', label: 'Accommodation', description: 'Sleeping arrangements will be available' },
                            { value: 'wifi', label: 'High-speed WiFi', description: 'Fast and reliable internet access' },
                            { value: 'parking', label: 'Parking', description: 'Parking facilities available for participants' },
                            { value: 'power', label: 'Power stations', description: 'Easy access to power outlets' },
                            { value: 'refreshments', label: 'Refreshments', description: 'Snacks and drinks available throughout the event' }
                          ]}
                          value={[
                            ...(formData.hasFood ? ['food'] : []),
                            ...(formData.hasAccommodation ? ['accommodation'] : []),
                            ...(formData.hasWifi ? ['wifi'] : []),
                            ...(formData.hasParking ? ['parking'] : []),
                            ...(formData.hasPowerStations ? ['power'] : []),
                            ...(formData.hasRefreshments ? ['refreshments'] : [])
                          ]}
                          onChange={(e) => {
                            const newValues = e.target.value;
                            setFormData(prev => ({
                              ...prev,
                              hasFood: newValues.includes('food'),
                              hasAccommodation: newValues.includes('accommodation'),
                              hasWifi: newValues.includes('wifi'),
                              hasParking: newValues.includes('parking'),
                              hasPowerStations: newValues.includes('power'),
                              hasRefreshments: newValues.includes('refreshments')
                            }));
                          }}
                          required={false}
                          columns={2}
                          tooltip="Select amenities that will be provided to participants"
                        />
                      </FormSection>
                    )}
                  </div>
                )}
                
                {/* Step 5: Technical Requirements & Prizes */}
                {currentStep === 5 && (
                  <div className="space-y-6 animate-fadeIn">
              <StylishTextarea
                id="technicalRequirements"
                name="technicalRequirements"
                label="Technical Requirements"
                rows={4}
                value={formData.technicalRequirements}
                onChange={handleInputChange}
                error={errors.technicalRequirements}
                placeholder="List the technical requirements, APIs, or tools participants might need"
                      icon={renderIcon(Hash, "h-5 w-5", false)}
                className="mb-6"
                      helpText="Optional: Specify any technical requirements or restrictions"
              />
              
              <StylishTextarea
                id="judgingCriteria"
                name="judgingCriteria"
                label="Judging Criteria"
                rows={4}
                value={formData.judgingCriteria}
                onChange={handleInputChange}
                error={errors.judgingCriteria}
                placeholder="List the criteria that will be used to judge the submissions"
                      icon={renderIcon(ListChecks, "h-5 w-5", false)}
                className="mb-6"
                      helpText="Optional: Detail how projects will be evaluated"
                    />
                    
                    <div className="mb-6">
                      <ToggleSwitch
                        id="hasPrizePool"
                        name="hasPrizePool"
                        label="Has Prize Pool"
                        checked={formData.hasPrizePool}
                onChange={handleInputChange}
                        helpText="Does your hackathon offer prizes to winners?"
                      />
                  </div>
                    
                    {formData.hasPrizePool && (
                      <>
                        <div className="mb-6">
                          <NumberInput
                id="prizePool"
                name="prizePool"
                label="Prize Pool"
                            placeholder="e.g., 50000"
                value={formData.prizePool}
                onChange={handleInputChange}
                            min={0}
                            icon={renderIcon(IndianRupee, "h-5 w-5", true)}
                            tooltip="Total prize money to be distributed (in INR)"
                            error={errors.prizePool}
                            required
                            showControls={true}
                className="mb-6"
              />
                        </div>
              
              <StylishTextarea
                id="prizes"
                name="prizes"
                label="Prizes Breakdown"
                rows={3}
                value={formData.prizes}
                onChange={handleInputChange}
                error={errors.prizes}
                placeholder="List the prizes for winners (e.g., '1st Prize: ₹25,000 + Mentorship')"
                          icon={renderIcon(Trophy, "h-5 w-5", false)}
                          helpText="Optional: Provide details on how the prize pool will be distributed"
                        />
                      </>
                    )}
                  </div>
                )}
                
                {/* Step 6: Contact & Visibility */}
                {currentStep === 6 && (
                  <div className="space-y-6 animate-fadeIn">
                    <FormSection
                      title="Contact Information"
                      description="Provide contact details for your hackathon"
                      icon={renderIcon(Mail, "h-5 w-5 text-indigo-600", false)}
                    >
                      {/* Primary Contact Information */}
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <StylishInput
                            id="primaryEmail"
                            name="primaryEmail"
                            label="Primary Contact Email"
                            placeholder="Enter primary email address"
                            value={formData.contactInfo.primaryEmail}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              contactInfo: {
                                ...prev.contactInfo,
                                primaryEmail: e.target.value
                              }
                            }))}
                            error={errors.primaryEmail}
                            required
                            icon={renderIcon(Mail, "h-5 w-5", false)}
                            helpText="Will be used for official communications"
                          />
                          
                          <StylishInput
                            id="primaryPhone"
                            name="primaryPhone"
                            label="Primary Contact Phone"
                            placeholder="Enter primary phone number"
                            value={formData.contactInfo.primaryPhone}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              contactInfo: {
                                ...prev.contactInfo,
                                primaryPhone: e.target.value
                              }
                            }))}
                            error={errors.primaryPhone}
                            required
                            icon={renderIcon(Phone, "h-5 w-5", false)}
                            helpText="Include country code (+91 for India)"
                          />
                        </div>

                        {/* Additional Emails */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Additional Contact Emails (Optional)
                          </label>
                          {formData.contactInfo.additionalEmails.map((email, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                              <StylishInput
                                id={`additionalEmail${index}`}
                                name={`additionalEmail${index}`}
                                placeholder="Enter additional email address"
                                value={email}
                                onChange={(e) => {
                                  const newEmails = [...formData.contactInfo.additionalEmails];
                                  newEmails[index] = e.target.value;
                                  setFormData(prev => ({
                                    ...prev,
                                    contactInfo: {
                                      ...prev.contactInfo,
                                      additionalEmails: newEmails
                                    }
                                  }));
                                }}
                                icon={renderIcon(Mail, "h-5 w-5", false)}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newEmails = formData.contactInfo.additionalEmails.filter((_, i) => i !== index);
                                  setFormData(prev => ({
                                    ...prev,
                                    contactInfo: {
                                      ...prev.contactInfo,
                                      additionalEmails: newEmails
                                    }
                                  }));
                                }}
                                className="p-2 text-red-600 hover:text-red-800"
                              >
                                <X className="h-5 w-5" />
                              </button>
                            </div>
                          ))}
                          {formData.contactInfo.additionalEmails.length < 3 && (
                            <button
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  contactInfo: {
                                    ...prev.contactInfo,
                                    additionalEmails: [...prev.contactInfo.additionalEmails, '']
                                  }
                                }));
                              }}
                              className="mt-2 text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add Another Email
                            </button>
                          )}
                        </div>

                        {/* Additional Phones */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Additional Contact Phones (Optional)
                          </label>
                          {formData.contactInfo.additionalPhones.map((phone, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                              <StylishInput
                                id={`additionalPhone${index}`}
                                name={`additionalPhone${index}`}
                                placeholder="Enter additional phone number"
                                value={phone}
                                onChange={(e) => {
                                  const newPhones = [...formData.contactInfo.additionalPhones];
                                  newPhones[index] = e.target.value;
                                  setFormData(prev => ({
                                    ...prev,
                                    contactInfo: {
                                      ...prev.contactInfo,
                                      additionalPhones: newPhones
                                    }
                                  }));
                                }}
                                icon={renderIcon(Phone, "h-5 w-5", false)}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newPhones = formData.contactInfo.additionalPhones.filter((_, i) => i !== index);
                                  setFormData(prev => ({
                                    ...prev,
                                    contactInfo: {
                                      ...prev.contactInfo,
                                      additionalPhones: newPhones
                                    }
                                  }));
                                }}
                                className="p-2 text-red-600 hover:text-red-800"
                              >
                                <X className="h-5 w-5" />
                              </button>
                            </div>
                          ))}
                          {formData.contactInfo.additionalPhones.length < 3 && (
                            <button
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  contactInfo: {
                                    ...prev.contactInfo,
                                    additionalPhones: [...prev.contactInfo.additionalPhones, '']
                                  }
                                }));
                              }}
                              className="mt-2 text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add Another Phone
                            </button>
                          )}
                        </div>

                        {/* Support Space Option */}
                        <div className="mt-6">
                          <ToggleSwitch
                            id="enableSupportSpace"
                            name="enableSupportSpace"
                            label="Enable Support Space"
                            checked={formData.contactInfo.enableSupportSpace}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              contactInfo: {
                                ...prev.contactInfo,
                                enableSupportSpace: e.target.checked
                              }
                            }))}
                            helpText="Enable a dedicated space for participants to communicate with you for queries"
                          />
                          {formData.contactInfo.enableSupportSpace && (
                            <div className="mt-2 p-4 bg-blue-50 rounded-lg">
                              <div className="flex items-center text-blue-800">
                                <Info className="h-5 w-5 mr-2" />
                                <p className="text-sm">
                                  A dedicated support space will be created where participants can ask questions and you can respond. 
                                  This helps maintain organized communication and provides a better experience for everyone.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Website and Social Media section remains the same */}
                      <div className="mt-6">
                        <StylishInput
                          id="websiteUrl"
                          name="websiteUrl"
                          label="Website (Optional)"
                          placeholder="https://www.yourwebsite.com"
                          value={formData.contactInfo.websiteUrl}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            contactInfo: {
                              ...prev.contactInfo,
                              websiteUrl: e.target.value
                            }
                          }))}
                          icon={renderIcon(Globe2, "h-5 w-5", false)}
                          helpText="Your organization's website or event page"
                        />
                      </div>
                    </FormSection>
                    
                    {/* Social Media section remains the same */}
                    <FormSection
                      title="Social Media Links"
                      description="Optional social media profiles for your organization"
                      icon={renderIcon(Share2, "h-5 w-5 text-indigo-600", false)}
                      collapsible
                    >
                      <div className="space-y-4">
                        <StylishInput
                          id="instagramUrl"
                          name="instagramUrl"
                          label="Instagram"
                          placeholder="https://www.instagram.com/yourusername"
                          value={formData.contactInfo.socialMedia.instagram}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            contactInfo: {
                              ...prev.contactInfo,
                              socialMedia: {
                                ...prev.contactInfo.socialMedia,
                                instagram: e.target.value
                              }
                            }
                          }))}
                          icon={renderIcon(Instagram, "h-5 w-5", false)}
                          helpText="Your organization's Instagram profile (optional)"
                        />
                        
                        <StylishInput
                          id="whatsappUrl"
                          name="whatsappUrl"
                          label="WhatsApp Group"
                          placeholder="https://chat.whatsapp.com/yourgroup"
                          value={formData.contactInfo.socialMedia.whatsapp}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            contactInfo: {
                              ...prev.contactInfo,
                              socialMedia: {
                                ...prev.contactInfo.socialMedia,
                                whatsapp: e.target.value
                              }
                            }
                          }))}
                          icon={renderIcon(FaWhatsapp, "h-5 w-5", false)}
                          helpText="Link to your WhatsApp group for participants (optional)"
                        />
                        
                        <StylishInput
                          id="telegramUrl"
                          name="telegramUrl"
                          label="Telegram Group"
                          placeholder="https://t.me/yourgroup"
                          value={formData.contactInfo.socialMedia.telegram}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            contactInfo: {
                              ...prev.contactInfo,
                              socialMedia: {
                                ...prev.contactInfo.socialMedia,
                                telegram: e.target.value
                              }
                            }
                          }))}
                          icon={renderIcon(FaTelegram, "h-5 w-5", false)}
                          helpText="Link to your Telegram group for participants (optional)"
                        />
                        
                        <StylishInput
                          id="linkedinUrl"
                          name="linkedinUrl"
                          label="LinkedIn"
                          placeholder="https://www.linkedin.com/company/yourcompany"
                          value={formData.contactInfo.socialMedia.linkedin}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            contactInfo: {
                              ...prev.contactInfo,
                              socialMedia: {
                                ...prev.contactInfo.socialMedia,
                                linkedin: e.target.value
                              }
                            }
                          }))}
                          icon={renderIcon(Linkedin, "h-5 w-5", false)}
                          helpText="Your organization's LinkedIn profile (optional)"
                        />
                      </div>
                    </FormSection>
                    
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="mb-4">
                        <ToggleSwitch
                          id="shareContactWithParticipants"
                          name="shareContactWithParticipants"
                          label="Share contact information with participants"
                          checked={formData.contactInfo.shareContactWithParticipants}
                          onChange={handleInputChange}
                          helpText="If enabled, your contact information will be visible to participants"
                        />
                      </div>
                      
                      <div>
                        <RadioCardGroup
                          id="visibility"
                          name="visibility"
                          label="Event Visibility"
                          value={formData.contactInfo.visibility}
                          onChange={handleInputChange}
                          options={[
                            { 
                              value: 'public', 
                              label: 'Public', 
                              description: 'Event will be visible to everyone on the platform',
                              icon: renderIcon(Globe2, "h-5 w-5", true)
                            },
                            { 
                              value: 'private', 
                              label: 'Private (Link Only)', 
                              description: 'Event will only be accessible via direct link',
                              icon: renderIcon(Link, "h-5 w-5", true)
                            }
                          ]}
                          tooltip="Choose who can see and access your event"
                        />
                  </div>
                </div>
              </div>
            )}
                
                {/* Step 7: Pricing & Discounts */}
                {currentStep === 7 && (
                  <div className="space-y-6 animate-fadeIn">
            <FormSection 
                      title="Pricing Information" 
                      description="Set your registration fee and pricing model"
                      icon={renderIcon(DollarSign, "h-5 w-5 text-indigo-600", false)}
                    >
                      <div className="bg-indigo-50 p-4 rounded-lg mb-6">
                        <div className="flex items-center text-indigo-800 mb-2">
                          <Info className="h-5 w-5 mr-2" />
                          <span className="font-medium">Payment Information</span>
        </div>
                        <p className="text-indigo-700 text-sm">
                          We accept major debit cards, netbanking, and UPI. All transactions are secure and powered by Razorpay.
                        </p>
      </div>
      
                      <div className="mb-6">
                        <ToggleSwitch
                          id="isFree"
                          name="isFree"
                          label="This is a free event"
                          checked={formData.isFree}
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            setFormData(prev => ({
                              ...prev,
                              isFree: isChecked,
                              price: isChecked ? 0 : prev.price
                            }));
                          }}
                          helpText="Enable if your event is free to attend"
                        />
                      </div>
                      
                      {!formData.isFree && (
                        <>
                          <div className="mb-6">
                            <div className="p-4 border border-gray-200 rounded-lg">
                              <RadioCardGroup
                                id="pricingType"
                                name="pricingType"
                                label="Pricing Type"
                                value={formData.pricingType}
                onChange={handleInputChange}
                                options={[
                                  { 
                                    value: 'per-team', 
                                    label: 'Per Team', 
                                    description: 'Charge one fee per team registration',
                                    icon: renderIcon(Users, "h-5 w-5", true)
                                  },
                                  { 
                                    value: 'per-person', 
                                    label: 'Per Person', 
                                    description: 'Charge a fee for each individual participant',
                                    icon: renderIcon(User, "h-5 w-5", true)
                                  }
                                ]}
                                tooltip="Choose how you want to charge participants"
                                layout="horizontal"
                              />
                            </div>
                          </div>
                          
                          <div className="max-w-sm">
                            <NumberInput
                              id="price"
                              name="price"
                              label={`Registration Fee (${formData.pricingType === 'per-team' ? 'per team' : 'per person'})`}
                              value={formData.price}
                onChange={handleInputChange}
                              min={0}
                              required={!formData.isFree}
                              error={errors.price}
                              tooltip="Set a registration fee in INR"
                              icon={renderIcon(IndianRupee, "h-5 w-5", true)}
                              showControls={true}
                            />
                          </div>
                        </>
                      )}
                    </FormSection>
                    
                    {/* Only show discount options for paid events */}
                    {!formData.isFree && (
                      <FormSection 
                        title={
                          <div className="flex items-center">
                            <span>Discount Options</span>
                            <BetaBadge className="ml-2" />
                          </div>
                        } 
                        description="Configure discounts and coupon codes for your event"
                        icon={renderIcon(Percent, "h-5 w-5 text-indigo-600", false)}
                      >
                        <div className="mb-6">
                          <div className="flex items-center mb-4">
                            <ToggleSwitch
                              id="enableCouponCode"
                              name="enableCouponCode"
                              label="Enable coupon code"
                              checked={!!formData.couponCode}
                              onChange={(e) => {
                                if (!e.target.checked) {
                                  setFormData(prev => ({ ...prev, couponCode: '' }));
                                } else if (!formData.couponCode) {
                                  generateRandomCouponCode();
                                }
                              }}
                              helpText="Allow participants to use a coupon code for discounts"
                            />
                            <BetaBadge className="ml-2" />
                          </div>
                          
                          {!!formData.couponCode && (
                            <>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 pl-8">
                                <div>
                                  <div className="relative">
                                    <StylishInput
                                      id="couponCode"
                                      name="couponCode"
                                      label="Coupon Code"
                                      placeholder="e.g., HACK2024"
                                      value={formData.couponCode}
                onChange={handleInputChange}
                                      error={errors.couponCode}
                                      icon={renderIcon(Tag, "h-5 w-5", false)}
                                      helpText="You can generate a random code or type your own custom code (max 10 chars)"
                                      maxLength={10}
                                    />
                                    <div className="absolute right-2 top-10 flex space-x-1">
                                      <button
                                        type="button"
                                        onClick={generateRandomCouponCode}
                                        className="h-8 px-2 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors bg-white border border-indigo-200 rounded-md hover:bg-indigo-50 flex items-center"
                                      >
                                        <Sparkles className="h-3 w-3 mr-1" />
                                        Generate
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                
                                <NumberInput
                                  id="couponDiscount"
                                  name="couponDiscount"
                                  label="Discount Percentage"
                                  min={1}
                                  max={100}
                                  value={formData.couponDiscount}
                onChange={handleInputChange}
                                  suffix="%"
                                  icon={renderIcon(Percent, "h-5 w-5", true)}
                                  tooltip="Percentage discount for the coupon code"
                                  showControls={true}
                                />
                              </div>
                              
                              <div className="flex flex-wrap gap-2 mt-4 pl-8">
                                <div className="relative group">
              <button
                type="button"
                                    disabled={true}
                                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-500 bg-gray-100 rounded-md border border-gray-200 cursor-not-allowed"
              >
                                    <Plus className="h-3 w-3 mr-1" />
                                    Create Additional Coupon
              </button>
                                  <div className="hidden group-hover:block absolute bottom-full mb-2 left-0 bg-gray-900 text-white text-xs rounded py-1 px-2 w-48 z-10">
                                    Available with premium account <span className="text-yellow-400">✦</span>
                                  </div>
                                </div>
                                <div className="relative group">
              <button
                                    type="button"
                                    disabled={true}
                                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-500 bg-gray-100 rounded-md border border-gray-200 cursor-not-allowed"
                                  >
                                    <Settings className="h-3 w-3 mr-1" />
                                    Advanced Options
                                  </button>
                                  <div className="hidden group-hover:block absolute bottom-full mb-2 left-0 bg-gray-900 text-white text-xs rounded py-1 px-2 w-48 z-10">
                                    Available with premium account <span className="text-yellow-400">✦</span>
                  </div>
                                </div>
                              </div>
                            </>
                )}
            </div>

                        <div className="mt-6 border-t border-gray-100 pt-6">
                          <div className="flex items-center mb-4">
                            <ToggleSwitch
                              id="enableRandomDiscounts"
                              name="enableRandomDiscounts"
                              label="Enable surprise discounts"
                              checked={formData.enableRandomDiscounts}
                              onChange={handleInputChange}
                              helpText="Randomly give discounts to some participants"
                            />
                            <BetaBadge className="ml-2" />
                          </div>
                          
                          {formData.enableRandomDiscounts && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 pl-8">
                              <NumberInput
                                id="randomDiscountPercentage"
                                name="randomDiscountPercentage"
                                label="Random Discount Percentage"
                                min={1}
                                max={50}
                                value={formData.randomDiscountPercentage}
                                onChange={handleInputChange}
                                suffix="%"
                                icon={renderIcon(Percent, "h-5 w-5", true)}
                                tooltip="Percentage discount for random recipients"
                                showControls={true}
                              />
                              
                              <NumberInput
                                id="randomDiscountChance"
                                name="randomDiscountChance"
                                label="Chance of Getting Discount"
                                min={1}
                                max={100}
                                value={formData.randomDiscountChance}
                                onChange={handleInputChange}
                                suffix="%"
                                icon={renderIcon(Sparkle, "h-5 w-5", true)}
                                tooltip="Percentage chance of a participant getting a random discount"
                                showControls={true}
                              />
                            </div>
                          )}
                        </div>
                      </FormSection>
                    )}
                    
                    <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                          <Info className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="ml-3">
                          <h3 className="text-sm font-medium text-indigo-800">Before publishing your event</h3>
                          <div className="mt-2 text-sm text-indigo-700">
                            <p>Please review all information carefully. Once published, some details cannot be modified.</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                              <li>Verify dates, times, and location details</li>
                              <li>Double-check pricing information and discount settings</li>
                              <li>Ensure all required technical information is accurate</li>
                            </ul>
                  </div>
                </div>
              </div>
        </div>
      </div>
                )}
                
                {/* Form Navigation */}
                <div className="flex justify-between pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={goToPreviousStep}
                    disabled={currentStep === 1}
                    className={`px-4 py-2 flex items-center gap-2 rounded-lg
                      ${currentStep === 1 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                  
                  {currentStep < totalSteps ? (
                    <button
                      type="button"
                      onClick={goToNextStep}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading}
                      className={`px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2
                        ${loading ? 'opacity-70 cursor-not-allowed' : ''}
                      `}
                    >
                      {loading ? (
                        <>
                          <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                          Publishing...
                        </>
                      ) : (
                        <>
                          Publish
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>
                
                {errors.submit && (
                  <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {errors.submit}
                  </div>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HostEventPage;