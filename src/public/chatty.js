"use strict";

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showUsernamePrompt: true,
      host: location.origin.replace(/^http/, 'ws'),
      username: '',
      messages: [],
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
        let m = {username: message.username, message: message.content};
        this.setState((state) => {
          let messages = state.messages.push(m);
          return messages;
        });
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
          <MessageBoard messagesList={this.state.messages} />
          <MessageInput handleSubmit={this.handleMessageSubmit} />
        </div>
      );
    }
  }
}

function MessageBoard(props) {
  console.log(props);
  console.log(typeof props.messagesList);
  console.log(props.messagesList);
  let messages = props.messagesList.map((m) =>     
    <li>{'<'+m.username+'>'+' '+m.message}</li>
  );
  return (
    <div>
      <ul id="messages">
        {messages}
      </ul>
    </div>
  );
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
