const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

// Function to generate random classroom code using nanoid
const generateClassroomCode = () => {
    return nanoid(4).toUpperCase();
};

const ClassroomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    subject: {
        type: String,
        required: [true, 'Please add a description']
    },
    code: {
        type: String,
        unique: true,
        default: generateClassroomCode
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please add an owner']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Pre-save middleware to ensure unique classroom code
ClassroomSchema.pre('save', async function(next) {
    if (this.isNew || this.isModified('code')) {
        let isUnique = false;
        let attempts = 0;
        const maxAttempts = 10;

        while (!isUnique && attempts < maxAttempts) {
            if (!this.code) {
                this.code = generateClassroomCode();
            }
            
            const existingClassroom = await this.constructor.findOne({ code: this.code });
            if (!existingClassroom) {
                isUnique = true;
            } else {
                this.code = generateClassroomCode();
                attempts++;
            }
        }

        if (!isUnique) {
            return next(new Error('Unable to generate unique classroom code after multiple attempts'));
        }
    }
    next();
});

// Static method to find classroom by code
ClassroomSchema.statics.findByCode = function(code) {
    return this.findOne({ code: code.toUpperCase() });
};

module.exports = mongoose.model('Classroom', ClassroomSchema);