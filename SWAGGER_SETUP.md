# Swagger API Documentation Setup

## Complete Node.js + Express Backend with Swagger UI

This project includes comprehensive API documentation using Swagger UI with JWT authentication support.

## 📁 Project Structure

```
src/
├── config/
│   ├── db.js                 # Database configuration
│   └── swagger.js            # Swagger configuration
├── controllers/
│   ├── authController.js     # Authentication controllers
│   └── userController.js     # User CRUD controllers
├── middleware/
│   ├── authmiddleware.js     # JWT authentication middleware
│   ├── token.js              # JWT token utilities
│   └── upload.js             # File upload middleware
├── models/
│   └── user.js               # User model with Mongoose
├── routes/
│   ├── authroutes.js         # Authentication routes with Swagger docs
│   └── userroutes.js         # User routes with Swagger docs
├── services/
│   ├── authService.js        # Authentication business logic
│   └── userService.js        # User business logic
├── utils/
│   ├── errors.js             # Error handling utilities
│   └── sendEmail.js          # Email utilities
├── constants/
│   └── errorMessages.js      # Error message constants
├── helper/
│   └── dbhelper.js           # Database helper functions
└── app.js                    # Main application file
```

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
npm install express mongoose bcryptjs jsonwebtoken
npm install swagger-jsdoc swagger-ui-express
npm install multer nodemailer dotenv nodemon
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/user-login-system
JWT_ACCESS_SECRET=your-access-token-secret
JWT_REFRESH_SECRET=your-refresh-token-secret
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 3. Start the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

### 4. Access Swagger Documentation

Open your browser and navigate to:
```
http://localhost:3001/api-docs
```

## 📚 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/refresh` | Refresh access token | No |
| POST | `/api/auth/logout` | Logout user | No |
| POST | `/api/auth/forgot-password` | Request password reset | No |
| PUT | `/api/auth/reset-password/:token` | Reset password | No |

### User Management Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/users` | Create new user | Yes |
| GET | `/api/users` | Get all users (paginated) | Yes |
| GET | `/api/users/:id` | Get user by ID | Yes |
| PUT | `/api/users/:id` | Update user | Yes |
| DELETE | `/api/users/:id` | Delete user | Yes |
| GET | `/api/users/usernames` | Get comma-separated usernames | Yes |
| PUT | `/api/users/change-password/:id` | Change user password | Yes |

## 🔐 JWT Authentication

### How to Use JWT in Swagger UI

1. **Login/Register** to get an access token
2. **Copy the access token** from the response
3. **Click "Authorize" button** in Swagger UI
4. **Enter**: `Bearer YOUR_ACCESS_TOKEN`
5. **Click "Authorize"** to apply to all protected endpoints

### Token Format
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📝 Swagger Features

### Comprehensive Documentation
- **Request/Response schemas** for all endpoints
- **Parameter descriptions** with types and validation
- **Security requirements** for protected routes
- **Error response examples** with status codes
- **File upload support** for multipart/form-data

### Interactive Testing
- **Try it out** functionality for all endpoints
- **Authentication flow** with JWT tokens
- **File upload testing** for photo uploads
- **Real-time validation** of request parameters

### Schema Definitions
- **User schema** with all properties
- **AuthResponse schema** for authentication responses
- **Error schema** for consistent error handling
- **Security schemes** for JWT bearer authentication

## 🛠 Customization

### Adding New Endpoints

1. **Create the route** in appropriate route file
2. **Add Swagger documentation** using JSDoc comments:

```javascript
/**
 * @swagger
 * /api/your-endpoint:
 *   post:
 *     summary: Your endpoint description
 *     tags: [YourTag]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success response
 */
```

### Modifying Swagger Config

Edit `src/config/swagger.js` to:
- **Change server URLs**
- **Add new schemas**
- **Modify API information**
- **Add custom security schemes**

## 🔧 Troubleshooting

### Common Issues

1. **Swagger UI not loading**
   - Check if swagger dependencies are installed
   - Verify swagger.js configuration
   - Ensure app.js includes swagger setup

2. **Authentication not working**
   - Verify JWT secrets in .env file
   - Check token format in Authorization header
   - Ensure middleware is properly configured

3. **File uploads failing**
   - Check multer configuration
   - Verify upload directory exists
   - Ensure proper content-type headers

### Debug Mode

Enable debug logging by adding to your .env:
```env
DEBUG=swagger-jsdoc:*
```

## 📊 Testing with Swagger UI

1. **Navigate to** `http://localhost:3001/api-docs`
2. **Register a new user** using `/api/auth/register`
3. **Login** using `/api/auth/login` to get tokens
4. **Authorize** using the access token
5. **Test protected endpoints** like `/api/users`
6. **Try file uploads** with photo fields
7. **Test pagination** with query parameters

## 🎯 Production Deployment

### Before deploying:

1. **Update server URLs** in swagger.js
2. **Set production environment variables**
3. **Enable CORS** for your domain
4. **Configure HTTPS** for secure token transmission
5. **Set up proper error logging**

### Security Considerations:

- **Never expose** JWT secrets
- **Use HTTPS** in production
- **Implement rate limiting**
- **Validate all inputs**
- **Sanitize file uploads**

## 📖 Additional Resources

- [Swagger OpenAPI Specification](https://swagger.io/specification/)
- [swagger-jsdoc Documentation](https://github.com/Surnet/swagger-jsdoc)
- [swagger-ui-express Documentation](https://github.com/scottie1984/swagger-ui-express)
- [JWT.io](https://jwt.io/) for token debugging