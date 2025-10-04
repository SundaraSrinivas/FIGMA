import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import qualitativeQuestionsService from '../services/qualitativeQuestionsService';

const QualitativeQuestions = ({ onBack }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [formData, setFormData] = useState({
    question: ''
  });

  // Fetch questions from database
  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await qualitativeQuestionsService.getAllQuestions();
      setQuestions(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching questions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load questions on component mount
  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setFormData({ question: '' });
    setShowAddForm(true);
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setFormData({
      question: question.question
    });
    setShowAddForm(true);
  };

  const handleDeleteQuestion = async (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        setLoading(true);
        await qualitativeQuestionsService.deleteQuestion(id);
        await fetchQuestions(); // Refresh the list
      } catch (error) {
        alert('Error deleting question: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingQuestion) {
        // Update existing question
        await qualitativeQuestionsService.updateQuestion(editingQuestion.id, formData);
      } else {
        // Add new question
        await qualitativeQuestionsService.createQuestion(formData);
      }
      setShowAddForm(false);
      setEditingQuestion(null);
      setFormData({ question: '' });
      await fetchQuestions(); // Refresh the list
    } catch (error) {
      alert('Error saving question: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFormCancel = () => {
    setShowAddForm(false);
    setEditingQuestion(null);
    setFormData({ question: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (showAddForm) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <button
                  onClick={handleFormCancel}
                  className="mr-4 p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                  title="Back to Questions"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-xl font-semibold text-gray-900">
                  {editingQuestion ? 'Edit Question' : 'Add New Question'}
                </h1>
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

        {/* Form */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <form onSubmit={handleFormSubmit} className="bg-white shadow-sm rounded-lg p-6">
            <div className="space-y-6">
              {/* Question Text */}
              <div>
                <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
                  Question Text *
                </label>
                <textarea
                  id="question"
                  name="question"
                  value={formData.question}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter the qualitative question..."
                  required
                />
              </div>


            </div>

            {/* Form Actions */}
            <div className="mt-8 flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleFormCancel}
                className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingQuestion ? 'Update Question' : 'Add Question'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

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
                title="Back to Performance Management"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Qualitative Questions</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleAddQuestion}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </button>
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">Admin Portal</span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  Admin
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl text-red-600 mb-4">
            Qualitative Questions Management
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create and manage qualitative questions for performance evaluations, 360-degree reviews, and behavioral assessments.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">Error: {error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            <span className="ml-3 text-gray-600">Loading questions...</span>
          </div>
        )}

        {/* Questions List */}
        {!loading && (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Current Questions ({questions.length})
              </h3>
            </div>
            
            <div className="divide-y divide-gray-200">
              {questions.length === 0 ? (
                <div className="px-6 py-12 text-center text-gray-500">
                  <p>No questions found. Add your first qualitative question!</p>
                </div>
              ) : (
              questions.map((question) => (
                <div key={question.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium mb-1">
                        {question.question}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleEditQuestion(question)}
                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                        title="Edit question"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(question.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        title="Delete question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
              )}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        {!loading && (
          <div className="mt-6">
            <div className="bg-white p-4 rounded-lg shadow-sm max-w-xs">
              <div className="text-sm font-medium text-gray-500">Total Questions</div>
              <div className="text-2xl font-semibold text-gray-900">{questions.length}</div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default QualitativeQuestions;
