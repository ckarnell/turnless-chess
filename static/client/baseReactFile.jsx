import React, { Component } from 'react';
import { Provider } from 'react-redux';
import _get from 'lodash/get';
import { createStore } from 'redux';
import reducer from './redux/gameStart.js';
import connectSocket from './events.js';
import Game from './Game';

const reduxDevExtension = (
  window.__REDUX_DEVTOOLS_EXTENSION__ &&
  window.__REDUX_DEVTOOLS_EXTENSION__()
);

class baseComponent extends Component {
  constructor(props) {
    super(props);
    this.store = createStore(
      reducer,
      reduxDevExtension,
    );

    // Connect to the websocket
    this.socket = connectSocket(document.domain, location.port, this.store);
    this.onPieceDrop = this.onPieceDrop.bind(this);
  }

  onPieceDrop(moveInfo) {
    const roomId = _get(this.store.getState(), 'roomId');
    const data = Object.assign({},
      moveInfo,
      { roomId },
    );
    this.socket.emit('move', data);
  }

  render() {
    return (
      <Provider store={this.store}>
        <Game
          socket={this.socket}
        />
      </Provider>
    );
  }
}

export default baseComponent;
