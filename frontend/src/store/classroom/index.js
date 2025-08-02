import {
  getClassroomsAxios,
  getClassroomByIdAxios,
  createClassroomAxios,
  updateClassroomAxios,
  deleteClassroomAxios,
  joinClassroomAxios,
  leaveClassroomAxios,
  getMyClassroomsAxios,
} from "@/services/classroom/classroom.service";
import asyncHandler from "@/utils/async";

function handleError(error) {
  // Güvenli hata mesajı çıkarma
  if (error.response && error.response.data && error.response.data.error) {
    error.message = error.response.data.error;
  } else if (
    error.response &&
    error.response.data &&
    error.response.data.message
  ) {
    error.message = error.response.data.message;
  } else if (!error.message) {
    // Hiçbir hata mesajı bulunamazsa varsayılan mesaj
    error.message = "Bir hata oluştu. Lütfen tekrar deneyin.";
  }
  throw error;
}

export default {
  namespaced: true,
  state: {
    classrooms: [],
    currentClassroom: null,
    loading: false,
    error: null,
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
      const index = state.classrooms.findIndex(
        (c) => c.id === updatedClassroom.id
      );
      if (index !== -1) {
        state.classrooms.splice(index, 1, updatedClassroom);
      }
    },
    REMOVE_CLASSROOM(state, classroomId) {
      state.classrooms = state.classrooms.filter((c) => c.id !== classroomId);
    },
    SET_LOADING(state, status) {
      state.loading = status;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
  },
  actions: {
    fetchClassrooms: asyncHandler(async function ({ commit }) {
      commit("SET_LOADING", true);
      const response = await getClassroomsAxios();
      if (response.data && response.data.data) {
        commit("SET_CLASSROOMS", response.data.data);
        commit("SET_ERROR", null);
      }
    }, handleError),  
    getMyClassrooms: asyncHandler(async function ({ commit }, userId) {
      const response = await getMyClassroomsAxios(userId);
      if (response.data && response.data.data) {
        commit("SET_CLASSROOMS", response.data.data);
      }
    }, handleError),
    fetchClassroomById: asyncHandler(async function ({ commit }, id) {
      commit("SET_LOADING", true);
      const response = await getClassroomByIdAxios(id);
      if (response.data && response.data.data) {
          commit("SET_CURRENT_CLASSROOM", response.data);
          commit("SET_ERROR", null);
        }
    }, handleError),
    createClassroom: asyncHandler(async function ({ commit }, classroomData) {
      commit("SET_LOADING", true);
      const response = await createClassroomAxios(classroomData);
      if (response.data && response.data.data) {
        commit("ADD_CLASSROOM", response.data);
        commit("SET_ERROR", null);
        commit("SET_LOADING", false);
      }
    }, handleError),
    updateClassroom: asyncHandler(async function ({ commit }, { id, classroomData }) {
      commit("SET_LOADING", true);
      const response = await updateClassroomAxios(id, classroomData);
      if (response.data && response.data.data) {
        commit("UPDATE_CLASSROOM", response.data);
        commit("SET_ERROR", null);
        commit("SET_LOADING", false);
      }
    }, handleError),
    deleteClassroom: asyncHandler(async function ({ commit }, id) {
      commit("SET_LOADING", true);
      const response = await deleteClassroomAxios(id);
      if (response.data && response.data.data) {
        commit("REMOVE_CLASSROOM", id);
        commit("SET_ERROR", null);
        commit("SET_LOADING", false);
      }
    }, handleError),
    joinClassroom: asyncHandler(async function ({ commit }, classroomCode) {
      commit("SET_LOADING", true);
      const response = await joinClassroomAxios(classroomCode);
      if (response.data && response.data.data) {
        commit("ADD_CLASSROOM", response.data.data);
        commit("SET_ERROR", null);
        commit("SET_LOADING", false);
      }
    }, handleError),
    leaveClassroom: asyncHandler(async function ({ commit }, id) {
      commit("SET_LOADING", true);
      const response = await leaveClassroomAxios(id);
      if (response.data && response.data.data) {
        commit("REMOVE_CLASSROOM", id);
        commit("SET_ERROR", null);
        commit("SET_LOADING", false);
      }
    }, handleError),
    setCurrentClassroom: asyncHandler(async function ({ commit }, classroom) {
      commit("SET_CURRENT_CLASSROOM", classroom);
    }, handleError),
  },
  getters: {
    getClassrooms(state) {
      return state.classrooms;
    },
    getCurrentClassroom(state) {
      return state.currentClassroom;
    },
    getClassroomById(state) {
      return (id) => state.classrooms.find((c) => c.id === id);
    },
    isLoading(state) {
      return state.loading;
    },
    getError(state) {
      return state.error;
    },
  },
};
