import io from 'socket.io-client';

export default function connect(domain, port) {
  const socket = io.connect(`http://${domain}:${port}`);

  socket.on('connect', () => {
    socket.emit('join', { data: 'Client is connected' });
  });

  return socket;
}
