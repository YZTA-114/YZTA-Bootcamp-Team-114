import {
    getQuizResponsesAxios,
    getQuizResponseByIdAxios,
    createQuizResponseAxios,
    updateQuizResponseAxios,
    deleteQuizResponseAxios
} from '@/services/quiz/quiz-response.service';

function asyncHandler(fn, errorHandler) {
    return async function (...args) {
        try {
            return await fn.apply(this, args);
        } catch (error) {
            if (errorHandler) {
                return errorHandler(error);
            }
            throw error;
        }
    };
}

function handleError(error) {
    console.error('Error in quiz response store:', error);
    if (error.response) {
        console.error('Response error:', error.response.data);
    }
    throw error;
}

export default {
    namespaced: true,
    
    state() {
        return {
            quizResponses: [],
            currentQuizResponse: null,
            loading: false,
            error: null
        };
    },

    mutations: {
        SET_QUIZ_RESPONSES(state, responses) {
            state.quizResponses = responses;
        },
        SET_CURRENT_QUIZ_RESPONSE(state, response) {
            state.currentQuizResponse = response;
        },
        ADD_QUIZ_RESPONSE(state, response) {
            state.quizResponses.push(response);
        },
        UPDATE_QUIZ_RESPONSE(state, updatedResponse) {
            const index = state.quizResponses.findIndex(r => r._id === updatedResponse._id);
            if (index !== -1) {
                state.quizResponses.splice(index, 1, updatedResponse);
            }
            if (state.currentQuizResponse && state.currentQuizResponse._id === updatedResponse._id) {
                state.currentQuizResponse = updatedResponse;
            }
        },
        REMOVE_QUIZ_RESPONSE(state, responseId) {
            state.quizResponses = state.quizResponses.filter(r => r._id !== responseId);
            if (state.currentQuizResponse && state.currentQuizResponse._id === responseId) {
                state.currentQuizResponse = null;
            }
        },
        SET_LOADING(state, status) {
            state.loading = status;
        },
        SET_ERROR(state, error) {
            state.error = error;
        }
    },

    actions: {
        fetchQuizResponses: asyncHandler(async function({ commit }, quizTakeId) {
            commit('SET_LOADING', true);
            try {
                const response = await getQuizResponsesAxios(quizTakeId);
                if (response.data && response.data.data) {
                    commit('SET_QUIZ_RESPONSES', response.data.data);
                    commit('SET_ERROR', null);
                }
            } finally {
                commit('SET_LOADING', false);
            }
        }, handleError),

        fetchQuizResponseById: asyncHandler(async function({ commit }, id) {
            commit('SET_LOADING', true);
            try {
                const response = await getQuizResponseByIdAxios(id);
                if (response.data && response.data.data) {
                    commit('SET_CURRENT_QUIZ_RESPONSE', response.data.data);
                    commit('SET_ERROR', null);
                }
            } finally {
                commit('SET_LOADING', false);
            }
        }, handleError),

        createQuizResponse: asyncHandler(async function({ commit }, { quizTakeId, responseData }) {
            commit('SET_LOADING', true);
            try {
                const response = await createQuizResponseAxios(quizTakeId, responseData);
                if (response.data && response.data.data) {
                    commit('ADD_QUIZ_RESPONSE', response.data.data);
                    commit('SET_ERROR', null);
                }
                return response.data.data;
            } finally {
                commit('SET_LOADING', false);
            }
        }, handleError),

        updateQuizResponse: asyncHandler(async function({ commit }, { id, responseData }) {
            commit('SET_LOADING', true);
            try {
                const response = await updateQuizResponseAxios(id, responseData);
                if (response.data && response.data.data) {
                    commit('UPDATE_QUIZ_RESPONSE', response.data.data);
                    commit('SET_ERROR', null);
                }
                return response.data.data;
            } finally {
                commit('SET_LOADING', false);
            }
        }, handleError),

        deleteQuizResponse: asyncHandler(async function({ commit }, id) {
            commit('SET_LOADING', true);
            try {
                await deleteQuizResponseAxios(id);
                commit('REMOVE_QUIZ_RESPONSE', id);
                commit('SET_ERROR', null);
            } finally {
                commit('SET_LOADING', false);
            }
        }, handleError)
    },

    getters: {
        getQuizResponses: state => state.quizResponses,
        getCurrentQuizResponse: state => state.currentQuizResponse,
        getLoading: state => state.loading,
        getError: state => state.error
    }
}; 