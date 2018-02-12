export const actionEnums = {
  MOVE_MADE: 'moveMade',
  SET_PLAYER: 'setPlayer',
  SET_ROOM: 'setRoom',
  SET_BOARD_STATE: 'setBoardState',
};

export default function reducer(state = {}, action) {
  switch (action.type) {
    case actionEnums.SET_PLAYER:
      return Object.assign({}, state, { playerId: action.payload.playerId });
    case actionEnums.SET_ROOM:
      return Object.assign({}, state, { roomId: action.payload.roomId });
    case actionEnums.SET_BOARD_STATE:
      return Object.assign({}, state, { boardState: action.payload.boardState });
    default:
      return state;
  }
}

// Action creators
export function setPlayerId(playerId) {
  return {
    type: actionEnums.SET_PLAYER,
    payload: { playerId },
  };
}

export function setRoom(roomId) {
  return {
    type: actionEnums.SET_ROOM,
    payload: { roomId },
  };
}

export function receiveMove(move) {
  return {
    type: actionEnums.MOVE_MADE,
    payload: { move },
  };
}

export function setBoardState(boardState) {
  return {
    type: actionEnums.SET_BOARD_STATE,
    payload: { boardState },
  };
}
