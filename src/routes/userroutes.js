
const router = require('express').Router();
const auth = require('../middleware/authmiddleware');
const { asyncHandler } = require('../utils/errors');
const {
  createUserController,
  getAllUsersController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
} = require('../controllers/userController');

router.post('/', asyncHandler(createUserController));
router.get('/', auth, asyncHandler(getAllUsersController));
router.get('/:id', auth, asyncHandler(getUserByIdController));
router.put('/:id', auth, asyncHandler(updateUserController));
router.delete('/:id', auth, asyncHandler(deleteUserController));

module.exports = router;
