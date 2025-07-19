const express = require('express');

const ClassroomParticipation = require('../../models/classroom/ClassroomParticipation');
const advancedResults = require('../../middleware/advancedResults');

const { 
    getClassroomParticipations, 
    getClassroomParticipation, 
    createClassroomParticipation, 
    updateClassroomParticipation, 
    deleteClassroomParticipation,
    getClassroomParticipationsByClassroom
} = require('../../controllers/classroom/classroomParticipationController');

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../../middleware/auth');

// Protect all routes after this middleware
router.use(protect);

// Admin only routes
router
    .route('/')
    .get(advancedResults(ClassroomParticipation, [
        {
            path: 'classroom',
            populate: {
                path: 'owner',
                select: 'name email'
            }
        },
        {
            path: 'user',
            select: 'name email role'
        }
    ]), getClassroomParticipations)
    .post(createClassroomParticipation);

router
    .route('/:id')
    .get(getClassroomParticipation)
    .put(authorize('admin'), updateClassroomParticipation)
    .delete(deleteClassroomParticipation);

// Nested routes for classroom participations
router
    .route('/classroom/:classroomId')
    .get(getClassroomParticipationsByClassroom);

module.exports = router; 