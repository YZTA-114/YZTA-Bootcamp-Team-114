import api from '@/api/api-v1-config'

export async function getQuizzesAxios() {
    return await api.get('quizzes', {
        withCredentials: true,
    });
}

export async function getQuizByIdAxios(id) {
    return await api.get(`quizzes/${id}`, {
        withCredentials: true,
    });
}

export async function getLessonQuizzesAxios(lessonId) {
    return await api.get(`lessons/${lessonId}/quizzes`, {
        withCredentials: true,
    });
}

export async function getClassroomQuizzesAxios(classroomId) {
    return await api.get(`classrooms/${classroomId}/quizzes`, {
        withCredentials: true,
    });
}

export async function createQuizAxios(lessonId, quizData) {
    return await api.post(`lessons/${lessonId}/quizzes`, quizData, {
        withCredentials: true,
    });
}

export async function updateQuizAxios(id, quizData) {
    return await api.put(`quizzes/${id}`, quizData, {
        withCredentials: true,
    });
}

export async function deleteQuizAxios(id) {
    return await api.delete(`quizzes/${id}`, {
        withCredentials: true,
    });
}

export async function submitQuizAxios(quizTakeId, answers) {
    return await api.post(`quizzes/${quizTakeId}/submit`, answers, {
        withCredentials: true,
    });
} 