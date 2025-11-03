const { 
  registerUser, 
  loginUser, 
  refreshTokens, 
  logoutUser,
  forgotPassword,
  resetPassword
} = require("../services/authService");
const { sendSuccess } = require("../helper/response");
const HTTP_STATUS = require("../constants/statusCodes");
const ERROR_MESSAGES = require("../constants/errorMessages");
const { asyncHandler } = require('../utils/errors');
const registerUserController = async (req, res) => {
  console.log('POST /api/auth/register called');
  const payload = {
      ...req.body,
      photo: req.file ? req.file.filename : null,
    };

    const result = await registerUser(payload);
  return sendSuccess(
    res,
    ERROR_MESSAGES.REGISTRATION_SUCCESSFUL,
    result,
    HTTP_STATUS.CREATED
  );
};

const loginUserController = async (req, res) => {
  console.log('POST /api/auth/login called');
  const result = await loginUser(req.body);
  return sendSuccess(
    res,
    ERROR_MESSAGES.LOGIN_SUCCESSFUL,
    result
  );
};

const refreshTokensController = async (req, res) => {
  console.log('POST /api/auth/refresh called');
  const { refreshToken } = req.body;
  const result = await refreshTokens(refreshToken);
  return sendSuccess(
    res,
    ERROR_MESSAGES.TOKEN_REFRESHED_SUCCESSFULLY,
    result
  );
};

const logoutUserController = async (req, res) => {
  console.log('POST /api/auth/logout called');
  const { refreshToken } = req.body;
  const result = await logoutUser(refreshToken);
  return sendSuccess(
    res,
    result.message,
    null
  );
};

const forgotPasswordController = async (req, res) => {
  console.log('POST /api/auth/forgot-password called');
  const { email } = req.body;
  const result = await forgotPassword(email);
  return sendSuccess(
    res,
    result.message,
    { resetToken: result.resetToken },
    HTTP_STATUS.OK
  );
};

const resetPasswordController = async (req, res) => {
  console.log('PUT /api/auth/reset-password called');
  const { token } = req.params;
  const { newPassword } = req.body;
  const result = await resetPassword(token, newPassword);
  return sendSuccess(
    res,
    result.message,
    null,
    HTTP_STATUS.OK
  );
};


module.exports = {
  registerUserController,
  loginUserController,
  refreshTokensController,
  logoutUserController,
  forgotPasswordController,
  resetPasswordController,
};
