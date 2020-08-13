var express = require('express');
var router = express.Router();
var TokenService = require('../services/tokenService');

// POST /token
router.post('/', function(req, res) {
  var identity = req.body.identity;

  var token = TokenService.generate(identity)

  res.json({
    identity: identity,
    token: token.toJwt(),
  });
});

// GET /token
router.get('/', function(req, res) {
  var identity = req.query.identity;

  var token = TokenService.generate(identity)

  res.json({
    identity: identity,
    token: token.toJwt(),
  });
});


module.exports = router;
