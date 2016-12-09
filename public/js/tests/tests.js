
// This line transpiles the *.jade to HTML,via Pug,sets it as the document.body.
document.body.innerHTML = window.__html__['views/index.jade'];

describe('TwilioChat', function() {
  describe('channels sorting', function() {
    it('sort channels by name', function() {
      var channels = [
        {friendlyName: 'BBB'},
        {friendlyName: 'BBA'},
        {friendlyName: 'BBA'},
      ];

      var result = twiliochat.sortChannelsByName(channels);

      assert.deepEqual(result,
                       [{friendlyName: 'BBA'}, {friendlyName: 'BBA'},
                       {friendlyName: 'BBB'}]
      );
    });

    it('be able to sort an empty list of channels', function() {
      var channels = [];

      var result = twiliochat.sortChannelsByName(channels);

      assert.deepEqual(result, []);
    });
  });

  describe('messaging', function() {
    it('be able to add messages to chat', function() {
      var message = {
        body: 'just a test message',
        author: 'me',
        timestamp: new Date(),
      };
      var messageList = twiliochat.$messageList;
      twiliochat.addMessageToList(message);

      assert.isOk(messageList.html().indexOf('just a test message') > -1,
                  messageList.html()
      );
    });
  });

  describe('channels creation', function() {
    it('creates a general channel if not present', function() {
     var messagingClientMock = {createChannel: function() {}};
     var mock = sinon.mock(messagingClientMock);
     twiliochat.messagingClient = messagingClientMock;
     mock.expects('createChannel').once().returns({then: function() {}});
     twiliochat.generalChannel = undefined;
     twiliochat.joinGeneralChannel();

     mock.verify();
    });

    it('creates a new channel', function() {
      var messagingClientMock = {createChannel: function() {}};
      var mock = sinon.mock(messagingClientMock);
      twiliochat.messagingClient = messagingClientMock;
      mock.expects('createChannel').once().returns({then: function() {}});

      twiliochat.handleNewChannelInputKeypress(
          {keyCode: 13, preventDefault: function() {}}
      );

      mock.verify();
    });
  });

  describe('channels listing', function() {
    it('gets a list of channels', function() {
      var messagingClientMock = {getPublicChannels: function() {}};
      var mock = sinon.mock(messagingClientMock);
      twiliochat.messagingClient = messagingClientMock;
      mock.expects('getPublicChannels').once().returns({then: function() {}});

      twiliochat.loadChannelList();

      mock.verify();
    });
  });
});
