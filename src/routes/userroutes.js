const router = require('express').Router();
const auth = require('../middleware/authmiddleware');
const { 
    sendSuccess
} = require('../helper/response');
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../services/userService');
const { asyncHandler } = require('../utils/errors');
const HTTP_STATUS = require('../constants/statusCodes');

router.post('/', asyncHandler(async (req, res) => {
  console.log('POST /api/users called');
  const user = await createUser(req.body);
  return sendSuccess(res, 'User created successfully', user, HTTP_STATUS.CREATED);
}));

router.get('/', auth, asyncHandler(async (req, res) => {
  console.log('GET /api/users called by userId:', req.user?.id);
  const users = await getAllUsers();
  return sendSuccess(res, 'Users fetched successfully', users);
}));

router.get('/:id', auth, asyncHandler(async (req, res) => {
  console.log('GET /api/users/:id called by userId:', req.user?.id, 'for id:', req.params.id);
  const user = await getUserById(req.params.id);
  return sendSuccess(res, 'User fetched successfully', user);
}));

router.put('/:id', auth, asyncHandler(async (req, res) => {
  console.log('PUT /api/users/:id called by userId:', req.user?.id, 'for id:', req.params.id);
  const updates = { ...req.body };
  const user = await updateUser(req.params.id, updates);
  return sendSuccess(res, 'User updated successfully', user);
}));

router.delete('/:id', auth, asyncHandler(async (req, res) => {
  console.log('DELETE /api/users/:id called by userId:', req.user?.id, 'for id:', req.params.id);
  const user = await deleteUser(req.params.id);
  return sendSuccess(res, 'User deleted successfully', user);
}));

module.exports = router;