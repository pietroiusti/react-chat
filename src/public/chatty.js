"use strict";

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showUsernamePrompt: true,
      host: location.origin.replace(/^http/, 'ws'),
      username: '',
    };
    this.handleUsernameSubmit = this.handleUsernameSubmit.bind(this);
    this.handleMessageSubmit = this.handleMessageSubmit.bind(this);
  }

  componentDidMount() {
    this.ws = new WebSocket(this.state.host);
    
    this.ws.onopen = () => {
      console.log('WebSocket Client Connected');
    };    

    this.ws.onmessage = (e) => {
      let message = JSON.parse(e.data);
      console.log('Message Received:');
      console.log(message);

      if (message.type === 'usernameConnectionSuccess') {
        this.setState({showUsernamePrompt: false,
                       username: message.username});
      } else if (message.type === 'message') {
        console.log(`TODO: I should display the message from ${message.username}:
${message.content}`);
      }
    };
  }

  handleUsernameSubmit(username) {
    this.ws.send(JSON.stringify({
      type: 'joinChat',
      username: username,
    }));
  }

  handleMessageSubmit(e, message) {
    e.preventDefault();
    //console.log({u: this.state.username, m: message});
    this.ws.send(JSON.stringify({
      type: 'message',
      username: this.state.username,
      content: message,
    }));
  }

  render() {
    if (this.state.showUsernamePrompt) {
      return (
        <UsernameForm handleUsernameSubmit={this.handleUsernameSubmit}/>
      );
    }
    else {
      return (
        <div>
          <MessageBoard />
          <MessageInput handleSubmit={this.handleMessageSubmit} />
        </div>
      );
    }
  }
}

class MessageBoard extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <ul id="messages">
        </ul>
      </div>
    );
  }
}

// TODO: extract the input from MessageBoard, no?
class MessageInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',      
    };
    this.handleChange = this.handleChange.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
  }
  // handleSubmit(event) {
  //   event.preventDefault();
  //   console.log(`I should be sending: ${this.state.value}, but...`);
  // }
  handleChange(event) {
    this.setState({value: event.target.value});
  }
  render() {
    return (
      <div>
        <form onSubmit={(e)=>this.props.handleSubmit(e, this.state.value)}>
          <input id="messageInput" autocomplete="off"
                 autofocus="true" onChange={this.handleChange}/>
        </form>
      </div>
    );
  }
}

class UsernameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleKeyUp(event) {
    if (event.type === 'keyup')
      if (event.keyCode === 13)
        this.props.handleUsernameSubmit(this.state.value);
  }

  render() {
    return (
      <input autofocus="true" type="text"
             placeholder="username" id="usernameInput"
             onChange={this.handleChange}
             onKeyUp={this.handleKeyUp}/>
    );
  }
}

ReactDOM.render(
  <Chat />,
  document.getElementById('root')
);
