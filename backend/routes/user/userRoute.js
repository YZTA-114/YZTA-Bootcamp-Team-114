const express = require('express');

const User = require('../../models/user/User');
const advancedResults = require('../../middleware/advancedResults');

const { getUsers, getUser, updateUser, deleteUser } = require('../../controllers/user/userController');

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../../middleware/auth');

// Include other resource routers
const userProfileRouter = require('./userProfileRoute');

// Re-route into other resource routers
router.use('/:userId/userprofiles', userProfileRouter);

// anything below this is going to use protect.
router.use(protect);
router.use(authorize('admin'));

router
    .route('/')
    .get(advancedResults(User, {
        path: 'userProfile' }
    ), getUsers);

router
    .route('/:id')
    .delete(deleteUser)
    .get(getUser)
    .put(updateUser)

module.exports = router;