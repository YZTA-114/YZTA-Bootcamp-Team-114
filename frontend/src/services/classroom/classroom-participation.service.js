import api from '@/api/api-v1-config'

export async function getClassroomParticipationsAxios() {
    return await api.get('classroom-participations', {
        withCredentials: true,
    });
}

export async function getClassroomParticipationByIdAxios(id) {
    return await api.get(`classroom-participations/${id}`, {
        withCredentials: true,
    });
}

export async function getMyClassroomParticipationsAxios(userId) {
    return await api.get(`users/${userId}/classroomParticipations`, {
        withCredentials: true,
    });
}

export async function getClassroomParticipationsByClassroomAxios(classroomId) {
    return await api.get(`classrooms/${classroomId}/participations`, {
        withCredentials: true,
    });
}

export async function createClassroomParticipationAxios(participationData) {
    return await api.post('classroom-participations', participationData, {
        withCredentials: true,
    });
}

export async function updateClassroomParticipationAxios(id, participationData) {
    return await api.put(`classroom-participations/${id}`, participationData, {
        withCredentials: true,
    });
}

export async function deleteClassroomParticipationAxios(id) {
    return await api.delete(`classroom-participations/${id}`, {
        withCredentials: true,
    });
} 