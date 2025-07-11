const express = require('express');
const path = require('path');
require('dotenv').config();
const session = require('express-session'); // Implements user sessions

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));


// Creating the user session
app.use(session({

    secret: 'secret123',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }

}));

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

// Export the app instead of listening here
module.exports = app;
