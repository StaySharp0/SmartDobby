import socketIo from 'socket.io-client';

const socket = socketIo('http://13.209.66.217:3000/client');
const io = {
  isInit: false,
  getSocket: () => {
    if (this.isInit) return socket;
    return null;
  },
  init: (token) => {
    console.log('sockek.io init!');

    socket.emit('req/connection/init', { token });
    socket.off('reconnect');
    socket.on('reconnect', () => {
      socket.emit('req/connection/init', { token });
    });
    socket.off('toastSchedule');
    socket.on('toastSchedule', (schedule) => {
      window.M.toast({ displayLength: 3000, html: `Run Schedule(${schedule.name})` });
    });

    this.isInit = true;
  },
};


export default io;
