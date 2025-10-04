import React, { useState, useEffect } from 'react';
import { ArrowLeft, UserCheck, MessageSquare, BarChart3, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import performanceService from '../services/performanceService';

const PerformanceManagement = ({ onBack, selectedEmployee, onSelfAssessmentClick, onRequestFeedbackClick }) => {
  const [quarters, setQuarters] = useState([]);
  const [selectedQuarter, setSelectedQuarter] = useState(null);
  const [performanceStats, setPerformanceStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch quarters on component mount
  useEffect(() => {
    fetchQuarters();
  }, []);

  // Fetch performance stats when quarter is selected
  useEffect(() => {
    if (selectedQuarter && selectedEmployee) {
      fetchPerformanceStats();
    }
  }, [selectedQuarter, selectedEmployee]);

  const fetchQuarters = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await performanceService.getAllQuarters();
      setQuarters(data);
      
      // Set active quarter as default selection
      const activeQuarter = data.find(q => q.isActive);
      if (activeQuarter) {
        setSelectedQuarter(activeQuarter);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching quarters:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPerformanceStats = async () => {
    try {
      const stats = await performanceService.getPerformanceStats(selectedEmployee.id, selectedQuarter.id);
      setPerformanceStats(stats);
    } catch (err) {
      console.error('Error fetching performance stats:', err);
    }
  };

  const handleQuarterSelect = async (quarter) => {
    try {
      setLoading(true);
      await performanceService.setActiveQuarter(quarter.id);
      setSelectedQuarter(quarter);
    } catch (err) {
      setError(err.message);
      console.error('Error setting active quarter:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTileClick = async (type) => {
    if (!selectedQuarter || !selectedEmployee) return;

    try {
      if (type === 'self_assessment') {
        // Navigate to self assessment page (allow access even if completed)
        onSelfAssessmentClick(selectedQuarter);
        return;
      }

      if (type === 'request_feedback') {
        // Navigate to request feedback page
        onRequestFeedbackClick(selectedQuarter);
        return;
      }

      // For other tiles, update status
      const existingRecord = await performanceService.getPerformanceRecordByType(
        selectedEmployee.id, 
        selectedQuarter.id, 
        type
      );

      if (existingRecord) {
        // Update existing record status
        await performanceService.updatePerformanceRecord(existingRecord.id, {
          status: existingRecord.status === 'pending' ? 'in_progress' : 'completed'
        });
      } else {
        // Create new record
        await performanceService.createPerformanceRecord({
          employeeId: selectedEmployee.id,
          quarterId: selectedQuarter.id,
          type: type,
          status: 'in_progress'
        });
      }

      // Refresh stats
      await fetchPerformanceStats();
    } catch (err) {
      console.error('Error handling tile click:', err);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      default:
        return 'Not Started';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
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
                title="Back to Employee Dashboard"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Performance Management</h1>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2">Employee Portal</span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {selectedEmployee?.name || 'Employee'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl text-blue-600 mb-4">
            Performance Management
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select a quarter to access your performance management tools and track your progress.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">Error: {error}</p>
          </div>
        )}

        {/* Quarter Selection */}
        <div className="mb-8">
          <div className="bg-white shadow-sm rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Calendar className="w-6 h-6 text-blue-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Select Quarter</h3>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading quarters...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quarters.map((quarter) => (
                  <button
                    key={quarter.id}
                    onClick={() => handleQuarterSelect(quarter)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      selectedQuarter?.id === quarter.id
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl font-bold mb-1">{quarter.name}</div>
                      <div className="text-sm text-gray-600">{quarter.year}</div>
                      {quarter.isActive && (
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Performance Management Tiles */}
        {selectedQuarter && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Self Assessment Tile */}
            <div 
              onClick={() => handleTileClick('self_assessment')}
              className={`rounded-lg shadow-sm border p-6 transition-shadow duration-200 ${
                performanceStats?.selfAssessment?.status === 'completed'
                  ? 'bg-green-50 border-green-200 cursor-pointer hover:shadow-md'
                  : 'bg-white border-gray-200 cursor-pointer hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <UserCheck className={`w-8 h-8 mr-3 ${
                    performanceStats?.selfAssessment?.status === 'completed'
                      ? 'text-green-600'
                      : 'text-blue-600'
                  }`} />
                  <h3 className="text-lg font-medium text-gray-900">Self Assessment</h3>
                </div>
                {performanceStats?.selfAssessment && getStatusIcon(performanceStats.selfAssessment.status)}
              </div>
              <p className="text-gray-600 mb-4">
                {performanceStats?.selfAssessment?.status === 'completed'
                  ? `Your self-assessment for ${selectedQuarter.name} ${selectedQuarter.year} has been completed and submitted.`
                  : `Complete your self-evaluation for ${selectedQuarter.name} ${selectedQuarter.year}. Reflect on your achievements, challenges, and goals.`
                }
              </p>
              {performanceStats?.selfAssessment && (
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(performanceStats.selfAssessment.status)}`}>
                  {getStatusText(performanceStats.selfAssessment.status)}
                </div>
              )}
              {performanceStats?.selfAssessment?.status === 'completed' && (
                <p className="text-sm text-green-600 mt-2 font-medium">
                  ✓ Assessment completed for this quarter
                </p>
              )}
            </div>

            {/* Request Feedback Tile */}
            <div 
              onClick={() => handleTileClick('request_feedback')}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <MessageSquare className="w-8 h-8 text-green-600 mr-3" />
                  <h3 className="text-lg font-medium text-gray-900">Request Feedback</h3>
                </div>
                {performanceStats?.requestFeedback && getStatusIcon(performanceStats.requestFeedback.status)}
              </div>
              <p className="text-gray-600 mb-4">
                Request feedback from colleagues, managers, and team members for {selectedQuarter.name} {selectedQuarter.year}.
              </p>
              {performanceStats?.requestFeedback && (
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(performanceStats.requestFeedback.status)}`}>
                  {getStatusText(performanceStats.requestFeedback.status)}
                </div>
              )}
            </div>

            {/* Feedback Summary Tile */}
            <div 
              onClick={() => handleTileClick('feedback_summary')}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <BarChart3 className="w-8 h-8 text-purple-600 mr-3" />
                  <h3 className="text-lg font-medium text-gray-900">Feedback Summary</h3>
                </div>
                {performanceStats?.feedbackSummary && getStatusIcon(performanceStats.feedbackSummary.status)}
              </div>
              <p className="text-gray-600 mb-4">
                View and analyze your feedback summary for {selectedQuarter.name} {selectedQuarter.year}. 
                Track your progress and development areas.
              </p>
              {performanceStats?.feedbackSummary && (
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(performanceStats.feedbackSummary.status)}`}>
                  {getStatusText(performanceStats.feedbackSummary.status)}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Performance Overview */}
        {selectedQuarter && performanceStats && (
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{performanceStats.totalRecords}</div>
                <div className="text-sm text-gray-500">Total Activities</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{performanceStats.completedRecords}</div>
                <div className="text-sm text-gray-500">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{performanceStats.inProgressRecords}</div>
                <div className="text-sm text-gray-500">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">{performanceStats.pendingRecords}</div>
                <div className="text-sm text-gray-500">Pending</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PerformanceManagement;
