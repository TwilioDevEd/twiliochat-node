var AccessToken = require('twilio').AccessToken;
var IpMessagingGrant = AccessToken.IpMessagingGrant;

var TokenServiceFactory = function(){
  return {
    generate: function(identity, deviceId){
      var appName = 'TwilioChat';

      // Create a unique ID for the client on their current device
      var endpointId = appName + ':' + identity + ':' + deviceId;

      // Create a "grant" which enables a client to use IPM as a given user,
      // on a given device
      var ipmGrant = new IpMessagingGrant({
          serviceSid: process.env.TWILIO_IPM_SERVICE_SID,
          endpointId: endpointId
      });

      // Create an access token which we will sign and return to the client,
      // containing the grant we just created
      var token = new AccessToken(
          process.env.TWILIO_ACCOUNT_SID,
          process.env.TWILIO_API_KEY,
          process.env.TWILIO_API_SECRET
      );
      token.addGrant(ipmGrant);
      token.identity = identity;

      return token;

      // // Serialize the token to a JWT string and include it in a JSON response
      // response.send({
      //     success: {
      //         identity: identity,
      //         token: token.toJwt()
      //     }
      // });
    }
  };
};
module.exports = TokenServiceFactory;
