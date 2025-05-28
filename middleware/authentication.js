const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const { BadRequestError } = require('../errors');
const catchAsync = require('../utils/catchAsync');

exports.authenticate = catchAsync(async (req, res, next) => {
    //check if the token is present
    let token = req.headers.authorization;

    if (!token || !token.startsWith('Bearer ')) {
        return next(new BadRequestError('Invalid Token'));
    }

    token = token.split(' ')[1];

    // verifies the token and check if it's valid and hasn't expired
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    req.user = { userId: decoded.userId, name: decoded.name };

    next();
});
