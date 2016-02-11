var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/generate', function(req, res, next) {
  var page = req.body.device;
  var identity = req.body.identity;

  res.send('respond with a resource');
});

module.exports = router;
