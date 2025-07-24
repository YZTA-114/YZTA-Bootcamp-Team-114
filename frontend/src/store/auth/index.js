import { getLoggedInUserAxios, loginUserAxios, logoutUserAxios } from "@/services/auth/auth.service";
import asyncHandler from "@/utils/async";

function handleError(error) {
  error.message = error.response.data.error;
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