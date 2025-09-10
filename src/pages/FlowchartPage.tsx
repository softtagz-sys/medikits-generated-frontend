import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { emergencySteps } from '../data/emergencyData';
import BodyMap from '../components/BodyMap';

const FlowchartPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();

  const currentStep = state.currentStep;
  
  if (!currentStep || !state.currentCategory) {
    navigate('/');
    return null;
  }

  const handleNextStep = (choice: { text: string; stepId: string }) => {
    const nextStep = emergencySteps[choice.stepId];
    if (nextStep) {
      dispatch({ type: 'SET_CURRENT_STEP', step: nextStep });
      dispatch({ 
        type: 'ADD_REPORT_STEP', 
        reportStep: {
          stepId: nextStep.id,
          title: nextStep.title,
          instruction: nextStep.instruction,
          timestamp: new Date(),
          choice: choice.text,
        }
      });
    }
  };

  const handleBodyMapSelection = (region: string) => {
    // This will be handled by the BodyMap component
  };

  if (currentStep.requiresBodyMap) {
    return (
      <div className="pt-20 pb-8 px-4 min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto">
          <BodyMap onRegionSelect={handleBodyMapSelection} />
        </div>
      </div>
    );
  }

  const instruction = state.isFirstResponderMode 
    ? (currentStep.instructionFirstResponder || currentStep.instruction)
    : currentStep.instruction;

  return (
    <div className="pt-20 pb-8 px-4 min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Header */}
          <div 
            className="px-6 py-4 text-white"
            style={{ backgroundColor: state.currentCategory.color }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{state.currentCategory.icon}</span>
              <div>
                <h1 className="text-xl font-bold">{state.currentCategory.name}</h1>
                <p className="opacity-90">Stap {state.report.length + 1}</p>
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {currentStep.title}
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Image */}
              <div className="order-2 md:order-1">
                <img
                  src={currentStep.image}
                  alt={currentStep.title}
                  className="w-full h-64 object-cover rounded-lg shadow-md"
                />
              </div>

              {/* Instructions */}
              <div className="order-1 md:order-2">
                <div className="bg-[#016565] bg-opacity-10 rounded-lg p-6 mb-6">
                  <p className="text-lg leading-relaxed text-gray-800">
                    {instruction}
                  </p>
                  
                  {state.isFirstResponderMode && currentStep.instructionFirstResponder && (
                    <div className="mt-4 pt-4 border-t border-[#016565] border-opacity-20">
                      <span className="inline-block bg-[#016565] text-white text-xs px-2 py-1 rounded-full mb-2">
                        Hulpverlener informatie
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {currentStep.nextSteps && currentStep.nextSteps.length > 0 && (
                  <div className="space-y-3">
                    <p className="font-medium text-gray-700 mb-4">Wat is de situatie?</p>
                    {currentStep.nextSteps.map((choice, index) => (
                      <button
                        key={index}
                        onClick={() => handleNextStep(choice)}
                        className="w-full bg-[#016565] hover:bg-[#014545] text-white py-4 px-6 rounded-lg text-left transition-colors font-medium text-lg"
                      >
                        {choice.text}
                      </button>
                    ))}
                  </div>
                )}

                {!currentStep.nextSteps && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 font-medium">
                      Volg deze instructies tot de ambulance arriveert.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowchartPage;