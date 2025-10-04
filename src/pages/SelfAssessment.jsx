import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, CheckCircle, Clock, AlertCircle, FileText, BarChart3 } from 'lucide-react';
import qualitativeQuestionsService from '../services/qualitativeQuestionsService';
import quantitativeQuestionsService from '../services/quantitativeQuestionsService';
import performanceService from '../services/performanceService';
import openaiService from '../services/openaiService';

const SelfAssessment = ({ onBack, selectedEmployee, selectedQuarter }) => {
  const [qualitativeQuestions, setQualitativeQuestions] = useState([]);
  const [quantitativeQuestions, setQuantitativeQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [aiSummary, setAiSummary] = useState(null);
  const [openaiConfigured, setOpenaiConfigured] = useState(false);
  const [assessmentCompleted, setAssessmentCompleted] = useState(false);

  // Check if OpenAI is configured
  const checkOpenAIConfiguration = () => {
    setOpenaiConfigured(openaiService.isConfigured());
  };

  // Helper function to check if an answer is user-provided (not AI-generated)
  const isUserProvidedAnswer = (answerKey, answerValue) => {
    // Handle different data types
    if (answerValue === null || answerValue === undefined) {
      return false;
    }
    
    // Convert to string for processing
    const stringValue = String(answerValue);
    
    if (!stringValue || stringValue.trim() === '') {
      return false;
    }
    
    if (answerKey.startsWith('qualitative_')) {
      const aiPatterns = [
        'Based on your quantitative assessments',
        'Your assessment shows',
        'You demonstrate strong',
        'Consider taking on',
        'Focus on developing',
        'Your highest score',
        'Your lowest score',
        'average score of'
      ];
      
      const isLikelyAI = aiPatterns.some(pattern => 
        stringValue.toLowerCase().includes(pattern.toLowerCase())
      );
      
      if (isLikelyAI && stringValue.length > 200) {
        return false;
      }
    }
    
    return true;
  };

  const getProgress = () => {
    if (!qualitativeQuestions || !quantitativeQuestions || !answers) return 0;
    const totalQuestions = qualitativeQuestions.length + quantitativeQuestions.length;
    const userAnsweredQuestions = Object.entries(answers).filter(([key, value]) => 
      isUserProvidedAnswer(key, value)
    ).length;
    return totalQuestions > 0 ? Math.round((userAnsweredQuestions / totalQuestions) * 100) : 0;
  };

  const isAllAnswered = () => {
    if (!qualitativeQuestions || !quantitativeQuestions || !answers) return false;
    const totalQuestions = qualitativeQuestions.length + quantitativeQuestions.length;
    const userAnsweredQuestions = Object.entries(answers).filter(([key, value]) => 
      isUserProvidedAnswer(key, value)
    ).length;
    return userAnsweredQuestions >= totalQuestions;
  };

  const getAnsweredCount = () => {
    if (!answers) return 0;
    return Object.entries(answers).filter(([key, value]) => 
      isUserProvidedAnswer(key, value)
    ).length;
  };

  const getTotalCount = () => {
    if (!qualitativeQuestions || !quantitativeQuestions) return 0;
    return qualitativeQuestions.length + quantitativeQuestions.length;
  };

  const loadQuestionsAndAnswers = async () => {
    setLoading(true);
    setError(null);
    try {
      const [qualitativeData, quantitativeData] = await Promise.all([
        qualitativeQuestionsService.getAllQuestions(),
        quantitativeQuestionsService.getAllQuestions()
      ]);

      setQualitativeQuestions(qualitativeData);
      setQuantitativeQuestions(quantitativeData);

      // Debug: Check all performance records for this employee and quarter
      const allRecords = await performanceService.getPerformanceRecords(
        selectedEmployee.id,
        selectedQuarter.id
      );
      console.log('All performance records for employee/quarter:', allRecords);

      const existingRecord = await performanceService.getPerformanceRecordByType(
        selectedEmployee.id,
        selectedQuarter.id,
        'self_assessment'
      );

      console.log('Existing record found:', existingRecord);
      console.log('Employee ID:', selectedEmployee.id);
      console.log('Quarter ID:', selectedQuarter.id);

      if (existingRecord) {
        console.log('Record status:', existingRecord.status);
        console.log('Record data:', existingRecord.data);
      }

      if (existingRecord && existingRecord.data) {
        const existingData = JSON.parse(existingRecord.data);
        console.log('Loading existing assessment data:', existingData);
        
        // Extract answers from the data object
        if (existingData.answers) {
          setAnswers(existingData.answers);
          console.log('Loaded answers from answers property:', existingData.answers);
        } else if (existingData && typeof existingData === 'object') {
          // Fallback: if the data is directly the answers object
          const directAnswers = {};
          Object.keys(existingData).forEach(key => {
            if (key.startsWith('qualitative_') || key.startsWith('quantitative_')) {
              directAnswers[key] = existingData[key];
            }
          });
          if (Object.keys(directAnswers).length > 0) {
            setAnswers(directAnswers);
            console.log('Loaded answers from direct data:', directAnswers);
          }
        }
        
        setSubmitted(existingRecord.status === 'completed');
        setAssessmentCompleted(existingRecord.status === 'completed');
        
        // Set AI summary if it exists
        if (existingData.summary) {
          setAiSummary(existingData.summary);
        }
      }
    } catch (err) {
      setError(err.message);
      console.error('Error loading questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, type, value) => {
    setAnswers(prev => {
      const newAnswers = {
        ...prev,
        [`${type}_${questionId}`]: value
      };
      
      setTimeout(() => {
        autoSave(newAnswers);
      }, 2000);
      
      return newAnswers;
    });
  };

  const autoSave = async (currentAnswers) => {
    if (Object.keys(currentAnswers).length === 0) return;
    
    setAutoSaving(true);
    try {
      const answerData = {
        answers: currentAnswers,
        employeeId: selectedEmployee.id,
        employeeName: selectedEmployee.name,
        quarterId: selectedQuarter.id,
        quarterName: selectedQuarter.name,
        quarterYear: selectedQuarter.year,
        lastUpdatedAt: new Date().toISOString(),
        status: 'in_progress',
        autoSaved: true
      };

      const existingRecord = await performanceService.getPerformanceRecordByType(
        selectedEmployee.id,
        selectedQuarter.id,
        'self_assessment'
      );

      if (existingRecord) {
        await performanceService.updatePerformanceRecord(existingRecord.id, {
          data: JSON.stringify(answerData),
          status: 'in_progress'
        });
      } else {
        await performanceService.createPerformanceRecord({
          employeeId: selectedEmployee.id,
          quarterId: selectedQuarter.id,
          type: 'self_assessment',
          status: 'in_progress',
          data: JSON.stringify(answerData)
        });
      }
      
      setLastSaved(new Date());
    } catch (err) {
      console.error('Error auto-saving:', err);
    } finally {
      setAutoSaving(false);
    }
  };

  const handleSave = async (status = 'in_progress') => {
    setSaving(true);
    try {
      const answerData = {
        answers: answers,
        employeeId: selectedEmployee.id,
        employeeName: selectedEmployee.name,
        quarterId: selectedQuarter.id,
        quarterName: selectedQuarter.name,
        quarterYear: selectedQuarter.year,
        createdAt: new Date().toISOString(),
        submittedAt: status === 'completed' ? new Date().toISOString() : null,
        lastUpdatedAt: new Date().toISOString(),
        status: status,
        totalQuestions: getTotalCount(),
        answeredQuestions: getAnsweredCount(),
        completionPercentage: getProgress(),
        qualitativeQuestionsCount: qualitativeQuestions.length,
        quantitativeQuestionsCount: quantitativeQuestions.length,
        qualitativeAnswersCount: Object.keys(answers).filter(key => key.startsWith('qualitative_')).length,
        quantitativeAnswersCount: Object.keys(answers).filter(key => key.startsWith('quantitative_')).length,
        sessionId: `self_assessment_${selectedEmployee.id}_${selectedQuarter.id}_${Date.now()}`,
        version: '1.0'
      };

      const existingRecord = await performanceService.getPerformanceRecordByType(
        selectedEmployee.id,
        selectedQuarter.id,
        'self_assessment'
      );

      if (existingRecord) {
        await performanceService.updatePerformanceRecord(existingRecord.id, {
          data: JSON.stringify(answerData),
          status: status
        });
      } else {
        await performanceService.createPerformanceRecord({
          employeeId: selectedEmployee.id,
          quarterId: selectedQuarter.id,
          type: 'self_assessment',
          status: status,
          data: JSON.stringify(answerData)
        });
      }

      if (status === 'completed') {
        setSubmitted(true);
        setAssessmentCompleted(true);
      }

      const message = status === 'completed' 
        ? `Self Assessment submitted successfully!\n\nEmployee: ${selectedEmployee.name}\nQuarter: ${selectedQuarter.name} ${selectedQuarter.year}\nQuestions Answered: ${getAnsweredCount()}/${getTotalCount()}\nCompletion: ${getProgress()}%`
        : `Self Assessment saved as draft!\n\nProgress: ${getAnsweredCount()}/${getTotalCount()} questions answered (${getProgress()}%)`;
      
      alert(message);
    } catch (err) {
      setError(err.message);
      console.error('Error saving self assessment:', err);
      alert(`Error saving self assessment: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const generateAIFeedback = async () => {
    setGeneratingAI(true);
    try {
      const quantitativeAnswers = {};
      quantitativeQuestions.forEach(question => {
        const answerKey = `quantitative_${question.id}`;
        if (answers[answerKey]) {
          quantitativeAnswers[question.id] = {
            question: question.question,
            answer: answers[answerKey],
            scale: question.scale
          };
        }
      });

      if (Object.keys(quantitativeAnswers).length === 0) {
        alert('Please answer some quantitative questions first to generate AI feedback.');
        return;
      }

      let aiGeneratedFeedback = {};
      let summary = '';

      if (openaiConfigured) {
        const aiResponse = await openaiService.generateFeedback(
          quantitativeAnswers,
          qualitativeQuestions,
          selectedEmployee.name,
          selectedQuarter
        );
        
        aiGeneratedFeedback = aiResponse.feedback;
        summary = aiResponse.summary;
        setAiSummary(summary);
      } else {
        qualitativeQuestions.forEach(qualQuestion => {
          const feedback = generateFeedbackForQuestion(qualQuestion, quantitativeAnswers);
          aiGeneratedFeedback[`qualitative_${qualQuestion.id}`] = feedback;
        });
        summary = 'AI-generated feedback based on your quantitative responses.';
        setAiSummary(summary);
      }

      setAnswers(prev => {
        const updatedAnswers = {
          ...prev,
          ...aiGeneratedFeedback
        };
        
        setTimeout(() => {
          autoSave(updatedAnswers);
        }, 1000);
        
        return updatedAnswers;
      });

      const message = openaiConfigured 
        ? `OpenAI-powered feedback generated for ${Object.keys(aiGeneratedFeedback).length} qualitative questions!\n\n${summary}`
        : `AI feedback generated for ${Object.keys(aiGeneratedFeedback).length} qualitative questions based on your quantitative responses!\n\nNote: For more detailed feedback, configure OpenAI API key.`;
      
      alert(message);
      
    } catch (err) {
      console.error('Error generating AI feedback:', err);
      alert('Error generating AI feedback. Please try again.');
    } finally {
      setGeneratingAI(false);
    }
  };

  const generateFeedbackForQuestion = (qualQuestion, quantitativeAnswers) => {
    const questionText = qualQuestion.question.toLowerCase();
    const scores = Object.values(quantitativeAnswers).map(q => parseInt(q.answer));
    const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);

    if (questionText.includes('leadership') || questionText.includes('lead')) {
      return generateLeadershipFeedback(averageScore, maxScore, minScore, quantitativeAnswers);
    } else if (questionText.includes('communication') || questionText.includes('communicate')) {
      return generateCommunicationFeedback(averageScore, maxScore, minScore, quantitativeAnswers);
    } else if (questionText.includes('teamwork') || questionText.includes('team') || questionText.includes('collaboration')) {
      return generateTeamworkFeedback(averageScore, maxScore, minScore, quantitativeAnswers);
    } else if (questionText.includes('strength') || questionText.includes('strong')) {
      return generateStrengthsFeedback(averageScore, maxScore, minScore, quantitativeAnswers);
    } else if (questionText.includes('improvement') || questionText.includes('develop') || questionText.includes('growth')) {
      return generateImprovementFeedback(averageScore, maxScore, minScore, quantitativeAnswers);
    } else {
      return generateGeneralFeedback(averageScore, maxScore, minScore, quantitativeAnswers);
    }
  };

  const generateLeadershipFeedback = (avg, max, min, answers) => {
    if (avg >= 4) {
      return `Based on your quantitative assessments, you demonstrate strong leadership capabilities with an average score of ${avg.toFixed(1)}. Your high performance across multiple areas (highest score: ${max}) indicates excellent leadership potential. You show consistency in your approach and have the ability to guide and inspire others effectively. Consider taking on more leadership responsibilities to further develop these skills.`;
    } else if (avg >= 3) {
      return `Your leadership assessment shows solid foundational skills with an average score of ${avg.toFixed(1)}. You have good leadership potential with room for growth. Your highest score of ${max} indicates areas where you excel. Focus on developing your weaker areas (lowest score: ${min}) to become a more well-rounded leader. Consider seeking mentorship or leadership training opportunities.`;
    } else {
      return `Your leadership assessment indicates areas for development with an average score of ${avg.toFixed(1)}. While you may not currently see yourself as a strong leader, there are opportunities for growth. Your highest score of ${max} shows you have some leadership strengths to build upon. Consider starting with smaller leadership opportunities and gradually expanding your responsibilities as you gain confidence.`;
    }
  };

  const generateCommunicationFeedback = (avg, max, min, answers) => {
    if (avg >= 4) {
      return `Your communication skills are excellent with an average score of ${avg.toFixed(1)}. You demonstrate strong ability to convey ideas clearly and effectively. Your high performance (highest score: ${max}) suggests you excel in various communication contexts. Continue to leverage these strengths and consider mentoring others in communication best practices.`;
    } else if (avg >= 3) {
      return `You have good communication skills with an average score of ${avg.toFixed(1)}. There's solid foundation to build upon, with your highest score of ${max} indicating particular strengths. Focus on improving areas where you scored lower (lowest: ${min}) to become a more effective communicator. Practice active listening and seek feedback on your communication style.`;
    } else {
      return `Your communication assessment shows opportunities for improvement with an average score of ${avg.toFixed(1)}. While this may be an area of development, your highest score of ${max} indicates you have some communication strengths. Consider communication training, practice in different settings, and seeking regular feedback to enhance your skills.`;
    }
  };

  const generateTeamworkFeedback = (avg, max, min, answers) => {
    if (avg >= 4) {
      return `You excel in teamwork and collaboration with an average score of ${avg.toFixed(1)}. Your high performance (highest score: ${max}) demonstrates strong collaborative skills and ability to work effectively with others. You likely contribute positively to team dynamics and help create productive working environments. Consider taking on team leadership roles or mentoring new team members.`;
    } else if (avg >= 3) {
      return `You have solid teamwork skills with an average score of ${avg.toFixed(1)}. You work well with others and contribute to team success. Your highest score of ${max} shows particular strengths in collaboration. Focus on developing areas where you scored lower (lowest: ${min}) to become an even more effective team member. Consider seeking opportunities to lead team projects.`;
    } else {
      return `Your teamwork assessment indicates areas for development with an average score of ${avg.toFixed(1)}. While collaboration may be challenging, your highest score of ${max} shows you have some teamwork strengths. Focus on building relationships, improving communication within teams, and seeking opportunities to contribute more actively to group projects.`;
    }
  };

  const generateStrengthsFeedback = (avg, max, min, answers) => {
    const strengths = [];
    Object.entries(answers).forEach(([key, data]) => {
      if (parseInt(data.answer) >= 4) {
        strengths.push(data.question);
      }
    });

    if (strengths.length > 0) {
      return `Based on your quantitative assessments, your key strengths include: ${strengths.slice(0, 3).join(', ')}. You demonstrate strong performance in these areas with scores of 4 or higher. Your average score of ${avg.toFixed(1)} indicates overall solid performance. Continue to leverage these strengths while working on areas for improvement. Consider how these strengths can be applied to new challenges and opportunities.`;
    } else {
      return `Your assessment shows consistent performance across different areas with an average score of ${avg.toFixed(1)}. While you may not have standout strengths in any particular area, you demonstrate reliability and competence. Your highest score of ${max} indicates your strongest area. Focus on developing this area further to create a more distinctive strength profile.`;
    }
  };

  const generateImprovementFeedback = (avg, max, min, answers) => {
    const improvementAreas = [];
    Object.entries(answers).forEach(([key, data]) => {
      if (parseInt(data.answer) <= 3) {
        improvementAreas.push(data.question);
      }
    });

    if (improvementAreas.length > 0) {
      return `Based on your quantitative assessments, areas for improvement include: ${improvementAreas.slice(0, 3).join(', ')}. These areas scored 3 or lower, indicating opportunities for development. Your average score of ${avg.toFixed(1)} suggests overall good performance with specific areas to focus on. Create a development plan targeting these areas and seek feedback and training to improve.`;
    } else {
      return `Your assessment shows strong performance across all areas with an average score of ${avg.toFixed(1)}. While you're performing well, consider setting stretch goals to continue your development. Your lowest score of ${min} could be an area to focus on for even greater excellence. Look for opportunities to take on new challenges that will push your boundaries.`;
    }
  };

  const generateGeneralFeedback = (avg, max, min, answers) => {
    if (avg >= 4) {
      return `Your overall performance is excellent with an average score of ${avg.toFixed(1)}. You demonstrate strong capabilities across multiple areas, with your highest score of ${max} indicating particular excellence. You show consistency and reliability in your work. Continue to build on these strengths and consider taking on more challenging responsibilities.`;
    } else if (avg >= 3) {
      return `You show solid performance with an average score of ${avg.toFixed(1)}. You have a good foundation with room for growth. Your highest score of ${max} indicates areas where you excel, while your lowest score of ${min} suggests areas for development. Focus on leveraging your strengths while working to improve weaker areas.`;
    } else {
      return `Your assessment indicates opportunities for development with an average score of ${avg.toFixed(1)}. While there are areas for improvement, your highest score of ${max} shows you have strengths to build upon. Create a development plan focusing on your lowest scoring areas (lowest: ${min}) and seek support and training to enhance your performance.`;
    }
  };

  // Load questions and existing answers on component mount
  useEffect(() => {
    loadQuestionsAndAnswers();
    checkOpenAIConfiguration();
  }, [selectedEmployee, selectedQuarter]);

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
              <h1 className="text-xl font-semibold text-gray-900">Self Assessment</h1>
              {assessmentCompleted && (
                <div className="ml-4 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-green-600">Completed</span>
                </div>
              )}
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

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <div className="flex items-center space-x-4">
              {autoSaving && (
                <div className="flex items-center text-sm text-blue-600">
                  <div className="animate-spin rounded-full h-3 w-3 border-b border-blue-600 mr-1"></div>
                  Auto-saving...
                </div>
              )}
              {lastSaved && !autoSaving && (
                <span className="text-sm text-green-600">
                  Last saved: {lastSaved.toLocaleTimeString()}
                </span>
              )}
              <span className="text-sm text-gray-500">
                {loading ? 'Loading...' : `${getAnsweredCount()}/${getTotalCount()} answered (${getProgress()}%)`}
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgress()}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Completion Banner */}
      {assessmentCompleted && (
        <div className="bg-green-50 border-b border-green-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-green-800">
                  Assessment Completed
                </h3>
                <p className="text-sm text-green-700 mt-1">
                  Your self-assessment for {selectedQuarter.name} {selectedQuarter.year} has been submitted and completed. 
                  You can view your responses below, but they cannot be modified.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl text-blue-600 mb-4">
            Self Assessment
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Please complete your self-assessment for {selectedQuarter.name} {selectedQuarter.year}. 
            Take your time to provide thoughtful and honest responses.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">Error: {error}</p>
          </div>
        )}

        {/* Submitted Status */}
        {submitted && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <p className="text-green-800">Your self-assessment has been submitted successfully!</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading questions...</span>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Quantitative Questions Section */}
            {quantitativeQuestions.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-6">
                  <BarChart3 className="w-6 h-6 text-green-600 mr-2" />
                  <h3 className="text-xl font-semibold text-gray-900">Quantitative Questions</h3>
                </div>
                <div className="space-y-6">
                  {quantitativeQuestions.map((question, index) => (
                    <div key={question.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Question {index + 1}
                        </label>
                        <p className="text-gray-900 font-medium">{question.question}</p>
                        <p className="text-sm text-gray-500 mt-1">Rating Scale: {question.scale}</p>
                      </div>
                      <div>
                        {question.scale === '1-5' && (
                          <div className="flex items-center space-x-4">
                            {[1, 2, 3, 4, 5].map(rating => (
                              <label key={rating} className="flex items-center">
                                <input
                                  type="radio"
                                  name={`quantitative_${question.id}`}
                                  value={rating}
                                  checked={answers[`quantitative_${question.id}`] === rating.toString()}
                                  onChange={(e) => handleAnswerChange(question.id, 'quantitative', e.target.value)}
                                  className="mr-2"
                                  disabled={assessmentCompleted}
                                />
                                <span className="text-sm text-gray-700">{rating}</span>
                              </label>
                            ))}
                            <div className="text-xs text-gray-500 ml-4">
                              (1 = Poor, 2 = Below Average, 3 = Average, 4 = Good, 5 = Excellent)
                            </div>
                          </div>
                        )}
                        {question.scale === '1-10' && (
                          <div className="flex items-center space-x-2">
                            <input
                              type="range"
                              min="1"
                              max="10"
                              value={answers[`quantitative_${question.id}`] || 5}
                              onChange={(e) => handleAnswerChange(question.id, 'quantitative', e.target.value)}
                              className="flex-1"
                              disabled={assessmentCompleted}
                            />
                            <span className="text-sm font-medium text-gray-700 min-w-[2rem]">
                              {answers[`quantitative_${question.id}`] || 5}
                            </span>
                          </div>
                        )}
                        {question.scale === '0-100' && (
                          <div className="flex items-center space-x-2">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={answers[`quantitative_${question.id}`] || 50}
                              onChange={(e) => handleAnswerChange(question.id, 'quantitative', e.target.value)}
                              className="flex-1"
                              disabled={assessmentCompleted}
                            />
                            <span className="text-sm font-medium text-gray-700 min-w-[3rem]">
                              {answers[`quantitative_${question.id}`] || 50}%
                            </span>
                          </div>
                        )}
                        {question.scale === 'Percentage' && (
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={answers[`quantitative_${question.id}`] || ''}
                              onChange={(e) => handleAnswerChange(question.id, 'quantitative', e.target.value)}
                              className={`w-20 px-3 py-2 border rounded-md ${
                                assessmentCompleted 
                                  ? 'bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed' 
                                  : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                              }`}
                              placeholder="0-100"
                              disabled={assessmentCompleted}
                            />
                            <span className="text-sm text-gray-700">%</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Generated Feedback Button */}
            {quantitativeQuestions.length > 0 && qualitativeQuestions.length > 0 && (
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg shadow-sm p-6 border border-purple-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-bold text-lg">AI</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">AI Generated Feedback</h3>
                      <p className="text-sm text-gray-600">
                        {openaiConfigured 
                          ? 'Generate detailed, personalized feedback using OpenAI GPT'
                          : 'Generate personalized qualitative feedback based on your quantitative responses'
                        }
                      </p>
                      {openaiConfigured && (
                        <div className="flex items-center mt-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-xs text-green-600 font-medium">OpenAI Connected</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={generateAIFeedback}
                    disabled={generatingAI || assessmentCompleted || !answers || Object.keys(answers).filter(key => key.startsWith('quantitative_')).length === 0}
                    className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {generatingAI ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Generate AI Feedback
                      </>
                    )}
                  </button>
                </div>
                {Object.keys(answers).filter(key => key.startsWith('quantitative_')).length === 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    Answer some quantitative questions first to enable AI feedback generation.
                  </p>
                )}
              </div>
            )}

            {/* AI Summary Section */}
            {aiSummary && (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow-sm p-6 border border-green-200">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mr-3">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">AI Assessment Summary</h3>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-100">
                  <p className="text-gray-700 leading-relaxed">{aiSummary}</p>
                </div>
              </div>
            )}

            {/* Qualitative Questions Section */}
            {qualitativeQuestions.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-6">
                  <FileText className="w-6 h-6 text-blue-600 mr-2" />
                  <h3 className="text-xl font-semibold text-gray-900">Qualitative Questions</h3>
                </div>
                <div className="space-y-6">
                  {qualitativeQuestions.map((question, index) => (
                    <div key={question.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Question {index + 1}
                        </label>
                        <p className="text-gray-900 font-medium">{question.question}</p>
                      </div>
                      <div>
                        <textarea
                          value={answers[`qualitative_${question.id}`] || ''}
                          onChange={(e) => handleAnswerChange(question.id, 'qualitative', e.target.value)}
                          rows={4}
                          className={`w-full px-3 py-2 border rounded-md ${
                            assessmentCompleted 
                              ? 'bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed' 
                              : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                          }`}
                          placeholder="Please provide your detailed response..."
                          disabled={assessmentCompleted}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Questions Message */}
            {qualitativeQuestions.length === 0 && quantitativeQuestions.length === 0 && (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Questions Available</h3>
                <p className="text-gray-600">
                  There are no questions configured for self-assessment yet. Please contact your administrator.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            {!assessmentCompleted && (qualitativeQuestions.length > 0 || quantitativeQuestions.length > 0) && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleSave('in_progress')}
                      disabled={saving}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      {saving ? 'Saving...' : 'Save Draft'}
                    </button>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      {loading ? 'Loading...' : `${getAnsweredCount()} of ${getTotalCount()} answered`}
                    </span>
                    <button
                      onClick={() => handleSave('completed')}
                      disabled={saving || !isAllAnswered()}
                      className="inline-flex items-center px-6 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {saving ? 'Submitting...' : 'Submit Assessment'}
                    </button>
                  </div>
                </div>
                {!isAllAnswered() && (
                  <p className="text-sm text-red-600 mt-2">
                    Please answer all questions before submitting. ({getTotalCount() - getAnsweredCount()} remaining)
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

export default SelfAssessment;