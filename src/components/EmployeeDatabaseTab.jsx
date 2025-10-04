import React, { useState } from 'react';
import { Users } from 'lucide-react';

export function EmployeeDatabaseTab({ onOpen }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (onOpen) onOpen();
        }}
        className="bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary-600 transition-colors"
        aria-label="Employee Database"
      >
        <Users className="w-6 h-6" />
      </button>
      
      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl border border-gray-200 p-4 min-w-64">
          <h3 className="font-semibold text-gray-900 mb-2">Employee Database</h3>
          <p className="text-sm text-gray-600 mb-3">
            Quick access to employee information and records.
          </p>
          <button 
            onClick={() => {
              if (onOpen) onOpen();
              setIsOpen(false);
            }}
            className="w-full bg-primary text-white py-2 px-4 rounded-md text-sm hover:bg-primary-600"
          >
            Open Database
          </button>
        </div>
      )}
    </div>
  );
}
