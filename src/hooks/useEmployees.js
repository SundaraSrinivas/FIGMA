import { useState, useEffect, useCallback } from 'react';
import employeeService from '../services/awsService';

export const useEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all employees
  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await employeeService.getAllEmployees();
      setEmployees(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new employee
  const createEmployee = useCallback(async (employeeData) => {
    setLoading(true);
    setError(null);
    try {
      const newEmployee = await employeeService.createEmployee(employeeData);
      setEmployees(prev => [...prev, newEmployee]);
      return newEmployee;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update employee
  const updateEmployee = useCallback(async (employeeId, employeeData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedEmployee = await employeeService.updateEmployee(employeeId, employeeData);
      setEmployees(prev => 
        prev.map(emp => emp.employeeId === employeeId ? updatedEmployee : emp)
      );
      return updatedEmployee;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete employee
  const deleteEmployee = useCallback(async (employeeId) => {
    setLoading(true);
    setError(null);
    try {
      await employeeService.deleteEmployee(employeeId);
      setEmployees(prev => prev.filter(emp => emp.employeeId !== employeeId));
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-refresh every 10 seconds
  useEffect(() => {
    fetchEmployees();
    
    const interval = setInterval(() => {
      fetchEmployees();
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, [fetchEmployees]);

  return {
    employees,
    loading,
    error,
    fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee
  };
};
