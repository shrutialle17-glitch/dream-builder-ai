import api from '../lib/axios';

export const getPitchDeck = async (projectId) => {
  const response = await api.get(
    `/v1/projects/${projectId}/pitch-decks`
  );

  return response.data.data || response.data;
};

export const generatePitchDeck = async (projectId) => {
  const response = await api.post(
    `/v1/projects/${projectId}/pitch-decks/generate`
  );

  return response.data.data || response.data;
};

export const regeneratePitchDeck = async (projectId) => {
  const response = await api.post(
    `/v1/projects/${projectId}/pitch-decks/regenerate`
  );

  return response.data.data || response.data;
};

export const askPitchDeckQuestion = async (projectId, question) => {
  const response = await api.post(
    `/v1/projects/${projectId}/pitch-decks/ask`,
    { question }
  );

  return response.data.data || response.data;
};

export const deletePitchDeck = async (projectId) => {
  const response = await api.delete(
    `/v1/projects/${projectId}/pitch-decks`
  );

  return response.data.data || response.data;
};