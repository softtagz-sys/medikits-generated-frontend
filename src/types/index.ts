export interface EmergencyStep {
  id: string;
  title: string;
  instruction: string;
  instructionFirstResponder?: string;
  image: string;
  nextSteps?: {
    text: string;
    stepId: string;
  }[];
  requiresBodyMap?: boolean;
  bodyMapRegions?: string[];
}

export interface EmergencyCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  initialStepId: string;
}

export interface ReportStep {
  stepId: string;
  title: string;
  instruction: string;
  timestamp: Date;
  choice?: string;
}

export interface AppState {
  currentCategory?: EmergencyCategory;
  currentStep?: EmergencyStep;
  isFirstResponderMode: boolean;
  report: ReportStep[];
  isEmergencyActive: boolean;
}