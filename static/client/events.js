import io from 'socket.io-client';
import {
  setPlayerId,
  setRoom,
  setBoardState,
  receiveMove,
} from './redux/gameStart.js';

export const eventEnums = {
  PLAYER_IDENTIFIED: 'playerIdentified',
  CONNECT: 'connect',
  NEW_MOVE: 'new_move',
  DISCONNECT: 'disconnect',
  LEAVE_ROOM: 'leave_room',
};

export default function connect(domain, port, store) {
  const socket = io.connect(`http://${domain}:${port}`);

  socket.on(eventEnums.CONNECT, () => {
    socket.emit('join_game');
  });

  socket.on(eventEnums.PLAYER_IDENTIFIED, (data) => {
    store.dispatch(setPlayerId(data.playerId));
    store.dispatch(setRoom(data.room));
    store.dispatch(setBoardState(data.boardState));
  });

  socket.on(eventEnums.NEW_MOVE, (data) => {
    store.dispatch(receiveMove(data.move));
  });

  return socket;
}
