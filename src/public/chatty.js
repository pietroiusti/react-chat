"use strict";

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showUsernamePrompt: true,
      host: location.origin.replace(/^http/, 'ws'),
      username: '',
      messages: [],
      inputValue: '',
    };
    this.handleUsernameSubmit = this.handleUsernameSubmit.bind(this);
    this.handleMessageSubmit = this.handleMessageSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
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

  handleInputChange(e) {
    e.preventDefault();
    this.setState({inputValue: e.target.value});
  }

  handleMessageSubmit(e) {
    this.setState({inputValue: ''});
    e.preventDefault();
    //console.log({u: this.state.username, m: message});
    this.ws.send(JSON.stringify({
      type: 'message',
      username: this.state.username,
      content: this.state.inputValue,
    }));
  }

  handleUsernameSubmit(username) {
    this.ws.send(JSON.stringify({
      type: 'joinChat',
      username: username,
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
          <MessageInput value={this.state.inputValue} handleChange={this.handleInputChange}
                        handleSubmit={this.handleMessageSubmit} />
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
// class MessageInput extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       value: '',      
//     };
//     this.handleChange = this.handleChange.bind(this);
//     // this.handleSubmit = this.handleSubmit.bind(this);
//   }
//   // handleSubmit(event) {
//   //   event.preventDefault();
//   //   console.log(`I should be sending: ${this.state.value}, but...`);
//   // }
//   // handleChange(event) {
//   //   this.setState({value: event.target.value});
//   // }
//   render() {
//     return (
//       <div>
//         <form onSubmit={this.props.handleSubmit}>
//           <input id="messageInput" autocomplete="off"
//                  autofocus="true" onChange={(e)=>this.prosp.handleChange(e.target.value)}/>
//         </form>
//       </div>
//     );
//   }
// }

function MessageInput(props) {
  return (
    <div>
      <form onSubmit={props.handleSubmit}>
        <input id="messageInput" autocomplete="off"
               autofocus="true" onChange={(e)=>props.handleChange(e)}
               value={props.value} />
      </form>
    </div>
  );
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
