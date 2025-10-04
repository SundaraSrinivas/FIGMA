// SQLite Employee Service
// This service provides the same interface as awsService but uses SQLite database

class SQLiteEmployeeService {
  constructor() {
    this.db = null;
    this.initDatabase();
  }

  initDatabase() {
    try {
      // For React apps, we'll use a simple in-memory database with localStorage backup
      // In a real app, you'd use a proper SQLite database
      this.db = {
        employees: this.loadFromStorage()
      };
      this.createTable();
      this.insertSampleData();
    } catch (error) {
      console.error('Error initializing database:', error);
      this.db = { employees: [] };
    }
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem('sqlite_employees');
      if (stored) {
        const data = JSON.parse(stored);
        // Check if data has the new isManager field, if not, clear and reinitialize
        if (data.length > 0 && !data[0].hasOwnProperty('isManager')) {
          console.log('Old data structure detected. Clearing storage to reinitialize with manager data.');
          localStorage.removeItem('sqlite_employees');
          return [];
        }
        return data;
      }
      return [];
    } catch (error) {
      console.error('Error loading from storage:', error);
      return [];
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem('sqlite_employees', JSON.stringify(this.db.employees));
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  }

  createTable() {
    // In a real SQLite implementation, you would run:
    // CREATE TABLE IF NOT EXISTS employees (
    //   employeeId TEXT PRIMARY KEY,
    //   name TEXT NOT NULL,
    //   role TEXT,
    //   department TEXT,
    //   manager TEXT,
    //   managerEmail TEXT,
    //   employeeEmail TEXT,
    //   performanceRating REAL,
    //   skillsRating REAL,
    //   compensation REAL,
    //   createdAt TEXT,
    //   updatedAt TEXT
    // );
    
    // For this demo, we'll just ensure the employees array exists
    if (!this.db.employees) {
      this.db.employees = [];
    }
  }

