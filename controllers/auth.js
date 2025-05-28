const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const { BadRequestError, UnauthenticatedError } = require('../errors');

exports.register = catchAsync(async (req, res, next) => {
    const newUser = await User.create(req.body);

    const token = await newUser.createJWT();

    res.status(StatusCodes.CREATED).json({
        status: 'success',
        user: { name: newUser.name },
        token,
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
    return res.status(StatusCodes.OK).json({ status: 'success', user: { name: user.name }, token });
});
