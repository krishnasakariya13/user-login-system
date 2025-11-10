const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { signAccess, signRefresh } = require('../middleware/token');
const ERROR_MESSAGES = require('../constants/errorMessages');
const {
  ValidationError,
  AuthenticationError,
  ConflictError,
  // NotFoundError,
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
    throw new ValidationError('Email is required');
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ValidationError('User not found');
  }

  // Generate reset token
  const jwtSecret = process.env.JWT_SECRET || process.env.JWT_ACCESS_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT secret not configured');
  }
  const resetToken = jwt.sign({ id: user._id }, jwtSecret, {
    expiresIn: '15m',
  });

  // Save token in database
  user.resetToken = resetToken;
  user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
  await user.save();

  // Create reset URL
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  // Compose email
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
        <p>Hello,</p>
        <p>You requested a password reset for your account. Click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
        </div>
        <p><strong>This link expires in 15 minutes.</strong></p>
        <p style="font-size: 12px; color: #666; word-break: break-all;">${resetUrl}</p>
      </div>
`,
  };

  // Debug email credentials
  console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'Not set');
  console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set' : 'Not set');

  try {
    await sendEmail(user.email, mailOptions.subject, mailOptions.html);
    console.log('Password reset email sent to:', user.email);
  } catch (error) {
    console.error('Failed to send email:', error.message);
    // Continue without throwing error - token is still generated
  }

  return { message: 'Reset link sent to your email' };
}

async function resetPassword(token, newPassword) {
  if (!token) {
    throw new ValidationError('Reset token is required');
  }
  if (!newPassword) {
    throw new ValidationError('New password is required');
  }
  if (newPassword.length < 6) {
    throw new ValidationError('Password must be at least 6 characters long');
  }

  // Verify token
  const jwtSecret = process.env.JWT_SECRET || process.env.JWT_ACCESS_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT secret not configured');
  }

  let decoded;
  try {
    decoded = jwt.verify(token, jwtSecret);
  } catch {
    throw new ValidationError('Invalid or expired token');
  }

  const user = await User.findById(decoded.id);
  if (
    !user ||
    user.resetToken !== token ||
    user.resetTokenExpiry < Date.now()
  ) {
    throw new ValidationError('Invalid or expired token');
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);

  // Clear reset token
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();

  console.log('Password reset successful for user:', user.email);
  return { message: 'Password reset successful' };
}

module.exports = {
  registerUser,
  loginUser,
  refreshTokens,
  logoutUser,
  forgotPassword,
  resetPassword,
};
