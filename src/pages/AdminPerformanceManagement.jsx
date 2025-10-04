import React from 'react';
import { ArrowLeft, FileText, BarChart3 } from 'lucide-react';

const AdminPerformanceManagement = ({ onBack, onQualitativeClick, onQuantitativeClick }) => {
  const handleModuleClick = (moduleName) => {
    if (moduleName === 'Qualitative') {
      onQualitativeClick();
    } else if (moduleName === 'Quantitative') {
      onQuantitativeClick();
    } else {
      alert(`Opening ${moduleName} Performance Management\n\nThis would navigate to the ${moduleName} performance analysis and management functionality for administrators.`);
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
                title="Back to Admin Dashboard"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Performance Management</h1>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2">Admin Portal</span>
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
            Performance Management
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Access comprehensive performance analysis tools to evaluate organizational performance through both qualitative assessments and quantitative metrics.
          </p>
        </div>

        {/* Performance Management Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Qualitative Performance */}
          <div 
            className="bg-white rounded-xl shadow-lg p-8 cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-blue-500"
            onClick={() => handleModuleClick('Qualitative')}
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Qualitative
              </h3>
              <p className="text-gray-600 mb-6">
                Manage subjective performance assessments, conduct 360-degree reviews, analyze behavioral competencies, and evaluate leadership qualities through comprehensive qualitative analysis.
              </p>
              <div className="flex items-center justify-center text-blue-600 font-medium">
                <span>Access Qualitative Analysis</span>
              </div>
            </div>
          </div>

          {/* Quantitative Performance */}
          <div 
            className="bg-white rounded-xl shadow-lg p-8 cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-green-500"
            onClick={() => handleModuleClick('Quantitative')}
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Quantitative
              </h3>
              <p className="text-gray-600 mb-6">
                Analyze measurable performance metrics, track KPIs, generate statistical reports, and evaluate performance trends through data-driven quantitative analysis and reporting.
              </p>
              <div className="flex items-center justify-center text-green-600 font-medium">
                <span>Access Quantitative Analysis</span>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default AdminPerformanceManagement;
