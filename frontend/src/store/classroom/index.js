import {
    getClassroomsAxios,
    getClassroomByIdAxios,
    createClassroomAxios,
    updateClassroomAxios,
    deleteClassroomAxios,
    joinClassroomAxios,
    leaveClassroomAxios
} from '@/services/classroom/classroom.service'

export const classroom = {
    namespaced: true,
    state: {
        classrooms: [],
        currentClassroom: null,
        loading: false,
        error: null
    },
    mutations: {
        SET_CLASSROOMS(state, classrooms) {
            state.classrooms = classrooms;
        },
        SET_CURRENT_CLASSROOM(state, classroom) {
            state.currentClassroom = classroom;
        },
        ADD_CLASSROOM(state, classroom) {
            state.classrooms.push(classroom);
        },
        UPDATE_CLASSROOM(state, updatedClassroom) {
            const index = state.classrooms.findIndex(c => c.id === updatedClassroom.id);
            if (index !== -1) {
                state.classrooms.splice(index, 1, updatedClassroom);
            }
        },
        REMOVE_CLASSROOM(state, classroomId) {
            state.classrooms = state.classrooms.filter(c => c.id !== classroomId);
        },
        SET_LOADING(state, status) {
            state.loading = status;
        },
        SET_ERROR(state, error) {
            state.error = error;
        }
    },
    actions: {
        async fetchClassrooms({ commit }) {
            commit('SET_LOADING', true);
            try {
                const response = await getClassroomsAxios();
                commit('SET_CLASSROOMS', response.data);
                commit('SET_ERROR', null);
            } catch (error) {
                commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch classrooms');
            } finally {
                commit('SET_LOADING', false);
            }
        },
        async fetchClassroomById({ commit }, id) {
            commit('SET_LOADING', true);
            try {
                const response = await getClassroomByIdAxios(id);
                commit('SET_CURRENT_CLASSROOM', response.data);
                commit('SET_ERROR', null);
                return response.data;
            } catch (error) {
                commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch classroom');
                throw error;
            } finally {
                commit('SET_LOADING', false);
            }
        },
        async createClassroom({ commit }, classroomData) {
            commit('SET_LOADING', true);
            try {
                const response = await createClassroomAxios(classroomData);
                commit('ADD_CLASSROOM', response.data);
                commit('SET_ERROR', null);
                return response.data;
            } catch (error) {
                commit('SET_ERROR', error.response?.data?.message || 'Failed to create classroom');
                throw error;
            } finally {
                commit('SET_LOADING', false);
            }
        },
        async updateClassroom({ commit }, { id, classroomData }) {
            commit('SET_LOADING', true);
            try {
                const response = await updateClassroomAxios(id, classroomData);
                commit('UPDATE_CLASSROOM', response.data);
                commit('SET_ERROR', null);
                return response.data;
            } catch (error) {
                commit('SET_ERROR', error.response?.data?.message || 'Failed to update classroom');
                throw error;
            } finally {
                commit('SET_LOADING', false);
            }
        },
        async deleteClassroom({ commit }, id) {
            commit('SET_LOADING', true);
            try {
                await deleteClassroomAxios(id);
                commit('REMOVE_CLASSROOM', id);
                commit('SET_ERROR', null);
            } catch (error) {
                commit('SET_ERROR', error.response?.data?.message || 'Failed to delete classroom');
                throw error;
            } finally {
                commit('SET_LOADING', false);
            }
        },
        async joinClassroom({ commit }, classroomCode) {
            commit('SET_LOADING', true);
            try {
                const response = await joinClassroomAxios(classroomCode);
                commit('ADD_CLASSROOM', response.data);
                commit('SET_ERROR', null);
                return response.data;
            } catch (error) {
                commit('SET_ERROR', error.response?.data?.message || 'Failed to join classroom');
                throw error;
            } finally {
                commit('SET_LOADING', false);
            }
        },
        async leaveClassroom({ commit }, id) {
            commit('SET_LOADING', true);
            try {
                await leaveClassroomAxios(id);
                commit('REMOVE_CLASSROOM', id);
                commit('SET_ERROR', null);
            } catch (error) {
                commit('SET_ERROR', error.response?.data?.message || 'Failed to leave classroom');
                throw error;
            } finally {
                commit('SET_LOADING', false);
            }
        }
    },
    getters: {
        getAllClassrooms: state => state.classrooms,
        getCurrentClassroom: state => state.currentClassroom,
        getClassroomById: state => id => state.classrooms.find(c => c.id === id),
        isLoading: state => state.loading,
        getError: state => state.error
    }
} 