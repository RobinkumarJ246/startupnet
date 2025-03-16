'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

// Define the initial state
const initialState = {
  isVisible: false,
  message: '',
  trigger: null,
  randomMessages: [],
  randomInterval: 10000, // Default to 10 seconds
  randomEnabled: false,
  idleTimeout: 30000, // Default to 30 seconds
  idleEnabled: false,
  isEnabled: true, // Global toggle for the assistant
  messageTimeout: 7000, // Default message display time (7 seconds)
  robotIcon: 'bot', // Default robot icon type
  assistantName: 'Assistant', // Customizable name
  animationSpeed: 300, // Animation speed in ms
  speechBubbleColor: 'white', // Speech bubble color
};

// Action types
const SHOW_ASSISTANT = 'SHOW_ASSISTANT';
const HIDE_ASSISTANT = 'HIDE_ASSISTANT';
const SET_MESSAGE = 'SET_MESSAGE';
const SET_RANDOM_MESSAGES = 'SET_RANDOM_MESSAGES';
const TOGGLE_RANDOM = 'TOGGLE_RANDOM';
const SET_RANDOM_INTERVAL = 'SET_RANDOM_INTERVAL';
const TOGGLE_IDLE = 'TOGGLE_IDLE';
const SET_IDLE_TIMEOUT = 'SET_IDLE_TIMEOUT';
const TOGGLE_ASSISTANT = 'TOGGLE_ASSISTANT';
const SET_TRIGGER = 'SET_TRIGGER';
const SET_MESSAGE_TIMEOUT = 'SET_MESSAGE_TIMEOUT';
const SET_ROBOT_ICON = 'SET_ROBOT_ICON';
const SET_ASSISTANT_NAME = 'SET_ASSISTANT_NAME';
const SET_ANIMATION_SPEED = 'SET_ANIMATION_SPEED';
const SET_SPEECH_BUBBLE_COLOR = 'SET_SPEECH_BUBBLE_COLOR';

// Reducer function
function assistantReducer(state, action) {
  switch (action.type) {
    case SHOW_ASSISTANT:
      return { ...state, isVisible: true };
    case HIDE_ASSISTANT:
      return { ...state, isVisible: false };
    case SET_MESSAGE:
      return { ...state, message: action.payload };
    case SET_RANDOM_MESSAGES:
      return { ...state, randomMessages: action.payload };
    case TOGGLE_RANDOM:
      return { ...state, randomEnabled: action.payload };
    case SET_RANDOM_INTERVAL:
      return { ...state, randomInterval: action.payload };
    case TOGGLE_IDLE:
      return { ...state, idleEnabled: action.payload };
    case SET_IDLE_TIMEOUT:
      return { ...state, idleTimeout: action.payload };
    case TOGGLE_ASSISTANT:
      return { ...state, isEnabled: action.payload };
    case SET_TRIGGER:
      return { ...state, trigger: action.payload };
    case SET_MESSAGE_TIMEOUT:
      return { ...state, messageTimeout: action.payload };
    case SET_ROBOT_ICON:
      return { ...state, robotIcon: action.payload };
    case SET_ASSISTANT_NAME:
      return { ...state, assistantName: action.payload };
    case SET_ANIMATION_SPEED:
      return { ...state, animationSpeed: action.payload };
    case SET_SPEECH_BUBBLE_COLOR:
      return { ...state, speechBubbleColor: action.payload };
    default:
      return state;
  }
}

// Create the context
const AssistantContext = createContext();

// Custom hook for using the assistant context
export function useAssistant() {
  const context = useContext(AssistantContext);
  if (!context) {
    throw new Error('useAssistant must be used within an AssistantProvider');
  }
  return context;
}

