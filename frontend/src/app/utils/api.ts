import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Helper for absolute URLs if needed elsewhere
export const getApiUrl = (path: string) => `${API_BASE_URL}${path}`;

export default api;
