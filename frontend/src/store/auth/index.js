import { getLoggedInUserAxios, loginUserAxios, logoutUserAxios, registerUserAxios } from "@/services/auth/auth.service";
import asyncHandler from "@/utils/async";

function handleError(error) {
  // Güvenli hata mesajı çıkarma
  if (error.response && error.response.data && error.response.data.error) {
    error.message = error.response.data.error;
  } else if (error.response && error.response.data && error.response.data.message) {
    error.message = error.response.data.message;
  } else if (!error.message) {
    // Hiçbir hata mesajı bulunamazsa varsayılan mesaj
    error.message = 'Bir hata oluştu. Lütfen tekrar deneyin.';
  }
  throw error;
}

export default {
    namespaced: true,

    state() {
        return {
            loginStatus: false,
            user: null,
        }
    },

    mutations: {
        setUser(state, user) {
            state.user = user;
        },
        setLoginStatus(state, loginStatus) {
            state.loginStatus = loginStatus;
        },
    },

    actions: {
        userLogin: asyncHandler(async function ({ commit, dispatch }, loginData) {
            const response = await loginUserAxios(loginData);
            if (response && response.data) {
                await dispatch("getMe");
                commit('setLoginStatus', true);
            } else {
                commit('setLoginStatus', false);
            }
        }, handleError),

        getMe: asyncHandler(async function ({ commit }) {
            const response = await getLoggedInUserAxios();
            if (response && response.data) {
                commit('setUser', response.data.data);
            }
        }, handleError),

        userLogout: asyncHandler(async function ({ commit }) {
            const response = await logoutUserAxios();
            if (response.status === 200) {
                commit('setUser', null);
            }
        }, handleError),

        userRegister: asyncHandler(async function ({ commit, dispatch }, registerData) {
                const response = await registerUserAxios(registerData);
                console.log('Register response:', response);
                
                if (response && response.data && response.data.success) {
                    // Başarılı kayıt sonrası kullanıcı bilgilerini al
                    await dispatch("getMe");
                    commit('setLoginStatus', true);
                } else {
                    throw new Error('Kayıt işlemi başarısız oldu - Geçersiz response');
                }
        }, handleError),
    },

    getters: {
        getUser(state) {
            return state.user;
        },

        getLoginStatus(state) {
            return state.loginStatus;
        },
    }
};