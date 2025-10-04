// SQLite Performance Management Service
// This service provides CRUD operations for quarters and performance data

class SQLitePerformanceService {
  constructor() {
    this.db = null;
    this.storageKey = 'performance_data';
    this.initDatabase();
  }

  initDatabase() {
    try {
      this.db = {
        quarters: this.loadFromStorage('quarters'),
        performanceRecords: this.loadFromStorage('performanceRecords')
      };
      this.createTables();
      this.insertSampleData();
    } catch (error) {
      console.error('Error initializing performance database:', error);
      this.db = { quarters: [], performanceRecords: [] };
    }
  }

  loadFromStorage(key) {
    try {
      const stored = localStorage.getItem(`${this.storageKey}_${key}`);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error(`Error loading ${key} from storage:`, error);
      return [];
    }
  }

  saveToStorage(key, data) {
    try {
      localStorage.setItem(`${this.storageKey}_${key}`, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${key} to storage:`, error);
    }
  }

  createTables() {
    // In a real SQLite implementation, you would run:
    // CREATE TABLE IF NOT EXISTS quarters (
    //   id INTEGER PRIMARY KEY AUTOINCREMENT,
    //   name TEXT NOT NULL,
    //   year INTEGER NOT NULL,
    //   startDate TEXT,
    //   endDate TEXT,
    //   isActive BOOLEAN DEFAULT 0,
    //   createdAt TEXT,
    //   updatedAt TEXT
    // );
    // 
    // CREATE TABLE IF NOT EXISTS performance_records (
    //   id INTEGER PRIMARY KEY AUTOINCREMENT,
    //   employeeId TEXT NOT NULL,
    //   quarterId INTEGER NOT NULL,
    //   type TEXT NOT NULL, -- 'self_assessment', 'request_feedback', 'feedback_summary'
    //   status TEXT DEFAULT 'pending', -- 'pending', 'in_progress', 'completed'
    //   data TEXT, -- JSON string for additional data
    //   createdAt TEXT,
    //   updatedAt TEXT,
    //   FOREIGN KEY (quarterId) REFERENCES quarters (id)
    // );
    
    if (!this.db.quarters) {
      this.db.quarters = [];
    }
    if (!this.db.performanceRecords) {
      this.db.performanceRecords = [];
    }
  }

  insertSampleData() {
    if (this.db.quarters.length === 0) {
      const currentYear = new Date().getFullYear();
      const sampleQuarters = [
        {
          id: 1,
          name: "Q1",
          year: currentYear,
          startDate: `${currentYear}-01-01`,
          endDate: `${currentYear}-03-31`,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 2,
          name: "Q2",
          year: currentYear,
          startDate: `${currentYear}-04-01`,
          endDate: `${currentYear}-06-30`,
          isActive: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 3,
          name: "Q3",
          year: currentYear,
          startDate: `${currentYear}-07-01`,
          endDate: `${currentYear}-09-30`,
          isActive: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 4,
          name: "Q4",
          year: currentYear,
          startDate: `${currentYear}-10-01`,
          endDate: `${currentYear}-12-31`,
          isActive: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      
      this.db.quarters = sampleQuarters;
      this.saveToStorage('quarters', this.db.quarters);
    }
  }

  // Quarter operations
  async getAllQuarters() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const quarters = [...this.db.quarters].sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        resolve(quarters);
      }, 300);
    });
  }

  async getActiveQuarter() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const activeQuarter = this.db.quarters.find(q => q.isActive);
        resolve(activeQuarter || null);
      }, 200);
    });
  }

  async setActiveQuarter(quarterId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // Set all quarters to inactive
          this.db.quarters.forEach(q => q.isActive = false);
          
          // Set the selected quarter as active
          const quarter = this.db.quarters.find(q => q.id === quarterId);
          if (quarter) {
            quarter.isActive = true;
            quarter.updatedAt = new Date().toISOString();
            this.saveToStorage('quarters', this.db.quarters);
            resolve(quarter);
          } else {
            throw new Error('Quarter not found');
          }
        } catch (error) {
          reject(error);
        }
      }, 300);
    });
  }

  // Performance record operations
  async getPerformanceRecords(employeeId, quarterId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const records = this.db.performanceRecords.filter(record => 
          record.employeeId === employeeId && record.quarterId === quarterId
        );
        resolve(records);
      }, 200);
    });
  }

  async createPerformanceRecord(recordData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const newRecord = {
            id: Date.now(),
            employeeId: recordData.employeeId,
            quarterId: recordData.quarterId,
            type: recordData.type, // 'self_assessment', 'request_feedback', 'feedback_summary'
            status: recordData.status || 'pending',
            data: recordData.data || null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          this.db.performanceRecords.push(newRecord);
          this.saveToStorage('performanceRecords', this.db.performanceRecords);
          resolve(newRecord);
        } catch (error) {
          reject(error);
        }
      }, 400);
    });
  }

  async updatePerformanceRecord(id, recordData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const index = this.db.performanceRecords.findIndex(r => r.id === id);
          if (index === -1) {
            throw new Error('Performance record not found');
          }

          this.db.performanceRecords[index] = {
            ...this.db.performanceRecords[index],
            ...recordData,
            updatedAt: new Date().toISOString()
          };

          this.saveToStorage('performanceRecords', this.db.performanceRecords);
          resolve(this.db.performanceRecords[index]);
        } catch (error) {
          reject(error);
        }
      }, 400);
    });
  }

  async getPerformanceRecordByType(employeeId, quarterId, type) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const record = this.db.performanceRecords.find(r => 
          r.employeeId === employeeId && r.quarterId === quarterId && r.type === type
        );
        resolve(record || null);
      }, 200);
    });
  }

  // Statistics
  async getPerformanceStats(employeeId, quarterId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const records = this.db.performanceRecords.filter(r => 
          r.employeeId === employeeId && r.quarterId === quarterId
        );
        
        const stats = {
          totalRecords: records.length,
          completedRecords: records.filter(r => r.status === 'completed').length,
          pendingRecords: records.filter(r => r.status === 'pending').length,
          inProgressRecords: records.filter(r => r.status === 'in_progress').length,
          selfAssessment: records.find(r => r.type === 'self_assessment') || null,
          requestFeedback: records.find(r => r.type === 'request_feedback') || null,
          feedbackSummary: records.find(r => r.type === 'feedback_summary') || null
        };
        
        resolve(stats);
      }, 100);
    });
  }
}

// Create and export a singleton instance
const performanceService = new SQLitePerformanceService();
export default performanceService;
