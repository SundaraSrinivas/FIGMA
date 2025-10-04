import React from 'react';

export function HRModuleTile({ title, description, icon, onEnter }) {
  return (
    <div 
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
      onClick={onEnter}
    >
      <div className="flex items-center mb-4">
        <div className="flex-shrink-0">
          {icon}
        </div>
        <h3 className="ml-3 text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <p className="text-gray-600 text-sm leading-relaxed">
        {description}
      </p>
      <div className="mt-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700">
          Click to Enter
        </span>
      </div>
    </div>
  );
}
