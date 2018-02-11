import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Draggable from 'react-draggable';
import whitePawn from '../assets/white_pawn_large.png';

export class Piece extends Component {
  static _onDragStart(e) {
    /* Allow the Draggable hoc handle dragging instead of the img defaults */
    e.preventDefault();
  }

  constructor(props) {
    super(props);
    // this._onDragStart = this._onDragStart.bind(this);
  }

  render() {
    return (
      <Draggable>
        <img
          draggable="true"
          onDragStart={this.constructor._onDragStart}
          height="50"
          width="50"
          src={whitePawn}
          alt="white-pawn"
        />
      </Draggable>
    );
  }
}

Piece.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export default Piece;
