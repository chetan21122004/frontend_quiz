// API client for the Express backend - ALL database operations go through this backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

console.info(`Frontend configured to use Express backend at: ${API_BASE_URL}`);

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET request
  async get(endpoint, params = {}) {
    const url = new URL(`${this.baseURL}${endpoint}`);
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });

    return this.request(url.pathname + url.search);
  }

  // POST request
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: data,
    });
  }

  // PUT request
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data,
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();

// API endpoints
export const API_ENDPOINTS = {
  // Health and setup
  HEALTH: '/health',
  SETUP_STATUS: '/api/setup/database-status',
  SETUP_SCHEMA: '/api/setup/sql-schema',
  TEST_CONNECTION: '/api/setup/test-connection',

  // Authentication
  TEACHER_REGISTER: '/api/auth/teacher/register',
  LOGIN: '/api/auth/login',
  STUDENT_LOGIN: '/api/auth/student/login',
  TEACHER_PROFILE: (id) => `/api/auth/teacher/${id}`,
  VERIFY_USER: (userType, id) => `/api/auth/verify/${userType}/${id}`,

  // MCQ Generation
  GENERATE_MCQS: '/api/mcq/generate',
  SAVE_MCQS: '/api/mcq/save',
  GET_TEST_MCQS: (testId) => `/api/mcq/test/${testId}`,

  // Test Management
  TESTS: '/api/test',
  TEST_BY_ID: (id) => `/api/test/${id}`,
  PUBLISH_TEST: (id) => `/api/test/${id}/publish`,
  TEST_SUBMISSIONS: '/api/test/submissions',
  TEST_SUBMISSION_DETAIL: (attemptId) => `/api/test/submissions/${attemptId}`,

  // Student
  STUDENT_PROFILE: (id) => `/api/student/${id}`,
  STUDENT_REGISTER: '/api/student/register',
  STUDENT_TESTS: (id) => `/api/student/${id}/tests`,
  STUDENT_TEST: (studentId, testId) => `/api/student/${studentId}/test/${testId}`,
  SUBMIT_TEST: '/api/student/submit-test',
  STUDENT_RESULTS: (id) => `/api/student/${id}/results`,
  STUDENT_RESULT: (studentId, attemptId) => `/api/student/${studentId}/result/${attemptId}`,

  // Insights
  GENERATE_INSIGHTS: '/api/insights/generate',
  STUDENT_INSIGHTS: (studentId) => `/api/insights/student/${studentId}`,
  ATTEMPT_INSIGHTS: (attemptId) => `/api/insights/attempt/${attemptId}`,
  CLASS_INSIGHTS: (className) => `/api/insights/class/${className}`,
};
