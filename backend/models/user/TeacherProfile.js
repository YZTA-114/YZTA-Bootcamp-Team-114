const mongoose = require('mongoose');

const UserProfile = require('./UserProfile');

const TeacherProfileSchema = new mongoose.Schema({
    department: {
        type: String,
        required: [true, 'Please add a department']
    },
});

module.exports = UserProfile.discriminator('TeacherProfile', TeacherProfileSchema);