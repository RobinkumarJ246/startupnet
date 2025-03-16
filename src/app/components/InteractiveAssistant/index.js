'use client';

import { AssistantProvider, useAssistant } from './AssistantContext';
import RobotAssistant from './RobotAssistant';
import { 
  useClickTrigger, 
  useHoverTrigger, 
  useInputTrigger, 
  useFormTrigger, 
  usePageLoadTrigger 
} from './useTriggers';

// Export everything
export {
  AssistantProvider,
  RobotAssistant,
  useAssistant,
  useClickTrigger,
  useHoverTrigger,
  useInputTrigger,
  useFormTrigger,
  usePageLoadTrigger
}; 