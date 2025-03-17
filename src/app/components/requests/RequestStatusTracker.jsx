'use client';
import { CheckCircle2, Clock, Hourglass, LineChart, Users } from 'lucide-react';

export default function RequestStatusTracker({ status = 'submitted' }) {
  const stages = [
    { 
      id: 'submitted', 
      title: 'Submitted', 
      description: 'Your request has been received', 
      icon: <CheckCircle2 className="h-5 w-5" />,
      color: 'bg-green-500'
    },
    { 
      id: 'review', 
      title: 'Under Review', 
      description: 'Our team is reviewing your request', 
      icon: <Clock className="h-5 w-5" />,
      color: 'bg-blue-500'
    },
    { 
      id: 'prioritized', 
      title: 'Prioritized', 
      description: 'Request has been evaluated and prioritized', 
      icon: <LineChart className="h-5 w-5" />,
      color: 'bg-indigo-500'
    },
    { 
      id: 'development', 
      title: 'In Development', 
      description: 'Our engineers are working on it', 
      icon: <Hourglass className="h-5 w-5" />,
      color: 'bg-purple-500'
    },
    { 
      id: 'completed', 
      title: 'Completed', 
      description: 'Your request has been implemented', 
      icon: <Users className="h-5 w-5" />,
      color: 'bg-emerald-500'
    }
  ];
  
  // Find the current stage index
  const currentStageIndex = stages.findIndex(stage => stage.id === status);
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Request Status</h3>
      
      <div className="relative">
        {/* Progress bar */}
        <div className="absolute left-5 top-0 w-0.5 h-full bg-gray-200"></div>
        
        {/* Stages */}
        <div className="space-y-8">
          {stages.map((stage, index) => {
            const isActive = index <= currentStageIndex;
            const isCurrent = index === currentStageIndex;
            
            return (
              <div key={stage.id} className="relative flex items-start">
                <div className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-500 ${
                  isActive ? `${stage.color} border-transparent text-white` : 'bg-white border-gray-300 text-gray-400'
                } ${isCurrent ? 'ring-4 ring-indigo-100' : ''}`}>
                  {stage.icon}
                </div>
                
                <div className="ml-4">
                  <h4 className={`text-base font-medium ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                    {stage.title}
                  </h4>
                  <p className={`text-sm ${isActive ? 'text-gray-600' : 'text-gray-400'}`}>
                    {stage.description}
                  </p>
                  
                  {isCurrent && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mt-2">
                      Current Stage
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 