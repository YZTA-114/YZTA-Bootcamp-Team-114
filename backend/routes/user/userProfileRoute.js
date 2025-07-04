const express = require('express');

const UserProfile = require('../../models/user/UserProfile');
const advancedResults = require('../../middleware/advancedResults');

const { 
    getUserProfiles,
    getUserProfileById,
    updateUserProfile,
    deleteUserProfile,
    addUserProfile
 } = require('../../controllers/user/userProfileController');

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../../middleware/auth');

// anything below this is going to use protect.
router.use(protect);

router
    .route('/')
    .get(advancedResults(UserProfile), 
    getUserProfiles).post(authorize('admin'), addUserProfile);

router
    .route('/:id')
    .get(getUserProfileById)
    .put(updateUserProfile)
    .delete(authorize('admin'), deleteUserProfile)

module.exports = router;