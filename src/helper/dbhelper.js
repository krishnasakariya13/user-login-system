const bcrypt = require('bcryptjs');
const User = require('../models/user');

const dbHelper = {
  findByUsername: (username) => User.findOne({ username }),

  usernameExists: async (username) => {
    const existing = await User.exists({ username });
    return !!existing;
  },

  createWithHashedPassword: async (data) => {
    const { username, password, firstname, lastname, photo, email } = data;
    const hashed = await bcrypt.hash(password, 10);
    return User.create({
      username,
      password: hashed,
      firstname,
      lastname,
      photo,
      email,
    });
  },

  updateByIdWithOptionalHash: async (id, updates) => {
    const next = { ...updates };
    const user = await User.findByIdAndUpdate(id, next, {
      new: true,
      runValidators: true,
      select: '-password -refreshToken',
    });
    return user;
  },

  safeFindAll: (options = {}) => {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = options;
    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
    return User.find()
      .select('-password -refreshToken')
      .sort(sort)
      .skip(skip)
      .limit(limit);
  },

  safeFindById: (id) => User.findById(id).select('-password -refreshToken'),

  safeDeleteById: (id) =>
    User.findByIdAndDelete(id).select('-password -refreshToken'),

  getAllUsernames: () => User.find().select('username -_id'),

  changePassword: async (id, currentPassword, newPassword) => {
    const user = await User.findById(id);
    if (!user) return null;

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) return false;

    const hashed = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(id, { password: hashed });
    return true;
  },

  findUserByEmail: async (email) => {
    return await User.findByEmail(email);
  },

  createResetToken: async (user) => {
    return await User.createResetToken(user);
  },

  resetPassword: async (token, newPassword) => {
    return await User.resetPasswordByToken(token, newPassword);
  },
};

module.exports = dbHelper;
