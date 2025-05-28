const mongoose = require('mongoose');

const JobSchema = mongoose.Schema(
    {
        company: {
            type: String,
            required: [true, 'Company name is required'],
        },
        position: {
            type: String,
            required: [true, 'Position is required'],
        },

        status: {
            type: String,
            default: 'pending',
            enum: {
                values: ['pending', 'interview', 'declined'],
                message: 'Invalid value for status. You can choose from pending, interview and declined',
            },
            required: [true, 'Status is required'],
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    { timestamps: true }
);

const Job = mongoose.model('Job', JobSchema);

module.exports = Job;
