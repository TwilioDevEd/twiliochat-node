var TokenControllerFactory = function(tokenService){
  return {
    generate: function(req, res, next){
      var deviceId = req.body.device;
      var identity = req.body.identity;

      var token = tokenService.generate(identity, deviceId)

      res.send({
          success: {
              identity: identity,
              token: token.toJwt()
          }
      });
    }
  };
};

module.exports = TokenControllerFactory;
