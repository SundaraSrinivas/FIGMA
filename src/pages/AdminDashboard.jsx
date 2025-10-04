import React from 'react';
import { ArrowLeft, Shield, BarChart3, Users, DollarSign, Database } from 'lucide-react';

const AdminDashboard = ({ onBack, onPerformanceManagementClick }) => {
  const handleModuleClick = (moduleName) => {
    if (moduleName === 'Performance Management') {
      onPerformanceManagementClick();
    } else {
      alert(`Opening ${moduleName}\n\nThis would navigate to the ${moduleName} functionality for system administrators.`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="mr-4 p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                title="Back to User Selection"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">HR Unity - Admin Portal</h1>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2">Logged in as:</span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                Admin
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl text-red-600 mb-4">
            Welcome to Admin Portal
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Access executive-level HR management tools for performance oversight, skills development, and compensation administration across the organization.
          </p>
        </div>

        {/* Admin Module Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Performance Management */}
          <div 
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300 border-l-4 border-red-500"
            onClick={() => handleModuleClick('Performance Management')}
          >
            <div className="flex items-center mb-4">
              <BarChart3 className="w-8 h-8 text-red-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">
                Performance Management
              </h3>
            </div>
            <p className="text-sm text-gray-600">
              Oversee organization-wide performance metrics, conduct executive reviews, and manage strategic performance initiatives.
            </p>
          </div>

          {/* Skills Profile */}
          <div 
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300 border-l-4 border-blue-500"
            onClick={() => handleModuleClick('Skills Profile')}
          >
            <div className="flex items-center mb-4">
              <Users className="w-8 h-8 text-blue-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">
                Skills Profile
              </h3>
            </div>
            <p className="text-sm text-gray-600">
              Manage organization-wide skills assessments, training programs, and strategic workforce development initiatives.
            </p>
          </div>

          {/* Compensation */}
          <div 
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300 border-l-4 border-green-500"
            onClick={() => handleModuleClick('Compensation')}
          >
            <div className="flex items-center mb-4">
              <DollarSign className="w-8 h-8 text-green-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">
                Compensation
              </h3>
            </div>
            <p className="text-sm text-gray-600">
              Oversee compensation strategies, executive pay structures, and organization-wide salary and benefits administration.
            </p>
          </div>
        </div>

      </main>
    </div>
  );
};

export default AdminDashboard;
