const mongoose = require('mongoose');
const { StatusCodes } = require('http-status-codes');
const catchAsync = require('../utils/catchAsync');
const Job = require('../models/Job');
const moment = require('moment');

exports.getAllJobs = catchAsync(async (req, res, next) => {
    // *** FILTERING ***

    const { search, status, jobType, sort } = req.query;

    // making a filterQuery object that will be passed as a filtering option to Model.find
    const filterQuery = {
        user: req.user.userId,
    };
    //Only add the values if they are not all as all == empty in find
    if (status && status !== 'all') filterQuery.status = status;
    if (jobType && jobType !== 'all') filterQuery.jobType = jobType;

    //If you want to search for documents where either the position or the company matches a given search term (e.g., "engineer"),
    //you can use MongoDB's $or operator.
    if (search) {
        filterQuery['$or'] = [
            { position: { $regex: search, $options: 'i' } },
            { company: { $regex: search, $options: 'i' } },
        ];
    }

    // ***SORTING ***
    let sortQuery = '';
    switch (sort) {
        case 'a-z':
            sortQuery = 'position';
            break;
        case 'z-a':
            sortQuery = '-position';
            break;
        case 'oldest':
            sortQuery = 'updatedAt';
            break;

        case 'latest':
        default:
            sortQuery = '-updatedAt';
            break;
    }

    // *** PAGINATION ***
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * 10;

    // Applying filtering, sorting and pagination
    const jobs = await Job.find(filterQuery).sort(sortQuery).skip(skip).limit(limit);

    const totalJobs = await Job.countDocuments(filterQuery);
    const numOfPages = Math.ceil(totalJobs / limit);

    res.status(StatusCodes.OK).json({ status: 'success', jobs, totalJobs, numOfPages });
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

exports.getStats = catchAsync(async (req, res, next) => {
    let stats = await Job.aggregate([
        {
            $match: { user: new mongoose.Types.ObjectId(req.user.userId) },
        },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 },
            },
        },
    ]);

    let defaultStats = { pending: 0, interview: 0, declined: 0 };
    stats.forEach((item) => {
        defaultStats[item._id] = item.count;
    });

    let monthlyApplications = await Job.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(req.user.userId) } },
        {
            $group: {
                _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
                count: { $sum: 1 },
            },
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        // { $limit: 6 },
    ]);

    monthlyApplications = monthlyApplications
        .map((item) => {
            const {
                _id: { year, month },
                count,
            } = item;
            const date = moment()
                .month(month - 1)
                .year(year)
                .format('MMM Y');
            return { date, count };
        })
        .reverse();

    //send response
    res.status(StatusCodes.OK).json({ status: 'success', defaultStats, monthlyApplications });
});
