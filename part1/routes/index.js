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
      'SELECT Dogs.name, Dogs.size FROM Dogs
      INNER JOIN '
    );
    res.json(dogs);
  } catch(err) {
    res.status(500).json({ error: 'Failed to fetch dogs from database' });
  }

});

// Return all open walk requests
router.get('/api/walkrequests/open', function(req, res, next) {

});

// Return a summary of each walker with their average rating and number of completed walks.
router.get('/api/walkers/summary', function(req, res, next) {

});

module.exports = router;
