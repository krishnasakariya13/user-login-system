const ERROR_MESSAGES = {
    // Authentication Errors
    USERNAME_REQUIRED: 'Username is required',
    PASSWORD_REQUIRED: 'Password is required',
    FIRSTNAME_REQUIRED: 'First name is required',
    LASTNAME_REQUIRED: 'Last name is required',
    USERNAME_ALREADY_EXISTS: 'Username already exists',
    INVALID_USERNAME: 'Invalid username',
    INVALID_PASSWORD: 'Invalid password',
    INVALID_CREDENTIALS: 'Incorrect username or password. Try again.',
    USER_ID_REQUIRED: 'User ID is required',
    USER_NOT_FOUND: 'User not found',
    PASSWORD_TOO_SHORT: 'Password must be at least 6 characters',
    MISSING_AUTHORIZATION_HEADER: 'You are not logged in. Please log in to continue.',
    INVALID_OR_EXPIRED_ACCESS_TOKEN: 'Invalid or expired access token',
    
    // Token Errors
    REFRESH_TOKEN_REQUIRED: 'Refresh token is required',
    INVALID_REFRESH_TOKEN: 'Invalid refresh token',
    REFRESH_TOKEN_EXPIRED: 'Refresh token expired',
    REFRESH_TOKEN_NOT_RECOGNIZED: 'Your session has expired. Please log in again',
    ACCESS_TOKEN_REQUIRED: 'Access token is required',
    INVALID_ACCESS_TOKEN: 'Invalid access token',
    ACCESS_TOKEN_EXPIRED: 'access token is expired',
    
    // General Errors
    INTERNAL_SERVER_ERROR: 'Internal server error',
    VALIDATION_ERROR: 'Validation error',
    UNAUTHORIZED_ACCESS: 'Unauthorized access',
    RESOURCE_NOT_FOUND: 'Resource not found',
    ALREADY_LOGGED_OUT: 'Already logged out',
    FAILED_TO_FETCH_USERS: 'Failed to fetch users',

    // DB Errors
    DB_CONNECTION_FAILED: 'MongoDB connection failed',
    DB_CONNECTION_ERROR: 'MongoDB connection error',
    DB_DISCONNECTED: 'MongoDB disconnected',
    DB_TERMINATED: 'MongoDB connection closed through app termination',

      // User Errors
    USER_UPDATE_FAILED: 'Failed to update user',
    USER_DELETE_FAILED: 'Failed to delete user',
    USER_NOT_FOUND: 'User not found with this email',
    RESET_LINK_SENT: 'Password reset link sent successfully',
    PASSWORD_RESET_SUCCESS: 'Password reset successfully',
    SERVER_ERROR: 'Internal server error',
    EMAIL_REQUIRED: 'Email is required',
    TOKEN_REQUIRED: 'Reset token is required',
    NEW_PASSWORD_REQUIRED: 'New password is required',
    TOKEN_INVALID: 'Reset token is invalid or expired',
    PASSWORD_TOO_SHORT: 'Password must be at least 6 characters long',
    USER_ID_REQUIRED: 'User ID is required',
    CURRENT_PASSWORD_REQUIRED: 'Current password is required',
    NEW_PASSWORD_REQUIRED: 'New password is required',
    CURRENT_PASSWORD_INCORRECT: 'Current password is incorrect',
    PASSWORD_CHANGE_SUCCESS: 'Password changed successfully',
    USER_NOT_FOUND: 'User not found',
    PASSWORD_TOO_SHORT: 'Password must be at least 6 characters long',
    INTERNAL_SERVER_ERROR: 'Something went wrong. Please try again later.',

    
    // Success Messages
    REGISTRATION_SUCCESSFUL: 'Registration successful',
    LOGIN_SUCCESSFUL: 'Login successful',
    LOGOUT_SUCCESSFUL: 'Logout successful',
    TOKEN_REFRESHED_SUCCESSFULLY: 'Token refreshed successfully',
    USER_CREATED_SUCCESSFULLY: 'User created successfully',
    USER_NAME_FETCH_SUCCESSFULLY: 'username fetch successfully',
    PASSWORD_CHANGE_SUCCESSFULLY: 'password change succesfully',
    USERS_FETCHED_SUCCESSFULLY: 'Users fetched successfully',
    USER_FETCHED_SUCCESSFULLY: 'User fetched successfully',
    USER_UPDATED_SUCCESSFULLY: 'User updated successfully',
    USER_DELETED_SUCCESSFULLY: 'User deleted successfully',
};

module.exports = ERROR_MESSAGES;

