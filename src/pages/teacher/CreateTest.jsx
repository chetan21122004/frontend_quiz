import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Save, 
  Eye, 
  Wand2, 
  Plus,
  Trash2,
  ArrowLeft
} from 'lucide-react';
import DashboardLayout from '../../components/ui/DashboardLayout';
import { apiClient, API_ENDPOINTS } from '../../lib/api/client';
import { useAuth } from '../../lib/AuthContext';

const CreateTest = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [testData, setTestData] = useState({
    title: '',
    subject: '',
    description: '',
    difficulty: 'Easy',
    duration: 60,
    class: '',
    questionCount: 5
  });

  const [generatedMCQs, setGeneratedMCQs] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTestData(prev => ({
      ...prev,
      [name]: name === 'duration' || name === 'questionCount' ? parseInt(value) || 0 : value
    }));
  };

  const generateMCQs = async () => {
    if (!testData.subject || !testData.difficulty) {
      setError('Please fill in subject and difficulty before generating MCQs');
      return;
    }

    setGenerating(true);
    setError('');

    try {
      const response = await apiClient.post(API_ENDPOINTS.GENERATE_MCQS, {
        topic: testData.subject,
        difficulty: testData.difficulty.toLowerCase(),
        noOfQue: testData.questionCount,
        testTitle: testData.title,
        teacherId: user?.id,
        class: testData.class
      });

      if (response.success) {
        setGeneratedMCQs(response.mcqs);
        setSuccess('MCQs generated successfully!');
      } else {
        setError('Failed to generate MCQs. Please try again.');
      }
    } catch (error) {
      console.error('Error generating MCQs:', error);
      setError('Failed to generate MCQs. Please check your connection and try again.');
    } finally {
      setGenerating(false);
    }
  };

  const saveTest = async () => {
    if (!testData.title || !testData.subject || generatedMCQs.length === 0) {
      setError('Please fill in all required fields and generate MCQs before saving');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const response = await apiClient.post(API_ENDPOINTS.SAVE_MCQS, {
        mcqs: generatedMCQs,
        teacherId: user?.id,
        testTitle: testData.title,
        topic: testData.subject,
        difficulty: testData.difficulty,
        className: testData.class
      });

      if (response.success) {
        setSuccess('Test saved successfully!');
        setTimeout(() => {
          navigate('/teacher/tests');
        }, 2000);
      } else {
        setError('Failed to save test. Please try again.');
      }
    } catch (error) {
      console.error('Error saving test:', error);
      setError('Failed to save test. Please check your connection and try again.');
    } finally {
      setSaving(false);
    }
  };

  const editMCQ = (index, field, value) => {
    const updatedMCQs = [...generatedMCQs];
    if (field === 'options') {
      updatedMCQs[index].options = value;
    } else {
      updatedMCQs[index][field] = value;
    }
    setGeneratedMCQs(updatedMCQs);
  };

  const removeMCQ = (index) => {
    const updatedMCQs = generatedMCQs.filter((_, i) => i !== index);
    setGeneratedMCQs(updatedMCQs);
    setTestData(prev => ({ ...prev, questionCount: updatedMCQs.length }));
  };

  return (
    <DashboardLayout title="Create Test">
      <div className="row">
        <div className="col">
          {/* Header */}
          <div className="d-flex align-items-center mb-4">
            <button 
              className="btn btn-outline-secondary me-3"
              onClick={() => navigate('/teacher/dashboard')}
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="h3 fw-bold mb-1">Create New Test</h1>
              <p className="text-muted mb-0">Generate AI-powered MCQs for your students</p>
            </div>
          </div>

          {/* Alerts */}
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          
          {success && (
            <div className="alert alert-success" role="alert">
              {success}
            </div>
          )}

          <div className="row">
            {/* Test Configuration */}
            <div className="col-lg-4 mb-4">
              <div className="card border-0 shadow-sm sticky-top" style={{ top: '20px' }}>
                <div className="card-header bg-white border-bottom-0">
                  <h5 className="card-title mb-0">Test Configuration</h5>
                </div>
                <div className="card-body">
                  <form>
                    <div className="mb-3">
                      <label htmlFor="title" className="form-label">Test Title *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="title"
                        name="title"
                        value={testData.title}
                        onChange={handleInputChange}
                        placeholder="e.g., JavaScript Fundamentals"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="subject" className="form-label">Subject *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="subject"
                        name="subject"
                        value={testData.subject}
                        onChange={handleInputChange}
                        placeholder="e.g., Programming, Mathematics"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="class" className="form-label">Class/Grade</label>
                      <input
                        type="text"
                        className="form-control"
                        id="class"
                        name="class"
                        value={testData.class}
                        onChange={handleInputChange}
                        placeholder="e.g., Grade 10, CS101"
                      />
                    </div>

                    <div className="row mb-3">
                      <div className="col-6">
                        <label htmlFor="difficulty" className="form-label">Difficulty</label>
                        <select
                          className="form-select"
                          id="difficulty"
                          name="difficulty"
                          value={testData.difficulty}
                          onChange={handleInputChange}
                        >
                          <option value="Easy">Easy</option>
                          <option value="Medium">Medium</option>
                          <option value="Hard">Hard</option>
                        </select>
                      </div>
                      <div className="col-6">
                        <label htmlFor="duration" className="form-label">Duration (min)</label>
                        <input
                          type="number"
                          className="form-control"
                          id="duration"
                          name="duration"
                          value={testData.duration}
                          onChange={handleInputChange}
                          min="1"
                          max="180"
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="questionCount" className="form-label">Number of Questions</label>
                      <input
                        type="number"
                        className="form-control"
                        id="questionCount"
                        name="questionCount"
                        value={testData.questionCount}
                        onChange={handleInputChange}
                        min="1"
                        max="50"
                      />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="description" className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        id="description"
                        name="description"
                        rows="3"
                        value={testData.description}
                        onChange={handleInputChange}
                        placeholder="Additional context for AI generation..."
                      />
                    </div>

                    <div className="d-grid gap-2">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={generateMCQs}
                        disabled={generating}
                      >
                        {generating ? (
                          <>
                            <div className="spinner-border spinner-border-sm me-2" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                            Generating...
                          </>
                        ) : (
                          <>
                            <Wand2 size={18} className="me-2" />
                            Generate MCQs
                          </>
                        )}
                      </button>

                      {generatedMCQs.length > 0 && (
                        <>
                          <button
                            type="button"
                            className="btn btn-success"
                            onClick={saveTest}
                            disabled={saving}
                          >
                            {saving ? (
                              <>
                                <div className="spinner-border spinner-border-sm me-2" role="status">
                                  <span className="visually-hidden">Loading...</span>
                                </div>
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save size={18} className="me-2" />
                                Save Test
                              </>
                            )}
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={() => {/* TODO: Implement preview */}}
                          >
                            <Eye size={18} className="me-2" />
                            Preview Test
                          </button>
                        </>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Generated MCQs */}
            <div className="col-lg-8">
              {generatedMCQs.length > 0 ? (
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-white border-bottom-0">
                    <h5 className="card-title mb-0">Generated Questions ({generatedMCQs.length})</h5>
                  </div>
                  <div className="card-body">
                    {generatedMCQs.map((mcq, index) => (
                      <div key={index} className="border rounded p-4 mb-4">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <h6 className="fw-bold">Question {index + 1}</h6>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => removeMCQ(index)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="mb-3">
                          <textarea
                            className="form-control"
                            rows="2"
                            value={mcq.question}
                            onChange={(e) => editMCQ(index, 'question', e.target.value)}
                          />
                        </div>

                        <div className="row mb-3">
                          {mcq.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="col-md-6 mb-2">
                              <div className="input-group">
                                <span className="input-group-text">
                                  {String.fromCharCode(65 + optionIndex)}
                                </span>
                                <input
                                  type="text"
                                  className={`form-control ${
                                    option === mcq.correctAnswer ? 'border-success' : ''
                                  }`}
                                  value={option}
                                  onChange={(e) => {
                                    const newOptions = [...mcq.options];
                                    newOptions[optionIndex] = e.target.value;
                                    editMCQ(index, 'options', newOptions);
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mb-3">
                          <label className="form-label small fw-bold">Correct Answer:</label>
                          <select
                            className="form-select form-select-sm"
                            value={mcq.correctAnswer}
                            onChange={(e) => editMCQ(index, 'correctAnswer', e.target.value)}
                          >
                            {mcq.options.map((option, optionIndex) => (
                              <option key={optionIndex} value={option}>
                                {String.fromCharCode(65 + optionIndex)}: {option}
                              </option>
                            ))}
                          </select>
                        </div>

                        {mcq.explanation && (
                          <div>
                            <label className="form-label small fw-bold">Explanation:</label>
                            <textarea
                              className="form-control form-control-sm"
                              rows="2"
                              value={mcq.explanation}
                              onChange={(e) => editMCQ(index, 'explanation', e.target.value)}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="card border-0 shadow-sm">
                  <div className="card-body text-center py-5">
                    <Wand2 size={48} className="text-muted mb-3" />
                    <h5 className="text-muted">No questions generated yet</h5>
                    <p className="text-muted">
                      Fill in the test configuration and click "Generate MCQs" to create questions using AI.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateTest;
