const express = require('express');
const router = express.Router();
const db = require('../models/db');

// GET all users (for admin/testing)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT user_id, username, email, role FROM Users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST a new user (simple signup)
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const [result] = await db.query(`
      INSERT INTO Users (username, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `, [username, email, password, role]);

    res.status(201).json({ message: 'User registered', user_id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.get('/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  res.json(req.session.user);
});

// POST login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Queries database to get user information based on the inputted username in the form
    const [rows] = await db.query(`
      SELECT user_id, username, email, role, password_hash FROM Users
      WHERE username = ?
    `, [username]);

    // If the username inputted is not in the database
    if (rows.length === 0) {
      return res.status(401).json({ error: 'The credentials inputted are invalid!' });
    }
    // Stores user information in user variable
    const user = rows[0];

    // If the password does not match
    if (password !== user.password_hash) {
      return res.status(401).json({ error: 'Invalid Email or password!' });
    }
    // Implements data for user sessions
      req.session.user = {
        user_id: rows[0].user_id,
        username: rows[0].username,
        email: rows[0].email,
        role: rows[0].role
      };

      // Redirects to the correct dashboard depending on user role
      if(user.role === 'owner') {
        return res.redirect('/owner-dashboard.html');
      }
      if(user.role === 'walker') {
        return res.redirect('/walker-dashboard.html');
      }

      res.json({ message: 'Login successful', user: rows[0] });

  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Deletes user cookie/session upon logout
router.post('/logout', (req, res) => {

  req.session.destroy((err) => {

    // If there is an issue with logging out
      if(err) {
        res.status(500).json({ message: 'The logout failed!' });
      }
      // Otherwise delete cookie and route to login page
      res.clearCookie('connect.sid');
      res.redirect('/index.html');
  });

});

// Gets the dogs of the current owner that is logged in
router.get('/yourDogs', async (req, res) => {

  const user_id = req.session.user_id;

  try {
     const [dogs] = await db.query('SELECT dog_id, name FROM Dogs WHERE owner_id = ?', [user_id]);
     res.json(dogs);

  } catch (err) {
    res.status(500).json({ error: 'Failed to get Owner dogs from Database!' });
  }

});


module.exports = router;
