import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { bodyMapSteps } from '../data/emergencyData';

interface Props {
  onRegionSelect: (region: string) => void;
}

const BodyMap: React.FC<Props> = ({ onRegionSelect }) => {
  const navigate = useNavigate();
  const { dispatch } = useApp();

  const handleRegionClick = (region: string) => {
    let stepId = '';
    switch (region) {
      case 'head':
        stepId = 'head-bleeding';
        break;
      case 'chest':
        stepId = 'chest-bleeding';
        break;
      case 'arm-left':
      case 'arm-right':
        stepId = 'arm-bleeding';
        break;
      case 'leg-left':
      case 'leg-right':
        stepId = 'leg-bleeding';
        break;
      default:
        stepId = 'general-bleeding';
    }

    if (bodyMapSteps[stepId]) {
      dispatch({ type: 'SET_CURRENT_STEP', step: bodyMapSteps[stepId] });
      dispatch({ 
        type: 'ADD_REPORT_STEP', 
        reportStep: {
          stepId,
          title: `Lichaamsdeel geselecteerd: ${region}`,
          instruction: bodyMapSteps[stepId].instruction,
          timestamp: new Date(),
          choice: region,
        }
      });
      navigate('/flowchart');
    }
    
    onRegionSelect(region);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Selecteer het gebied met bloeding
      </h2>
      
      <div className="relative max-w-md mx-auto">
        <svg
          viewBox="0 0 400 600"
          className="w-full h-auto"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Head */}
          <circle
            cx="200"
            cy="80"
            r="40"
            fill="#E5F3F3"
            stroke="#016565"
            strokeWidth="2"
            className="cursor-pointer hover:fill-[#016565] hover:fill-opacity-20 transition-all"
            onClick={() => handleRegionClick('head')}
          />
          
          {/* Body/Chest */}
          <rect
            x="150"
            y="120"
            width="100"
            height="120"
            rx="15"
            fill="#E5F3F3"
            stroke="#016565"
            strokeWidth="2"
            className="cursor-pointer hover:fill-[#016565] hover:fill-opacity-20 transition-all"
            onClick={() => handleRegionClick('chest')}
          />
          
          {/* Left Arm */}
          <rect
            x="100"
            y="140"
            width="50"
            height="100"
            rx="25"
            fill="#E5F3F3"
            stroke="#016565"
            strokeWidth="2"
            className="cursor-pointer hover:fill-[#016565] hover:fill-opacity-20 transition-all"
            onClick={() => handleRegionClick('arm-left')}
          />
          
          {/* Right Arm */}
          <rect
            x="250"
            y="140"
            width="50"
            height="100"
            rx="25"
            fill="#E5F3F3"
            stroke="#016565"
            strokeWidth="2"
            className="cursor-pointer hover:fill-[#016565] hover:fill-opacity-20 transition-all"
            onClick={() => handleRegionClick('arm-right')}
          />
          
          {/* Left Leg */}
          <rect
            x="170"
            y="240"
            width="30"
            height="120"
            rx="15"
            fill="#E5F3F3"
            stroke="#016565"
            strokeWidth="2"
            className="cursor-pointer hover:fill-[#016565] hover:fill-opacity-20 transition-all"
            onClick={() => handleRegionClick('leg-left')}
          />
          
          {/* Right Leg */}
          <rect
            x="200"
            y="240"
            width="30"
            height="120"
            rx="15"
            fill="#E5F3F3"
            stroke="#016565"
            strokeWidth="2"
            className="cursor-pointer hover:fill-[#016565] hover:fill-opacity-20 transition-all"
            onClick={() => handleRegionClick('leg-right')}
          />

          {/* Labels */}
          <text x="200" y="85" textAnchor="middle" className="text-sm fill-gray-700 pointer-events-none">Hoofd</text>
          <text x="200" y="185" textAnchor="middle" className="text-sm fill-gray-700 pointer-events-none">Borst</text>
          <text x="125" y="195" textAnchor="middle" className="text-sm fill-gray-700 pointer-events-none">Arm</text>
          <text x="275" y="195" textAnchor="middle" className="text-sm fill-gray-700 pointer-events-none">Arm</text>
          <text x="185" y="305" textAnchor="middle" className="text-sm fill-gray-700 pointer-events-none">Been</text>
          <text x="215" y="305" textAnchor="middle" className="text-sm fill-gray-700 pointer-events-none">Been</text>
        </svg>
      </div>
      
      <p className="text-center text-gray-600 mt-6">
        Klik op het lichaamsdeel waar de bloeding zich bevindt
      </p>
    </div>
  );
};

export default BodyMap;