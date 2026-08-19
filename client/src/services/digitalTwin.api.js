import api from '../lib/axios';

export const getDigitalTwin = async (projectId) => {
  const response = await api.get(
    `/v1/projects/${projectId}/digital-twin`
  );

  return response.data.data || response.data;
};

export const simulateScenario = async (projectId, assumptions = null) => {
  const response = await api.post(
    `/v1/projects/${projectId}/digital-twin/simulate`,
    assumptions || {}
  );

  return response.data.data || response.data;
};

export const generateDigitalTwinInsights = async (
  projectId,
  scenario = 'base'
) => {
  const response = await api.post(
    `/v1/projects/${projectId}/digital-twin/insights`,
    { scenario }
  );

  return response.data.data || response.data;
};

export const askDigitalTwinQuestion = async (projectId, question) => {
  const response = await api.post(
    `/v1/projects/${projectId}/digital-twin/ask`,
    { question }
  );

  return response.data.data || response.data;
};