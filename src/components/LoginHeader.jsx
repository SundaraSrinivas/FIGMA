import React from 'react';

export function LoginHeader() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">HR Unity</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              Dashboard
            </button>
            <button className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-600">
              Login
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
