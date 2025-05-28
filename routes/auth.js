const express = require('express');
const { register, login, updateUser } = require('../controllers/auth');
const { authenticate } = require('../middleware/authentication');

const authRouter = express.Router();

authRouter.route('/register').post(register);
authRouter.route('/login').post(login);
authRouter.route('/updateUser').patch(authenticate, updateUser);

module.exports = authRouter;
