import React, { Component } from 'react';
import { connect } from 'react-redux';
import Stomp from 'stompjs';

class PassengerDashboardPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      receiverUser: '',
      isConnected: false,
      socketSessionId: '',
      latitude: 50.063978,
      longitude: 19.970156,
      userId: this.props.user.user.id
    };

    this.onConnect = this.onConnect.bind(this);
    this.onChange = this.onChange.bind(this);
    this.sendGetTaxiRequest = this.sendGetTaxiRequest.bind(this);
    this.sendActivate = this.sendActivate.bind(this);
    this.sendMessage3 = this.sendMessage3.bind(this);
  }

  onConnect() {
    this.ws = Stomp.over(new WebSocket(`${process.env.REACT_APP_SOCKET_URL}/ws`));
    this.ws.connect(
      {},
      (frame) => {
        this.ws.subscribe('/topic/reply', (payload) => {
          this.setState({ messages: [...this.state.messages, JSON.stringify(payload)] });
        });

        this.ws.subscribe('/user/queue/passenger', (payload) => {
          console.log('dupa');
          this.setState({ messages: [...this.state.messages, JSON.stringify(payload)] });
        });

        this.ws.subscribe('/user/queue/errors', (payload) => {
          this.setState({ messages: [...this.state.messages, JSON.stringify(payload)] });
        });

        this.setState({
          isConnected: true,
          socketSessionId: frame.headers['user-name']
        });
      },
      err => console.log('STOMP error:', err)
    );
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  sendGetTaxiRequest() {
    const { state } = this;

    this.ws.send('/taxi.orderRequest', {}, JSON.stringify({
      receiverId: state.receiverUser,
      localization: {
        latitude: state.latitude,
        longitude: state.longitude
      }
    }));
  }

  sendActivate() {
    this.ws.send('/taxi.activate', {}, JSON.stringify({
      id: this.state.userId,
      socketSessionId: this.state.socketSessionId,
      latitude: this.state.latitude,
      longitude: this.state.longitude
    }));
  }

  sendMessage3() {
    // const { user } = store.getState();
    this.ws.send('/taxi.deactivate', {}, JSON.stringify({
      // id: user.user.id,
      socketSessionId: this.state.receiverUser
    }));
  }

  render() {
    const messages = this.state.messages.map((message, index) => (
      <li key={index}>{message}</li>
    ));

    return (
      <div>
        <h1>Passenger</h1>
        <ul>
          {messages}
        </ul>
        <div>
          <button onClick={this.onConnect}>Connect</button><br /><br />
        </div>
        { this.state.isConnected &&
          <div>
            <label htmlFor="receiverUser">
              Lat:
              <input type="text" id="latitude" name="latitude" onChange={this.onChange} />
            </label>
            <label htmlFor="receiverUser">
              Lang:
              <input type="text" id="longitude" name="longitude" onChange={this.onChange} />
            </label>
            <label htmlFor="receiverUser">
              Lang:
              <input type="text" id="receiverUser" name="receiverUser" onChange={this.onChange} />
            </label>
            <button onClick={this.sendActivate}>Activate</button>
            <button onClick={this.sendGetTaxiRequest}>Get taxi</button>
          </div>}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(PassengerDashboardPage);

// { this.state.receiverUser &&
//   <div>
//     <button onClick={this.sendMessage}>Send message</button>
//     <button onClick={this.sendMessage2}>Send activate</button>
//     <button onClick={this.sendMessage3}>Send deactivate</button>
//   </div>
// }
