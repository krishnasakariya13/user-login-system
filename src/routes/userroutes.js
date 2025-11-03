
const router = require('express').Router();
const auth = require('../middleware/authmiddleware');
const { asyncHandler } = require('../utils/errors');
const {
  createUserController,
  getAllUsersController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
  getUsernamesController,
  changePasswordController,
} = require('../controllers/userController');
const upload = require('../middleware/upload');

router.post('/', auth, upload.single('photo'), asyncHandler(createUserController));
router.get('/', auth, asyncHandler(getAllUsersController));
router.get('/usernames', auth, asyncHandler(getUsernamesController));
router.put('/change-password/:id', auth, asyncHandler(changePasswordController));
router.get('/:id', auth, asyncHandler(getUserByIdController));
router.put('/:id', auth, upload.single('photo'), asyncHandler(updateUserController));
router.delete('/:id', auth, asyncHandler(deleteUserController));

module.exports = router;
