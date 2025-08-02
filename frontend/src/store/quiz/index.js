import {
    getQuizByIdAxios,
    getLessonQuizzesAxios,
    getClassroomQuizzesAxios,
    createQuizAxios,
    updateQuizAxios,
    deleteQuizAxios
} from '@/services/quiz/quiz.service';

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
    console.error('Error in quiz store:', error);
    if (error.response) {
        console.error('Response error:', error.response.data);
    }
    throw error;
}

export default {
    namespaced: true,
    
    state() {
        return {
            quizzes: [],
            currentQuiz: null,
            loading: false,
            error: null
        };
    },

    mutations: {
        SET_QUIZZES(state, quizzes) {
            state.quizzes = quizzes;
        },
        SET_CURRENT_QUIZ(state, quiz) {
            state.currentQuiz = quiz;
        },
        ADD_QUIZ(state, quiz) {
            state.quizzes.push(quiz);
        },
        UPDATE_QUIZ(state, updatedQuiz) {
            const index = state.quizzes.findIndex(q => q._id === updatedQuiz._id);
            if (index !== -1) {
                state.quizzes.splice(index, 1, updatedQuiz);
            }
            if (state.currentQuiz && state.currentQuiz._id === updatedQuiz._id) {
                state.currentQuiz = updatedQuiz;
            }
        },
        REMOVE_QUIZ(state, quizId) {
            state.quizzes = state.quizzes.filter(q => q._id !== quizId);
            if (state.currentQuiz && state.currentQuiz._id === quizId) {
                state.currentQuiz = null;
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
        fetchLessonQuizzes: asyncHandler(async function({ commit }, lessonId) {
            commit('SET_LOADING', true);
            try {
                const response = await getLessonQuizzesAxios(lessonId);
                if (response.data && response.data.data) {
                    commit('SET_QUIZZES', response.data.data);
                    commit('SET_ERROR', null);
                }
            } finally {
                commit('SET_LOADING', false);
            }
        }, handleError),

        fetchClassroomQuizzes: asyncHandler(async function({ commit }, classroomId) {
            commit('SET_LOADING', true);
            try {
                const response = await getClassroomQuizzesAxios(classroomId);
                if (response.data && response.data.data) {
                    commit('SET_QUIZZES', response.data.data);
                    commit('SET_ERROR', null);
                }
            } finally {
                commit('SET_LOADING', false);
            }
        }, handleError),

        fetchQuizById: asyncHandler(async function({ commit }, id) {
            commit('SET_LOADING', true);
            try {
                const response = await getQuizByIdAxios(id);
                if (response.data && response.data.data) {
                    commit('SET_CURRENT_QUIZ', response.data.data);
                    commit('SET_ERROR', null);
                }
            } finally {
                commit('SET_LOADING', false);
            }
        }, handleError),

        createQuiz: asyncHandler(async function({ commit }, { lessonId, quizData }) {
            commit('SET_LOADING', true);
            try {
                const response = await createQuizAxios(lessonId, quizData);
                if (response.data && response.data.data) {
                    commit('ADD_QUIZ', response.data.data);
                    commit('SET_ERROR', null);
                }
                return response.data.data;
            } finally {
                commit('SET_LOADING', false);
            }
        }, handleError),

        updateQuiz: asyncHandler(async function({ commit }, { id, quizData }) {
            commit('SET_LOADING', true);
            try {
                const response = await updateQuizAxios(id, quizData);
                if (response.data && response.data.data) {
                    commit('UPDATE_QUIZ', response.data.data);
                    commit('SET_ERROR', null);
                }
                return response.data.data;
            } finally {
                commit('SET_LOADING', false);
            }
        }, handleError),

        deleteQuiz: asyncHandler(async function({ commit }, id) {
            commit('SET_LOADING', true);
            try {
                await deleteQuizAxios(id);
                commit('REMOVE_QUIZ', id);
                commit('SET_ERROR', null);
            } finally {
                commit('SET_LOADING', false);
            }
        }, handleError)
    },

    getters: {
        getQuizzes: state => state.quizzes,
        getCurrentQuiz: state => state.currentQuiz,
        getLoading: state => state.loading,
        getError: state => state.error
    }
}; 