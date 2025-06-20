var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql2/promise');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

let db;

(async () => {
  try {
    // Connect to MySQL without specifying a database
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '' // Set your MySQL root password
    });

    // Create the database if it doesn't exist
    await connection.query('CREATE DATABASE IF NOT EXISTS DogWalkService');
    await connection.end();

    // Now connect to the created database
    db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'DogWalkService'
    });

    // Insert user data if table is empty
    const [userRows] = await db.execute('SELECT COUNT(*) AS count FROM Users');
    if (userRows[0].count === 0) {
      await db.execute(`
        INSERT INTO Users (username, email, password_hash, role)
        VALUES ('alice123', 'alice@example.com', 'hashed123', 'owner'),
        ('bobwalker', 'bob@example.com', 'hashed456', 'walker'),
        ('carol123', 'carol@example.com', 'hashed789', 'owner'),
        ('olivia1', 'olivia@example.com', 'pass123', 'walker'),
        ('Bwana', 'Bwana@example.com', 'coolPassword', 'owner');
      `);
    }
    // Insert dog data if table is empty
    const [dogRows] = await db.execute('SELECT COUNT(*) AS count FROM Dogs');
    if(dogRows[0].count === 0) {
        await db.execute(`INSERT INTO Dogs (owner_id, name, size)
        VALUES ((SELECT user_id FROM Users WHERE username = 'alice123'), 'Max', 'medium'),
        ((SELECT user_id FROM Users WHERE username = 'carol123'), 'Bella', 'small'),
        ((SELECT user_id FROM Users WHERE username = 'carol123'), 'Poppy', 'large'),
        ((SELECT user_id FROM Users WHERE username = 'alice123'), 'Henry', 'small'),
        ((SELECT user_id FROM Users WHERE username = 'Bwana'), 'Enji', 'medium');`);
    }

    // Insert WalkRequest data if table is empty
    const [walkRows] = await db.execute('SELECT COUNT(*) AS count FROM WalkRequests');
    if(walkRows[0].count === 0) {
        await db.execute(`INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status)
        VALUES ((SELECT dog_id FROM Dogs INNER JOIN Users ON Dogs.owner_id = Users.user_id WHERE Dogs.name = 'Max' AND Users.username = 'alice123'), '2025-06-10 08:00:00', 30, 'Parklands', 'open'),
        ((SELECT dog_id FROM Dogs INNER JOIN Users ON Dogs.owner_id = Users.user_id WHERE name = 'Bella' AND Users.username = 'carol123'), '2025-06-10 09:30:00', 45, 'Beachside Ave', 'accepted'),
        ((SELECT dog_id FROM Dogs INNER JOIN Users ON Dogs.owner_id = Users.user_id WHERE name = 'Max' AND Users.username = 'alice123'), '2025-05-11 09:00:00', 60, 'City Centre', 'completed'),
        ((SELECT dog_id FROM Dogs INNER JOIN Users ON Dogs.owner_id = Users.user_id WHERE name = 'Enji' AND Users.username = 'Bwana'), '2025-06-10 10:30:00', 30, 'Glenelg Beach', 'accepted'),
        ((SELECT dog_id FROM Dogs INNER JOIN Users ON Dogs.owner_id = Users.user_id WHERE name = 'Henry' AND Users.username = 'alice123'), '2025-06-11 13:30:00', 45, 'Court St', 'cancelled');`);
    }

    // Basic insertion for 
    const[ratingRows] = await db.execute('SELECT COUNT(*) AS count FROM WalkRatings');


  } catch (err) {
    console.error('Error setting up database. Ensure Mysql is running: service mysql start', err);
  }
})();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
