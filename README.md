# Live Chat Backend 🚀

A modern, scalable Node.js backend application for real-time chat functionality, built with Express.js and MongoDB.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- **User Management**: Complete user registration, authentication, and profile management
- **Secure Authentication**: Password hashing with bcryptjs
- **Database Integration**: MongoDB with Mongoose ODM
- **Logging**: Comprehensive logging with Winston
- **CORS Support**: Cross-origin resource sharing enabled
- **Serverless Ready**: AWS Lambda deployment support
- **Error Handling**: Robust error handling and validation
- **Development Tools**: ESLint, Prettier, and Babel for code quality

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js 5.1.0
- **Database**: MongoDB with Mongoose 8.18.0
- **Authentication**: bcryptjs for password hashing
- **Logging**: Winston 3.17.0
- **Development**: Babel, ESLint, Prettier, Nodemon
- **Deployment**: Serverless (AWS Lambda ready)

## 📁 Project Structure

```
live-chat-backend/
├── config/                 # Configuration files
│   └── app.js             # App configuration
├── controllers/           # Route controllers
│   ├── authentication.js # Auth controller
│   └── user.js          # User controller
├── loaders/              # Application loaders
│   ├── express.js       # Express configuration
│   ├── index.js         # Loader index
│   └── mongoose.js      # Database connection
├── middleware/           # Custom middleware
│   └── isUser.js        # User authentication middleware
├── models/              # Database models
│   └── user.js          # User model
├── routes/              # API routes
│   └── v1/              # API version 1
│       ├── api.js       # Main API router
│       └── user.js      # User routes
├── utils/               # Utility functions
│   └── logger.js        # Winston logger configuration
├── logs/                # Log files
├── app.js               # Serverless app configuration
├── index.js             # Application entry point
└── package.json         # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/wentaiouyang/live-chat-backend.git
   cd live-chat-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Configure your environment variables (see [Environment Variables](#environment-variables) section)

4. **Start the development server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3000` (or your configured PORT).

## 📡 API Endpoints

### User Management

| Method | Endpoint                  | Description     | Authentication |
| ------ | ------------------------- | --------------- | -------------- |
| GET    | `/api/v1/user/list`       | Get all users   | Optional       |
| POST   | `/api/v1/user/add`        | Create new user | No             |
| PUT    | `/api/v1/user/update/:id` | Update user     | Required       |

### Example Requests

**Create User**

```bash
curl -X POST http://localhost:3000/api/v1/user/add \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword"
  }'
```

**Get All Users**

```bash
curl -X GET http://localhost:3000/api/v1/user/list
```

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/live-chat-backend

# API Configuration
API_PREFIX=/api/v1

# JWT Configuration (if implementing JWT)
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
```

## 💻 Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm test` - Run tests (currently not implemented)
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Code Quality

This project uses:

- **ESLint** for code linting
- **Prettier** for code formatting
- **Babel** for modern JavaScript features

### Database Schema

**User Model**

```javascript
{
  name: String (default: 'ChatApp'),
  email: String (required, unique),
  password: String (required, hashed),
  verified: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Deployment

### Serverless Deployment (AWS Lambda)

This application is configured for serverless deployment:

```bash
# Install serverless framework
npm install -g serverless

# Deploy to AWS Lambda
serverless deploy
```

### Traditional Deployment

For traditional server deployment:

```bash
# Production build
npm run build

# Start production server
npm start
```

## 🔒 Security Features

- Password hashing with bcryptjs (salt factor: 10)
- CORS enabled for cross-origin requests
- Input validation and sanitization
- Error handling without sensitive information exposure
- MongoDB injection protection through Mongoose

## 📝 Logging

The application uses Winston for comprehensive logging:

- **Combined logs**: All logs in `logs/combined.log`
- **Error logs**: Error-specific logs in `logs/error.log`
- **Console output**: Development-friendly console logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Wentai Ouyang**

- GitHub: [@wentaiouyang](https://github.com/wentaiouyang)
- Repository: [live-chat-backend](https://github.com/wentaiouyang/live-chat-backend)

## 🆘 Support

If you have any questions or need help, please:

1. Check the [Issues](https://github.com/wentaiouyang/live-chat-backend/issues) page
2. Create a new issue if your problem isn't already addressed
3. Contact the maintainer

---

**Happy Coding! 🎉**
