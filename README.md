express-app/
│── 📂 src/
│   ├── 📂 config/          # Configuration files (DB, SMTP, JWT, etc.)
│   │   ├── db.ts
│   │   ├── smtp.ts
│   │   ├── jwt.ts
│   │   └── env.ts
│   │
│   ├── 📂 controllers/     # Route controllers (business logic)
│   │   ├── auth.controller.ts
│   │   ├── task.controller.ts
│   │   └── user.controller.ts
│   │
│   ├── 📂 middlewares/     # Middleware functions
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── validate.middleware.ts
│   │   └── rateLimiter.middleware.ts
│   │
│   ├── 📂 models/          # Mongoose models
│   │   ├── user.model.ts
│   │   ├── task.model.ts
│   │   └── otp.model.ts
│   │
│   ├── 📂 routes/          # API routes
│   │   ├── auth.routes.ts
│   │   ├── task.routes.ts
│   │   ├── user.routes.ts
│   │   └── index.ts        # Centralized route export
│   │
│   ├── 📂 services/        # Reusable service functions (DB queries, emails, etc.)
│   │   ├── auth.service.ts
│   │   ├── task.service.ts
│   │   ├── user.service.ts
│   │   ├── email.service.ts
│   │   └── otp.service.ts
│   │
│   ├── 📂 utils/           # Utility functions (helpers)
│   │   ├── generateToken.ts
│   │   ├── responseHandler.ts
│   │   ├── logger.ts
│   │   └── pagination.ts
│   │
│   ├── server.ts          # Express app setup
│   └── app.ts             # Main application entry point
│
├── .env                   # Environment variables
├── .gitignore             # Git ignore file
├── package.json           # Package dependencies
├── README.md              # Project documentation
└── nodemon.json           # Nodemon config (if using)
