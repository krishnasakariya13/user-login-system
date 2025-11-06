const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUsernames,
  changePassword,
} = require('../services/userService');

const { sendSuccess } = require('../helper/response');
const HTTP_STATUS = require('../constants/statusCodes');
const ERROR_MESSAGES = require('../constants/errorMessages');

// Create User
const createUserController = async (req, res) => {
  console.log('POST /api/users called');
  console.log('req.body:', req.body);
  console.log('req.file:', req.file);
  const photoPath = req.file ? req.file.filename : null;
  const user = await createUser({
    ...req.body,
    photo: photoPath,
  });
  return sendSuccess(
    res,
    ERROR_MESSAGES.USER_CREATED_SUCCESSFULLY,
    user,
    HTTP_STATUS.CREATED
  );
};

// Get All Users
const getAllUsersController = async (req, res) => {
  console.log('GET /api/users called by userId:', req.user?.id);
  const { page, limit, sortBy, sortOrder } = req.query;
  const options = {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
    sortBy: sortBy || 'createdAt',
    sortOrder: sortOrder || 'desc',
  };
  const users = await getAllUsers(options);
  return sendSuccess(res, ERROR_MESSAGES.USERS_FETCHED_SUCCESSFULLY, users);
};

// Get User by ID
const getUserByIdController = async (req, res) => {
  console.log(
    'GET /api/users/:id called by userId:',
    req.user?.id,
    'for id:',
    req.params.id
  );
  const user = await getUserById(req.params.id);
  return sendSuccess(res, ERROR_MESSAGES.USER_FETCHED_SUCCESSFULLY, user);
};

// Update User
const updateUserController = async (req, res) => {
  console.log(
    'PUT /api/users/:id called by userId:',
    req.user?.id,
    'for id:',
    req.params.id
  );
  console.log('req.body:', req.body);
  console.log('req.file:', req.file);

  const updates = { ...req.body };

  if (req.file) {
    updates.photo = req.file.filename;
  }

  const user = await updateUser(req.params.id, updates);
  if (!user) {
    throw new Error(ERROR_MESSAGES.USER_UPDATE_FAILED);
  }
  return sendSuccess(res, ERROR_MESSAGES.USER_UPDATED_SUCCESSFULLY, user);
};

// Delete User
const deleteUserController = async (req, res) => {
  console.log(
    'DELETE /api/users/:id called by userId:',
    req.user?.id,
    'for id:',
    req.params.id
  );
  const user = await deleteUser(req.params.id);
  if (!user) {
    throw new Error(ERROR_MESSAGES.USER_DELETE_FAILED);
  }
  return sendSuccess(res, ERROR_MESSAGES.USER_DELETED_SUCCESSFULLY, user);
};

// Get Usernames (comma-separated)
const getUsernamesController = async (req, res) => {
  console.log('GET /api/users/usernames called by userId:', req.user?.id);
  const usernames = await getUsernames();
  return sendSuccess(res, ERROR_MESSAGES.USER_NAME_FETCH_SUCCESSFULLY, {
    usernames,
  });
};

// Change Password
const changePasswordController = async (req, res) => {
  console.log('PUT /api/users/change-password called by userId:', req.user?.id);
  const { currentPassword, newPassword } = req.body || {};
  const result = await changePassword(
    req.user.id,
    currentPassword,
    newPassword
  );
  return sendSuccess(res, ERROR_MESSAGES.PASSWORD_CHANGE_SUCCESSFULLY, result);
};

module.exports = {
  createUserController,
  getAllUsersController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
  getUsernamesController,
  changePasswordController,
};
