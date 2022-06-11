"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var welcomeMessage0 = '\n\n                     __          __  _\n                     \\ \\        / / | |\n                      \\ \\  /\\  / /__| | ___ ___  _ __ ___   ___\n                       \\ \\/  \\/ / _ \\ |/ __/ _ \\| \'_ ` _ \\ / _ \\\n                        \\  /\\  /  __/ | (_| (_) | | | | | |  __/\n                         \\/  \\/ \\___|_|\\___\\___/|_| |_| |_|\\___|\n\n\n\n\n\n\n\n\n\n';

var welcomeMessage1 = '\n\n\n\n                     +-------------------------------------------------------+\n                     | +---------------------------------------------------+ |\n                     | | +-----------------------------------------------+ | |\n                     | | |  __          __  _                            | | |\n                     | | |  \\ \\        / / | |                           | | |\n                     | | |   \\ \\  /\\  / /__| | ___ ___  _ __ ___   ___   | | |\n                     | | |    \\ \\/  \\/ / _ \\ |/ __/ _ \\| \'_ ` _ \\ / _ \\  | | |\n                     | | |     \\  /\\  /  __/ | (_| (_) | | | | | |  __/  | | |\n                     | | |      \\/  \\/ \\___|_|\\___\\___/|_| |_| |_|\\___|  | | |\n                     | | |                                               | | |\n                     | | +-----------------------------------------------+ | |\n                     | +---------------------------------------------------+ |\n                     +-------------------------------------------------------+\n\n\n\n\n\n\n\n\n\n';

var Chat = function (_React$Component) {
  _inherits(Chat, _React$Component);

  function Chat(props) {
    _classCallCheck(this, Chat);

    var _this = _possibleConstructorReturn(this, (Chat.__proto__ || Object.getPrototypeOf(Chat)).call(this, props));

    _this.state = {
      showUsernamePrompt: true,
      host: location.origin.replace(/^http/, 'ws'),
      username: '',
      users: [],
      messages: [{ art: true, message: welcomeMessage1 }],
      inputValue: '',
      error: false,
      loading: false,
      loadingState: 0,
      loadingInterval: null
    };
    _this.handleUsernameSubmit = _this.handleUsernameSubmit.bind(_this);
    _this.handleMessageSubmit = _this.handleMessageSubmit.bind(_this);
    _this.handleInputChange = _this.handleInputChange.bind(_this);
    return _this;
  }

  _createClass(Chat, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      this.ws = new WebSocket(this.state.host);

      this.ws.onopen = function () {
        console.log('WebSocket Client Connected');
      };

      this.ws.onclose = function () {
        console.log('WebSocket connection closed.');

        var m = { username: null, message: '### You have lost connection to the chat. ###' };

        _this2.setState(function (state) {
          var mess = state.messages.slice();
          mess.push(m);

          return {
            messages: mess
          };
        });
      };

      this.ws.onmessage = function (e) {
        var message = JSON.parse(e.data);
        console.log('Message Received:');
        console.log(message);

        if (message.type === 'usernameConnectionSuccess') {
          clearInterval(_this2.state.loadingInterval);
          _this2.setState({
            loadingInterval: null,
            showUsernamePrompt: false,
            username: message.username,
            users: message.users
          });
        } else if (message.type === 'error') {
          clearInterval(_this2.state.loadingInterval);
          _this2.setState({
            loading: false,
            loadingState: 0,
            loadingInterval: null,
            error: message.text
          });
        } else if (message.type === 'userJoined') {
          console.log('New user has joined the chat.');

          var m = { username: null, message: '### ' + message.username + ' has joined the chat.###' };

          _this2.setState(function (state) {
            var mess = state.messages.slice();
            mess.push(m);
            return {
              messages: mess,
              users: message.users
            };
          });
        } else if (message.type === 'userLeft') {
          console.log('User has left the chat.');

          var _m = { username: null, message: '### ' + message.username + ' has left the chat. ###' };

          _this2.setState(function (state) {
            var mess = state.messages.slice();
            mess.push(_m);

            return {
              messages: mess,
              users: message.users
            };
          });
        } else if (message.type === 'message') {

          var _m2 = { username: message.username, message: message.content };

          _this2.setState(function (state) {
            var mess = state.messages.slice();
            mess.push(_m2);
            return { messages: mess };
          });
        }
      };
    }
  }, {
    key: 'handleInputChange',
    value: function handleInputChange(e) {
      e.preventDefault();
      this.setState({ inputValue: e.target.value });
    }
  }, {
    key: 'handleMessageSubmit',
    value: function handleMessageSubmit(e) {
      this.setState({ inputValue: '' });
      e.preventDefault();
      //console.log({u: this.state.username, m: message});
      this.ws.send(JSON.stringify({
        type: 'message',
        username: this.state.username,
        content: this.state.inputValue
      }));
    }
  }, {
    key: 'handleUsernameSubmit',
    value: function handleUsernameSubmit(username) {
      var _this3 = this;

      this.setState({
        loading: true,
        error: false
      });

      var interval = setInterval(function () {
        console.log('foo');
        if (_this3.state.loadingState !== 3) {
          _this3.setState({ loadingState: _this3.state.loadingState + 1 });
        } else if (_this3.state.loadingState === 3) {
          _this3.setState({ loadingState: 0 });
        }
      }, 300);
      this.setState({ loadingInterval: interval });

      setTimeout(function () {
        _this3.ws.send(JSON.stringify({
          type: 'joinChat',
          username: username
        }));
      }, 3000);
    }
  }, {
    key: 'render',
    value: function render() {
      if (this.state.showUsernamePrompt) {
        if (this.state.error) {
          return React.createElement(
            'div',
            { id: 'usernameFormContainer' },
            React.createElement(UsernameForm, { handleUsernameSubmit: this.handleUsernameSubmit }),
            React.createElement(ErrorNotification, { text: this.state.error }),
            React.createElement(LoadingDots, { value: this.state.loading, loadingState: this.state.loadingState })
          );
        } else {
          return React.createElement(
            'div',
            { id: 'usernameFormContainer' },
            React.createElement(UsernameForm, { handleUsernameSubmit: this.handleUsernameSubmit }),
            React.createElement(LoadingDots, { value: this.state.loading, loadingState: this.state.loadingState })
          );
        }
      } else {
        return React.createElement(
          'div',
          { id: 'chatContainer' },
          React.createElement(Header, null),
          React.createElement(UserList, { users: this.state.users }),
          React.createElement(MessageBoard, { messagesList: this.state.messages }),
          React.createElement(MessageInput, { value: this.state.inputValue, handleChange: this.handleInputChange,
            handleSubmit: this.handleMessageSubmit })
        );
      }
    }
  }]);

  return Chat;
}(React.Component);

