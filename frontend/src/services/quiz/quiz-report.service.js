import api from '@/api/api-v1-config'

export async function getQuizReportsAxios() {
    return await api.get('quiz-reports', {
        withCredentials: true,
    });
}

export async function getQuizReportByIdAxios(id) {
    return await api.get(`quiz-reports/${id}`, {
        withCredentials: true,
    });
}

export async function getQuizReportByQuizTakeIdAxios(quizTakeId) {
    return await api.get(`quiz-takes/${quizTakeId}/quiz-reports`, {
        withCredentials: true,
    });
}

export async function createQuizReportAxios(quizTakeId, reportData) {
    return await api.post(`quiz-takes/${quizTakeId}/quiz-reports`, reportData, {
        withCredentials: true,
    });
}

export async function updateQuizReportAxios(id, reportData) {
    return await api.put(`quiz-reports/${id}`, reportData, {
        withCredentials: true,
    });
}

export async function deleteQuizReportAxios(id) {
    return await api.delete(`quiz-reports/${id}`, {
        withCredentials: true,
    });
} 