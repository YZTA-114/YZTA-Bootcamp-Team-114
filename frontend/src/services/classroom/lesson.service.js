import api from '@/api/api-v1-config'

export async function getLessonsAxios() {
    return await api.get('lessons', {
        withCredentials: true,
    });
}

export async function getLessonByIdAxios(id) {
    return await api.get(`lessons/${id}`, {
        withCredentials: true,
    });
}

export async function getClassroomLessonsAxios(classroomId) {
    return await api.get(`classrooms/${classroomId}/lessons`, {
        withCredentials: true,
    });
}

export async function createLessonAxios(classroomId, lessonData) {
    return await api.post(`classrooms/${classroomId}/lessons`, lessonData, {
        withCredentials: true,
    });
}

export async function updateLessonAxios(id, lessonData) {
    return await api.put(`lessons/${id}`, lessonData, {
        withCredentials: true,
    });
}

export async function deleteLessonAxios(id) {
    return await api.delete(`lessons/${id}`, {
        withCredentials: true,
    });
} 