function LoadingDots(props) {
  if (props.value === true) {
    if (props.loadingState === 0) {
      return React.createElement(
        'div',
        { id: 'loadingDots' },
        '  '
      );
    } else if (props.loadingState === 1) {
      return React.createElement(
        'div',
        { id: 'loadingDots' },
        ' . '
      );
    } else if (props.loadingState === 2) {
      return React.createElement(
        'div',
        { id: 'loadingDots' },
        ' .  . '
      );
    } else if (props.loadingState === 3) {
      return React.createElement(
        'div',
        { id: 'loadingDots' },
        ' .  .  . '
      );
    }
  } else {
    return null;
  }
}

function Header(props) {
  return React.createElement(
    'div',
    { id: 'header' },
    'A Chat in React'
  );
}

function UserList(props) {
  var users = props.users.map(function (u) {
    return React.createElement(
      'li',
      null,
      u
    );
  });
  return React.createElement(
    'div',
    { id: 'userListDiv' },
    React.createElement(
      'ul',
      { id: 'userList' },
      users
    )
  );
}

function MessageBoard(props) {

  var messages = props.messagesList.map(function (m) {
    if (m.art) {
      return React.createElement(
        'li',
        null,
        React.createElement(
          'div',
          { 'class': 'art' },
          m.message
        )
      );
    } else {
      return React.createElement(
        'li',
        null,
        m.username == null ? m.message : '<' + m.username + '>' + ' ' + m.message
      );
    }
  });

  return React.createElement(
    'div',
    { id: 'messagesDiv' },
    React.createElement(
      'ul',
      { id: 'messages' },
      messages
    )
  );
}

function MessageInput(props) {
  return React.createElement(
    'div',
    { id: 'messageInputDiv' },
    React.createElement(
      'form',
      { onSubmit: props.handleSubmit },
      React.createElement('input', { type: 'text', id: 'messageInput', autocomplete: 'off',
        autoFocus: 'true', onChange: function onChange(e) {
          return props.handleChange(e);
        },
        value: props.value })
    )
  );
}

function ErrorNotification(props) {
  return React.createElement(
    'p',
    null,
    'Error: ',
    props.text,
    '.'
  );
}

var UsernameForm = function (_React$Component2) {
  _inherits(UsernameForm, _React$Component2);

  function UsernameForm(props) {
    _classCallCheck(this, UsernameForm);

    var _this4 = _possibleConstructorReturn(this, (UsernameForm.__proto__ || Object.getPrototypeOf(UsernameForm)).call(this, props));

    _this4.state = {
      value: ''
    };
    _this4.handleChange = _this4.handleChange.bind(_this4);
    _this4.handleKeyUp = _this4.handleKeyUp.bind(_this4);
    return _this4;
  }

  _createClass(UsernameForm, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      // TODO: refactor
      var i = 0;
      var speed = 80;
      var txt = "Type your username";

      function typeWriter() {
        if (i < txt.length) {
          document.querySelector("#usernameInput").placeholder += txt.charAt(i);
          i++;
          setTimeout(typeWriter, speed);
        }
      }
      typeWriter();
    }
  }, {
    key: 'handleChange',
    value: function handleChange(event) {
      this.setState({ value: event.target.value });
    }
  }, {
    key: 'handleKeyUp',
    value: function handleKeyUp(event) {
      if (event.type === 'keyup') if (event.keyCode === 13) this.props.handleUsernameSubmit(this.state.value);
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement('input', { autoFocus: 'true', type: 'text',
        id: 'usernameInput',
        onChange: this.handleChange,
        onKeyUp: this.handleKeyUp });
    }
  }]);

  return UsernameForm;
}(React.Component);

ReactDOM.render(React.createElement(Chat, null), document.getElementById('root'));