// SQLite Qualitative Questions Service
// This service provides CRUD operations for qualitative questions

class SQLiteQualitativeQuestionsService {
  constructor() {
    this.db = null;
    this.storageKey = 'qualitative_questions';
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
      console.error('Error initializing qualitative questions database:', error);
      this.db = { questions: [] };
    }
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading qualitative questions from storage:', error);
      return [];
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.db.questions));
    } catch (error) {
      console.error('Error saving qualitative questions to storage:', error);
    }
  }

  createTable() {
    // In a real SQLite implementation, you would run:
    // CREATE TABLE IF NOT EXISTS qualitative_questions (
    //   id INTEGER PRIMARY KEY AUTOINCREMENT,
    //   question TEXT NOT NULL,
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
          question: "How would you describe the employee's leadership capabilities?",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 2,
          question: "Rate the employee's communication skills on a scale of 1-10",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 3,
          question: "What are the employee's key strengths in teamwork?",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      
      this.db.questions = sampleData;
      this.saveToStorage();
    }
  }

  // Get all questions (equivalent to SELECT * FROM qualitative_questions ORDER BY createdAt DESC)
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

  // Get question by ID (equivalent to SELECT * FROM qualitative_questions WHERE id = ?)
  async getQuestionById(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const question = this.db.questions.find(q => q.id === id);
        resolve(question || null);
      }, 200);
    });
  }

  // Create new question (equivalent to INSERT INTO qualitative_questions)
  async createQuestion(questionData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const newQuestion = {
            id: Date.now(),
            question: questionData.question,
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

  // Update question (equivalent to UPDATE qualitative_questions SET ... WHERE id = ?)
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

  // Delete question (equivalent to DELETE FROM qualitative_questions WHERE id = ?)
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

  // Search questions (equivalent to SELECT * FROM qualitative_questions WHERE question LIKE ?)
  async searchQuestions(searchTerm) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const term = searchTerm.toLowerCase();
        const results = this.db.questions.filter(q =>
          q.question.toLowerCase().includes(term)
        );
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
          totalQuestions: questions.length
        };
        resolve(stats);
      }, 100);
    });
  }
}

// Create and export a singleton instance
const qualitativeQuestionsService = new SQLiteQualitativeQuestionsService();
export default qualitativeQuestionsService;
