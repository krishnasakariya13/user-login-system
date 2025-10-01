const ERROR_MESSAGES = {
    // Authentication Errors
    USERNAME_REQUIRED: 'Username is required',
    PASSWORD_REQUIRED: 'Password is required',
    FIRSTNAME_REQUIRED: 'First name is required',
    LASTNAME_REQUIRED: 'Last name is required',
    USERNAME_ALREADY_EXISTS: 'Username already exists',
    INVALID_USERNAME: 'Invalid username',
    INVALID_PASSWORD: 'Invalid password',
    INVALID_CREDENTIALS: 'Invalid credentials',
    
    // Token Errors
    REFRESH_TOKEN_REQUIRED: 'Refresh token is required',
    INVALID_REFRESH_TOKEN: 'Invalid or expired refresh token',
    REFRESH_TOKEN_NOT_RECOGNIZED: 'Refresh token not recognized',
    ACCESS_TOKEN_REQUIRED: 'Access token is required',
    INVALID_ACCESS_TOKEN: 'Invalid or expired access token',
    
    // General Errors
    INTERNAL_SERVER_ERROR: 'Internal server error',
    VALIDATION_ERROR: 'Validation error',
    UNAUTHORIZED_ACCESS: 'Unauthorized access',
    RESOURCE_NOT_FOUND: 'Resource not found',
    ALREADY_LOGGED_OUT: 'Already logged out',
    
    // Success Messages
    REGISTRATION_SUCCESSFUL: 'Registration successful',
    LOGIN_SUCCESSFUL: 'Login successful',
    LOGOUT_SUCCESSFUL: 'Logout successful',
    TOKEN_REFRESHED_SUCCESSFULLY: 'Token refreshed successfully',
};

module.exports = ERROR_MESSAGES;

