# User Authentication API

A robust Node.js authentication API built with Express.js and MongoDB using Mongoose.

## 🚀 Features

- User registration and login
- JWT-based authentication with access and refresh tokens
- Password hashing with bcrypt
- Comprehensive error handling
- Input validation
- Login history tracking
- Token refresh mechanism
- Secure logout

## 📁 Project Structure

```
src/
├── constants/           # Application constants
│   ├── statusCodes.js   # HTTP status codes
│   ├── errorMessages.js # Error messages
│   └── index.js         # Constants export
├── controllers/         # Route controllers
│   └── authcontroller.js
├── helper/             # Utility helpers
│   └── response.js     # Response formatting
├── middleware/         # Express middleware
│   ├── authmiddleware.js
│   └── token.js        # JWT token utilities
├── models/             # Database models
│   └── user.js         # User schema and methods
├── routes/             # API routes
│   ├── authroutes.js
│   ├── userroutes.js
│   └── index.js
├── services/           # Business logic layer
│   ├── authService.js
│   └── userService.js
├── utils/              # Utility functions
│   └── errors.js       # Error handling utilities
├── config/             # Configuration
│   └── db.js           # Database connection
├── app.js              # Express app setup
├── server.js           # Server entry point
└── index.js            # Application entry point
```

## 🛠️ Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with the following variables:
```env
MONGO_URI=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
ACCESS_EXPIRES=15m
REFRESH_EXPIRES=7d
PORT=3001
```

3. Start the server:
```bash
npm run dev
```

## 📚 API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

## 🔧 Key Improvements Made

### 1. **Fixed User Model Issues**
- Fixed `timestamps` syntax error
- Changed `loginHistory` from single Date to array of Dates
- Made `lastLoginAt` optional with default null
- Moved static methods before module.exports

### 2. **Created Constants Structure**
- Centralized HTTP status codes
- Standardized error messages
- Easy maintenance and consistency

### 3. **Implemented Comprehensive Error Handling**
- Custom error classes (AppError, ValidationError, AuthenticationError, etc.)
- Global error handler middleware
- Async error wrapper
- Validation helper functions

### 4. **Enhanced Response Helper**
- Standardized API response format
- Success and error response methods
- Consistent response structure across the application

### 5. **Refactored Authentication Flow**
- Clean separation of concerns (Controller → Service → Model)
- Proper error handling with custom error classes
- Consistent use of constants
- Async/await error handling with wrapper

### 6. **Improved Code Structure**
- Service layer for business logic
- Controller layer for request/response handling
- Model layer with static methods for database operations
- Utility functions for common operations

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Refresh token rotation
- Input validation
- Error message sanitization
- Secure logout with token invalidation

## 📝 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

## 🧪 Testing

The API can be tested using tools like Postman or curl. Make sure to include the required headers and body parameters for each endpoint.

## 📄 License

This project is licensed under the ISC License.

