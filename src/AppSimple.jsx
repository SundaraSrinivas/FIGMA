import React, { useState, useEffect } from "react";
import EmployeeDatabaseSQLite from "./pages/EmployeeDatabaseSQLite";
import UserTypeSelection from "./pages/UserTypeSelection";
import ManagerDashboard from "./pages/ManagerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminPerformanceManagement from "./pages/AdminPerformanceManagement";
import QualitativeQuestions from "./pages/QualitativeQuestions";
import QuantitativeQuestions from "./pages/QuantitativeQuestions";
import PerformanceManagement from "./pages/PerformanceManagement";
import SelfAssessment from "./pages/SelfAssessment";
import RequestFeedback from "./pages/RequestFeedback";
import { Users, ChevronDown, ArrowLeft } from "lucide-react";
import sqliteEmployeeService from "./services/sqliteService";

export default function AppSimple() {
  const [currentPage, setCurrentPage] = useState('user-selection');
  const [userType, setUserType] = useState('');
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedQuarter, setSelectedQuarter] = useState(null);

  const handleEmployeeDatabaseClick = () => {
    setCurrentPage('employee-database');
  };

  const handleUserTypeSelect = (type) => {
    setUserType(type);
    if (type === 'manager') {
      setCurrentPage('manager-dashboard');
    } else if (type === 'admin') {
      setCurrentPage('admin-dashboard');
    } else {
      setCurrentPage('dashboard');
    }
  };

  const handleBackToUserSelection = () => {
    setCurrentPage('user-selection');
  };

  const handleAdminPerformanceManagementClick = () => {
    setCurrentPage('admin-performance-management');
  };

  const handleQualitativeQuestionsClick = () => {
    setCurrentPage('qualitative-questions');
  };

  const handleQuantitativeQuestionsClick = () => {
    setCurrentPage('quantitative-questions');
  };

  const handlePerformanceManagementClick = () => {
    setCurrentPage('performance-management');
  };

  const handleSelfAssessmentClick = (quarter) => {
    setSelectedQuarter(quarter);
    setCurrentPage('self-assessment');
  };

  const handleRequestFeedbackClick = (quarter) => {
    setSelectedQuarter(quarter);
    setCurrentPage('request-feedback');
  };

  // Fetch employees for dropdown
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const data = await sqliteEmployeeService.getAllEmployees();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleEmployeeSelect = (employeeId) => {
    setSelectedEmployee(employeeId);
    const employee = employees.find(emp => emp.employeeId === employeeId);
    if (employee) {
      alert(`Selected Employee: ${employee.name}\nRole: ${employee.role}\nDepartment: ${employee.department}`);
    }
  };

  const handleModuleClick = (moduleName) => {
    const employee = employees.find(emp => emp.employeeId === selectedEmployee);
    if (employee) {
      if (moduleName === 'Performance Management') {
        handlePerformanceManagementClick();
      } else {
        alert(`Opening ${moduleName} for ${employee.name}\n\nThis would navigate to the ${moduleName} functionality for the selected employee.`);
      }
    }
  };

  if (currentPage === 'user-selection') {
    return <UserTypeSelection onUserTypeSelect={handleUserTypeSelect} onEmployeeDatabaseClick={handleEmployeeDatabaseClick} />;
  }

  if (currentPage === 'manager-dashboard') {
    return <ManagerDashboard onBack={handleBackToUserSelection} />;
  }

  if (currentPage === 'admin-dashboard') {
    return <AdminDashboard onBack={handleBackToUserSelection} onPerformanceManagementClick={handleAdminPerformanceManagementClick} />;
  }

  if (currentPage === 'admin-performance-management') {
    return <AdminPerformanceManagement 
      onBack={() => setCurrentPage('admin-dashboard')} 
      onQualitativeClick={handleQualitativeQuestionsClick}
      onQuantitativeClick={handleQuantitativeQuestionsClick}
    />;
  }

  if (currentPage === 'qualitative-questions') {
    return <QualitativeQuestions onBack={() => setCurrentPage('admin-performance-management')} />;
  }

  if (currentPage === 'quantitative-questions') {
    return <QuantitativeQuestions onBack={() => setCurrentPage('admin-performance-management')} />;
  }

  if (currentPage === 'performance-management') {
    const selectedEmployeeData = employees.find(emp => emp.employeeId === selectedEmployee);
    return <PerformanceManagement 
      onBack={() => setCurrentPage('dashboard')} 
      selectedEmployee={selectedEmployeeData}
      onSelfAssessmentClick={handleSelfAssessmentClick}
      onRequestFeedbackClick={handleRequestFeedbackClick}
    />;
  }

  if (currentPage === 'self-assessment') {
    const selectedEmployeeData = employees.find(emp => emp.employeeId === selectedEmployee);
    return <SelfAssessment 
      onBack={() => setCurrentPage('performance-management')} 
      selectedEmployee={selectedEmployeeData}
      selectedQuarter={selectedQuarter}
    />;
  }

  if (currentPage === 'request-feedback') {
    const selectedEmployeeData = employees.find(emp => emp.employeeId === selectedEmployee);
    return <RequestFeedback 
      onBack={() => setCurrentPage('performance-management')} 
      selectedEmployee={selectedEmployeeData}
      selectedQuarter={selectedQuarter}
    />;
  }

  if (currentPage === 'employee-database') {
    return <EmployeeDatabaseSQLite onBack={handleBackToUserSelection} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={handleBackToUserSelection}
                className="mr-4 p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                title="Back to User Selection"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">HR Unity</h1>
            </div>
            {userType && (
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">Logged in as:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  userType === 'employee' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {userType === 'employee' ? 'Employee' : 'Manager'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl text-blue-600 mb-4">
            Welcome to HR Unity
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Your comprehensive human resources management platform. Access all your HR tools from one unified interface.
          </p>
          
          {/* Employee Selection Dropdown */}
          <div className="max-w-md mx-auto">
            <label htmlFor="employee-select" className="block text-sm font-medium text-gray-700 mb-2">
              Select an Employee
            </label>
            <div className="relative">
              <select
                id="employee-select"
                value={selectedEmployee}
                onChange={(e) => handleEmployeeSelect(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                disabled={loading}
              >
                <option value="">
                  {loading ? 'Loading employees...' : 'Choose an employee'}
                </option>
                {employees.map((employee) => (
                  <option key={employee.employeeId} value={employee.employeeId}>
                    {employee.name} - {employee.role} ({employee.department})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
            {employees.length === 0 && !loading && (
              <p className="text-sm text-gray-500 mt-2">
                No employees found. Add employees in the Employee Database.
              </p>
            )}
          </div>
        </div>

        {/* Simple Module Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div 
            className={`rounded-lg shadow-md p-6 transition-all duration-300 ${
              selectedEmployee 
                ? 'bg-white cursor-pointer hover:shadow-lg hover:scale-105' 
                : 'bg-gray-100 cursor-not-allowed opacity-50'
            }`}
            onClick={selectedEmployee ? () => handleModuleClick('Performance Management') : undefined}
          >
            <h3 className={`text-lg font-semibold mb-2 ${
              selectedEmployee ? 'text-gray-900' : 'text-gray-500'
            }`}>
              Performance Management
            </h3>
            <p className={`text-sm ${
              selectedEmployee ? 'text-gray-600' : 'text-gray-400'
            }`}>
              Track employee performance, set goals, conduct reviews, and manage career development plans.
            </p>
            {!selectedEmployee && (
              <p className="text-xs text-gray-400 mt-2 italic">
                Select an employee to access this module
              </p>
            )}
          </div>
          
          <div 
            className={`rounded-lg shadow-md p-6 transition-all duration-300 ${
              selectedEmployee 
                ? 'bg-white cursor-pointer hover:shadow-lg hover:scale-105' 
                : 'bg-gray-100 cursor-not-allowed opacity-50'
            }`}
            onClick={selectedEmployee ? () => handleModuleClick('Skills Management') : undefined}
          >
            <h3 className={`text-lg font-semibold mb-2 ${
              selectedEmployee ? 'text-gray-900' : 'text-gray-500'
            }`}>
              Skills Management
            </h3>
            <p className={`text-sm ${
              selectedEmployee ? 'text-gray-600' : 'text-gray-400'
            }`}>
              Assess competencies, identify skill gaps, and create personalized learning and development pathways.
            </p>
            {!selectedEmployee && (
              <p className="text-xs text-gray-400 mt-2 italic">
                Select an employee to access this module
              </p>
            )}
          </div>
          
          <div 
            className={`rounded-lg shadow-md p-6 transition-all duration-300 ${
              selectedEmployee 
                ? 'bg-white cursor-pointer hover:shadow-lg hover:scale-105' 
                : 'bg-gray-100 cursor-not-allowed opacity-50'
            }`}
            onClick={selectedEmployee ? () => handleModuleClick('Compensation Management') : undefined}
          >
            <h3 className={`text-lg font-semibold mb-2 ${
              selectedEmployee ? 'text-gray-900' : 'text-gray-500'
            }`}>
              Compensation Management
            </h3>
            <p className={`text-sm ${
              selectedEmployee ? 'text-gray-600' : 'text-gray-400'
            }`}>
              Manage salary structures, benefits administration, and compensation planning across your organization.
            </p>
            {!selectedEmployee && (
              <p className="text-xs text-gray-400 mt-2 italic">
                Select an employee to access this module
              </p>
            )}
          </div>
        </div>
      </main>

    </div>
  );
}
