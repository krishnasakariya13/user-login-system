const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const User = require("../models/user"); // Using dbHelper instead
const { signAccess, signRefresh } = require('../middleware/token');
const ERROR_MESSAGES = require('../constants/errorMessages');
const {
  ValidationError,
  AuthenticationError,
  ConflictError,
  NotFoundError,
  // DatabaseError, // Unused import
  validateRequired,
} = require('../utils/errors');
const sendEmail = require('../utils/sendEmail');
const dbHelper = require('../helper/dbhelper');
async function registerUser(payload = {}) {
  if (!payload || Object.keys(payload).length === 0) {
    throw new ValidationError('Request body is empty');
  }
  const { username, password, firstname, lastname, photo, email } = payload;
  console.log('email:', email);
  validateRequired(payload, [
    'username',
    'password',
    'firstname',
    'lastname',
    'photo',
    'email',
  ]);
  console.log(
    'validation:',
    (payload,
    ['username', 'password', 'firstname', 'lastname', 'photo', 'email'])
  );
  console.log('line 26');

  const exists = await dbHelper.usernameExists(username);
  if (exists) {
    throw new ConflictError(ERROR_MESSAGES.USERNAME_ALREADY_EXISTS);
  }

  console.log('linw 33');
  const user = await dbHelper.createWithHashedPassword({
    username,
    password,
    firstname,
    lastname,
    photo,
    email,
  });

  console.log('line 43');
  console.log('user', user);

  const accessToken = signAccess(user);
  const refreshToken = signRefresh(user);

  console.log('accessToken', accessToken);

  return {
    id: user._id,
    username: user.username,
    firstname: user.firstname,
    lastname: user.lastname,
    photo: user.photo,
    email: user.email,
    createdAt: user.createdAt,
    accessToken,
    refreshToken,
  };
}

async function loginUser(payload) {
  const safePayload = payload || {};
  const { username, password } = safePayload;

  validateRequired(safePayload, ['username', 'password']);

  const user = await dbHelper.findByUsername(username);
  if (!user) {
    throw new AuthenticationError(ERROR_MESSAGES.INVALID_USERNAME);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AuthenticationError(ERROR_MESSAGES.INVALID_PASSWORD);
  }

  const accessToken = signAccess(user);
  const refreshToken = signRefresh(user);

  // const now = new Date(); // Unused variable

  return {
    accessToken,
    refreshToken,
    lastLoginAt: user.lastLoginAt,
  };
}

async function refreshTokens(refreshToken) {
  if (!refreshToken) {
    throw new ValidationError(ERROR_MESSAGES.REFRESH_TOKEN_REQUIRED);
  }

  const payload = await new Promise((resolve, reject) => {
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return reject(
            new AuthenticationError(ERROR_MESSAGES.REFRESH_TOKEN_EXPIRED)
          );
        }
        return reject(
          new AuthenticationError(ERROR_MESSAGES.INVALID_REFRESH_TOKEN)
        );
      }
      return resolve(decoded);
    });
  });

  const user = await dbHelper.safeFindById(payload.id);
  if (!user) {
    throw new AuthenticationError(ERROR_MESSAGES.REFRESH_TOKEN_NOT_RECOGNIZED);
  }

  const newAccessToken = signAccess(user);
  const newRefreshToken = signRefresh(user);

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
}

async function logoutUser(refreshToken) {
  if (!refreshToken) {
    throw new ValidationError(ERROR_MESSAGES.REFRESH_TOKEN_REQUIRED);
  }

  const payload = jwt.decode(refreshToken);
  if (!payload?.id) {
    return { success: true, message: ERROR_MESSAGES.ALREADY_LOGGED_OUT };
  }

  return { success: true, message: ERROR_MESSAGES.LOGOUT_SUCCESSFUL };
}

async function forgotPassword(email) {
  if (!email) {
    throw new ValidationError(ERROR_MESSAGES.EMAIL_REQUIRED);
  }

  const user = await dbHelper.findUserByEmail(email);
  if (!user) {
    throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
  }

  const token = await dbHelper.createResetToken(user);
  const resetLink = `http://localhost:3001/api/auth/reset-password/${token}`;

  try {
    await sendEmail(
      user.email,
      'Password Reset',
      `Click here to reset password: ${resetLink}`
    );
  } catch (error) {
    console.log('Email sending failed:', error.message);
  }

  return { message: ERROR_MESSAGES.RESET_LINK_SENT, resetToken: token };
}

async function resetPassword(token, newPassword) {
  if (!token) {
    throw new ValidationError(ERROR_MESSAGES.TOKEN_REQUIRED);
  }
  if (!newPassword) {
    throw new ValidationError(ERROR_MESSAGES.NEW_PASSWORD_REQUIRED);
  }

  const user = await dbHelper.resetPassword(token, newPassword);
  if (!user) {
    throw new ValidationError(ERROR_MESSAGES.TOKEN_INVALID);
  }

  return {
    message: ERROR_MESSAGES.PASSWORD_RESET_SUCCESS,
  };
}

module.exports = {
  registerUser,
  loginUser,
  refreshTokens,
  logoutUser,
  forgotPassword,
  resetPassword,
};
