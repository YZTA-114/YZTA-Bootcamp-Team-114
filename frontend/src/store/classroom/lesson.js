import {
  getLessonsAxios,
  getLessonByIdAxios,
  getClassroomLessonsAxios,
  createLessonAxios,
  updateLessonAxios,
  deleteLessonAxios,
} from "@/services/classroom/lesson.service";
import asyncHandler from "@/utils/async";

function handleError(error) {
  if (error.response && error.response.data && error.response.data.error) {
    error.message = error.response.data.error;
  } else if (
    error.response &&
    error.response.data &&
    error.response.data.message
  ) {
    error.message = error.response.data.message;
  } else if (!error.message) {
    error.message = "Bir hata oluştu. Lütfen tekrar deneyin.";
  }
  throw error;
}

export default {
  namespaced: true,
  state: {
    lessons: [],
    currentLesson: null,
    loading: false,
    error: null,
  },
  mutations: {
    SET_LESSONS(state, lessons) {
      state.lessons = lessons;
    },
    SET_CURRENT_LESSON(state, lesson) {
      state.currentLesson = lesson;
    },
    ADD_LESSON(state, lesson) {
      state.lessons.push(lesson);
    },
    UPDATE_LESSON(state, updatedLesson) {
      const index = state.lessons.findIndex(
        (l) => l.id === updatedLesson.id
      );
      if (index !== -1) {
        state.lessons.splice(index, 1, updatedLesson);
      }
    },
    REMOVE_LESSON(state, lessonId) {
      state.lessons = state.lessons.filter((l) => l.id !== lessonId);
    },
    SET_LOADING(state, status) {
      state.loading = status;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
  },
  actions: {
    fetchLessons: asyncHandler(async function ({ commit }) {
      commit("SET_LOADING", true);
      const response = await getLessonsAxios();
      if (response.data && response.data.data) {
        commit("SET_LESSONS", response.data.data);
        commit("SET_ERROR", null);
      }
      commit("SET_LOADING", false);
    }, handleError),
    fetchLessonById: asyncHandler(async function ({ commit }, id) {
      commit("SET_LOADING", true);
      const response = await getLessonByIdAxios(id);
      if (response.data && response.data.data) {
        commit("SET_CURRENT_LESSON", response.data.data);
        commit("SET_ERROR", null);
      }
      commit("SET_LOADING", false);
    }, handleError),
    fetchClassroomLessons: asyncHandler(async function ({ commit }, classroomId) {
      commit("SET_LOADING", true);
      const response = await getClassroomLessonsAxios(classroomId);
      if (response.data && response.data.data) {
        commit("SET_LESSONS", response.data.data);
        commit("SET_ERROR", null);
      }
      commit("SET_LOADING", false);
    }, handleError),
    createLesson: asyncHandler(async function ({ commit }, { classroomId, lessonData }) {
      commit("SET_LOADING", true);
      const response = await createLessonAxios(classroomId, lessonData);
      if (response.data && response.data.data) {
        commit("ADD_LESSON", response.data.data);
        commit("SET_ERROR", null);
      }
      commit("SET_LOADING", false);
    }, handleError),
    updateLesson: asyncHandler(async function ({ commit }, { id, lessonData }) {
      commit("SET_LOADING", true);
      const response = await updateLessonAxios(id, lessonData);
      if (response.data && response.data.data) {
        commit("UPDATE_LESSON", response.data.data);
        commit("SET_ERROR", null);
      }
      commit("SET_LOADING", false);
    }, handleError),
    deleteLesson: asyncHandler(async function ({ commit }, id) {
      commit("SET_LOADING", true);
      const response = await deleteLessonAxios(id);
      if (response.data && response.data.data) {
        commit("REMOVE_LESSON", id);
        commit("SET_ERROR", null);
      }
      commit("SET_LOADING", false);
    }, handleError),
    setCurrentLesson: asyncHandler(async function ({ commit }, lesson) {
      commit("SET_CURRENT_LESSON", lesson);
    }, handleError),
  },
  getters: {
    getLessons(state) {
      return state.lessons;
    },
    getCurrentLesson(state) {
      return state.currentLesson;
    },
    getLessonById(state) {
      return (id) => state.lessons.find((l) => l.id === id);
    },
    isLoading(state) {
      return state.loading;
    },
    getError(state) {
      return state.error;
    },
  },
}; 