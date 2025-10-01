const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { signAccess, signRefresh } = require("../middleware/token");
const ERROR_MESSAGES = require("../constants/errorMessages");
const { 
    ValidationError, 
    AuthenticationError, 
    ConflictError,
    validateRequired 
} = require("../utils/errors");

async function registerUser(payload) {
  const { username, password, firstname, lastname } = payload;

  validateRequired(payload, ['username', 'password', 'firstname', 'lastname']);

  const exists = await User.usernameExists(username);
  if (exists) {
    throw new ConflictError(ERROR_MESSAGES.USERNAME_ALREADY_EXISTS);
  }

  const user = await User.createWithHashedPassword({
    username,
    password,
    firstname,
    lastname,
  });

  const accessToken = signAccess(user);
  const refreshToken = signRefresh(user);

  user.refreshToken = refreshToken;


  return {
    user: {
      id: user._id,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      createdAt: user.createdAt,
    },
    accessToken,
    refreshToken,
  };
}

async function loginUser(payload) {
  const safePayload = payload || {};
  const { username, password } = safePayload;

  validateRequired(safePayload, ['username', 'password']);

  const user = await User.findByUsername(username);
  if (!user) {
    throw new AuthenticationError(ERROR_MESSAGES.INVALID_USERNAME);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AuthenticationError(ERROR_MESSAGES.INVALID_PASSWORD);
  }

  const accessToken = signAccess(user);
  const refreshToken = signRefresh(user);

  const now = new Date();
  user.refreshToken = refreshToken;
  user.lastLoginAt = now;
  
  if (!user.loginHistory) {
    user.loginHistory = [];
  }
  user.loginHistory.push(now);
  
  return {
    accessToken,
    refreshToken,
    lastLoginAt: user.lastLoginAt,
    success: true,
  };
}

async function refreshTokens(refreshToken) {
  if (!refreshToken) {
    throw new ValidationError(ERROR_MESSAGES.REFRESH_TOKEN_REQUIRED);
  }

  const payload = await new Promise((resolve, reject) => {
    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
      (err, decoded) => {
        if (err) {
          reject(new AuthenticationError(ERROR_MESSAGES.INVALID_REFRESH_TOKEN));
        } else {
          resolve(decoded);
        }
      }
    );
  });

  const user = await User.findById(payload.id);
  if (!user || user.refreshToken !== refreshToken) {
    throw new AuthenticationError(ERROR_MESSAGES.REFRESH_TOKEN_NOT_RECOGNIZED);
  }

  const newAccessToken = signAccess(user);
  const newRefreshToken = signRefresh(user);

  user.refreshToken = newRefreshToken;

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

  const user = await User.findById(payload.id);
  if (user && user.refreshToken === refreshToken) {
    user.refreshToken = null;
    await user.save();
  }

  return { success: true, message: ERROR_MESSAGES.LOGOUT_SUCCESSFUL };
}

module.exports = {
  registerUser,
  loginUser,
  refreshTokens,
  logoutUser,
};



