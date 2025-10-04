import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronDown, UserCheck, BarChart3, Users, DollarSign } from 'lucide-react';
import sqliteEmployeeService from '../services/sqliteService';

const ManagerDashboard = ({ onBack }) => {
  const [managers, setManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch managers for dropdown
  const fetchManagers = async () => {
    setLoading(true);
    try {
      const data = await sqliteEmployeeService.getManagers();
      console.log('Fetched managers:', data); // Debug log
      setManagers(data);
    } catch (error) {
      console.error('Error fetching managers:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load managers on component mount
  useEffect(() => {
    fetchManagers();
  }, []);

  const handleManagerSelect = (managerId) => {
    setSelectedManager(managerId);
    const manager = managers.find(mgr => mgr.employeeId === managerId);
    if (manager) {
      alert(`Selected Manager: ${manager.name}\nRole: ${manager.role}\nDepartment: ${manager.department}`);
    }
  };

  const handleModuleClick = (moduleName) => {
    const manager = managers.find(mgr => mgr.employeeId === selectedManager);
    if (manager) {
      alert(`Opening ${moduleName} for Manager ${manager.name}\n\nThis would navigate to the ${moduleName} functionality for the selected manager.`);
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
              <h1 className="text-xl font-semibold text-gray-900">HR Unity - Manager Portal</h1>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2">Logged in as:</span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Manager
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl text-green-600 mb-4">
            Welcome to Manager Portal
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Access comprehensive management tools, team analytics, and employee oversight capabilities from your unified management interface.
          </p>
          
          {/* Manager Selection Dropdown */}
          <div className="max-w-md mx-auto">
            <label htmlFor="manager-select" className="block text-sm font-medium text-gray-700 mb-2">
              Select a Manager
            </label>
            <div className="relative">
              <select
                id="manager-select"
                value={selectedManager}
                onChange={(e) => handleManagerSelect(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
                disabled={loading}
              >
                <option value="">
                  {loading ? 'Loading managers...' : 'Choose a manager'}
                </option>
                {managers.map((manager) => (
                  <option key={manager.employeeId} value={manager.employeeId}>
                    {manager.name} - {manager.role} ({manager.department})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
            {managers.length === 0 && !loading && (
              <div className="text-center mt-4">
                <p className="text-sm text-gray-500 mb-2">
                  No managers found in the database.
                </p>
                <button
                  onClick={() => {
                    localStorage.removeItem('sqlite_employees');
                    window.location.reload();
                  }}
                  className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Reset Database
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Manager Module Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div 
            className={`rounded-lg shadow-md p-6 transition-all duration-300 ${
              selectedManager 
                ? 'bg-white cursor-pointer hover:shadow-lg hover:scale-105' 
                : 'bg-gray-100 cursor-not-allowed opacity-50'
            }`}
            onClick={selectedManager ? () => handleModuleClick('Team Performance Management') : undefined}
          >
            <div className="flex items-center mb-4">
              <BarChart3 className={`w-8 h-8 mr-3 ${
                selectedManager ? 'text-green-600' : 'text-gray-400'
              }`} />
              <h3 className={`text-lg font-semibold ${
                selectedManager ? 'text-gray-900' : 'text-gray-500'
              }`}>
                Team Performance
              </h3>
            </div>
            <p className={`text-sm ${
              selectedManager ? 'text-gray-600' : 'text-gray-400'
            }`}>
              Monitor team performance metrics, conduct reviews, and track progress across all team members.
            </p>
            {!selectedManager && (
              <p className="text-xs text-gray-400 mt-2 italic">
                Select a manager to access this module
              </p>
            )}
          </div>
          
          <div 
            className={`rounded-lg shadow-md p-6 transition-all duration-300 ${
              selectedManager 
                ? 'bg-white cursor-pointer hover:shadow-lg hover:scale-105' 
                : 'bg-gray-100 cursor-not-allowed opacity-50'
            }`}
            onClick={selectedManager ? () => handleModuleClick('Team Development') : undefined}
          >
            <div className="flex items-center mb-4">
              <Users className={`w-8 h-8 mr-3 ${
                selectedManager ? 'text-green-600' : 'text-gray-400'
              }`} />
              <h3 className={`text-lg font-semibold ${
                selectedManager ? 'text-gray-900' : 'text-gray-500'
              }`}>
                Team Development
              </h3>
            </div>
            <p className={`text-sm ${
              selectedManager ? 'text-gray-600' : 'text-gray-400'
            }`}>
              Manage team skills development, training programs, and career progression planning.
            </p>
            {!selectedManager && (
              <p className="text-xs text-gray-400 mt-2 italic">
                Select a manager to access this module
              </p>
            )}
          </div>
          
          <div 
            className={`rounded-lg shadow-md p-6 transition-all duration-300 ${
              selectedManager 
                ? 'bg-white cursor-pointer hover:shadow-lg hover:scale-105' 
                : 'bg-gray-100 cursor-not-allowed opacity-50'
            }`}
            onClick={selectedManager ? () => handleModuleClick('Budget & Compensation') : undefined}
          >
            <div className="flex items-center mb-4">
              <DollarSign className={`w-8 h-8 mr-3 ${
                selectedManager ? 'text-green-600' : 'text-gray-400'
              }`} />
              <h3 className={`text-lg font-semibold ${
                selectedManager ? 'text-gray-900' : 'text-gray-500'
              }`}>
                Budget & Compensation
              </h3>
            </div>
            <p className={`text-sm ${
              selectedManager ? 'text-gray-600' : 'text-gray-400'
            }`}>
              Manage team budgets, compensation reviews, and resource allocation across departments.
            </p>
            {!selectedManager && (
              <p className="text-xs text-gray-400 mt-2 italic">
                Select a manager to access this module
              </p>
            )}
          </div>
        </div>

        {/* Manager Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
            <div className="flex items-center">
              <UserCheck className="w-8 h-8 text-green-500 mr-4" />
              <div>
                <div className="text-sm font-medium text-gray-500">Total Managers</div>
                <div className="text-2xl font-semibold text-gray-900">{managers.length}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-500 mr-4" />
              <div>
                <div className="text-sm font-medium text-gray-500">Departments</div>
                <div className="text-2xl font-semibold text-gray-900">
                  {new Set(managers.map(mgr => mgr.department)).size}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-purple-500 mr-4" />
              <div>
                <div className="text-sm font-medium text-gray-500">Avg Manager Salary</div>
                <div className="text-2xl font-semibold text-gray-900">
                  ${managers.length > 0 
                    ? Math.round(managers.reduce((sum, mgr) => sum + (mgr.compensation || 0), 0) / managers.length).toLocaleString()
                    : 'N/A'
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManagerDashboard;
