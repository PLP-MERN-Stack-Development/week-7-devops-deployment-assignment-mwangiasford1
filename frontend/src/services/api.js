import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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