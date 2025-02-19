
// // };
// // src/config/api.config.js
// import axios from 'axios';

// const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// export const apiClient = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   timeout: 10000,
// });

// export const api = {
//   movies: {
//     getAll: () => apiClient.get('/api/movies'),
//     getById: (id) => apiClient.get(`/api/movies/${id}`),
//     add: (movie) => apiClient.post('/api/movies/add-movie', movie),
//     update: (id, movie) => apiClient.put(`/api/movies/edit-movie/${id}`, movie),
//     delete: (id) => apiClient.delete(`/api/movies/delete-movie/${id}`)
//   },
//   actors: {
//     getAll: () => apiClient.get('/api/actors'),
//     add: (actor) => apiClient.post('/api/actors/add-actor', actor)
//   },
//   producers: {
//     getAll: () => apiClient.get('/api/producers'),
//     add: (producer) => apiClient.post('/api/producers/add-producer', producer)
//   }
// };
// src/config/api.config.js
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BACKEND_API || 'http://localhost:5000/api';

// Retry configuration
const RETRY_COUNT = 3;
const RETRY_DELAY = 1000; // 1 second
const TIMEOUT = 10000; // 10 seconds

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: TIMEOUT,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching
    config.params = {
      ...config.params,
      _t: Date.now()
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with retry logic
apiClient.interceptors.response.use(
  response => response,
  async error => {
    const { config } = error;
    
    // Skip retry for specific status codes
    if (error.response?.status === 401 || error.response?.status === 403) {
      return Promise.reject(error);
    }

    // Initialize retry count
    config.retryCount = config.retryCount || 0;

    if (config.retryCount < RETRY_COUNT) {
      config.retryCount += 1;

      // Exponential backoff
      const delay = RETRY_DELAY * Math.pow(2, config.retryCount - 1);
      
      // Wait for the specified delay
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Retry the request
      return apiClient(config);
    }

    return Promise.reject(error);
  }
);

export const api = {
  movies: {
    getAll: () => apiClient.get('/movies'),
    getById: (id) => apiClient.get(`/movies/${id}`),
    add: (movie) => apiClient.post('/movies/add-movie', movie),
    update: (id, movie) => apiClient.put(`/movies/edit-movie/${id}`, movie),
    delete: (id) => apiClient.delete(`/movies/delete-movie/${id}`)
  },
  actors: {
    getAll: () => apiClient.get('/actors'),
    add: (actor) => apiClient.post('/actors/add-actor', actor)
  },
  producers: {
    getAll: () => apiClient.get('/producers'),
    add: (producer) => apiClient.post('/producers/add-producer', producer)
  }
};

// Error handler helper
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    return {
      status: error.response.status,
      message: error.response.data.message || 'An error occurred',
      error: error.response.data
    };
  } else if (error.request) {
    // Request made but no response
    return {
      status: 0,
      message: 'No response from server',
      error: 'Network error'
    };
  } else {
    // Request setup error
    return {
      status: 0,
      message: 'Failed to make request',
      error: error.message
    };
  }
};
