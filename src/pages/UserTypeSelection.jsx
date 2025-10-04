import React from 'react';
import { Users, UserCheck, ArrowRight, Database, Shield } from 'lucide-react';

const UserTypeSelection = ({ onUserTypeSelect, onEmployeeDatabaseClick }) => {
  const handleEmployeeClick = () => {
    onUserTypeSelect('employee');
  };

  const handleManagerClick = () => {
    onUserTypeSelect('manager');
  };

  const handleAdminClick = () => {
    onUserTypeSelect('admin');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to HR Unity
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Please select your role to access the appropriate HR management tools and features.
          </p>
        </div>

        {/* User Type Selection Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Employee Tile */}
          <div 
            className="bg-white rounded-xl shadow-lg p-8 cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-blue-500"
            onClick={handleEmployeeClick}
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Employee
              </h2>
              <p className="text-gray-600 mb-6">
                Access your personal HR information, view performance reviews, track your skills development, and manage your career growth.
              </p>
              <div className="flex items-center justify-center text-blue-600 font-medium">
                <span>Access Employee Portal</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </div>
            </div>
          </div>

          {/* Manager Tile */}
          <div 
            className="bg-white rounded-xl shadow-lg p-8 cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-green-500"
            onClick={handleManagerClick}
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <UserCheck className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Manager
              </h2>
              <p className="text-gray-600 mb-6">
                Manage your team's performance, conduct reviews, track employee development, and access comprehensive HR analytics and reports.
              </p>
              <div className="flex items-center justify-center text-green-600 font-medium">
                <span>Access Manager Portal</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </div>
            </div>
          </div>

          {/* Admin Tile */}
          <div 
            className="bg-white rounded-xl shadow-lg p-8 cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-red-500"
            onClick={handleAdminClick}
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-red-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Admin
              </h2>
              <p className="text-gray-600 mb-6">
                Access system administration tools, manage user permissions, configure system settings, and oversee all HR operations and data.
              </p>
              <div className="flex items-center justify-center text-red-600 font-medium">
                <span>Access Admin Portal</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-12">
          <p className="text-sm text-gray-500">
            Need help? Contact your HR administrator for assistance with account access.
          </p>
        </div>
      </div>

      {/* Fixed Employee Database Tab */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={onEmployeeDatabaseClick}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          aria-label="Employee Database"
        >
          <Database className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default UserTypeSelection;
