// SQLite Quantitative Questions Service
// This service provides CRUD operations for quantitative questions

class SQLiteQuantitativeQuestionsService {
  constructor() {
    this.db = null;
    this.storageKey = 'quantitative_questions';
    this.initDatabase();
  }

  initDatabase() {
    try {
      this.db = {
        questions: this.loadFromStorage()
      };
      this.createTable();
      this.insertSampleData();
    } catch (error) {
      console.error('Error initializing quantitative questions database:', error);
      this.db = { questions: [] };
    }
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading quantitative questions from storage:', error);
      return [];
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.db.questions));
    } catch (error) {
      console.error('Error saving quantitative questions to storage:', error);
    }
  }

  createTable() {
    // In a real SQLite implementation, you would run:
    // CREATE TABLE IF NOT EXISTS quantitative_questions (
    //   id INTEGER PRIMARY KEY AUTOINCREMENT,
    //   question TEXT NOT NULL,
    //   scale TEXT NOT NULL,
    //   createdAt TEXT,
    //   updatedAt TEXT
    // );
    
    if (!this.db.questions) {
      this.db.questions = [];
    }
  }

  insertSampleData() {
    if (this.db.questions.length === 0) {
      const sampleData = [
        {
          id: 1,
          question: "Rate the employee's technical skills proficiency",
          scale: "1-5",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 2,
          question: "How would you rate the employee's project completion rate?",
          scale: "1-5",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 3,
          question: "Rate the employee's meeting attendance and punctuality",
          scale: "1-5",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      
      this.db.questions = sampleData;
      this.saveToStorage();
    }
  }

  // Get all questions (equivalent to SELECT * FROM quantitative_questions ORDER BY createdAt DESC)
  async getAllQuestions() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const questions = [...this.db.questions].sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        resolve(questions);
      }, 300);
    });
  }

  // Get question by ID (equivalent to SELECT * FROM quantitative_questions WHERE id = ?)
  async getQuestionById(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const question = this.db.questions.find(q => q.id === id);
        resolve(question || null);
      }, 200);
    });
  }

  // Create new question (equivalent to INSERT INTO quantitative_questions)
  async createQuestion(questionData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const newQuestion = {
            id: Date.now(),
            question: questionData.question,
            scale: questionData.scale,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          this.db.questions.push(newQuestion);
          this.saveToStorage();
          resolve(newQuestion);
        } catch (error) {
          reject(error);
        }
      }, 400);
    });
  }

  // Update question (equivalent to UPDATE quantitative_questions SET ... WHERE id = ?)
  async updateQuestion(id, questionData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const index = this.db.questions.findIndex(q => q.id === id);
          if (index === -1) {
            throw new Error('Question not found');
          }

          this.db.questions[index] = {
            ...this.db.questions[index],
            question: questionData.question,
            scale: questionData.scale,
            updatedAt: new Date().toISOString()
          };

          this.saveToStorage();
          resolve(this.db.questions[index]);
        } catch (error) {
          reject(error);
        }
      }, 400);
    });
  }

  // Delete question (equivalent to DELETE FROM quantitative_questions WHERE id = ?)
  async deleteQuestion(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const index = this.db.questions.findIndex(q => q.id === id);
          if (index === -1) {
            throw new Error('Question not found');
          }

          this.db.questions.splice(index, 1);
          this.saveToStorage();
          resolve(true);
        } catch (error) {
          reject(error);
        }
      }, 300);
    });
  }

  // Search questions (equivalent to SELECT * FROM quantitative_questions WHERE question LIKE ?)
  async searchQuestions(searchTerm) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const term = searchTerm.toLowerCase();
        const results = this.db.questions.filter(q =>
          q.question.toLowerCase().includes(term) ||
          q.scale.toLowerCase().includes(term)
        );
        resolve(results);
      }, 200);
    });
  }

  // Get questions by scale (equivalent to SELECT * FROM quantitative_questions WHERE scale = ?)
  async getQuestionsByScale(scale) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const results = this.db.questions.filter(q => q.scale === scale);
        resolve(results);
      }, 200);
    });
  }

  // Get question statistics
  async getQuestionStats() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const questions = this.db.questions;
        const stats = {
          totalQuestions: questions.length,
          scaleBreakdown: questions.reduce((acc, q) => {
            acc[q.scale] = (acc[q.scale] || 0) + 1;
            return acc;
          }, {})
        };
        resolve(stats);
      }, 100);
    });
  }
}

// Create and export a singleton instance
const quantitativeQuestionsService = new SQLiteQuantitativeQuestionsService();
export default quantitativeQuestionsService;
