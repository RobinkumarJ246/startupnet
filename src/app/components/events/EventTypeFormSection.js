'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Dynamically import event-specific forms
const CulturalsForm = dynamic(() => import('./typeforms/CulturalsForm'), {
  loading: () => <div className="py-4 text-gray-500">Loading form...</div>
});

const ExpertLectureForm = dynamic(() => import('./typeforms/ExpertLectureForm'), {
  loading: () => <div className="py-4 text-gray-500">Loading form...</div>
});

const WorkshopForm = dynamic(() => import('./typeforms/WorkshopForm'), {
  loading: () => <div className="py-4 text-gray-500">Loading form...</div>
});

const ConferenceForm = dynamic(() => import('./typeforms/ConferenceForm'), {
  loading: () => <div className="py-4 text-gray-500">Loading form...</div>
});

const HackathonForm = dynamic(() => import('./typeforms/HackathonForm'), {
  loading: () => <div className="py-4 text-gray-500">Loading form...</div>
});

const EventTypeFormSection = ({ formData, setFormData, errors }) => {
  const [isFormLoaded, setIsFormLoaded] = useState(false);

  useEffect(() => {
    // Reset form loaded state when event type changes
    setIsFormLoaded(false);
    
    // Set it to true after a small delay to trigger animation
    const timer = setTimeout(() => {
      setIsFormLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [formData.eventType]);

  if (!formData.eventType) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h2>
        <p className="text-amber-600 text-sm">Please select an event type in the Basic Details section to see specific fields.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        {formData.eventType === 'hackathon' && 'Hackathon Details'}
        {formData.eventType === 'culturals' && 'Cultural Event Details'}
        {formData.eventType === 'expertLecture' && 'Expert Lecture Details'}
        {formData.eventType === 'workshop' && 'Workshop Details'}
        {formData.eventType === 'conference' && 'Conference Details'}
      </h2>
      
      <div className={`transition-opacity duration-300 ${isFormLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {formData.eventType === 'hackathon' && <HackathonForm formData={formData} setFormData={setFormData} errors={errors} />}
        {formData.eventType === 'culturals' && <CulturalsForm formData={formData} setFormData={setFormData} errors={errors} />}
        {formData.eventType === 'expertLecture' && <ExpertLectureForm formData={formData} setFormData={setFormData} errors={errors} />}
        {formData.eventType === 'workshop' && <WorkshopForm formData={formData} setFormData={setFormData} errors={errors} />}
        {formData.eventType === 'conference' && <ConferenceForm formData={formData} setFormData={setFormData} errors={errors} />}
      </div>
    </div>
  );
};

export default EventTypeFormSection; 