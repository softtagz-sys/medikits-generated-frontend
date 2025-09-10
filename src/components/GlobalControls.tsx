import React from 'react';
import { Phone, UserCheck, ArrowLeft, Settings } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';

const GlobalControls: React.FC = () => {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const handleEmergencyCall = () => {
    window.open('tel:112', '_self');
  };

  const handleAmbulanceArrived = () => {
    dispatch({ type: 'END_EMERGENCY' });
    navigate('/report');
  };

  const handleBack = () => {
    if (location.pathname === '/') {
      return;
    }
    
    if (state.report.length > 0) {
      dispatch({ type: 'GO_BACK' });
    }
    navigate(-1);
  };

  const toggleFirstResponder = () => {
    dispatch({ type: 'TOGGLE_FIRST_RESPONDER' });
  };

  const showBackButton = location.pathname !== '/';

  return (
    <div className="fixed top-0 left-0 right-0 bg-white border-b-2 border-gray-200 z-50 px-4 py-3">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          {showBackButton && (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="hidden sm:inline">Terug</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleFirstResponder}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              state.isFirstResponderMode
                ? 'bg-[#016565] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Settings size={16} />
            <span className="hidden sm:inline">
              {state.isFirstResponderMode ? 'Hulpverlener' : 'Basis'}
            </span>
          </button>

          {state.isEmergencyActive && (
            <button
              onClick={handleAmbulanceArrived}
              className="flex items-center gap-2 px-4 py-2 bg-[#016565] hover:bg-[#014545] text-white rounded-lg transition-colors"
            >
              <UserCheck size={20} />
              <span className="hidden sm:inline">Ambulance aangekomen</span>
            </button>
          )}

          <button
            onClick={handleEmergencyCall}
            className="flex items-center gap-2 px-6 py-3 bg-[#C12F2F] hover:bg-[#A12525] text-white font-bold rounded-lg transition-colors shadow-lg"
          >
            <Phone size={24} />
            <span className="text-lg">112</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlobalControls;