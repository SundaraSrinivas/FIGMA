import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Send, User, MessageSquare, CheckCircle, Clock, AlertCircle, Search, X } from 'lucide-react';
import sqliteEmployeeService from '../services/sqliteService';
import performanceService from '../services/performanceService';
import emailService from '../services/emailService';
import '../utils/emailTest'; // Import to show email service status

const RequestFeedback = ({ onBack, selectedEmployee, selectedQuarter }) => {
  const [colleagues, setColleagues] = useState([]);
  const [selectedColleagues, setSelectedColleagues] = useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [existingRequests, setExistingRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredColleagues, setFilteredColleagues] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const loadColleagues = useCallback(async () => {
    setLoading(true);
    try {
      const allEmployees = await sqliteEmployeeService.getAllEmployees();
      // Filter out the current employee and only show colleagues
      const colleaguesList = allEmployees.filter(emp => 
        emp.employeeId !== selectedEmployee.employeeId
      );
      setColleagues(colleaguesList);
      console.log('Loaded colleagues:', colleaguesList);
    } catch (err) {
      setError(err.message);
      console.error('Error loading colleagues:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedEmployee.employeeId]);

  const loadExistingRequests = useCallback(async () => {
    try {
      const existingRecord = await performanceService.getPerformanceRecordByType(
        selectedEmployee.id,
        selectedQuarter.id,
        'request_feedback'
      );

      if (existingRecord && existingRecord.data) {
        const requestData = JSON.parse(existingRecord.data);
        setExistingRequests(requestData.requests || []);
        setFeedbackMessage(requestData.message || '');
        setSelectedColleagues(requestData.selectedColleagues || []);
        console.log('Loaded existing feedback requests:', requestData);
      }
    } catch (err) {
      console.error('Error loading existing requests:', err);
    }
  }, [selectedEmployee.id, selectedQuarter.id]);

  // Load colleagues and existing requests on component mount
  useEffect(() => {
    loadColleagues();
    loadExistingRequests();
  }, [loadColleagues, loadExistingRequests]);

  // Filter colleagues based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredColleagues(colleagues);
      setShowSuggestions(false);
    } else {
      const filtered = colleagues.filter(colleague =>
        (colleague.name && colleague.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (colleague.role && colleague.role.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (colleague.department && colleague.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (colleague.email && colleague.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredColleagues(filtered);
      setShowSuggestions(true);
    }
    setHighlightedIndex(-1);
  }, [searchTerm, colleagues]);

  const handleColleagueToggle = (colleague) => {
    setSelectedColleagues(prev => {
      const isSelected = prev.find(c => c.employeeId === colleague.employeeId);
      if (isSelected) {
        return prev.filter(c => c.employeeId !== colleague.employeeId);
      } else {
        return [...prev, colleague];
      }
    });
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredColleagues.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredColleagues.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredColleagues.length) {
          handleColleagueToggle(filteredColleagues[highlightedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        break;
      default:
        break;
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchFocus = () => {
    if (searchTerm.trim() !== '') {
      setShowSuggestions(true);
    }
  };

  const handleSearchBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      setShowSuggestions(false);
      setHighlightedIndex(-1);
    }, 200);
  };

  const handleSendRequests = async () => {
    if (selectedColleagues.length === 0) {
      alert('Please select at least one colleague to request feedback from.');
      return;
    }

    setSaving(true);
    try {
      // Prepare email requests
      const emailRequests = selectedColleagues.map(colleague => ({
        toEmail: colleague.email || colleague.employeeEmail,
        toName: colleague.name,
        fromName: selectedEmployee.name,
        fromEmail: selectedEmployee.email || selectedEmployee.employeeEmail,
        quarterName: selectedQuarter.name,
        quarterYear: selectedQuarter.year,
        message: feedbackMessage,
        feedbackUrl: `${window.location.origin}/feedback/${selectedEmployee.id}/${selectedQuarter.id}`
      }));

      // Send emails to all selected colleagues
      console.log('Sending feedback request emails...');
      const emailResults = await emailService.sendBulkFeedbackRequests(emailRequests);
      
      // Check email sending results
      const successfulEmails = emailResults.filter(result => result.success);
      const failedEmails = emailResults.filter(result => !result.success);
      
      console.log('Email sending results:', {
        successful: successfulEmails.length,
        failed: failedEmails.length,
        results: emailResults
      });

      // Prepare request data with email status
      const requestData = {
        requests: selectedColleagues.map((colleague, index) => ({
          colleagueId: colleague.employeeId,
          colleagueName: colleague.name,
          colleagueEmail: colleague.email || colleague.employeeEmail,
          status: emailResults[index]?.success ? 'sent' : 'failed',
          requestedAt: new Date().toISOString(),
          emailStatus: emailResults[index]?.status || 'unknown',
          emailError: emailResults[index]?.error || null
        })),
        selectedColleagues: selectedColleagues,
        message: feedbackMessage,
        employeeId: selectedEmployee.id,
        employeeName: selectedEmployee.name,
        quarterId: selectedQuarter.id,
        quarterName: selectedQuarter.name,
        quarterYear: selectedQuarter.year,
        createdAt: new Date().toISOString(),
        status: successfulEmails.length > 0 ? 'in_progress' : 'failed',
        emailResults: emailResults
      };

      // Check if record already exists
      const existingRecord = await performanceService.getPerformanceRecordByType(
        selectedEmployee.id,
        selectedQuarter.id,
        'request_feedback'
      );

      if (existingRecord) {
        // Update existing record
        await performanceService.updatePerformanceRecord(existingRecord.id, {
          data: JSON.stringify(requestData),
          status: requestData.status
        });
      } else {
        // Create new record
        await performanceService.createPerformanceRecord({
          employeeId: selectedEmployee.id,
          quarterId: selectedQuarter.id,
          type: 'request_feedback',
          status: requestData.status,
          data: JSON.stringify(requestData)
        });
      }

      setExistingRequests(requestData.requests);
      setSuccess(true);
      
      setTimeout(() => {
        setSuccess(false);
      }, 5000);

      // Show detailed results
      if (successfulEmails.length === selectedColleagues.length) {
        alert(`✅ All feedback requests sent successfully to ${selectedColleagues.length} colleague(s) for ${selectedQuarter.name} ${selectedQuarter.year}!`);
      } else if (successfulEmails.length > 0) {
        alert(`⚠️ Feedback requests sent to ${successfulEmails.length} out of ${selectedColleagues.length} colleagues. ${failedEmails.length} emails failed to send.`);
      } else {
        alert(`❌ Failed to send feedback requests. Please check your email configuration and try again.`);
      }
      
    } catch (err) {
      setError(err.message);
      console.error('Error sending feedback requests:', err);
      alert('Error sending feedback requests. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'sent':
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'sent':
        return 'Email Sent';
      case 'in_progress':
        return 'In Progress';
      case 'failed':
        return 'Failed';
      default:
        return 'Pending';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'sent':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
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
                title="Back to Performance Management"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Request Feedback</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {selectedQuarter.name} {selectedQuarter.year}
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">Employee:</span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {selectedEmployee.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl text-green-600 mb-4">
            Request Feedback
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select colleagues from whom you'd like to request feedback for {selectedQuarter.name} {selectedQuarter.year}. 
            They will be notified about your feedback request.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">Error: {error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <p className="text-green-800">Feedback requests sent successfully!</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <span className="ml-3 text-gray-600">Loading colleagues...</span>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Colleague Selection */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-6">
                <User className="w-6 h-6 text-green-600 mr-2" />
                <h3 className="text-xl font-semibold text-gray-900">Select Colleagues</h3>
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-4">
                  Search and select colleagues from whom you'd like to request feedback. You can select multiple colleagues.
                </p>
                
                {/* Search Input */}
                <div className="relative mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      onFocus={handleSearchFocus}
                      onBlur={handleSearchBlur}
                      onKeyDown={handleKeyDown}
                      placeholder="Search colleagues by name, role, department, or email..."
                      className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setShowSuggestions(false);
                          setHighlightedIndex(-1);
                        }}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  
                  {/* Suggestions Dropdown */}
                  {showSuggestions && filteredColleagues.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredColleagues.map((colleague, index) => {
                        const isSelected = selectedColleagues.find(c => c.employeeId === colleague.employeeId);
                        return (
                          <div
                            key={colleague.employeeId}
                            onClick={() => handleColleagueToggle(colleague)}
                            className={`p-3 cursor-pointer transition-colors duration-150 ${
                              index === highlightedIndex
                                ? 'bg-green-50 border-l-4 border-green-500'
                                : 'hover:bg-gray-50'
                            } ${index === 0 ? 'rounded-t-lg' : ''} ${index === filteredColleagues.length - 1 ? 'rounded-b-lg' : ''}`}
                          >
                            <div className="flex items-center">
                              <div className={`w-4 h-4 rounded border-2 mr-3 ${
                                isSelected
                                  ? 'bg-green-500 border-green-500'
                                  : 'border-gray-300'
                              }`}>
                                {isSelected && (
                                  <CheckCircle className="w-3 h-3 text-white" />
                                )}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">{colleague.name || 'Unknown Name'}</h4>
                                <p className="text-sm text-gray-600">{colleague.role || 'No Role'}</p>
                                <p className="text-xs text-gray-500">{colleague.department || 'No Department'}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  
                  {/* No Results Message */}
                  {showSuggestions && filteredColleagues.length === 0 && searchTerm.trim() !== '' && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
                      <div className="text-center text-gray-500">
                        <Search className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p>No colleagues found matching "{searchTerm}"</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Selected Colleagues Display */}
                {selectedColleagues.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Colleagues ({selectedColleagues.length})</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedColleagues.map((colleague) => (
                        <div
                          key={colleague.employeeId}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 border border-green-200"
                        >
                          <span>{colleague.name || 'Unknown Name'}</span>
                          <button
                            onClick={() => handleColleagueToggle(colleague)}
                            className="ml-2 text-green-600 hover:text-green-800"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {colleagues.length === 0 && (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Colleagues Available</h3>
                  <p className="text-gray-600">
                    There are no other employees in the system to request feedback from.
                  </p>
                </div>
              )}
            </div>

            {/* Feedback Message */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <MessageSquare className="w-6 h-6 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Feedback Request Message</h3>
              </div>
              
              <div className="mb-4">
                <label htmlFor="feedback-message" className="block text-sm font-medium text-gray-700 mb-2">
                  Personal Message (Optional)
                </label>
                <textarea
                  id="feedback-message"
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Add a personal message to your feedback request (optional)..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  This message will be included with your feedback request to help colleagues understand what specific areas you'd like feedback on.
                </p>
              </div>
            </div>

            {/* Existing Requests */}
            {existingRequests.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <Clock className="w-6 h-6 text-purple-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Previous Feedback Requests</h3>
                </div>
                
                <div className="space-y-3">
                  {existingRequests.map((request, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <User className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <h4 className="font-medium text-gray-900">{request.colleagueName || 'Unknown Name'}</h4>
                          <p className="text-sm text-gray-600">{request.colleagueEmail || 'No Email'}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(request.status)}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                          {getStatusText(request.status)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {colleagues.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      {selectedColleagues.length} colleague(s) selected
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={handleSendRequests}
                      disabled={saving || selectedColleagues.length === 0}
                      className="inline-flex items-center px-6 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {saving ? 'Sending...' : 'Send Feedback Requests'}
                    </button>
                  </div>
                </div>
                {selectedColleagues.length === 0 && (
                  <p className="text-sm text-red-600 mt-2">
                    Please select at least one colleague to send feedback requests.
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default RequestFeedback;
