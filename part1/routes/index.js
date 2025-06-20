var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Return a list of all dogs with their size and owner's username.
router.get('/api/dogs', function(req, res, next) {

});

// Return all open walk requests, including the dog name, requested time, location, and owner's username.
router.get('/api/walkrequests/open', function(req, res, next) {

});

module.exports = router;
