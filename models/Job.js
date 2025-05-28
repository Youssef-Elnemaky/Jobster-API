const { required } = require('joi');
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
        jobLocation: {
            type: String,
            required: [true, 'Job location is required'],
            length: [50, 'Job location length cannot exceed 50'],
        },
        jobType: {
            type: String,
            enum: {
                values: ['full-time', 'part-time', 'remote', 'internship'],
                message: 'Invalid value for job type. Choose from (full-time , part-time, remote and internship)',
            },
            required: [true, 'Job type is required'],
        },
    },
    { timestamps: true }
);

const Job = mongoose.model('Job', JobSchema);

module.exports = Job;
