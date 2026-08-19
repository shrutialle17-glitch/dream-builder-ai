import api from '../lib/axios';

export const getProjects = async (params = {}) => {
  const { data } = await api.get('/projects', { params });
  return data; // { success, projects, total, page, limit }
};

export const getProject = async (id) => {
  const { data } = await api.get(`/projects/${id}`);
  return data.project;
};

export const createProject = async (projectData) => {
  const { data } = await api.post('/projects', projectData);
  return data.project;
};

export const updateProject = async (id, projectData) => {
  const { data } = await api.put(`/projects/${id}`, projectData);
  return data.project;
};

export const deleteProject = async (id) => {
  const { data } = await api.delete(`/projects/${id}`);
  return data;
};

export const getProjectOverview = async (id) => {
  const { data } = await api.get(`/projects/${id}/overview`);
  return data.data; // The backend returns { success: true, data: { ... } }
};

export const generateProjectOverview = async (id) => {
  const { data } = await api.post(`/projects/${id}/overview/generate`);
  return data.data;
};

export const getIdeaValidation = async (projectId) => {
  const { data } = await api.get(`/projects/${projectId}/validation`);
  return data.data;
};

export const generateIdeaValidation = async (projectId) => {
  const { data } = await api.post(`/projects/${projectId}/validation/generate`);
  return data.data;
};

export const regenerateIdeaValidation = async (projectId) => {
  const { data } = await api.post(`/projects/${projectId}/validation/regenerate`);
  return data.data;
};

export const askValidationQuestion = async (projectId, question) => {
  const { data } = await api.post(`/projects/${projectId}/validation/ask`, { question });
  return data.answer;
};

// Startup DNA
export const getStartupDNA = async (projectId) => {
  const { data } = await api.get(`/projects/${projectId}/startup-dna`);
  return data.data;
};

export const generateStartupDNA = async (projectId) => {
  const { data } = await api.post(`/projects/${projectId}/startup-dna/generate`);
  return data.data;
};

export const regenerateStartupDNA = async (projectId) => {
  const { data } = await api.post(`/projects/${projectId}/startup-dna/regenerate`);
  return data.data;
};

export const askDNAQuestion = async (projectId, question) => {
  const { data } = await api.post(`/projects/${projectId}/startup-dna/ask`, { question });
  return data.answer || data.data?.answer;
};

// Chat History
export const getChatHistory = async (projectId, moduleType) => {
  const { data } = await api.get(`/projects/${projectId}/chat/${moduleType}`);
  return data.data; // array of { id, role, content, createdAt }
};

export const clearChatHistory = async (projectId, moduleType) => {
  const { data } = await api.delete(`/projects/${projectId}/chat/${moduleType}`);
  return data;
};

// Business Plan
export const getBusinessPlan = async (projectId) => {
  const { data } = await api.get(`/projects/${projectId}/business-plan`);
  return data.data;
};

export const generateBusinessPlan = async (projectId) => {
  const { data } = await api.post(`/projects/${projectId}/business-plan/generate`);
  return data.data;
};

export const regenerateBusinessPlan = async (projectId) => {
  const { data } = await api.post(`/projects/${projectId}/business-plan/regenerate`);
  return data.data;
};

export const deleteBusinessPlan = async (projectId) => {
  const { data } = await api.delete(`/projects/${projectId}/business-plan`);
  return data.data;
};

export const askBusinessPlanQuestion = async (projectId, question) => {
  const { data } = await api.post(`/projects/${projectId}/business-plan/ask`, { question });
  return data.answer || data.data?.answer;
};

// MVP Planner
export const getMVPPlan = async (projectId) => {
  const { data } = await api.get(`/projects/${projectId}/mvp`);
  return data.data;
};

export const generateMVPPlan = async (projectId) => {
  const { data } = await api.post(`/projects/${projectId}/mvp/generate`);
  return data.data;
};

export const regenerateMVPPlan = async (projectId) => {
  const { data } = await api.post(`/projects/${projectId}/mvp/regenerate`);
  return data.data;
};

export const deleteMVPPlan = async (projectId) => {
  const { data } = await api.delete(`/projects/${projectId}/mvp`);
  return data.data;
};

export const askMVPQuestion = async (projectId, question) => {
  const { data } = await api.post(`/projects/${projectId}/mvp/ask`, { question });
  return data.answer || data.data?.answer;
};

// Branding
export const getBranding = async (projectId) => {
  const { data } = await api.get(`/projects/${projectId}/branding`);
  return data.data;
};

export const generateBranding = async (projectId) => {
  const { data } = await api.post(`/projects/${projectId}/branding/generate`);
  return data.data;
};

export const regenerateBranding = async (projectId) => {
  const { data } = await api.post(`/projects/${projectId}/branding/regenerate`);
  return data.data;
};

export const deleteBranding = async (projectId) => {
  const { data } = await api.delete(`/projects/${projectId}/branding`);
  return data.data;
};

export const askBrandingQuestion = async (projectId, question) => {
  const { data } = await api.post(`/projects/${projectId}/branding/ask`, { question });
  return data.answer || data.data?.answer;
};

// Pitch Deck
export const getPitchDeck = async (projectId) => {
  const { data } = await api.get(`/projects/${projectId}/pitch-deck`);
  return data.data;
};

export const generatePitchDeck = async (projectId) => {
  const { data } = await api.post(`/projects/${projectId}/pitch-deck/generate`);
  return data.data;
};

export const regeneratePitchDeck = async (projectId) => {
  const { data } = await api.post(`/projects/${projectId}/pitch-deck/regenerate`);
  return data.data;
};

export const deletePitchDeck = async (projectId) => {
  const { data } = await api.delete(`/projects/${projectId}/pitch-deck`);
  return data.data;
};

export const askPitchDeckQuestion = async (projectId, question) => {
  const { data } = await api.post(`/projects/${projectId}/pitch-deck/ask`, { question });
  return data.answer || data.data?.answer;
};

// Digital Twin
export const getDigitalTwin = async (projectId) => {
  const { data } = await api.get(`/projects/${projectId}/digital-twin`);
  return data;
};

export const runSimulation = async (projectId, customAssumptions = null) => {
  const { data } = await api.post(`/projects/${projectId}/digital-twin/simulate`, { customAssumptions });
  return data;
};

export const generateDigitalTwinInsights = async (projectId, scenarioKey = 'base') => {
  const { data } = await api.post(`/projects/${projectId}/digital-twin/insights`, { scenarioKey });
  return data;
};

export const askDigitalTwinQuestion = async (projectId, question) => {
  const { data } = await api.post(`/projects/${projectId}/digital-twin/ask`, { question });
  return data.answer || data.data?.answer;
};

// Market Research
export const getMarketResearch = async (projectId) => {
  const { data } = await api.get(`/projects/${projectId}/market-research`);
  return data;
};

export const generateMarketResearch = async (projectId) => {
  const { data } = await api.post(`/projects/${projectId}/market-research/generate`);
  return data;
};

export const regenerateMarketResearch = async (projectId) => {
  const { data } = await api.post(`/projects/${projectId}/market-research/regenerate`);
  return data;
};

export const deleteMarketResearch = async (projectId) => {
  const { data } = await api.delete(`/projects/${projectId}/market-research`);
  return data;
};

export const askMarketQuestion = async (projectId, question) => {
  const { data } = await api.post(`/projects/${projectId}/market-research/ask`, { question });
  return data.answer || data.data?.answer;
};

