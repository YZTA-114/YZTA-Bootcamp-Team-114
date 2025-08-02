import api from '@/api/api-v1-config'

export async function getQuizQuestionsAxios(quizId) {
    return await api.get(`quizzes/${quizId}/quiz-questions`, {
        withCredentials: true,
    });
}

export async function getQuizQuestionByIdAxios(id) {
    return await api.get(`quiz-questions/${id}`, {
        withCredentials: true,
    });
}

export async function createQuizQuestionAxios(quizId, questionData) {
    return await api.post(`quizzes/${quizId}/quiz-questions`, questionData, {
        withCredentials: true,
    });
}

export async function updateQuizQuestionAxios(id, questionData) {
    return await api.put(`quiz-questions/${id}`, questionData, {
        withCredentials: true,
    });
}

export async function deleteQuizQuestionAxios(id) {
    return await api.delete(`quiz-questions/${id}`, {
        withCredentials: true,
    });
} 