'use client';
import { useState } from 'react';
import { ArrowUp, Bug, Lightbulb, ThumbsUp, Hammer } from 'lucide-react';

export default function PopularRequests() {
  const [requests, setRequests] = useState([
    {
      id: 1,
      title: 'Dark mode throughout the platform',
      votes: 278,
      type: 'feature',
      status: 'development',
      icon: <Lightbulb />
    },
    {
      id: 2,
      title: 'Mobile app for iOS and Android',
      votes: 245,
      type: 'integration',
      status: 'prioritized',
      icon: <Hammer />
    },
    {
      id: 3,
      title: 'Project progress visualization',
      votes: 187,
      type: 'feature',
      status: 'review',
      icon: <Lightbulb />
    },
    {
      id: 4,
      title: 'Fix slow loading on project pages',
      votes: 162,
      type: 'bug',
      status: 'completed',
      icon: <Bug />
    },
    {
      id: 5,
      title: 'Integration with GitHub/GitLab',
      votes: 149,
      type: 'integration',
      status: 'review',
      icon: <Hammer />
    }
  ]);

  const [voted, setVoted] = useState({});

  const handleVote = (id) => {
    if (voted[id]) return;
    
    setRequests(prevRequests => 
      prevRequests.map(request => 
        request.id === id 
          ? { ...request, votes: request.votes + 1 } 
          : request
      )
    );
    
    setVoted(prev => ({ ...prev, [id]: true }));
  };

  const getStatusBadgeClasses = (status) => {
    switch (status) {
      case 'review':
        return 'bg-blue-100 text-blue-800';
      case 'prioritized':
        return 'bg-indigo-100 text-indigo-800';
      case 'development':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Popular Requests</h3>
      
      <div className="space-y-4">
        {requests.map(request => (
          <div 
            key={request.id} 
            className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div 
              className={`
                flex items-center justify-center w-8 h-8 rounded-full mr-3
                ${request.type === 'feature' ? 'bg-indigo-100 text-indigo-600' : 
                  request.type === 'bug' ? 'bg-red-100 text-red-600' : 
                  'bg-blue-100 text-blue-600'}
              `}
            >
              {request.icon && <div className="w-4 h-4">{request.icon}</div>}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center">
                <h4 className="text-sm font-medium text-gray-900">{request.title}</h4>
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClasses(request.status)}`}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {request.votes} votes
              </p>
            </div>
            
            <button
              onClick={() => handleVote(request.id)}
              disabled={voted[request.id]}
              className={`
                flex items-center px-3 py-1 rounded-full text-xs font-medium 
                ${voted[request.id] 
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}
              `}
            >
              <ArrowUp className="w-3 h-3 mr-1" />
              {voted[request.id] ? 'Voted' : 'Upvote'}
            </button>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center justify-center mx-auto">
          <ThumbsUp className="w-4 h-4 mr-1" />
          View all requests
        </button>
      </div>
    </div>
  );
} 