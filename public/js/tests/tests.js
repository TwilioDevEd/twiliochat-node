document.body.innerHTML = window.__html__['views/index.jade'];

describe('TwilioChat', function() {
  it('should sort channels by name', function() {
    var channels = [
      {friendlyName: 'BBB'},
      {friendlyName: 'BBA'}
    ];

    var result = twiliochat.sortChannelsByName(channels)

    assert.deepEqual(result, [{friendlyName: 'BBA'}, {friendlyName: 'BBB'}]);
  });

  it('should be able to sort an empty list of channels', function() {
    var channels = [];

    var result = twiliochat.sortChannelsByName(channels)

    assert.deepEqual(result, []);
  });

  it('should sort channels when they have same name', function() {
    var channels = [
      {friendlyName: 'BBB'},
      {friendlyName: 'BBA'},
      {friendlyName: 'BBA'}
    ];

    var result = twiliochat.sortChannelsByName(channels);

    assert.deepEqual(result, [{friendlyName: 'BBA'}, {friendlyName: 'BBA'}, {friendlyName: 'BBB'}]);
  });

  it('should be able to add messages to chat', function() {
    var message = {
      body: 'just a test message',
      author: 'me',
      timestamp: new Date()
    }
    var messageList = twiliochat.$messageList;
    twiliochat.addMessageToList(message);

    assert.ok(messageList.html().indexOf('just a test message') > -1, messageList.html());
  });

  it('should create a general channel when there is not one', function(){
   var messagingClientMock = { createChannel: function () {} };
   var mock = sinon.mock(messagingClientMock);
   twiliochat.messagingClient = messagingClientMock;
   mock.expects('createChannel').once().returns({ then: function(){} });
   twiliochat.generalChannel = undefined;
   twiliochat.joinGeneralChannel();

   mock.verify();
  });

  it('should create a new channel when requested by the user', function(){
    var messagingClientMock = { createChannel: function () {} };
    var mock = sinon.mock(messagingClientMock);
    twiliochat.messagingClient = messagingClientMock;
    mock.expects('createChannel').once().returns({ then: function(){} });

    twiliochat.handleNewChannelInputKeypress({keyCode: 13, preventDefault: function() {}});

    mock.verify();
  });

  it('should retrieve list of channels', function() {
    var messagingClientMock = {getPublicChannels: function(){} };
    var mock = sinon.mock(messagingClientMock);
    twiliochat.messagingClient = messagingClientMock;
    mock.expects('getPublicChannels').once().returns({then: function(){} });

    twiliochat.loadChannelList();

    mock.verify();
  });
});
