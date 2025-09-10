import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { emergencyCategories, emergencySteps } from '../data/emergencyData';
import EmergencyCategoryCard from '../components/EmergencyCategoryCard';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { dispatch } = useApp();

  const handleCategorySelect = (category: any) => {
    dispatch({ type: 'START_EMERGENCY', category });
    
    const initialStep = emergencySteps[category.initialStepId];
    if (initialStep) {
      dispatch({ type: 'SET_CURRENT_STEP', step: initialStep });
      dispatch({ 
        type: 'ADD_REPORT_STEP', 
        reportStep: {
          stepId: initialStep.id,
          title: `Noodsituatie gestart: ${category.name}`,
          instruction: initialStep.instruction,
          timestamp: new Date(),
        }
      });
    }
    
    navigate('/flowchart');
  };

  return (
    <div className="pt-20 pb-8 px-4 min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="text-[#016565]">Rescura</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Nederlandse eerste hulp gids. Selecteer de noodsituatie voor stap-voor-stap instructies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {emergencyCategories.map((category) => (
            <EmergencyCategoryCard
              key={category.id}
              category={category}
              onClick={() => handleCategorySelect(category)}
            />
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate('/admin')}
            className="text-[#016565] hover:text-[#014545] font-medium text-sm transition-colors"
          >
            Admin Panel
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;