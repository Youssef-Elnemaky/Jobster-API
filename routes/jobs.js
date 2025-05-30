const express = require('express');

const { getAllJobs, getJob, createJob, updateJob, deleteJob, getStats } = require('../controllers/jobs');
const checkOwnership = require('../middleware/checkOwnership');
const { testUser } = require('../middleware/testUser');
const Job = require('../models/Job');

const jobsRouter = express.Router();

jobsRouter.route('/').get(getAllJobs).post(testUser, createJob);
jobsRouter.route('/stats').get(getStats);

jobsRouter.use('/:id', checkOwnership(Job, 'job'));
jobsRouter.route('/:id').get(getJob).patch(testUser, updateJob).delete(testUser, deleteJob);
module.exports = jobsRouter;
