var express = require('express');
var router = express.Router();
var db = require('../db');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Return a list of all dogs with their size and owner's username.
router.get('/api/dogs', async function(req, res, next) {

  try {
    const [dogs] = await db.execute(
      `SELECT Dogs.name, Dogs.size, Users.username AS owner_username FROM Dogs
      INNER JOIN Users ON Dogs.owner_id = Users.user_id`
    );
    res.json(dogs);
  } catch(err) {
    res.status(500).json({ error: 'Failed to fetch dogs from database' });
  }

});

// Return all open walk requests
router.get('/api/walkrequests/open', async function(req, res, next) {

  try {
    const[walkRequests] = await db.execute(
      `SELECT w.request_id, d.name as dog_name, w.requested_time, w.duration_minutes, w.location, u.username as owner_username
      FROM WalkRequests w
      INNER JOIN Dogs d ON w.dog_id = d.dog_id
      INNER JOIN Users u ON d.owner_id = u.user_id
      WHERE w.status = 'open';`
    );

    res.json(walkRequests);

  } catch(err) {
    res.status(500).json({ error: 'Failed to fetch walkRequests from database!' });
  }

});

// Return a summary of each walker with their average rating and number of completed walks.
router.get('/api/walkers/summary', async function(req, res, next) {

  try {
    const[walkerSummary] = await db.execute(
      `SELECT u.username, r.COUNT(r.rating) AS total_ratings, AVG(r.rating) AS average_rating, COUNT(w.status) AS completed_walks
      FROM WalkRatings r
      INNER JOIN Users u ON r.walker_id = u.user_id
      INNER JOIN WalkRequests w`

    );

    res.json(walkerSummary);

  } catch(err) {
    res.status(500).json({ error: 'Failed to fetch walker summary from database!' });
  }

});

module.exports = router;
