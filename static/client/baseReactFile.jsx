import React, { Component } from 'react';
import connectSocket from './events.js';
import { Board } from './Board';

class firstComponent extends Component {
  componentWillMount() {
    // Connect to the websocket
    const socket = connectSocket(document.domain, location.port);
    this.setState({ socket });
  }

  render() {
    return (
      <div>
        <Board />
      </div>
    );
  }
}

export default firstComponent;
