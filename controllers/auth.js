const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const { BadRequestError, UnauthenticatedError, NotFoundError } = require('../errors');

exports.register = catchAsync(async (req, res, next) => {
    const newUser = await User.create(req.body);

    const token = await newUser.createJWT();

    res.status(StatusCodes.CREATED).json({
        status: 'success',
        user: {
            email: newUser.email,
            lastName: newUser.lastName,
            location: newUser.location,
            name: newUser.name,
            token,
        },
    });
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new BadRequestError('Email and password must be provided'));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePasswords(password))) {
        return next(new UnauthenticatedError('Invalid email or password'));
    }

    //generate JWT token and send it back
    const token = await user.createJWT();
    return res.status(StatusCodes.OK).json({
        status: 'success',
        user: {
            email: user.email,
            lastName: user.lastName,
            location: user.location,
            name: user.name,
            token,
        },
    });
});

exports.updateUser = catchAsync(async (req, res, next) => {
    const { name, lastName, email, location } = req.body;
    const userId = req.user.userId;
    if (!name || !lastName || !email || !location) {
        return next(new BadRequestError('All values must be provided'));
    }

    const user = await User.findById(userId);

    if (!user) {
        return next(new NotFoundError(`User with ${userId} not found`));
    }

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { name, lastName, email, location },
        { new: true, runValidators: true }
    );

    const token = await updatedUser.createJWT();

    return res.status(StatusCodes.OK).json({
        status: 'success',
        user: {
            email: updatedUser.email,
            lastName: updatedUser.lastName,
            location: updatedUser.location,
            name: updatedUser.name,
            token,
        },
    });
});
