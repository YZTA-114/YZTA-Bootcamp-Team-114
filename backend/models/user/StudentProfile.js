const mongoose = require('mongoose');

const UserProfile = require('./UserProfile');

const StudentProfileSchema = new mongoose.Schema({
    
});

module.exports = UserProfile.discriminator('StudentProfile', StudentProfileSchema);