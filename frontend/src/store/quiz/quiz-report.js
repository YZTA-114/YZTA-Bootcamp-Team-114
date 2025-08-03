import {
    getQuizReportsAxios,
    getQuizReportByIdAxios,
    getQuizReportByQuizTakeIdAxios,
    createQuizReportAxios,
    updateQuizReportAxios,
    deleteQuizReportAxios
} from '@/services/quiz/quiz-report.service';

import asyncHandler from '@/utils/async';

function handleError(error) {
    console.error('Error in quiz report store:', error);
    if (error.response) {
        console.error('Response error:', error.response.data);
    }
    throw error;
}

export default {
    namespaced: true,
    
    state() {
        return {
            quizReports: [],
            currentQuizReport: null,
            loading: false,
            error: null
        };
    },

    mutations: {
        SET_QUIZ_REPORTS(state, reports) {
            state.quizReports = reports;
        },
        SET_CURRENT_QUIZ_REPORT(state, report) {
            state.currentQuizReport = report;
        },
        ADD_QUIZ_REPORT(state, report) {
            state.quizReports.push(report);
        },
        UPDATE_QUIZ_REPORT(state, updatedReport) {
            const index = state.quizReports.findIndex(r => r._id === updatedReport._id);
            if (index !== -1) {
                state.quizReports.splice(index, 1, updatedReport);
            }
            if (state.currentQuizReport && state.currentQuizReport._id === updatedReport._id) {
                state.currentQuizReport = updatedReport;
            }
        },
        REMOVE_QUIZ_REPORT(state, reportId) {
            state.quizReports = state.quizReports.filter(r => r._id !== reportId);
            if (state.currentQuizReport && state.currentQuizReport._id === reportId) {
                state.currentQuizReport = null;
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
        fetchQuizReports: asyncHandler(async function({ commit }) {
            commit('SET_LOADING', true);
            try {
                const response = await getQuizReportsAxios();
                if (response.data && response.data.data) {
                    commit('SET_QUIZ_REPORTS', response.data.data);
                    commit('SET_ERROR', null);
                }
            } finally {
                commit('SET_LOADING', false);
            }
        }, handleError),

        fetchQuizReportById: asyncHandler(async function({ commit }, id) {
            commit('SET_LOADING', true);
            try {
                const response = await getQuizReportByIdAxios(id);
                if (response.data && response.data.data) {
                    commit('SET_CURRENT_QUIZ_REPORT', response.data.data);
                    commit('SET_ERROR', null);
                    return response.data.data;
                }
            } finally {
                commit('SET_LOADING', false);
            }
        }, handleError),

        fetchQuizReportByQuizTakeId: asyncHandler(async function({ commit }, quizTakeId) {
            commit('SET_LOADING', true);
            try {
                const response = await getQuizReportByQuizTakeIdAxios(quizTakeId);
                if (response.data && response.data.data) {
                    // Since the API returns an array but we expect a single report,
                    // we take the first one (there should only be one report per quiz take)
                    const report = Array.isArray(response.data.data) ? response.data.data[0] : response.data.data;
                    commit('SET_CURRENT_QUIZ_REPORT', report);
                    commit('SET_ERROR', null);
                    return report;
                }
            } finally {
                commit('SET_LOADING', false);
            }
        }, handleError),

        createQuizReport: asyncHandler(async function({ commit }, { quizTakeId, reportData }) {
            commit('SET_LOADING', true);
            try {
                const response = await createQuizReportAxios(quizTakeId, reportData);
                if (response.data && response.data.data) {
                    commit('ADD_QUIZ_REPORT', response.data.data);
                    commit('SET_CURRENT_QUIZ_REPORT', response.data.data);
                    commit('SET_ERROR', null);
                    return response.data.data;
                }
            } finally {
                commit('SET_LOADING', false);
            }
        }, handleError),

        updateQuizReport: asyncHandler(async function({ commit }, { id, reportData }) {
            commit('SET_LOADING', true);
            try {
                const response = await updateQuizReportAxios(id, reportData);
                if (response.data && response.data.data) {
                    commit('UPDATE_QUIZ_REPORT', response.data.data);
                    commit('SET_ERROR', null);
                    return response.data.data;
                }
            } finally {
                commit('SET_LOADING', false);
            }
        }, handleError),

        deleteQuizReport: asyncHandler(async function({ commit }, id) {
            commit('SET_LOADING', true);
            try {
                await deleteQuizReportAxios(id);
                commit('REMOVE_QUIZ_REPORT', id);
                commit('SET_ERROR', null);
            } finally {
                commit('SET_LOADING', false);
            }
        }, handleError)
    },

    getters: {
        getQuizReports: state => state.quizReports,
        getCurrentQuizReport: state => state.currentQuizReport,
        getLoading: state => state.loading,
        getError: state => state.error
    }
}; 