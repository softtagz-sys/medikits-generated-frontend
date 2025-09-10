import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppState, EmergencyCategory, EmergencyStep, ReportStep } from '../types';

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

type AppAction = 
  | { type: 'START_EMERGENCY'; category: EmergencyCategory }
  | { type: 'SET_CURRENT_STEP'; step: EmergencyStep }
  | { type: 'TOGGLE_FIRST_RESPONDER' }
  | { type: 'ADD_REPORT_STEP'; reportStep: ReportStep }
  | { type: 'END_EMERGENCY' }
  | { type: 'GO_BACK' };

const initialState: AppState = {
  isFirstResponderMode: false,
  report: [],
  isEmergencyActive: false,
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'START_EMERGENCY':
      return {
        ...state,
        currentCategory: action.category,
        isEmergencyActive: true,
        report: [],
      };
    case 'SET_CURRENT_STEP':
      return {
        ...state,
        currentStep: action.step,
      };
    case 'TOGGLE_FIRST_RESPONDER':
      return {
        ...state,
        isFirstResponderMode: !state.isFirstResponderMode,
      };
    case 'ADD_REPORT_STEP':
      return {
        ...state,
        report: [...state.report, action.reportStep],
      };
    case 'END_EMERGENCY':
      return {
        ...state,
        isEmergencyActive: false,
        currentCategory: undefined,
        currentStep: undefined,
      };
    case 'GO_BACK':
      return {
        ...state,
        report: state.report.slice(0, -1),
      };
    default:
      return state;
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};