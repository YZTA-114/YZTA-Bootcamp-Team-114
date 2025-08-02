import {
    getClassroomParticipationsAxios,
    getClassroomParticipationByIdAxios,
    getMyClassroomParticipationsAxios,
    getClassroomParticipationsByClassroomAxios,
    createClassroomParticipationAxios,
    updateClassroomParticipationAxios,
    deleteClassroomParticipationAxios,
} from "@/services/classroom/classroom-participation.service";
import asyncHandler from "@/utils/async";

function handleError(error) {
    if (error.response && error.response.data && error.response.data.error) {
        error.message = error.response.data.error;
    } else if (error.response && error.response.data && error.response.data.message) {
        error.message = error.response.data.message;
    } else if (!error.message) {
        error.message = "An error occurred. Please try again.";
    }
    throw error;
}

export default {
    namespaced: true,
    state: {
        participations: [],
        currentParticipation: null,
        loading: false,
        error: null
    },
    mutations: {
        SET_PARTICIPATIONS(state, participations) {
            state.participations = participations;
        },
        SET_CURRENT_PARTICIPATION(state, participation) {
            state.currentParticipation = participation;
        },
        ADD_PARTICIPATION(state, participation) {
            state.participations.push(participation);
        },
        UPDATE_PARTICIPATION(state, updatedParticipation) {
            const index = state.participations.findIndex(p => p.id === updatedParticipation.id);
            if (index !== -1) {
                state.participations.splice(index, 1, updatedParticipation);
            }
        },
        REMOVE_PARTICIPATION(state, id) {
            state.participations = state.participations.filter(p => p.id !== id);
        },
        SET_LOADING(state, status) {
            state.loading = status;
        },
        SET_ERROR(state, error) {
            state.error = error;
        }
    },
    actions: {
        fetchParticipations: asyncHandler(async function ({ commit }) {
            commit("SET_LOADING", true);
            const response = await getClassroomParticipationsAxios();
            if (response.data && response.data.data) {
                commit("SET_PARTICIPATIONS", response.data.data);
                commit("SET_ERROR", null);
            }
            commit("SET_LOADING", false);
        }, handleError),

        getMyParticipations: asyncHandler(async function ({ commit }, userId) {
            commit("SET_LOADING", true);
            const response = await getMyClassroomParticipationsAxios(userId);
            if (response.data && response.data.data) {
                commit("SET_PARTICIPATIONS", response.data.data);
                commit("SET_ERROR", null);
            }
            commit("SET_LOADING", false);
        }, handleError),

        fetchParticipationById: asyncHandler(async function ({ commit }, id) {
            commit("SET_LOADING", true);
            const response = await getClassroomParticipationByIdAxios(id);
            if (response.data && response.data.data) {
                commit("SET_CURRENT_PARTICIPATION", response.data.data);
                commit("SET_ERROR", null);
            }
            commit("SET_LOADING", false);
        }, handleError),

        getClassroomParticipations: asyncHandler(async function ({ commit }, classroomId) {
            commit("SET_LOADING", true);
            const response = await getClassroomParticipationsByClassroomAxios(classroomId);
            if (response.data && response.data.data) {
                commit("SET_PARTICIPATIONS", response.data.data);
                commit("SET_ERROR", null);
            }
            commit("SET_LOADING", false);
        }, handleError),

        createParticipation: asyncHandler(async function ({ commit }, participationData) {
            commit("SET_LOADING", true);
            const response = await createClassroomParticipationAxios(participationData);
            if (response.data && response.data.data) {
                commit("ADD_PARTICIPATION", response.data.data);
                commit("SET_ERROR", null);
            }
            commit("SET_LOADING", false);
        }, handleError),

        updateParticipation: asyncHandler(async function ({ commit }, { id, participationData }) {
            commit("SET_LOADING", true);
            const response = await updateClassroomParticipationAxios(id, participationData);
            if (response.data && response.data.data) {
                commit("UPDATE_PARTICIPATION", response.data.data);
                commit("SET_ERROR", null);
            }
            commit("SET_LOADING", false);
        }, handleError),

        deleteParticipation: asyncHandler(async function ({ commit }, id) {
            commit("SET_LOADING", true);
            const response = await deleteClassroomParticipationAxios(id);
            if (response.status === 200) {
                commit("REMOVE_PARTICIPATION", id);
                commit("SET_ERROR", null);
            }
            commit("SET_LOADING", false);
        }, handleError),
    },
    getters: {
        getParticipations(state) {
            return state.participations;
        },
        getCurrentParticipation(state) {
            return state.currentParticipation;
        },
        getParticipationById: (state) => (id) => {
            return state.participations.find(p => p.id === id);
        },
        isLoading(state) {
            return state.loading;
        },
        getError(state) {
            return state.error;
        }
    }
}; 