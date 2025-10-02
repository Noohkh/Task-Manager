# Task Manager Application

A full-stack task management application built with React (Frontend) and Node.js/Express (Backend).

## Features
- User authentication (signup/login)
- Create, read, update, and delete tasks
- Responsive design

## Tech Stack
- Frontend: React, Tailwind CSS (via CDN)
- Backend: Node.js, Express
- Authentication: JWT
- Password Security: bcryptjs

## Local Development

1. Install dependencies:
   ```
   npm install
   ```

2. Run the development server:
   ```
   npm start
   ```

3. Run the frontend development server:
   ```
   npm run dev
   ```

## Production Build

1. Build the React frontend:
   ```
   npm run build
   ```

2. Start the server (serves both API and frontend):
   ```
   npm start
   ```

## Deployment

### Heroku Deployment

1. Create a new app on Heroku
2. Connect your GitHub repository
3. Enable automatic deploys
4. Add environment variables in Heroku settings:
   - JWT_SECRET (required for production)

### Manual Deployment

1. Build the frontend:
   ```
   npm run build
   ```

2. Upload all files to your server
3. Install dependencies:
   ```
   npm install --production
   ```

4. Start the server:
   ```
   npm start
   ```

## Environment Variables

- PORT: Server port (default: 3003)
- JWT_SECRET: Secret key for JWT token signing (required in production)

## API Endpoints

- POST /api/auth/signup - Register a new user
- POST /api/auth/login - Login user
- GET /api/profile - Get user profile
- GET /api/tasks - Get all tasks for user
- POST /api/tasks - Create a new task
- PUT /api/tasks/:id - Update a task
- DELETE /api/tasks/:id - Delete a task

## Note

This is a demo application using in-memory storage. For production use, replace the in-memory database with a persistent database like MongoDB or PostgreSQL.