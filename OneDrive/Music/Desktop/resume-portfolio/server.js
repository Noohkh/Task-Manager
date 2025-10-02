// --- Dependencies ---
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

// --- Configuration ---
const PORT = process.env.PORT || 3003;
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-that-is-long-and-secure'; // In production, use environment variables

// --- Initializations ---
const app = express();
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Middleware to parse JSON bodies

// --- In-Memory Database (for demonstration) ---
// In a real application, this would be a connection to MongoDB, PostgreSQL, etc.
let users = [];
let tasks = [];
let userIdCounter = 1;
let taskIdCounter = 1;

// --- Middleware ---

/**
 * Authentication Middleware
 * Verifies the JWT token from the Authorization header.
 * If valid, it attaches the user's ID to the request object.
 */
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (token == null) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden: Invalid token' });
        }
        req.userId = user.id; // Add user id from token payload to request
        next();
    });
};

// --- API Routes ---

// --- 1. Authentication Routes ---

// [POST] /api/auth/signup - Register a new user
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            return res.status(409).json({ message: 'User with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            id: userIdCounter++,
            email,
            password: hashedPassword,
        };
        users.push(newUser);

        const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '1d' });

        console.log('User signed up:', { id: newUser.id, email: newUser.email });
        res.status(201).json({ token });

    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// [POST] /api/auth/login - Log in an existing user
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' });
        
        console.log('User logged in:', { id: user.id, email: user.email });
        res.status(200).json({ token });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// --- 2. Profile Route ---

// [GET] /api/profile - Fetch logged-in user's profile
// This route is protected by the authMiddleware
app.get('/api/profile', authMiddleware, (req, res) => {
    const user = users.find(u => u.id === req.userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    // Return user info, but exclude the password hash
    res.json({ id: user.id, email: user.email });
});

// --- 3. Task CRUD Routes ---
// All these routes are protected and require a valid token.

// [GET] /api/tasks - Get all tasks for the logged-in user
app.get('/api/tasks', authMiddleware, (req, res) => {
    const userTasks = tasks.filter(task => task.userId === req.userId);
    res.json(userTasks);
});

// [POST] /api/tasks - Create a new task
app.post('/api/tasks', authMiddleware, (req, res) => {
    const { title, description = '' } = req.body;
    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }

    const newTask = {
        _id: taskIdCounter++,
        userId: req.userId,
        title,
        description,
        createdAt: new Date().toISOString(),
    };
    tasks.push(newTask);
    console.log('Task created:', newTask);
    res.status(201).json(newTask);
});

// [PUT] /api/tasks/:id - Update an existing task
app.put('/api/tasks/:id', authMiddleware, (req, res) => {
    const taskId = parseInt(req.params.id);
    const { title, description } = req.body;
    const taskIndex = tasks.findIndex(t => t._id === taskId && t.userId === req.userId);

    if (taskIndex === -1) {
        return res.status(404).json({ message: 'Task not found or you do not have permission to edit it' });
    }

    if (title) tasks[taskIndex].title = title;
    if (description !== undefined) tasks[taskIndex].description = description;

    console.log('Task updated:', tasks[taskIndex]);
    res.json(tasks[taskIndex]);
});

// [DELETE] /api/tasks/:id - Delete a task
app.delete('/api/tasks/:id', authMiddleware, (req, res) => {
    const taskId = parseInt(req.params.id);
    const initialLength = tasks.length;
    tasks = tasks.filter(t => !(t._id === taskId && t.userId === req.userId));

    if (tasks.length === initialLength) {
        return res.status(404).json({ message: 'Task not found or you do not have permission to delete it' });
    }

    console.log('Task deleted:', { id: taskId });
    res.status(204).send(); // 204 No Content
});

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, 'dist')));

// For any request that doesn't match the API routes, send the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});