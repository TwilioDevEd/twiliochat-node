const router = require('express').Router();

// GET /
router.get('/', function(req, res, next) {
  res.render('index');
});

module.exports = router;
