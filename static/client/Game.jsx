import PropTypes from 'prop-types';
import React from 'react';
import _get from 'lodash/get';
import { connect } from 'react-redux';
import Board from './Board';

function Game(props) {
  const {
    boardState,
    onPieceDrop,
    playerColor,
  } = props;

  return (
    <Board
      boardState={boardState}
      onPieceDrop={onPieceDrop}
      playerColor={playerColor}
    />
  );
}

Game.propTypes = {
  boardState: PropTypes.shape({}),
  onPieceDrop: PropTypes.func,
  playerColor: PropTypes.string,
};

const mapStateToProps = (state, props) => {
  const boardState = state.boardState || {};
  const onPieceDrop = (moveInfo) => {
    const roomId = state.roomId;
    const data = Object.assign({},
      moveInfo,
      { roomId },
    );
    props.socket.emit('move', data);
  };

  return {
    boardState,
    onPieceDrop,
    playerColor: _get(state, 'player.color'),
  };
};

export default connect(mapStateToProps, null)(Game);
