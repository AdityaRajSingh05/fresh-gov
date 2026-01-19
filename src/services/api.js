import axios from 'axios';

// Based on your server.js, the prefix is /api/v1
const API_URL = 'http://localhost:3000/api/v1';

export const api = {
  // Datasets
  getDatasets: () => axios.get(`${API_URL}/datasets`),
  registerDataset: (data) => axios.post(`${API_URL}/datasets`, data),
  
  // Lineage
  getLineage: () => axios.get(`${API_URL}/lineage`),
  
  // Organization (for dropdowns)
  getDepartments: () => axios.get(`${API_URL}/organization_unit`),
  
  // Quality
  getQualityJobs: () => axios.get(`${API_URL}/quality_batch_job`),
};