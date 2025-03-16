"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useActionState } from "react";
import Link from "next/link";
import { login } from "./actions";
import { 
  User, 
  Lock, 
  LogIn, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Sparkles
} from "lucide-react";

// Import assistant hooks
import { 
  useAssistant, 
  useInputTrigger, 
  useFormTrigger, 
  useClickTrigger,
  usePageLoadTrigger
} from "../components/InteractiveAssistant";

export default function LoginPage() {
  const [state, formAction] = useActionState(login, { errors: {} });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [emailValue, setEmailValue] = useState('');
  
  // State for confetti particles
  const [particles, setParticles] = useState([]);
  
  // References for assistant triggers
  const formRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const loginBtnRef = useRef(null);
  const registerLinkRef = useRef(null);
  const rememberMeRef = useRef(null);
  const forgotPasswordRef = useRef(null);
  
  // Generate stable confetti particles on mount
  useEffect(() => {
    const newParticles = Array(15).fill(null).map((_, index) => ({
      id: index,
      left: `${Math.random() * 100}%`,
      top: `-${Math.random() * 10}px`,
      animationDelay: `${Math.random() * 2}s`,
      animationDuration: `${1 + Math.random() * 2}s`
    }));
    
    setParticles(newParticles);
  }, []);
  
  // Access assistant functions
  const { 
    showAssistant, 
    hideAssistant, 
    setRandomMessages, 
    toggleRandom, 
    setRandomInterval,
    setMessage,
    setMessageTimeout,
    setRobotIcon,
    setAssistantName,
    setAnimationSpeed
  } = useAssistant();
  
  // Memoize the setup function to avoid recreation on every render
  const setupAssistant = useCallback(() => {
    // Set custom assistant properties for login page
    setAssistantName("LoginBot");
    setRobotIcon("user");
    setAnimationSpeed(400); // Slightly slower animations
    setMessageTimeout(7000); // Default 7-second timeout for all messages
    
    // Set random messages specific to the login page
    setRandomMessages([
      "Need help logging in?",
      "Forgot your password? Click the 'Forgot password' link.",
      "Make sure you're using the email you registered with.",
      "Welcome back! Glad to see you again.",
      "Having trouble? Try resetting your password."
    ]);
    
    // Keep random messages disabled for login page to avoid distractions
    toggleRandom(false);
    setRandomInterval(20000); // Show random messages every 20 seconds
  }, [
    setRandomMessages, 
    toggleRandom, 
    setRandomInterval, 
    setMessageTimeout, 
    setRobotIcon, 
    setAssistantName,
    setAnimationSpeed
  ]);
  
  // Reset function for cleanup
  const resetAssistant = useCallback(() => {
    // Reset assistant to defaults when leaving page
    setAssistantName("Assistant");
    setRobotIcon("bot");
    setAnimationSpeed(300);
    setMessageTimeout(7000);
    toggleRandom(false);
  }, [
    toggleRandom, 
    setMessageTimeout, 
    setRobotIcon, 
    setAssistantName,
    setAnimationSpeed
  ]);
  
  // Configure the assistant specifically for the login page
  useEffect(() => {
    setupAssistant();
    
    // Cleanup on unmount
    return resetAssistant;
  }, [setupAssistant, resetAssistant]);
  
  // Custom trigger for the forgot password link
  useEffect(() => {
    if (!forgotPasswordRef.current) return;
    
    const handleClick = () => {
      showAssistant("I'll send you a password reset link to your email address.", 10000); // 10 second timeout
    };
    
    forgotPasswordRef.current.addEventListener('click', handleClick);
    return () => {
      if (forgotPasswordRef.current) {
        forgotPasswordRef.current.removeEventListener('click', handleClick);
      }
    };
  }, [showAssistant]);
  
  // Form submission trigger with custom timeout
  useEffect(() => {
    if (!formRef.current) return;
    
    const handleSubmit = () => {
      showAssistant("Logging you in! Please wait...", 5000); // 5 second timeout
    };
    
    formRef.current.addEventListener('submit', handleSubmit);
    return () => {
      if (formRef.current) {
        formRef.current.removeEventListener('submit', handleSubmit);
      }
    };
  }, [showAssistant]);
  
  // Input trigger for email with dynamic content
  useEffect(() => {
    if (!emailRef.current) return;
    
    const handleFocus = () => {
      showAssistant("Enter your email address here");
    };
    
    const handleInput = (e) => {
      // Only update while typing if we have some content
      if (e.target.value && e.target.value.includes('@')) {
        const username = e.target.value.split('@')[0];
        showAssistant(`Hello ${username}! Please enter your password too.`, 3000);
      }
    };
    
    emailRef.current.addEventListener('focus', handleFocus);
    emailRef.current.addEventListener('input', handleInput);
    
    return () => {
      if (emailRef.current) {
        emailRef.current.removeEventListener('focus', handleFocus);
        emailRef.current.removeEventListener('input', handleInput);
      }
    };
  }, [showAssistant]);
  
  // Custom handler for remember me checkbox
  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
    
    // Get username from email if available
    const username = emailValue ? emailValue.split('@')[0] : null;
    
    if (e.target.checked) {
      // Show assistant message with or without username
      const messages = username ? [
        `Okay ${username}, I got you! I'll remember you next time.`,
        `Sure thing, ${username}! I've saved your name.`,
        `Got it, ${username}! I'll remember your account.`,
        `No problem, ${username}! I'll remember you when you come back.`,
      ] : [
        "Okay, I got you! I'll remember you next time.",
        "Sure thing! I've saved your login details.",
        "Got it! I'll remember you.",
        "No problem! I'll remember you when you come back."
      ];
      
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      
      // Use the custom 7-second timeout that's set up by default
      showAssistant(randomMsg);
    }
  };
  
  // Track email changes to extract username
  const handleEmailChange = (e) => {
    setEmailValue(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (formData) => {
    setLoading(true);
    await formAction(formData);
    setLoading(false);
  };

  // Use the built-in hooks instead of creating custom effects where possible
  useClickTrigger("Signing you in now!", loginBtnRef);
  useClickTrigger("Want to create a new account?", registerLinkRef);
  usePageLoadTrigger("Welcome to the login page! Please sign in to continue.", 1500);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-indigo-50 to-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Animated background elements */}
      <div className="absolute top-0 w-full h-32 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full flex justify-around">
          {particles.map((particle) => (
            <Sparkles 
              key={particle.id} 
              size={16} 
              className="text-indigo-500 absolute animate-fall" 
              style={{ 
                left: particle.left, 
                top: particle.top,
                animationDelay: particle.animationDelay,
                animationDuration: particle.animationDuration
              }} 
            />
          ))}
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center mb-6 group">
          <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 transition-transform duration-300 transform group-hover:scale-105">
            StartupsNet
          </span>
        </Link>
        <h2 className="text-center text-3xl font-extrabold text-gray-900 animate-fade-in-up">Welcome back</h2>
        <p className="mt-2 text-center text-sm text-gray-600 animate-fade-in-up">
          Sign in to continue your journey with our growing community
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-xl sm:px-10 border border-gray-100 transition-all duration-300 hover:shadow-lg">
          <form ref={formRef} action={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input
                  ref={emailRef}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all duration-200"
                  placeholder="your.email@example.com"
                  value={emailValue}
                  onChange={handleEmailChange}
                />
              </div>
              {state?.errors?.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  {state.errors.email[0]}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  ref={passwordRef}
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all duration-200"
                  placeholder="••••••••"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {state?.errors?.password && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  {state.errors.password[0]}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  ref={rememberMeRef}
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                  checked={rememberMe}
                  onChange={handleRememberMeChange}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a 
                  ref={forgotPasswordRef}
                  href="#" 
                  className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            {state?.errors?.general && (
              <div className="text-sm text-red-600 text-center bg-red-50 p-3 rounded-lg border border-red-100 animate-fade-in-up">
                {state.errors.general}
              </div>
            )}

            <button 
              ref={loginBtnRef}
              type="submit" 
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:translate-y-[-2px]"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign in <LogIn size={16} className="ml-2" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center">
              <span className="text-sm text-gray-500">Don't have an account?</span>
              <Link 
                ref={registerLinkRef}
                href="/register" 
                className="ml-2 flex items-center font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
              >
                Create an account <ArrowRight size={14} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
