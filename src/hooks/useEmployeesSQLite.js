import { useState, useEffect, useCallback } from 'react';
import sqliteEmployeeService from '../services/sqliteService';

export const useEmployeesSQLite = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    departments: 0,
    averagePerformance: 0,
    averageCompensation: 0
  });

  // Fetch all employees
  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await sqliteEmployeeService.getAllEmployees();
      setEmployees(data);
      
      // Also fetch stats
      const employeeStats = await sqliteEmployeeService.getEmployeeStats();
      setStats(employeeStats);
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
      const newEmployee = await sqliteEmployeeService.createEmployee(employeeData);
      setEmployees(prev => [...prev, newEmployee]);
      
      // Update stats
      const employeeStats = await sqliteEmployeeService.getEmployeeStats();
      setStats(employeeStats);
      
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
      const updatedEmployee = await sqliteEmployeeService.updateEmployee(employeeId, employeeData);
      setEmployees(prev => 
        prev.map(emp => emp.employeeId === employeeId ? updatedEmployee : emp)
      );
      
      // Update stats
      const employeeStats = await sqliteEmployeeService.getEmployeeStats();
      setStats(employeeStats);
      
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
      await sqliteEmployeeService.deleteEmployee(employeeId);
      setEmployees(prev => prev.filter(emp => emp.employeeId !== employeeId));
      
      // Update stats
      const employeeStats = await sqliteEmployeeService.getEmployeeStats();
      setStats(employeeStats);
      
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Search employees
  const searchEmployees = useCallback(async (searchTerm) => {
    setLoading(true);
    setError(null);
    try {
      const results = await sqliteEmployeeService.searchEmployees(searchTerm);
      return results;
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
    stats,
    fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    searchEmployees
  };
};
