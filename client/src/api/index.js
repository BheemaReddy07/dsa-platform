import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/api` : '/api',
});

export const getSolutions = (params) => api.get('/solutions', { params });
export const getSolution = (id) => api.get(`/solutions/${id}`);
export const createSolution = (data) => api.post('/solutions', data);
export const updateSolution = (id, data) => api.put(`/solutions/${id}`, data);
export const deleteSolution = (id) => api.delete(`/solutions/${id}`);
export const getStats = () => api.get('/solutions/meta/stats');
