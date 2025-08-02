import { createStore, createLogger } from "vuex";
import auth from "./auth";
import classroom from "./classroom";
import classroomParticipation from "./classroom-participation";
import quiz from "./quiz";
import quizTake from "./quiz/quiz-take";
import quizResponse from "./quiz/quiz-response";

const debug = process.env.NODE_ENV !== "production";

export default createStore({
    modules: {
        auth,
        classroom,
        classroomParticipation,
        quiz,
        quizTake,
        quizResponse
    },
    strict: debug,
    plugins: debug ? [createLogger()] : []
});