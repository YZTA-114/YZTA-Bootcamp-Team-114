import api from '@/api/api-v1-config'

export async function getQuizResponsesAxios(quizTakeId) {
    return await api.get(`quiz-takes/${quizTakeId}/quiz-responses`, {
        withCredentials: true,
    });
}

export async function getQuizResponseByIdAxios(id) {
    return await api.get(`quiz-responses/${id}`, {
        withCredentials: true,
    });
}

export async function createQuizResponseAxios(quizTakeId, responseData) {
    return await api.post(`quiz-takes/${quizTakeId}/quiz-responses`, responseData, {
        withCredentials: true,
    });
}

export async function updateQuizResponseAxios(id, responseData) {
    return await api.put(`quiz-responses/${id}`, responseData, {
        withCredentials: true,
    });
}

export async function deleteQuizResponseAxios(id) {
    return await api.delete(`quiz-responses/${id}`, {
        withCredentials: true,
    });
} 