import {
    getQuizTakesAxios,
    getMyQuizTakesAxios,
    getQuizTakeByIdAxios,
    createQuizTakeAxios,
    deleteQuizTakeAxios
} from '@/services/quiz/quiz-take.service';

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
    console.error('Error in quiz take store:', error);
    if (error.response) {
        console.error('Response error:', error.response.data);
    }
    throw error;
}

export default {
    namespaced: true,
    
    state() {
        return {
            quizTakes: [],
            currentQuizTake: null,
            loading: false,
            error: null
        };
    },

    mutations: {
        SET_QUIZ_TAKES(state, quizTakes) {
            state.quizTakes = quizTakes;
        },
        SET_CURRENT_QUIZ_TAKE(state, quizTake) {
            state.currentQuizTake = quizTake;
        },
        ADD_QUIZ_TAKE(state, quizTake) {
            state.quizTakes.push(quizTake);
        },
        REMOVE_QUIZ_TAKE(state, quizTakeId) {
            state.quizTakes = state.quizTakes.filter(qt => qt._id !== quizTakeId);
            if (state.currentQuizTake && state.currentQuizTake._id === quizTakeId) {
                state.currentQuizTake = null;
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
        fetchQuizTakes: asyncHandler(async function({ commit }, quizId) {
            commit('SET_LOADING', true);
            try {
                const response = await getQuizTakesAxios(quizId);
                if (response.data && response.data.data) {
                    commit('SET_QUIZ_TAKES', response.data.data);
                    commit('SET_ERROR', null);
                }
            } finally {
                commit('SET_LOADING', false);
            }
        }, handleError),

        fetchMyQuizTakes: asyncHandler(async function({ commit }) {
            commit('SET_LOADING', true);
            try {
                const response = await getMyQuizTakesAxios();
                if (response.data && response.data.data) {
                    commit('SET_QUIZ_TAKES', response.data.data);
                    commit('SET_ERROR', null);
                }
            } finally {
                commit('SET_LOADING', false);
            }
        }, handleError),

        fetchQuizTakeById: asyncHandler(async function({ commit }, id) {
            commit('SET_LOADING', true);
            try {
                const response = await getQuizTakeByIdAxios(id);
                if (response.data && response.data.data) {
                    commit('SET_CURRENT_QUIZ_TAKE', response.data.data);
                    commit('SET_ERROR', null);
                }
            } finally {
                commit('SET_LOADING', false);
            }
        }, handleError),

        createQuizTake: asyncHandler(async function({ commit }, quizId) {
            commit('SET_LOADING', true);
            try {
                const response = await createQuizTakeAxios(quizId);
                if (response.data && response.data.data) {
                    commit('ADD_QUIZ_TAKE', response.data.data);
                    commit('SET_CURRENT_QUIZ_TAKE', response.data.data);
                    commit('SET_ERROR', null);
                }
                return response.data.data;
            } finally {
                commit('SET_LOADING', false);
            }
        }, handleError),

        deleteQuizTake: asyncHandler(async function({ commit }, id) {
            commit('SET_LOADING', true);
            try {
                await deleteQuizTakeAxios(id);
                commit('REMOVE_QUIZ_TAKE', id);
                commit('SET_ERROR', null);
            } finally {
                commit('SET_LOADING', false);
            }
        }, handleError)
    },

    getters: {
        getQuizTakes: state => state.quizTakes,
        getCurrentQuizTake: state => state.currentQuizTake,
        getLoading: state => state.loading,
        getError: state => state.error
    }
}; 