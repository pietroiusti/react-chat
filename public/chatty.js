"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Chat = function (_React$Component) {
  _inherits(Chat, _React$Component);

  function Chat(props) {
    _classCallCheck(this, Chat);

    var _this = _possibleConstructorReturn(this, (Chat.__proto__ || Object.getPrototypeOf(Chat)).call(this, props));

    _this.state = {
      showUsernamePrompt: true,
      host: location.origin.replace(/^http/, 'ws'),
      username: '',
      messages: []
    };
    _this.handleUsernameSubmit = _this.handleUsernameSubmit.bind(_this);
    _this.handleMessageSubmit = _this.handleMessageSubmit.bind(_this);
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

      this.ws.onmessage = function (e) {
        var message = JSON.parse(e.data);
        console.log('Message Received:');
        console.log(message);

        if (message.type === 'usernameConnectionSuccess') {
          _this2.setState({ showUsernamePrompt: false,
            username: message.username });
        } else if (message.type === 'message') {
          var m = { username: message.username, message: message.content };
          _this2.setState(function (state) {
            var messages = state.messages.push(m);
            return messages;
          });
        }
      };
    }
  }, {
    key: 'handleUsernameSubmit',
    value: function handleUsernameSubmit(username) {
      this.ws.send(JSON.stringify({
        type: 'joinChat',
        username: username
      }));
    }
  }, {
    key: 'handleMessageSubmit',
    value: function handleMessageSubmit(e, message) {
      e.preventDefault();
      //console.log({u: this.state.username, m: message});
      this.ws.send(JSON.stringify({
        type: 'message',
        username: this.state.username,
        content: message
      }));
    }
  }, {
    key: 'render',
    value: function render() {
      if (this.state.showUsernamePrompt) {
        return React.createElement(UsernameForm, { handleUsernameSubmit: this.handleUsernameSubmit });
      } else {
        return React.createElement(
          'div',
          null,
          React.createElement(MessageBoard, { messagesList: this.state.messages }),
          React.createElement(MessageInput, { handleSubmit: this.handleMessageSubmit })
        );
      }
    }
  }]);

  return Chat;
}(React.Component);

function MessageBoard(props) {
  console.log(props);
  console.log(_typeof(props.messagesList));
  console.log(props.messagesList);
  var messages = props.messagesList.map(function (m) {
    return React.createElement(
      'li',
      null,
      '<' + m.username + '>' + ' ' + m.message
    );
  });
  return React.createElement(
    'div',
    null,
    React.createElement(
      'ul',
      { id: 'messages' },
      messages
    )
  );
}

// TODO: extract the input from MessageBoard, no?

var MessageInput = function (_React$Component2) {
  _inherits(MessageInput, _React$Component2);

  function MessageInput(props) {
    _classCallCheck(this, MessageInput);

    var _this3 = _possibleConstructorReturn(this, (MessageInput.__proto__ || Object.getPrototypeOf(MessageInput)).call(this, props));

    _this3.state = {
      value: ''
    };
    _this3.handleChange = _this3.handleChange.bind(_this3);
    // this.handleSubmit = this.handleSubmit.bind(this);
    return _this3;
  }
  // handleSubmit(event) {
  //   event.preventDefault();
  //   console.log(`I should be sending: ${this.state.value}, but...`);
  // }


  _createClass(MessageInput, [{
    key: 'handleChange',
    value: function handleChange(event) {
      this.setState({ value: event.target.value });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      return React.createElement(
        'div',
        null,
        React.createElement(
          'form',
          { onSubmit: function onSubmit(e) {
              return _this4.props.handleSubmit(e, _this4.state.value);
            } },
          React.createElement('input', { id: 'messageInput', autocomplete: 'off',
            autofocus: 'true', onChange: this.handleChange })
        )
      );
    }
  }]);

  return MessageInput;
}(React.Component);

var UsernameForm = function (_React$Component3) {
  _inherits(UsernameForm, _React$Component3);

  function UsernameForm(props) {
    _classCallCheck(this, UsernameForm);

    var _this5 = _possibleConstructorReturn(this, (UsernameForm.__proto__ || Object.getPrototypeOf(UsernameForm)).call(this, props));

    _this5.state = {
      value: ''
    };
    _this5.handleChange = _this5.handleChange.bind(_this5);
    _this5.handleKeyUp = _this5.handleKeyUp.bind(_this5);
    return _this5;
  }

  _createClass(UsernameForm, [{
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
      return React.createElement('input', { autofocus: 'true', type: 'text',
        placeholder: 'username', id: 'usernameInput',
        onChange: this.handleChange,
        onKeyUp: this.handleKeyUp });
    }
  }]);

  return UsernameForm;
}(React.Component);

ReactDOM.render(React.createElement(Chat, null), document.getElementById('root'));