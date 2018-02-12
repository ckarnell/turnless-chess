import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from './redux/gameStart.js';
import connectSocket from './events.js';
import { Board } from './Board';

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
  }

  render() {
    return (
      <Provider store={this.store}>
        <Board />
      </Provider>
    );
  }
}

export default baseComponent;