  insertSampleData() {
    if (this.db.employees.length === 0) {
      const sampleData = [
        {
          employeeId: 'EMP001',
          name: 'John Smith',
          role: 'Software Engineer',
          department: 'Engineering',
          manager: 'Jane Doe',
          managerEmail: 'jane.doe@company.com',
          employeeEmail: 'john.smith@company.com',
          performanceRating: 4.5,
          skillsRating: 4.2,
          compensation: 85000,
          isManager: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          employeeId: 'EMP002',
          name: 'Sarah Johnson',
          role: 'Product Manager',
          department: 'Product',
          manager: 'Mike Wilson',
          managerEmail: 'mike.wilson@company.com',
          employeeEmail: 'sarah.johnson@company.com',
          performanceRating: 4.8,
          skillsRating: 4.6,
          compensation: 95000,
          isManager: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          employeeId: 'EMP003',
          name: 'Alex Chen',
          role: 'UX Designer',
          department: 'Design',
          manager: 'Emily Brown',
          managerEmail: 'emily.brown@company.com',
          employeeEmail: 'alex.chen@company.com',
          performanceRating: 4.3,
          skillsRating: 4.7,
          compensation: 78000,
          isManager: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          employeeId: 'EMP004',
          name: 'Jane Doe',
          role: 'Engineering Manager',
          department: 'Engineering',
          manager: 'CEO',
          managerEmail: 'ceo@company.com',
          employeeEmail: 'jane.doe@company.com',
          performanceRating: 4.9,
          skillsRating: 4.8,
          compensation: 120000,
          isManager: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          employeeId: 'EMP005',
          name: 'Mike Wilson',
          role: 'VP of Product',
          department: 'Product',
          manager: 'CEO',
          managerEmail: 'ceo@company.com',
          employeeEmail: 'mike.wilson@company.com',
          performanceRating: 4.7,
          skillsRating: 4.9,
          compensation: 140000,
          isManager: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      
      this.db.employees = sampleData;
      this.saveToStorage();
    }
  }

  // Get all employees (equivalent to SELECT * FROM employees)
  async getAllEmployees() {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate SQL query: SELECT * FROM employees ORDER BY name
        const employees = [...this.db.employees].sort((a, b) => a.name.localeCompare(b.name));
        resolve(employees);
      }, 300); // Simulate database query time
    });
  }

  // Get only managers (equivalent to SELECT * FROM employees WHERE isManager = true)
  async getManagers() {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate SQL query: SELECT * FROM employees WHERE isManager = true ORDER BY name
        const allEmployees = this.db.employees;
        console.log('All employees in database:', allEmployees);
        
        const managers = allEmployees
          .filter(emp => emp.isManager === true)
          .sort((a, b) => a.name.localeCompare(b.name));
        
        console.log('Filtered managers:', managers);
        resolve(managers);
      }, 300); // Simulate database query time
    });
  }

  // Get employee by ID (equivalent to SELECT * FROM employees WHERE employeeId = ?)
  async getEmployeeById(employeeId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate SQL query: SELECT * FROM employees WHERE employeeId = ?
        const employee = this.db.employees.find(emp => emp.employeeId === employeeId);
        resolve(employee || null);
      }, 200);
    });
  }

  // Create new employee (equivalent to INSERT INTO employees)
  async createEmployee(employeeData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // Check if employee ID already exists
          const existingEmployee = this.db.employees.find(emp => emp.employeeId === employeeData.employeeId);
          if (existingEmployee) {
            throw new Error('Employee ID already exists');
          }

          // Simulate SQL INSERT
          const newEmployee = {
            employeeId: employeeData.employeeId || `EMP${Date.now()}`,
            name: employeeData.name,
            role: employeeData.role,
            department: employeeData.department,
            manager: employeeData.manager,
            managerEmail: employeeData.managerEmail,
            employeeEmail: employeeData.employeeEmail,
            performanceRating: parseFloat(employeeData.performanceRating) || 0,
            skillsRating: parseFloat(employeeData.skillsRating) || 0,
            compensation: parseFloat(employeeData.compensation) || 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          this.db.employees.push(newEmployee);
          this.saveToStorage();
          resolve(newEmployee);
        } catch (error) {
          reject(error);
        }
      }, 400);
    });
  }

  // Update employee (equivalent to UPDATE employees SET ... WHERE employeeId = ?)
  async updateEmployee(employeeId, employeeData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // Simulate SQL UPDATE
          const index = this.db.employees.findIndex(emp => emp.employeeId === employeeId);
          if (index === -1) {
            throw new Error('Employee not found');
          }

          this.db.employees[index] = {
            ...this.db.employees[index],
            name: employeeData.name,
            role: employeeData.role,
            department: employeeData.department,
            manager: employeeData.manager,
            managerEmail: employeeData.managerEmail,
            employeeEmail: employeeData.employeeEmail,
            performanceRating: parseFloat(employeeData.performanceRating) || 0,
            skillsRating: parseFloat(employeeData.skillsRating) || 0,
            compensation: parseFloat(employeeData.compensation) || 0,
            updatedAt: new Date().toISOString()
          };

          this.saveToStorage();
          resolve(this.db.employees[index]);
        } catch (error) {
          reject(error);
        }
      }, 400);
    });
  }

  // Delete employee (equivalent to DELETE FROM employees WHERE employeeId = ?)
  async deleteEmployee(employeeId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // Simulate SQL DELETE
          const index = this.db.employees.findIndex(emp => emp.employeeId === employeeId);
          if (index === -1) {
            throw new Error('Employee not found');
          }

          this.db.employees.splice(index, 1);
          this.saveToStorage();
          resolve(true);
        } catch (error) {
          reject(error);
        }
      }, 300);
    });
  }

  // Search employees (equivalent to SELECT * FROM employees WHERE name LIKE ? OR role LIKE ?)
  async searchEmployees(searchTerm) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const term = searchTerm.toLowerCase();
        const results = this.db.employees.filter(emp =>
          emp.name.toLowerCase().includes(term) ||
          emp.role.toLowerCase().includes(term) ||
          emp.department.toLowerCase().includes(term) ||
          emp.employeeId.toLowerCase().includes(term)
        );
        resolve(results);
      }, 200);
    });
  }

  // Get employee statistics
  async getEmployeeStats() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const employees = this.db.employees;
        const stats = {
          totalEmployees: employees.length,
          departments: [...new Set(employees.map(emp => emp.department))].length,
          averagePerformance: employees.length > 0 
            ? employees.reduce((sum, emp) => sum + (emp.performanceRating || 0), 0) / employees.length 
            : 0,
          averageCompensation: employees.length > 0
            ? employees.reduce((sum, emp) => sum + (emp.compensation || 0), 0) / employees.length
            : 0
        };
        resolve(stats);
      }, 100);
    });
  }
}

// Create and export a singleton instance
const sqliteEmployeeService = new SQLiteEmployeeService();
export default sqliteEmployeeService;
