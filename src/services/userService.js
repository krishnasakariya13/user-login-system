const User = require("../models/user");
const { 
    ValidationError, 
    ConflictError,
    NotFoundError,
    validateRequired, 
    DatabaseError
} = require("../utils/errors");
const ERROR_MESSAGES = require("../constants/errorMessages")

async function createUser(payload) {
  const { username, password, firstname, lastname } = payload;
  
  validateRequired(payload, ['username', 'password', 'firstname', 'lastname']);

  const exists = await User.usernameExists(username);
  if (exists) {
    throw new ConflictError(ERROR_MESSAGES.USERNAME_ALREADY_EXISTS, 'username');
  }

  const user = await User.createWithHashedPassword({
    username,
    password,
    firstname,
    lastname,
  });

  return {
    id: user._id,
    username,
    firstname,
    lastname,
    createdAt: user.createdAt,
  };
}
async function getAllUsers() {
  try {
    return await User.safeFindAll();
  } catch (error) {
    throw new DatabaseError(ERROR_MESSAGES.FAILED_TO_FETCH_USERS);
  }
}

async function getUserById(id) {
  if (!id) {
    throw new ValidationError(ERROR_MESSAGES.USER_ID_REQUIRED);
  }
  
  const user = await User.safeFindById(id);
  if (!user) {
    throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND, 'user');
  }
  
  return user;
}

async function updateUser(id, updates) {
  if (!id) {
    throw new ValidationError(ERROR_MESSAGES.USER_ID_REQUIRED);
  }
  
  const user = await User.updateByIdWithOptionalHash(id, updates);
  if (!user) {
    throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND, 'user');
  }
  
  return user;
}

async function deleteUser(id) {
  if (!id) {
    throw new ValidationError(ERROR_MESSAGES.USER_ID_REQUIRED);
  }
  
  const user = await User.safeDeleteById(id);
  if (!user) {
    throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND, 'user');
  }
  
  return user;
}
// console.log('fgyjfyf');

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};





