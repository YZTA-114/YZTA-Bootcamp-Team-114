import api from '@/api/api-v1-config'

export async function loginUserAxios(loginData) {
    return await api.post('auth/login', loginData, {
        withCredentials: true,
    });
}

export async function getLoggedInUserAxios() {
    return await api.get('auth/me', {
        withCredentials: true,
    });
}

export async function logoutUserAxios() {
    return await api.post('auth/logout', {}, {
        withCredentials: true,
    });
}

export async function registerUserAxios(body) {
    return await api.post('auth/register', body, {
        withCredentials: true,
    });
}