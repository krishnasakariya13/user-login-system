const User = require("../models/user");
const { 
    ValidationError, 
    ConflictError,
    NotFoundError,
    validateRequired 
} = require("../utils/errors");

async function createUser(payload) {
  const { username, password, firstname, lastname } = payload;
  
  validateRequired(payload, ['username', 'password', 'firstname', 'lastname']);

  const exists = await User.usernameExists(username);
  if (exists) {
    throw new ConflictError("Username already exists", 'username');
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
    throw new Error('Failed to fetch users');
  }
}

async function getUserById(id) {
  if (!id) {
    throw new ValidationError('User ID is required');
  }
  
  const user = await User.safeFindById(id);
  if (!user) {
    throw new NotFoundError('User not found', 'user');
  }
  
  return user;
}

async function updateUser(id, updates) {
  if (!id) {
    throw new ValidationError('User ID is required');
  }
  
  const user = await User.updateByIdWithOptionalHash(id, updates);
  if (!user) {
    throw new NotFoundError('User not found', 'user');
  }
  
  return user;
}

async function deleteUser(id) {
  if (!id) {
    throw new ValidationError('User ID is required');
  }
  
  const user = await User.safeDeleteById(id);
  if (!user) {
    throw new NotFoundError('User not found', 'user');
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





