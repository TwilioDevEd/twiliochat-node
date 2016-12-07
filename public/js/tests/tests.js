require('jsdom-global')();
global.jQuery = global.$ = window.$ = window.jQuery = require('jquery');
global.moment = require('moment');
require('../../../node_modules/twilio-chat/dist/twilio-chat');
require('../../../node_modules/twilio-common/dist/twilio-common');
require('../dateformatter');
require('../vendor/jquery-throttle.min');
require('../vendor/jquery.loadTemplate-1.4.4.min');
require('../twiliochat');
var assert = require('chai').assert;
var sinon = require('sinon');
var fs = require('fs');
var path = require('path');
var pug = require('pug');

var twiliochat = window.twiliochat;

global.dateFormatter = window.dateFormatter;

var indexFilePath = path.resolve(__dirname, '../../../views/index.jade');
var indexHtml = pug.compile(fs.readFileSync(indexFilePath))();
document.body.innerHTML = indexHtml;

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

  it('should not create a new general channel if it already has one', function(){
   var messagingClientMock = { createChannel: function () {} };
   var mock = sinon.mock(messagingClientMock);
   twiliochat.messagingClient = messagingClientMock;
   mock.expects('createChannel').never().returns({then: function(){} });
   twiliochat.generalChannel = {join: function(){ return {then: function() {}}}};
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
