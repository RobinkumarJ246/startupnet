'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAssistant } from './AssistantContext';
import { 
  X, 
  Bot, 
  HelpCircle, 
  MessageSquare, 
  Smile, 
  Coffee,
  User,
  Star,
  Sparkles,
  Zap
} from 'lucide-react';

// Map of available robot icons
const robotIcons = {
  bot: <Bot size={24} className="text-white" />,
  help: <HelpCircle size={24} className="text-white" />,
  message: <MessageSquare size={24} className="text-white" />,
  smile: <Smile size={24} className="text-white" />,
  coffee: <Coffee size={24} className="text-white" />,
  user: <User size={24} className="text-white" />,
  star: <Star size={24} className="text-white" />,
  sparkles: <Sparkles size={24} className="text-white" />,
  zap: <Zap size={24} className="text-white" />
};

export default function RobotAssistant() {
  const {
    isVisible,
    message,
    hideAssistant,
    isEnabled,
    robotIcon,
    assistantName,
    animationSpeed,
    speechBubbleColor,
    showAssistant
  } = useAssistant();

  const [animation, setAnimation] = useState('');
  const bubbleRef = useRef(null);

  // Handle animation states
  useEffect(() => {
    if (isVisible) {
      setAnimation('slide-in');
      // After slide in, apply bounce animation
      const timer = setTimeout(() => {
        setAnimation('bounce');
      }, animationSpeed);
      return () => clearTimeout(timer);
    } else {
      setAnimation('slide-out');
    }
  }, [isVisible, animationSpeed]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bubbleRef.current && !bubbleRef.current.contains(event.target) && isVisible) {
        hideAssistant();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [hideAssistant, isVisible]);

  if (!isEnabled) return null;

  // Get the correct robot icon
  const currentRobotIcon = robotIcons[robotIcon] || robotIcons.bot;

  // Adjust transition duration based on animation speed
  const transitionStyle = {
    transitionDuration: `${animationSpeed}ms`
  };
  
  // Handle robot click
  const handleRobotClick = () => {
    if (!isVisible) {
      // If not visible, show with a default message
      const defaultMessages = [
        "Hello! Need any help?",
        "Hi there! How can I assist you?",
        "Hey! I'm your assistant. What do you need?"
      ];
      const randomMessage = defaultMessages[Math.floor(Math.random() * defaultMessages.length)];
      showAssistant(randomMessage);
    } else {
      hideAssistant();
    }
  };

  // Render the component with custom styles
  return (
    <div 
      className={`fixed bottom-4 right-4 z-50 flex items-end transition-all ${animation}`}
      style={transitionStyle}
    >
      {/* Speech bubble */}
      {isVisible && message && (
        <div 
          ref={bubbleRef}
          className={`max-w-xs rounded-lg p-4 mb-3 mr-3 shadow-lg border border-gray-200 speech-bubble animate-fade-in-up`}
          style={{ backgroundColor: speechBubbleColor }}
        >
          <div className="flex justify-between items-start">
            <div className="font-medium text-gray-900 mb-1">{assistantName}</div>
            <button 
              onClick={hideAssistant}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>
          <p className="text-gray-700 text-sm">{message}</p>
        </div>
      )}

      {/* Robot character */}
      <div 
        className={`flex items-center justify-center w-14 h-14 rounded-full shadow-lg 
          ${isVisible 
            ? 'bg-gradient-to-br from-indigo-500 to-purple-600' 
            : 'bg-gradient-to-br from-gray-500 to-gray-600'} 
          transition-all transform hover:scale-110 cursor-pointer`}
        style={transitionStyle}
        onClick={handleRobotClick}
        aria-label={isVisible ? "Hide assistant" : "Show assistant"}
      >
        {currentRobotIcon}
      </div>
    </div>
  );
} 