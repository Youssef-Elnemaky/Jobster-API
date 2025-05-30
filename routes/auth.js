const express = require('express');
const { register, login, updateUser } = require('../controllers/auth');
const { authenticate } = require('../middleware/authentication');
const { testUser } = require('../middleware/testUser');

const authRouter = express.Router();

authRouter.route('/register').post(register);
authRouter.route('/login').post(login);
authRouter.route('/updateUser').patch(authenticate, testUser, updateUser);

module.exports = authRouter;
