"use strict";

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showUsernamePrompt: true,
      host: location.origin.replace(/^http/, 'ws'),
      username: '',
      users: [],
      messages: [],
      inputValue: '',
      error: false,
      loading: false,
      loadingState: 0,
      loadingInterval: null,
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

    this.ws.onclose = () => {
      console.log('WebSocket connection closed.');

      let m = {username: null, message: '### You have lost connection to the chat. ###'};

      this.setState((state) => {
        let mess = state.messages.slice();
        mess.push(m);

        return {
          messages: mess,
          users: message.users,
        };
      });
    };

    this.ws.onmessage = (e) => {
      let message = JSON.parse(e.data);
      console.log('Message Received:');
      console.log(message);

      if (message.type === 'usernameConnectionSuccess') {
        clearInterval(this.state.loadingInterval);
        this.setState({
          loadingInterval: null,
          showUsernamePrompt: false,
          username: message.username,
          users: message.users,
        });
      } else if (message.type === 'error') {
        clearInterval(this.state.loadingInterval);
        this.setState({
          loading: false,
          loadingState: 0,
          loadingInterval: null,
          error: message.text,
        });
      } else if (message.type === 'userJoined') {
        console.log('New user has joined the chat.');

        let m = {username: null, message: `### ${message.username} has joined the chat.###`};

        this.setState((state) => {
          let mess = state.messages.slice();
          mess.push(m);
          return {
            messages: mess,
            users: message.users,
          };
        });

      } else if (message.type === 'userLeft') {
        console.log('User has left the chat.');

        let m = {username: null, message: `### ${message.username} has left the chat. ###`};

        this.setState((state) => {
          let mess = state.messages.slice();
          mess.push(m);

          return {
            messages: mess,
            users: message.users,
          };
        });


      } else if (message.type === 'message') {

        let m = {username: message.username, message: message.content};

        this.setState((state) => {
          let mess = state.messages.slice();
          mess.push(m);
          return {messages: mess};
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
    this.setState({
      loading: true,
      error: false,
    });
    
    let interval = setInterval(() => {
      console.log('foo');
      if (this.state.loadingState !== 3) {
        this.setState({loadingState: this.state.loadingState + 1});
      } else if (this.state.loadingState === 3) {
        this.setState({loadingState: 0});
      }
    }, 300);
    this.setState({loadingInterval:  interval});
    
    setTimeout(() => {
      this.ws.send(JSON.stringify({
        type: 'joinChat',
        username: username,
      }));
    }, 3000);
  }

  render() {
    if (this.state.showUsernamePrompt) {
      if (this.state.error) {
        return (
          <div id="usernameFormContainer">
            <UsernameForm handleUsernameSubmit={this.handleUsernameSubmit}/>
            <ErrorNotification text={this.state.error}/>
            <LoadingDots value={this.state.loading} loadingState={this.state.loadingState} />
          </div>
        );
      } else {
        return (
          <div id="usernameFormContainer">
            <UsernameForm handleUsernameSubmit={this.handleUsernameSubmit}/>
            <LoadingDots value={this.state.loading} loadingState={this.state.loadingState} />
          </div>
        );
      }
    }
    else {
      return (
        <div id="chatContainer">
          <Header />
          <UserList users={this.state.users} />
          <MessageBoard messagesList={this.state.messages} />
          <MessageInput value={this.state.inputValue} handleChange={this.handleInputChange}
                        handleSubmit={this.handleMessageSubmit} />
        </div>
      );
    }
  }
}

function LoadingDots(props) {
  if (props.value === true) {
    if (props.loadingState === 0) {
      return (
        <div id="loadingDots">  </div>
      );
    } else if (props.loadingState === 1) {
      return (
        <div id="loadingDots"> . </div>
      );
    } else if (props.loadingState === 2) {
      return (
        <div id="loadingDots"> .  . </div>
      );
    } else if (props.loadingState === 3) {
      return (
        <div id="loadingDots"> .  .  . </div>
      );
    }
  } else {
    return null;
  }
}


function Header (props) {
  return (
    <div id="header">
      A Chat in React
    </div>
  );
}

function UserList(props) {
  let users = props.users.map((u) =>
    <li>{u}</li>
  );
  return (
    <div id="userListDiv">
      <ul id="userList">
        {users}
      </ul>
    </div>
  );
}

function MessageBoard(props) {

  let messages = props.messagesList.map(m =>
    <li>{m.username==null? m.message :'<'+m.username+'>' + ' ' + m.message}</li>
  );


  return (
    <div id="messagesDiv">
      <ul id="messages">
        {messages}
      </ul>
    </div>
  );
}

function MessageInput(props) {
  return (
    <div id="messageInputDiv">
      <form onSubmit={props.handleSubmit}>
        <input type="text" id="messageInput" autocomplete="off"
               autoFocus="true" onChange={(e)=>props.handleChange(e)}
               value={props.value} />
      </form>
    </div>
  );
}

function ErrorNotification(props) {
  return (
    <p>
      Error: {props.text}.
    </p>
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

  componentDidMount() { // TODO: refactor
      let i = 0;
      let speed = 80;
      let txt = "Type your username";

      function typeWriter() {
        if (i < txt.length) {
          document.querySelector("#usernameInput").placeholder += txt.charAt(i);
          i++;
          setTimeout(typeWriter, speed);
        }
      }
    typeWriter();
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
      <input autoFocus="true" type="text"
             id="usernameInput"
             onChange={this.handleChange}
             onKeyUp={this.handleKeyUp}/>
    );
  }
}

ReactDOM.render(
  <Chat />,
  document.getElementById('root')
);
