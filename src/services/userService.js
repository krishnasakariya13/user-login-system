const {
  ValidationError,
  ConflictError,
  NotFoundError,
  validateRequired,
  DatabaseError,
} = require('../utils/errors');
const ERROR_MESSAGES = require('../constants/errorMessages');
const dbHelper = require('../helper/dbhelper');
async function createUser(payload) {
  const { username, password, firstname, lastname, photo, email } = payload;

  validateRequired(payload, [
    'username',
    'password',
    'firstname',
    'lastname',
    'photo',
    'email',
  ]);

  const exists = await dbHelper.usernameExists(username);
  if (exists) {
    throw new ConflictError(ERROR_MESSAGES.USERNAME_ALREADY_EXISTS, 'username');
  }

  const user = await dbHelper.createWithHashedPassword({
    username,
    password,
    firstname,
    lastname,
    photo,
    email,
  });

  return {
    id: user._id,
    username,
    firstname,
    lastname,
    photo,
    email,
    createdAt: user.createdAt,
  };
}
async function getAllUsers(options = {}) {
  try {
    return await dbHelper.safeFindAll(options);
  } catch {
    throw new DatabaseError(ERROR_MESSAGES.FAILED_TO_FETCH_USERS);
  }
}

async function getUserById(id) {
  if (!id) {
    throw new ValidationError(ERROR_MESSAGES.USER_ID_REQUIRED);
  }

  const user = await dbHelper.safeFindById(id);
  if (!user) {
    throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND, 'user');
  }

  return user;
}

async function updateUser(id, updates) {
  if (!id) {
    throw new ValidationError(ERROR_MESSAGES.USER_ID_REQUIRED);
  }

  const user = await dbHelper.updateByIdWithOptionalHash(id, updates);
  if (!user) {
    throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND, 'user');
  }

  return user;
}

async function deleteUser(id) {
  if (!id) {
    throw new ValidationError(ERROR_MESSAGES.USER_ID_REQUIRED);
  }

  const user = await dbHelper.safeDeleteById(id);
  if (!user) {
    throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND, 'user');
  }

  return user;
}

async function getUsernames() {
  try {
    const users = await dbHelper.getAllUsernames();
    return users.map((user) => user.username).join(',');
  } catch {
    throw new DatabaseError(ERROR_MESSAGES.FAILED_TO_FETCH_USERS);
  }
}

async function changePassword(id, currentPassword, newPassword) {
  if (!id) {
    throw new ValidationError(ERROR_MESSAGES.USER_ID_REQUIRED);
  }
  if (!currentPassword) {
    throw new ValidationError(ERROR_MESSAGES.CURRENT_PASSWORD_REQUIRED);
  }
  if (!newPassword) {
    throw new ValidationError(ERROR_MESSAGES.NEW_PASSWORD_REQUIRED);
  }

  const result = await dbHelper.changePassword(
    id,
    currentPassword,
    newPassword
  );
  if (result === null) {
    throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND, 'user');
  }
  if (result === false) {
    throw new ValidationError(ERROR_MESSAGES.CURRENT_PASSWORD_INCORRECT);
  }

  return { message: ERROR_MESSAGES.PASSWORD_CHANGE_SUCCESS };
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUsernames,
  changePassword,
};
