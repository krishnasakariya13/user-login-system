
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../services/userService');

const { sendSuccess } = require('../helper/response');
const HTTP_STATUS = require('../constants/statusCodes');
const ERROR_MESSAGES = require('../constants/errorMessages');

// Create User
const createUserController = async (req, res) => {
  console.log('POST /api/users called');
  const user = await createUser(req.body);
  return sendSuccess(res, ERROR_MESSAGES.USER_CREATED_SUCCESSFULLY, user, HTTP_STATUS.CREATED);
};

// Get All Users
const getAllUsersController = async (req, res) => {
  console.log('GET /api/users called by userId:', req.user?.id);
  const users = await getAllUsers();
  return sendSuccess(res, ERROR_MESSAGES.USERS_FETCHED_SUCCESSFULLY, users);
};

// Get User by ID
const getUserByIdController = async (req, res) => {
  console.log('GET /api/users/:id called by userId:', req.user?.id, 'for id:', req.params.id);
  const user = await getUserById(req.params.id);
  return sendSuccess(res, ERROR_MESSAGES.USER_FETCHED_SUCCESSFULLY, user);
};

// Update User
const updateUserController = async (req, res) => {
  console.log('PUT /api/users/:id called by userId:', req.user?.id, 'for id:', req.params.id);
  const updates = { ...req.body };
  const user = await updateUser(req.params.id, updates);
  if (!user) {
    throw new Error(ERROR_MESSAGES.USER_UPDATE_FAILED);
  }
  return sendSuccess(res, ERROR_MESSAGES.USER_UPDATED_SUCCESSFULLY, user);
};

// Delete User
const deleteUserController = async (req, res) => {
  console.log('DELETE /api/users/:id called by userId:', req.user?.id, 'for id:', req.params.id);
  const user = await deleteUser(req.params.id);
  if (!user) {
    throw new Error(ERROR_MESSAGES.USER_DELETE_FAILED);
  }
  return sendSuccess(res, ERROR_MESSAGES.USER_DELETED_SUCCESSFULLY, user);
};

module.exports = {
  createUserController,
  getAllUsersController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
};
