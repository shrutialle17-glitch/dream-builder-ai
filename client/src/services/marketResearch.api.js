import api from '../lib/axios';

export const getMarketResearch = async (projectId) => {
  const response = await api.get(
    `/v1/projects/${projectId}/market-research`
  );

  return response.data.data || response.data;
};

export const generateMarketResearch = async (projectId) => {
  const response = await api.post(
    `/v1/projects/${projectId}/market-research/generate`
  );

  return response.data.data || response.data;
};

export const regenerateMarketResearch = async (projectId) => {
  const response = await api.post(
    `/v1/projects/${projectId}/market-research/regenerate`
  );

  return response.data.data || response.data;
};

export const askMarketResearchQuestion = async (projectId, question) => {
  const response = await api.post(
    `/v1/projects/${projectId}/market-research/ask`,
    { question }
  );

  return response.data.data || response.data;
};