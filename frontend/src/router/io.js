import socketIo from 'socket.io-client';

const socket = socketIo('http://localhost:3000/client');
const io = {
  isInit: false,
  getSocket: () => {
    if (this.isInit) return socket;
    return null;
  },
  init: (token) => {
    socket.emit('req/connection/init', { token });
    this.isInit = true;
  },
};


export default io;