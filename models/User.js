const { promisify } = require('util');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name must be provided'],
        minLength: [5, 'Name cannot be less than 5 characters'],
        maxLength: [25, 'Name cannot exceed 25 characters'],
        trim: true,
    },

    email: {
        type: String,
        unique: true,
        required: [true, 'Email must be provided'],
        validate: {
            validator: function (email) {
                return validator.isEmail(email);
            },
            message: 'Invalid Email',
        },
        maxLength: [50, 'Email cannot exceed 50 characters'],
    },

    password: {
        type: String,
        required: [true, 'Password must be provided'],
        maxLength: [50, 'Passowrd cannot exceed 50'],
        minLength: [10, 'Password cannot be shorter than 10'],
        select: false,
    },
    lastName: {
        type: String,
        maxLength: [20, 'Last name cannot exceed 20 characters'],
        default: 'lastName',
        trim: true,
    },
    location: {
        type: String,
        maxLength: [20, 'Location cannot exceed 20 characters'],
        trim: true,
        default: 'my city',
    },
});

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, process.env.SALT_ROUNDS * 1);
    next();
});

UserSchema.methods.comparePasswords = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.createJWT = async function () {
    const signAsync = promisify(jwt.sign);
    return await signAsync({ userId: this._id, name: this.name }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME,
    });
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
