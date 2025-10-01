const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    lastLoginAt: { type: Date, default: null },
    loginHistory: [{ type: Date }],
    refreshToken: { type: String, default: null },
}, {
    timestamps: true
});

userSchema.statics.findByUsername = function(username) {
    return this.findOne({ username });
};

userSchema.statics.usernameExists = async function(username) {
    const existing = await this.exists({ username });
    return !!existing;
};

userSchema.statics.createWithHashedPassword = async function(data) {
    const { username, password, firstname, lastname } = data;
    const hashed = await bcrypt.hash(password, 10);
    const user = await this.create({ username, password: hashed, firstname, lastname });
    return user;
};

userSchema.statics.updateByIdWithOptionalHash = async function(id, updates) {
    const next = { ...updates };
    if (next.password) {
        const salt = await bcrypt.genSalt(10);
        next.password = await bcrypt.hash(next.password, salt);
    }
    const user = await this.findByIdAndUpdate(id, next, {
        new: true,
        runValidators: true,
        select: '-password -refreshToken',
    });
    return user;
};

userSchema.statics.safeFindAll = function() {
    return this.find().select('-password -refreshToken');
};

userSchema.statics.safeFindById = function(id) {
    return this.findById(id).select('-password -refreshToken');
};

userSchema.statics.safeDeleteById = function(id) {
    return this.findByIdAndDelete(id).select('-password -refreshToken');
};


const User = mongoose.model('User', userSchema);

module.exports = User;


