var twiliochat = (function() {
  var tc = {};

  var GENERAL_CHANNEL_UNIQUE_NAME = 'general';
  var GENERAL_CHANNEL_NAME = 'General Channel';
  var MESSAGES_HISTORY_LIMIT = 50;

  var $channelList;
  var $inputText;
  var $usernameInput;
  var $statusRow;
  var $connectPanel;
  var $newChannelInputRow;
  var $newChannelInput;
  var $typingRow;
  var $typingPlaceholder;

  $(document).ready(function() {
    tc.$messageList = $('#message-list');
    $channelList = $('#channel-list');
    $inputText = $('#input-text');
    $usernameInput = $('#username-input');
    $statusRow = $('#status-row');
    $connectPanel = $('#connect-panel');
    $newChannelInputRow = $('#new-channel-input-row');
    $newChannelInput = $('#new-channel-input');
    $typingRow = $('#typing-row');
    $typingPlaceholder = $('#typing-placeholder');
    $usernameInput.focus();
    $usernameInput.on('keypress', handleUsernameInputKeypress);
    $inputText.on('keypress', handleInputTextKeypress);
    $newChannelInput.on('keypress', tc.handleNewChannelInputKeypress);
    $('#connect-image').on('click', connectClientWithUsername);
    $('#add-channel-image').on('click', showAddChannelInput);
    $('#leave-span').on('click', disconnectClient);
    $('#delete-channel-span').on('click', deleteCurrentChannel);
  });

  function handleUsernameInputKeypress(event) {
    if (event.keyCode === 13){
      connectClientWithUsername();
    }
  }

  function handleInputTextKeypress(event) {
    if (event.keyCode === 13) {
      tc.currentChannel.sendMessage($(this).val());
      event.preventDefault();
      $(this).val('');
    }
    else {
      notifyTyping();
    }
  }

  var notifyTyping = $.throttle(function() {
    tc.currentChannel.typing();
  }, 1000);

  tc.handleNewChannelInputKeypress = function(event) {
    if (event.keyCode === 13) {
      tc.messagingClient
        .createChannel({
          friendlyName: $newChannelInput.val(),
        })
        .then(hideAddChannelInput);

      $(this).val('');
      event.preventDefault();
    }
  };

  function connectClientWithUsername() {
    var usernameText = $usernameInput.val();
    $usernameInput.val('');
    if (usernameText == '') {
      alert('Username cannot be empty');
      return;
    }
    tc.username = usernameText;
    fetchAccessToken(tc.username, connectMessagingClient);
  }

  function fetchAccessToken(username, handler) {
    $.post('/token', {identity: username, device: 'browser'}, null, 'json')
      .done(function(response) {
        handler(response.token);
      })
      .fail(function(error) {
        console.log('Failed to fetch the Access Token with error: ' + error);
      });
  }

  function connectMessagingClient(token) {
    // Initialize the IP messaging client
    tc.messagingClient = new Twilio.Chat.Client(token);
    tc.messagingClient.initialize()
      .then(function() {
        updateConnectedUI();
        tc.loadChannelList(tc.joinGeneralChannel);
        tc.messagingClient.on('channelAdded', $.throttle(tc.loadChannelList));
        tc.messagingClient.on('channelRemoved', $.throttle(tc.loadChannelList));
        tc.messagingClient.on('tokenExpired', refreshToken);
      });
  }

  function refreshToken() {
    fetchAccessToken(tc.username, setNewToken);
  }

  function setNewToken(token) {
    tc.messagingClient.updateToken(tokenResponse.token);
  }

  function updateConnectedUI() {
    $('#username-span').text(tc.username);
    $statusRow.addClass('connected').removeClass('disconnected');
    tc.$messageList.addClass('connected').removeClass('disconnected');
    $connectPanel.addClass('connected').removeClass('disconnected');
    $inputText.addClass('with-shadow');
    $typingRow.addClass('connected').removeClass('disconnected');
  }

  tc.loadChannelList = function(handler) {
    if (tc.messagingClient === undefined) {
      console.log('Client is not initialized');
      return;
    }

    tc.messagingClient.getPublicChannels().then(function(channels) {
      tc.channelArray = tc.sortChannelsByName(channels.items);
      $channelList.text('');
      tc.channelArray.forEach(addChannel);
      if (typeof handler === 'function') {
        handler();
      }
    });
  };

  tc.joinGeneralChannel = function() {
    console.log('Attempting to join "general" chat channel...');
    if (!tc.generalChannel) {
      // If it doesn't exist, let's create it
      tc.messagingClient.createChannel({
        uniqueName: GENERAL_CHANNEL_UNIQUE_NAME,
        friendlyName: GENERAL_CHANNEL_NAME
      }).then(function(channel) {
        console.log('Created general channel');
        tc.generalChannel = channel;
        tc.loadChannelList(tc.joinGeneralChannel);
      });
    }
    else {
      console.log('Found general channel:');
      setupChannel(tc.generalChannel);
    }
  };

  function initChannel(channel) {
    console.log('Initialized channel ' + channel.friendlyName);
    return tc.messagingClient.getChannelBySid(channel.sid);
  }

  function joinChannel(_channel) {
    return _channel.join()
      .then(function(joinedChannel) {
        console.log('Joined channel ' + joinedChannel.friendlyName);
        updateChannelUI(_channel);
        tc.currentChannel = _channel;
        tc.loadMessages();
        return joinedChannel;
      });
  }

  function initChannelEvents() {
    console.log(tc.currentChannel.friendlyName + ' ready.');
    tc.currentChannel.on('messageAdded', tc.addMessageToList);
    tc.currentChannel.on('typingStarted', showTypingStarted);
    tc.currentChannel.on('typingEnded', hideTypingStarted);
    tc.currentChannel.on('memberJoined', notifyMemberJoined);
    tc.currentChannel.on('memberLeft', notifyMemberLeft);
    $inputText.prop('disabled', false).focus();
  }

  function setupChannel(channel) {
    return leaveCurrentChannel()
      .then(function() {
        return initChannel(channel);
      })
      .then(function(_channel) {
        return joinChannel(_channel);
      })
      .then(initChannelEvents);
  }

  tc.loadMessages = function() {
    tc.currentChannel.getMessages(MESSAGES_HISTORY_LIMIT).then(function (messages) {
      messages.items.forEach(tc.addMessageToList);
    });
  };

  function leaveCurrentChannel() {
    if (tc.currentChannel) {
      return tc.currentChannel.leave().then(function(leftChannel) {
        console.log('left ' + leftChannel.friendlyName);
        leftChannel.removeListener('messageAdded', tc.addMessageToList);
        leftChannel.removeListener('typingStarted', showTypingStarted);
        leftChannel.removeListener('typingEnded', hideTypingStarted);
        leftChannel.removeListener('memberJoined', notifyMemberJoined);
        leftChannel.removeListener('memberLeft', notifyMemberLeft);
      });
    } else {
      return Promise.resolve();
    }
  }

  tc.addMessageToList = function(message) {
    var rowDiv = $('<div>').addClass('row no-margin');
    rowDiv.loadTemplate($('#message-template'), {
      username: message.author,
      date: dateFormatter.getTodayDate(message.timestamp),
      body: message.body
    });
    if (message.author === tc.username) {
      rowDiv.addClass('own-message');
    }

    tc.$messageList.append(rowDiv);
    scrollToMessageListBottom();
  };

  function notifyMemberJoined(member) {
    notify(member.identity + ' joined the channel')
  }

  function notifyMemberLeft(member) {
    notify(member.identity + ' left the channel');
  }

  function notify(message) {
    var row = $('<div>').addClass('col-md-12');
    row.loadTemplate('#member-notification-template', {
      status: message
    });
    tc.$messageList.append(row);
    scrollToMessageListBottom();
  }

  function showTypingStarted(member) {
    $typingPlaceholder.text(member.identity + ' is typing...');
  }

  function hideTypingStarted(member) {
    $typingPlaceholder.text('');
  }

  function scrollToMessageListBottom() {
    tc.$messageList.scrollTop(tc.$messageList[0].scrollHeight);
  }

  function updateChannelUI(selectedChannel) {
    var channelElements = $('.channel-element').toArray();
    var channelElement = channelElements.filter(function(element) {
      return $(element).data().sid === selectedChannel.sid;
    });
    channelElement = $(channelElement);
    if (tc.currentChannelContainer === undefined && selectedChannel.uniqueName === GENERAL_CHANNEL_UNIQUE_NAME) {
      tc.currentChannelContainer = channelElement;
    }
    tc.currentChannelContainer.removeClass('selected-channel').addClass('unselected-channel');
    channelElement.removeClass('unselected-channel').addClass('selected-channel');
    tc.currentChannelContainer = channelElement;
  }

  function showAddChannelInput() {
    if (tc.messagingClient) {
      $newChannelInputRow.addClass('showing').removeClass('not-showing');
      $channelList.addClass('showing').removeClass('not-showing');
      $newChannelInput.focus();
    }
  }

  function hideAddChannelInput() {
    $newChannelInputRow.addClass('not-showing').removeClass('showing');
    $channelList.addClass('not-showing').removeClass('showing');
    $newChannelInput.val('');
  }

  function addChannel(channel) {
    if (channel.uniqueName === GENERAL_CHANNEL_UNIQUE_NAME) {
      tc.generalChannel = channel;
    }
    var rowDiv = $('<div>').addClass('row channel-row');
    rowDiv.loadTemplate('#channel-template', {
      channelName: channel.friendlyName
    });

    var channelP = rowDiv.children().children().first();

    rowDiv.on('click', selectChannel);
    channelP.data('sid', channel.sid);
    if (tc.currentChannel && channel.sid === tc.currentChannel.sid) {
      tc.currentChannelContainer = channelP;
      channelP.addClass('selected-channel');
    }
    else {
      channelP.addClass('unselected-channel')
    }

    $channelList.append(rowDiv);
  }

  function deleteCurrentChannel() {
    if (!tc.currentChannel) {
      return;
    }

    if (tc.currentChannel.sid === tc.generalChannel.sid) {
      alert('You cannot delete the general channel');
      return;
    }

    tc.currentChannel
      .delete()
      .then(function(channel) {
        console.log('channel: '+ channel.friendlyName + ' deleted');
        setupChannel(tc.generalChannel);
      });
  }

  function selectChannel(event) {
    var target = $(event.target);
    var channelSid = target.data().sid;
    var selectedChannel = tc.channelArray.filter(function(channel) {
      return channel.sid === channelSid;
    })[0];
    if (selectedChannel === tc.currentChannel) {
      return;
    }
    setupChannel(selectedChannel);
  };

  function disconnectClient() {
    leaveCurrentChannel();
    $channelList.text('');
    tc.$messageList.text('');
    channels = undefined;
    $statusRow.addClass('disconnected').removeClass('connected');
    tc.$messageList.addClass('disconnected').removeClass('connected');
    $connectPanel.addClass('disconnected').removeClass('connected');
    $inputText.removeClass('with-shadow');
    $typingRow.addClass('disconnected').removeClass('connected');
  }

  tc.sortChannelsByName = function(channels) {
    return channels.sort(function(a, b) {
      if (a.friendlyName === GENERAL_CHANNEL_NAME) {
        return -1;
      }
      if (b.friendlyName === GENERAL_CHANNEL_NAME) {
        return 1;
      }
      return a.friendlyName.localeCompare(b.friendlyName);
    });
  };

  return tc;
})();
