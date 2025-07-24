import api from '@/api/api-v1-config'

export async function getClassroomsAxios() {
    return await api.get('classrooms', {
        withCredentials: true,
    });
}

export async function getClassroomByIdAxios(id) {
    return await api.get(`classrooms/${id}`, {
        withCredentials: true,
    });
}

export async function createClassroomAxios(classroomData) {
    return await api.post('classrooms', classroomData, {
        withCredentials: true,
    });
}

export async function updateClassroomAxios(id, classroomData) {
    return await api.put(`classrooms/${id}`, classroomData, {
        withCredentials: true,
    });
}

export async function deleteClassroomAxios(id) {
    return await api.delete(`classrooms/${id}`, {
        withCredentials: true,
    });
}

export async function joinClassroomAxios(classroomCode) {
    return await api.post(`classrooms/join/${classroomCode}`, {}, {
        withCredentials: true,
    });
}

export async function leaveClassroomAxios(classroomId) {
    return await api.delete(`classrooms/leave/${classroomId}`, {
        withCredentials: true,
    });
} 