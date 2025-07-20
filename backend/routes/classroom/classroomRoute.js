const express = require('express');

const Classroom = require('../../models/classroom/Classroom');
const advancedResults = require('../../middleware/advancedResults');

const { 
    getClassrooms, 
    getClassroom, 
    createClassroom, 
    updateClassroom, 
    deleteClassroom,
    joinClassroomByCode
} = require('../../controllers/classroom/classroomController');

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../../middleware/auth');

// Protect all routes after this middleware
router.use(protect);

// Re-route into other resource routers
const lessonRouter = require('./lessonRoute');
router.use('/:classroomId/lessons', lessonRouter);

router
    .route('/')
    .get(advancedResults(Classroom, {
        path: 'owner',
        select: 'name email'
    }), getClassrooms)
    .post(createClassroom);

router
    .route('/join/:code')
    .post(joinClassroomByCode);

router
    .route('/:id')
    .get(getClassroom)
    .put(updateClassroom)
    .delete(deleteClassroom);

module.exports = router; 