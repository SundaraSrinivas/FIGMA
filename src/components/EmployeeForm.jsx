import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, X } from 'lucide-react';

const EmployeeForm = ({ employee, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    department: '',
    manager: '',
    managerEmail: '',
    employeeEmail: '',
    performanceRating: '',
    skillsRating: '',
    compensation: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        role: employee.role || '',
        department: employee.department || '',
        manager: employee.manager || '',
        managerEmail: employee.managerEmail || '',
        employeeEmail: employee.employeeEmail || '',
        performanceRating: employee.performanceRating?.toString() || '',
        skillsRating: employee.skillsRating?.toString() || '',
        compensation: employee.compensation?.toString() || ''
      });
    }
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.role.trim()) newErrors.role = 'Role is required';
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    if (!formData.manager.trim()) newErrors.manager = 'Manager is required';
    if (!formData.employeeEmail.trim()) newErrors.employeeEmail = 'Employee email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.employeeEmail)) newErrors.employeeEmail = 'Email is invalid';
    
    if (!formData.managerEmail.trim()) newErrors.managerEmail = 'Manager email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.managerEmail)) newErrors.managerEmail = 'Email is invalid';

    if (formData.performanceRating && (isNaN(formData.performanceRating) || formData.performanceRating < 0 || formData.performanceRating > 5)) {
      newErrors.performanceRating = 'Performance rating must be between 0 and 5';
    }

    if (formData.skillsRating && (isNaN(formData.skillsRating) || formData.skillsRating < 0 || formData.skillsRating > 5)) {
      newErrors.skillsRating = 'Skills rating must be between 0 and 5';
    }

    if (formData.compensation && (isNaN(formData.compensation) || formData.compensation < 0)) {
      newErrors.compensation = 'Compensation must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={onCancel}
                className="mr-4 p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-semibold text-gray-900">
                {employee ? 'Edit Employee' : 'Add New Employee'}
              </h1>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-600 flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Employee
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter full name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Role *
              </label>
              <input
                type="text"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.role ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., Software Engineer"
              />
              {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
            </div>

            {/* Department */}
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                Department *
              </label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.department ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select Department</option>
                <option value="Engineering">Engineering</option>
                <option value="Product">Product</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="HR">Human Resources</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
              </select>
              {errors.department && <p className="mt-1 text-sm text-red-600">{errors.department}</p>}
            </div>

            {/* Manager */}
            <div>
              <label htmlFor="manager" className="block text-sm font-medium text-gray-700 mb-2">
                Manager *
              </label>
              <input
                type="text"
                id="manager"
                name="manager"
                value={formData.manager}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.manager ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Manager's name"
              />
              {errors.manager && <p className="mt-1 text-sm text-red-600">{errors.manager}</p>}
            </div>

            {/* Employee Email */}
            <div>
              <label htmlFor="employeeEmail" className="block text-sm font-medium text-gray-700 mb-2">
                Employee Email *
              </label>
              <input
                type="email"
                id="employeeEmail"
                name="employeeEmail"
                value={formData.employeeEmail}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.employeeEmail ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="employee@company.com"
              />
              {errors.employeeEmail && <p className="mt-1 text-sm text-red-600">{errors.employeeEmail}</p>}
            </div>

            {/* Manager Email */}
            <div>
              <label htmlFor="managerEmail" className="block text-sm font-medium text-gray-700 mb-2">
                Manager Email *
              </label>
              <input
                type="email"
                id="managerEmail"
                name="managerEmail"
                value={formData.managerEmail}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.managerEmail ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="manager@company.com"
              />
              {errors.managerEmail && <p className="mt-1 text-sm text-red-600">{errors.managerEmail}</p>}
            </div>

            {/* Performance Rating */}
            <div>
              <label htmlFor="performanceRating" className="block text-sm font-medium text-gray-700 mb-2">
                Performance Rating (0-5)
              </label>
              <input
                type="number"
                id="performanceRating"
                name="performanceRating"
                value={formData.performanceRating}
                onChange={handleChange}
                min="0"
                max="5"
                step="0.1"
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.performanceRating ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="4.5"
              />
              {errors.performanceRating && <p className="mt-1 text-sm text-red-600">{errors.performanceRating}</p>}
            </div>

            {/* Skills Rating */}
            <div>
              <label htmlFor="skillsRating" className="block text-sm font-medium text-gray-700 mb-2">
                Skills Rating (0-5)
              </label>
              <input
                type="number"
                id="skillsRating"
                name="skillsRating"
                value={formData.skillsRating}
                onChange={handleChange}
                min="0"
                max="5"
                step="0.1"
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.skillsRating ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="4.2"
              />
              {errors.skillsRating && <p className="mt-1 text-sm text-red-600">{errors.skillsRating}</p>}
            </div>

            {/* Compensation */}
            <div className="md:col-span-2">
              <label htmlFor="compensation" className="block text-sm font-medium text-gray-700 mb-2">
                Annual Compensation ($)
              </label>
              <input
                type="number"
                id="compensation"
                name="compensation"
                value={formData.compensation}
                onChange={handleChange}
                min="0"
                step="1000"
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.compensation ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="85000"
              />
              {errors.compensation && <p className="mt-1 text-sm text-red-600">{errors.compensation}</p>}
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-600"
            >
              {employee ? 'Update Employee' : 'Create Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
