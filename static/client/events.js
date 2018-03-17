import io from 'socket.io-client';
import {
  setPlayer,
  setRoom,
  setBoardState,
  receiveMove,
} from './redux/gameStart.js';

export const eventEnums = {
  PLAYER_IDENTIFIED: 'playerIdentified',
  CONNECT: 'connect',
  NEW_MOVE: 'new_move',
  MOVE_MADE: 'move_made',
  DISCONNECT: 'disconnect',
  LEAVE_ROOM: 'leave_room',
  JOIN_GAME: 'join_game',
};

export default function connect(domain, port, store) {
  const socket = io.connect(`http://${domain}:${port}`);

  socket.on(eventEnums.CONNECT, () => {
    socket.emit(eventEnums.JOIN_GAME);
  });

  socket.on(eventEnums.PLAYER_IDENTIFIED, (data) => {
    store.dispatch(setPlayer(data.player));
    store.dispatch(setRoom(data.room));
    store.dispatch(setBoardState(data.boardState));
  });

  socket.on(eventEnums.NEW_MOVE, (data) => { // TODO: Delete
    store.dispatch(receiveMove(data.move));
  });

  socket.on(eventEnums.MOVE_MADE, (data) => {
    store.dispatch(setBoardState(data));
  });

  return socket;
}
