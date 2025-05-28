const { ForbiddenError, NotFoundError } = require('../errors');
const catchAsync = require('../utils/catchAsync');

const checkOwnership = (Model, modelName = '') => {
    return catchAsync(async (req, res, next) => {
        const resoruce = await Model.findById(req.params.id);

        if (!resoruce) {
            return next(new NotFoundError(`No ${modelName} with ID: ${req.params.id} found`));
        }

        //check the if the user is authorized to get this resoruce (owner or not)
        if (resoruce.user != req.user.userId) {
            return next(new ForbiddenError('You do not have access to perform this action'));
        }

        req.resource = resoruce;
        next();
    });
};

module.exports = checkOwnership;
