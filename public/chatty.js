"use strict";

(function () {

  var username = void 0;

  var body = document.getElementsByTagName('body')[0];
  var usernameInput = document.createElement('input');
  usernameInput.autofocus = true;
  usernameInput.type = 'text';
  usernameInput.placeholder = 'username';
  usernameInput.id = 'usernameInput';
  body.appendChild(usernameInput);

  usernameInput.addEventListener("keyup", function (event) {
    event.preventDefault();
    if (event.keyCode === 13) {
      usernameInput.style.display = 'none';
      username = usernameInput.value;
      startChat(username);
    }
  });

  function startChat(username) {
    var HOST = location.origin.replace(/^http/, 'ws');
    var ws = new WebSocket(HOST);

    ws.onopen = function () {
      console.log('WebSocket Client Connected');
      ws.send(JSON.stringify({
        type: 'joinChat',
        username: username
      }));
    };
    ws.onmessage = function (e) {
      var action = JSON.parse(e.data);

      if (action.type === 'joinChat') {
        body.appendChild(renderChat());
        document.getElementById('messageInput').focus();
      } else if (action.type === 'message') {
        //console.log(action.content);
        var li = document.createElement('li');
        var liTxt = document.createTextNode('<' + action.username + '> ' + action.content);
        li.appendChild(liTxt);
        document.getElementById('messages').appendChild(li);
      } else if (action.type === 'usernameTaken') {
        usernameInput.value = '';
        usernameInput.placeholder = 'username taken';
        usernameInput.style.display = '';
        usernameInput.focus();
      }
    };

    function renderChat() {
      var chat = document.createElement('div');
      var ul = document.createElement('ul');
      ul.id = 'messages';
      chat.appendChild(ul);

      var form = document.createElement('form');
      form.action = '';

      var input = document.createElement('input');
      input.id = 'messageInput';
      input.autocomplete = 'off';
      form.appendChild(input);
      chat.appendChild(form);

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        ws.send(JSON.stringify({
          type: 'message',
          username: username,
          content: input.value
        }));
        document.getElementById('messageInput').value = '';
        document.getElementById('messageInput').focus();
      });
      return chat;
    }
  };
})();