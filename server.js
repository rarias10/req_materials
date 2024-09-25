require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const path = require('path');

// Import Routes
const authRoutes = require('./app/routes/authRoutes');
const requestRoutes = require('./app/routes/requestRoutes');

// Import DB connection
const pool = require('./db/db');

// Initialize Express
const app = express();
const port = process.env.PORT || 3000;

// Helmet middleware for security
app.use(helmet());

// Rate limiter to prevent brute-force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Cookie Parser middleware
app.use(cookieParser());

// Express session setup
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
  },
}));

// Passport.js initialization
require('./config/passport'); // Externalize Passport configuration
app.use(passport.initialize());
app.use(passport.session());

// CSRF protection middleware
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// Serve static files (e.g., HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'frontend/public')));

// Pass CSRF token to the frontend via cookies
app.use((req, res, next) => {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  next();
});

// Define Routes
app.use('/auth', authRoutes);  // Authentication routes (login, register, logout)
app.use('/requests', requestRoutes); // Requests routes (create, view)

// Route to check active session
app.get('/check-session', (req, res) => {
  if (req.isAuthenticated()) {
    return res.status(200).json({ message: 'Session is active', user: req.user });
  }
  return res.status(401).json({ message: 'No active session' });
});

// Default error handler
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    // Handle CSRF token errors here
    return res.status(403).json({ message: 'Invalid CSRF token' });
  }
  console.error('Error:', err.stack);
  res.status(500).send('Something went wrong.');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
