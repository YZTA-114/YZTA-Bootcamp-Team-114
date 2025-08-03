import api from '@/api/api-v1-config'

export async function getQuizTakesAxios(quizId) {
    return await api.get(`quizzes/${quizId}/quiz-takes`, {
        withCredentials: true,
    });
}

export async function getMyQuizTakesAxios() {
    return await api.get('quiz-takes/me', {
        withCredentials: true,
    });
}

export async function getQuizTakeByIdAxios(id) {
    return await api.get(`quiz-takes/${id}`, {
        withCredentials: true,
    });
}

export async function createQuizTakeAxios(quizId) {
    return await api.post(`quizzes/${quizId}/quiz-takes`, {}, {
        withCredentials: true,
    });
}

export async function deleteQuizTakeAxios(id) {
    return await api.delete(`quiz-takes/${id}`, {
        withCredentials: true,
    });
}

export async function updateQuizTakeAxios(id, data) {
    return await api.put(`quiz-takes/${id}`, data, {
        withCredentials: true,
    });
} 