const express = require('express');

const Resource = require('../../models/classroom/Resource');
const advancedResults = require('../../middleware/advancedResults');

const { 
    getResources, 
    getResource, 
    createResource, 
    updateResource, 
    deleteResource
} = require('../../controllers/classroom/resourceController');

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../../middleware/auth');

// Protect all routes after this middleware
router.use(protect);

router
    .route('/')
    .get(advancedResults(Resource, [
        {
            path: 'lesson',
            populate: {
                path: 'classroom',
                populate: {
                    path: 'owner',
                    select: 'name email'
                }
            }
        }
    ]), getResources)
    .post(createResource);

router
    .route('/:id')
    .get(getResource)
    .put(updateResource)
    .delete(deleteResource);

module.exports = router; 