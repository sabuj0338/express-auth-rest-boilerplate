# Express.js Boilerplate API

## Introduction
This is an Express.js boilerplate API for authentication and user management.

## Features
- JWT authentication
- MongoDB integration
- Email service with SMTP configuration
- Secure cookie-based authentication

## Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or later recommended)
- [MongoDB](https://www.mongodb.com/try/download/community)

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/sabuj0338/express-auth-rest-boilerplate.git
   cd express-auth-rest-boilerplate
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Create a `.env` file in the project root and add the following variables:
   ```env
   APP_NAME=auth-boilerplate-api
   NODE_ENV=development
   APP_URL=http://localhost:4000

   # Port number
   PORT=4000

   # URL of the MongoDB
   MONGODB_URL=mongodb://localhost:27017/express-app

   # JWT
   JWT_SECRET=
   JWT_ACCESS_EXPIRATION_MINUTES=30
   JWT_REFRESH_EXPIRATION_DAYS=30
   JWT_RESET_PASSWORD_EXPIRATION_MINUTES=10
   JWT_VERIFY_EMAIL_EXPIRATION_MINUTES=10

   # SMTP configuration
   MAIL_DRIVER=
   MAIL_ENCRYPTION=
   SMTP_HOST=
   SMTP_PORT=
   SMTP_USER=
   SMTP_PASS=
   EMAIL_FROM=

   # Cookie configurations
   COOKIE_NAME=
   COOKIE_SECRET=
   COOKIE_EXPIRY=

   # Client application URL
   CLIENT_URL=
   ```

4. Start the MongoDB server if it is not already running:
   ```sh
   mongod
   ```

## Running the Application

### Development Mode
To start the application in development mode, run:
```sh
npm run dev
```

### Production Mode
To start the application in production mode, run:
```sh
npm start
```

## API Endpoints
| Method | Endpoint            | Description         |
|--------|---------------------|---------------------|
| POST   | `/auth/register`    | Register a new user |
| POST   | `/auth/login`       | Login a user        |
| POST   | `/auth/logout`      | Logout a user       |

## License
This project is licensed under the MIT License.

