import api from '@/api/api-v1-config'

export const extractQuestionsFromFileAxios = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return await api.post(`quiz/ai/extract`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    withCredentials: true
  });
};

export const extractQuestionsFromMultipleFilesAxios = async (files) => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file);
  });
  return await api.post(`quiz/ai/extract-multiple`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    withCredentials: true
  });
};

export const saveExtractedQuestionsAsQuizAxios = async (quizData) => {
  return await api.post(`quiz/ai/save-quiz`, quizData, {
    withCredentials: true
  });
};

export const extractQuestionsFromTextAxios = async (text) => {
  return await api.post(`quiz/ai/extract-from-text`, { text }, {
    withCredentials: true
  });
};

export const getAIStatusAxios = async () => {
  return await api.get(`quiz/ai/status`, {
    withCredentials: true
  });
}; 