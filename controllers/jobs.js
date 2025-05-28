const { StatusCodes } = require('http-status-codes');
const catchAsync = require('../utils/catchAsync');
const Job = require('../models/Job');

exports.getAllJobs = catchAsync(async (req, res, next) => {
    const jobs = await Job.find({ user: req.user.userId });
    res.status(StatusCodes.OK).json({ status: 'success', length: jobs.length, jobs });
});

exports.getJob = catchAsync(async (req, res, next) => {
    //Get the job from checkOwnership middleware
    const job = req.resource;

    res.status(StatusCodes.OK).json({ status: 'success', job });
});

exports.createJob = catchAsync(async (req, res, next) => {
    const newJob = await Job.create({ ...req.body, user: req.user.userId });

    res.status(StatusCodes.CREATED).json({ status: 'success', job: newJob });
});

exports.updateJob = catchAsync(async (req, res, next) => {
    //Get the job from checkOwnership middleware
    const job = req.resource;

    //update the document
    Object.assign(job, req.body);
    await job.save(); // will run the validators automatically

    //send the response
    res.status(StatusCodes.OK).json({ status: 'success', job });
});

exports.deleteJob = catchAsync(async (req, res, next) => {
    //Get the job from checkOwnership middleware
    const job = req.resource;

    //delete the document
    await job.deleteOne();

    //send the response
    res.status(StatusCodes.NO_CONTENT).json({ status: 'success' });
});
