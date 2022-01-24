"use strict";

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
      username: ''
    };
    _this.handleUsernameSubmit = _this.handleUsernameSubmit.bind(_this);
    return _this;
  }

  _createClass(Chat, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.ws = new WebSocket(this.state.host);

      this.ws.onopen = function () {
        console.log('WebSocket Client Connected');
      };

      this.ws.onmessage = function (e) {
        var message = JSON.parse(e.data);
        console.log('Message Received:');
        console.log(message);

        if (message.type === 'usernameConnectionSuccess') {
          console.log('Gotta show message board');
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
    key: 'render',
    value: function render() {
      if (this.state.showUsernamePrompt) {
        return React.createElement(UsernameForm, { handleUsernameSubmit: this.handleUsernameSubmit });
      } else {
        return "MESSAGE BOARD (TODO)";
      }
    }
  }]);

  return Chat;
}(React.Component);

var UsernameForm = function (_React$Component2) {
  _inherits(UsernameForm, _React$Component2);

  function UsernameForm(props) {
    _classCallCheck(this, UsernameForm);

    var _this2 = _possibleConstructorReturn(this, (UsernameForm.__proto__ || Object.getPrototypeOf(UsernameForm)).call(this, props));

    _this2.state = {
      value: ''
    };
    _this2.handleChange = _this2.handleChange.bind(_this2);
    _this2.handleKeyUp = _this2.handleKeyUp.bind(_this2);
    return _this2;
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