// Provider component
export function AssistantProvider({ children }) {
  const [state, dispatch] = useReducer(assistantReducer, initialState);
  
  // Automatic message hiding timer
  useEffect(() => {
    let hideTimer;
    
    if (state.isVisible && state.messageTimeout > 0) {
      hideTimer = setTimeout(() => {
        dispatch({ type: HIDE_ASSISTANT });
      }, state.messageTimeout);
    }
    
    return () => {
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, [state.isVisible, state.message, state.messageTimeout]);
  
  // Idle timer
  useEffect(() => {
    if (!state.isEnabled || !state.idleEnabled) return;

    let idleTimer;
    const resetIdleTimer = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        const randomMessage = state.randomMessages.length > 0
          ? state.randomMessages[Math.floor(Math.random() * state.randomMessages.length)]
          : "Are you still there? Need any help?";
        
        dispatch({ type: SET_MESSAGE, payload: randomMessage });
        dispatch({ type: SHOW_ASSISTANT });
      }, state.idleTimeout);
    };

    // Events to reset the idle timer
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => document.addEventListener(event, resetIdleTimer));
    
    // Initialize the timer
    resetIdleTimer();
    
    // Cleanup
    return () => {
      clearTimeout(idleTimer);
      events.forEach(event => document.removeEventListener(event, resetIdleTimer));
    };
  }, [state.idleEnabled, state.idleTimeout, state.isEnabled, state.randomMessages]);

  // Random messages timer
  useEffect(() => {
    if (!state.isEnabled || !state.randomEnabled || state.randomMessages.length === 0) return;

    const randomTimer = setInterval(() => {
      const randomMessage = state.randomMessages[Math.floor(Math.random() * state.randomMessages.length)];
      dispatch({ type: SET_MESSAGE, payload: randomMessage });
      dispatch({ type: SHOW_ASSISTANT });
      
      // Auto-hide is now handled by the messageTimeout effect
    }, state.randomInterval);
    
    return () => clearInterval(randomTimer);
  }, [state.randomEnabled, state.randomInterval, state.randomMessages, state.isEnabled]);

  // Define the assistant actions with useCallback to memoize them
  const showAssistant = useCallback((message, timeout) => {
    if (!state.isEnabled) return;
    
    if (message) dispatch({ type: SET_MESSAGE, payload: message });
    
    // If a custom timeout is provided, temporarily set it
    if (timeout !== undefined && timeout !== null) {
      dispatch({ type: SET_MESSAGE_TIMEOUT, payload: timeout });
    }
    
    dispatch({ type: SHOW_ASSISTANT });
  }, [state.isEnabled]);

  const hideAssistant = useCallback(() => {
    dispatch({ type: HIDE_ASSISTANT });
  }, []);

  const setMessage = useCallback((message) => {
    dispatch({ type: SET_MESSAGE, payload: message });
  }, []);

  const setRandomMessages = useCallback((messages) => {
    dispatch({ type: SET_RANDOM_MESSAGES, payload: messages });
  }, []);

  const toggleRandom = useCallback((enabled) => {
    dispatch({ type: TOGGLE_RANDOM, payload: enabled });
  }, []);

  const setRandomInterval = useCallback((interval) => {
    dispatch({ type: SET_RANDOM_INTERVAL, payload: interval });
  }, []);

  const toggleIdle = useCallback((enabled) => {
    dispatch({ type: TOGGLE_IDLE, payload: enabled });
  }, []);

  const setIdleTimeout = useCallback((timeout) => {
    dispatch({ type: SET_IDLE_TIMEOUT, payload: timeout });
  }, []);

  const toggleAssistant = useCallback((enabled) => {
    dispatch({ type: TOGGLE_ASSISTANT, payload: enabled });
  }, []);

  const setTrigger = useCallback((trigger) => {
    dispatch({ type: SET_TRIGGER, payload: trigger });
  }, []);
  
  const setMessageTimeout = useCallback((timeout) => {
    dispatch({ type: SET_MESSAGE_TIMEOUT, payload: timeout });
  }, []);
  
  const setRobotIcon = useCallback((icon) => {
    dispatch({ type: SET_ROBOT_ICON, payload: icon });
  }, []);
  
  const setAssistantName = useCallback((name) => {
    dispatch({ type: SET_ASSISTANT_NAME, payload: name });
  }, []);
  
  const setAnimationSpeed = useCallback((speed) => {
    dispatch({ type: SET_ANIMATION_SPEED, payload: speed });
  }, []);
  
  const setSpeechBubbleColor = useCallback((color) => {
    dispatch({ type: SET_SPEECH_BUBBLE_COLOR, payload: color });
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = React.useMemo(() => ({
    ...state,
    showAssistant,
    hideAssistant,
    setMessage,
    setRandomMessages,
    toggleRandom,
    setRandomInterval,
    toggleIdle,
    setIdleTimeout,
    toggleAssistant,
    setTrigger,
    setMessageTimeout,
    setRobotIcon,
    setAssistantName,
    setAnimationSpeed,
    setSpeechBubbleColor,
  }), [
    state,
    showAssistant,
    hideAssistant,
    setMessage,
    setRandomMessages,
    toggleRandom,
    setRandomInterval,
    toggleIdle,
    setIdleTimeout,
    toggleAssistant,
    setTrigger,
    setMessageTimeout,
    setRobotIcon,
    setAssistantName,
    setAnimationSpeed,
    setSpeechBubbleColor,
  ]);

  return (
    <AssistantContext.Provider value={contextValue}>
      {children}
    </AssistantContext.Provider>
  );
} 