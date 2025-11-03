const router = require('express').Router();
const {
    registerUserController,
    loginUserController,
    refreshTokensController,
    logoutUserController,
    forgotPasswordController,
    resetPasswordController
} = require('../controllers/authController');
const { asyncHandler } = require('../utils/errors');
const upload = require('../middleware/upload');

router.post('/register', upload.single('photo'), asyncHandler(registerUserController));
router.post('/login', asyncHandler(loginUserController));
router.post('/refresh', asyncHandler(refreshTokensController));
router.post('/logout', asyncHandler(logoutUserController));
router.post('/forgot-password', asyncHandler(forgotPasswordController));
router.put('/reset-password/:token', asyncHandler(resetPasswordController));
module.exports = router;