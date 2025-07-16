import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors (unauthorized) by redirecting to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid token
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login page or show login modal
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

// Items API
export const itemsAPI = {
  // Get all items
  getAll: () => api.get('/api/items'),
  
  // Get single item by ID
  getById: (id) => api.get(`/api/items/${id}`),
  
  // Create new item
  create: (itemData) => api.post('/api/items', itemData),
  
  // Update item
  update: (id, itemData) => api.put(`/api/items/${id}`, itemData),
  
  // Delete item
  delete: (id) => api.delete(`/api/items/${id}`),
};

// Health check
export const healthCheck = () => api.get('/health');

export default api; 