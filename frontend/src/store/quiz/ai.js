import {
    extractQuestionsFromFileAxios,
    extractQuestionsFromMultipleFilesAxios,
    saveExtractedQuestionsAsQuizAxios,
    extractQuestionsFromTextAxios,
    getAIStatusAxios
} from '@/services/ai/ai.service';
import asyncHandler from '@/utils/async';

function handleError(error) {
    console.error('Error in AI quiz store:', error);
    if (error.response) {
        console.error('Response error:', error.response.data);
    }
    throw error;
}

export default {
    namespaced: true,
    
    state() {
        return {
            extractedQuestions: [],
            aiStatus: null,
            loading: false,
            error: null,
            extractedText: null,
            fileProcessingInfo: {
                filename: null,
                fileType: null,
                totalQuestions: 0
            }
        };
    },

    mutations: {
        SET_EXTRACTED_QUESTIONS(state, questions) {
            state.extractedQuestions = questions;
        },
        SET_AI_STATUS(state, status) {
            state.aiStatus = status;
        },
        SET_LOADING(state, status) {
            state.loading = status;
        },
        SET_ERROR(state, error) {
            state.error = error;
        },
        SET_EXTRACTED_TEXT(state, text) {
            state.extractedText = text;
        },
        SET_FILE_PROCESSING_INFO(state, info) {
            state.fileProcessingInfo = info;
        },
        CLEAR_EXTRACTED_DATA(state) {
            state.extractedQuestions = [];
            state.extractedText = null;
            state.fileProcessingInfo = {
                filename: null,
                fileType: null,
                totalQuestions: 0
            };
        }
    },

    actions: {
        extractQuestionsFromFile: asyncHandler(async function({ commit }, file) {
            commit('SET_LOADING', true);
            try {
                const response = await extractQuestionsFromFileAxios(file);
                if (response.data && response.data.data) {
                    const { questions, extractedText, filename, fileType, totalQuestions } = response.data.data;
                    commit('SET_EXTRACTED_QUESTIONS', questions);
                    commit('SET_EXTRACTED_TEXT', extractedText);
                    commit('SET_FILE_PROCESSING_INFO', { filename, fileType, totalQuestions });
                    commit('SET_ERROR', null);
                }
                return response.data.data;
            } finally {
                commit('SET_LOADING', false);
            }
        }, handleError),

        extractQuestionsFromMultipleFiles: asyncHandler(async function({ commit }, files) {
            commit('SET_LOADING', true);
            try {
                const response = await extractQuestionsFromMultipleFilesAxios(files);
                if (response.data && response.data.data) {
                    const results = response.data.data;
                    const allQuestions = results.reduce((acc, result) => [...acc, ...result.questions], []);
                    commit('SET_EXTRACTED_QUESTIONS', allQuestions);
                    commit('SET_ERROR', null);
                }
                return response.data.data;
            } finally {
                commit('SET_LOADING', false);
            }
        }, handleError),

        saveExtractedQuestionsAsQuiz: asyncHandler(async function({ commit }, quizData) {
            commit('SET_LOADING', true);
            try {
                const response = await saveExtractedQuestionsAsQuizAxios(quizData);
                if (response.data && response.data.data) {
                    commit('CLEAR_EXTRACTED_DATA');
                    commit('SET_ERROR', null);
                }
                return response.data.data;
            } finally {
                commit('SET_LOADING', false);
            }
        }, handleError),

        extractQuestionsFromText: asyncHandler(async function({ commit }, text) {
            commit('SET_LOADING', true);
            try {
                const response = await extractQuestionsFromTextAxios(text);
                if (response.data && response.data.data) {
                    const { questions, totalQuestions } = response.data.data;
                    commit('SET_EXTRACTED_QUESTIONS', questions);
                    commit('SET_FILE_PROCESSING_INFO', { 
                        filename: 'Text Input',
                        fileType: 'text',
                        totalQuestions
                    });
                    commit('SET_ERROR', null);
                }
                return response.data.data;
            } finally {
                commit('SET_LOADING', false);
            }
        }, handleError),

        getAIStatus: asyncHandler(async function({ commit }) {
            commit('SET_LOADING', true);
            try {
                const response = await getAIStatusAxios();
                if (response.data && response.data.data) {
                    commit('SET_AI_STATUS', response.data.data);
                    commit('SET_ERROR', null);
                }
                return response.data.data;
            } finally {
                commit('SET_LOADING', false);
            }
        }, handleError),

        clearExtractedData({ commit }) {
            commit('CLEAR_EXTRACTED_DATA');
        }
    },

    getters: {
        getExtractedQuestions: state => state.extractedQuestions,
        getAIStatus: state => state.aiStatus,
        getLoading: state => state.loading,
        getError: state => state.error,
        getExtractedText: state => state.extractedText,
        getFileProcessingInfo: state => state.fileProcessingInfo
    }
}; 