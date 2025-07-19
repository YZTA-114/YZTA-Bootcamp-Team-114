const express = require('express');

const Lesson = require('../../models/classroom/Lesson');
const advancedResults = require('../../middleware/advancedResults');

const { 
    getLessons, 
    getLesson, 
    createLesson, 
    updateLesson, 
    deleteLesson
} = require('../../controllers/classroom/lessonController');

const resourceRouter = require('./resourceRoute');

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../../middleware/auth');

// Protect all routes after this middleware
router.use(protect);

// Re-route into other resource routers
router.use('/:lessonId/resources', resourceRouter);

router
    .route('/')
    .get(advancedResults(Lesson, {
        path: 'classroom',
        populate: {
            path: 'owner',
            select: 'name email'
        }
    }), getLessons)
    .post(createLesson);

router
    .route('/:id')
    .get(getLesson)
    .put(updateLesson)
    .delete(deleteLesson);

module.exports = router; 