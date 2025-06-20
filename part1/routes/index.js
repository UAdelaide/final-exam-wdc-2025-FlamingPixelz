var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Return a list of all dogs with their size and owner's username.
router.get('/api/dogs', function(req, res, next) {

  try {


  } catch(err) {
    res.status(500).send('')
  }

});

// Return all open walk requests
router.get('/api/walkrequests/open', function(req, res, next) {

});

// Return a summary of each walker with their average rating and number of completed walks.
router.get('/api/walkers/summary', function(req, res, next) {

});

module.exports = router;
