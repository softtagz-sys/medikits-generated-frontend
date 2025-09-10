import React from 'react';
import { EmergencyCategory } from '../types';

interface Props {
  category: EmergencyCategory;
  onClick: () => void;
}

const EmergencyCategoryCard: React.FC<Props> = ({ category, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 p-6 text-left border-2 border-transparent hover:border-[#016565] group"
    >
      <div className="flex items-center gap-4 mb-3">
        <div 
          className="text-4xl p-3 rounded-full"
          style={{ backgroundColor: `${category.color}20` }}
        >
          {category.icon}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#016565] transition-colors">
            {category.name}
          </h3>
        </div>
      </div>
      <p className="text-gray-600 leading-relaxed">
        {category.description}
      </p>
      <div 
        className="mt-4 h-1 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
        style={{ backgroundColor: category.color }}
      />
    </button>
  );
};

export default EmergencyCategoryCard;