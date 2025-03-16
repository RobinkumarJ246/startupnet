'use client';

import { useEffect, useRef } from 'react';
import { useAssistant } from './AssistantContext';

// Hook for click trigger
export function useClickTrigger(message, ref) {
  const { showAssistant, hideAssistant, isEnabled } = useAssistant();
  const elementRef = useRef(ref);

  useEffect(() => {
    if (!isEnabled || !elementRef.current) return;
    
    const element = ref.current || elementRef.current;
    if (!element) return;

    const handleClick = () => {
      showAssistant(message);
    };

    element.addEventListener('click', handleClick);
    
    return () => {
      element.removeEventListener('click', handleClick);
    };
  }, [message, ref, showAssistant, isEnabled]);

  return elementRef;
}

// Hook for hover trigger
export function useHoverTrigger(message, ref) {
  const { showAssistant, hideAssistant, isEnabled } = useAssistant();
  const elementRef = useRef(ref);

  useEffect(() => {
    if (!isEnabled || !elementRef.current) return;
    
    const element = ref.current || elementRef.current;
    if (!element) return;

    const handleMouseEnter = () => {
      showAssistant(message);
    };

    const handleMouseLeave = () => {
      hideAssistant();
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [message, ref, showAssistant, hideAssistant, isEnabled]);

  return elementRef;
}

// Hook for input focus trigger
export function useInputTrigger(message, inputRef) {
  const { showAssistant, hideAssistant, isEnabled } = useAssistant();
  const elementRef = useRef(inputRef);

  useEffect(() => {
    if (!isEnabled || !elementRef.current) return;
    
    const element = inputRef.current || elementRef.current;
    if (!element) return;

    const handleFocus = () => {
      showAssistant(message);
    };

    const handleBlur = () => {
      hideAssistant();
    };

    const handleInput = (e) => {
      if (e.target.value) {
        showAssistant(`Typing: ${e.target.value.length} characters`);
      } else {
        hideAssistant();
      }
    };

    element.addEventListener('focus', handleFocus);
    element.addEventListener('blur', handleBlur);
    element.addEventListener('input', handleInput);
    
    return () => {
      element.removeEventListener('focus', handleFocus);
      element.removeEventListener('blur', handleBlur);
      element.removeEventListener('input', handleInput);
    };
  }, [message, inputRef, showAssistant, hideAssistant, isEnabled]);

  return elementRef;
}

// Hook for form submission trigger
export function useFormTrigger(message, formRef) {
  const { showAssistant, hideAssistant, isEnabled } = useAssistant();
  const elementRef = useRef(formRef);

  useEffect(() => {
    if (!isEnabled || !elementRef.current) return;
    
    const element = formRef.current || elementRef.current;
    if (!element) return;

    const handleSubmit = (e) => {
      // Don't prevent default, just show the message
      showAssistant(message);
      
      // Hide after 3 seconds
      setTimeout(() => {
        hideAssistant();
      }, 3000);
    };

    element.addEventListener('submit', handleSubmit);
    
    return () => {
      element.removeEventListener('submit', handleSubmit);
    };
  }, [message, formRef, showAssistant, hideAssistant, isEnabled]);

  return elementRef;
}

// Utility hook to trigger the assistant on page load
export function usePageLoadTrigger(message, delay = 1000) {
  const { showAssistant, hideAssistant, isEnabled } = useAssistant();
  
  useEffect(() => {
    if (!isEnabled) return;
    
    const timer = setTimeout(() => {
      showAssistant(message);
      
      // Hide after 5 seconds
      setTimeout(() => {
        hideAssistant();
      }, 5000);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [message, delay, showAssistant, hideAssistant, isEnabled]);
} 