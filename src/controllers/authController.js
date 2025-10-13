const { 
  registerUser, 
  loginUser, 
  refreshTokens, 
  logoutUser 
} = require("../services/authService");
const { sendSuccess } = require("../helper/response");
const HTTP_STATUS = require("../constants/statusCodes");
const ERROR_MESSAGES = require("../constants/errorMessages");

const registerUserController = async (req, res) => {
  console.log('POST /api/auth/register called');
  const result = await registerUser(req.body);
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

module.exports = {
  register: registerUserController,
  login: loginUserController,
  refresh: refreshTokensController,
  logout: logoutUserController
};
