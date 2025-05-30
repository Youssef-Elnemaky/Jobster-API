const { ForbiddenError } = require('../errors/');

exports.testUser = (req, res, next) => {
    //check for testUser ID
    if (req.user.userId == '6839240261ab9fb89d211d7e') {
        return next(new ForbiddenError('Test User. Read Only'));
    }
    next();
};
