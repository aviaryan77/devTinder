
const socket = require('socket.io');

const initializeServer = (server) => {
  const io =  socket(server, {
    cors: {
      origin: 'http://localhost:5173',
    },
  });

  io.on('connection', (socket) => {
    console.log('a user connected',socket.id);
    
    socket.on('joinChat', ({userId,targetUserId}) => {
      const room = [userId,targetUserId].sort().join('-');
      socket.join(room);
      console.log('joined chat', room);
    });

    socket.on('sendMessage', ({
      userId,
      targetUserId,
      text,
      firstName,
      lastName,
      timestamp,
    }) => {
      const room = [userId,targetUserId].sort().join('-');
      socket.to(room).emit('receiveMessage', {
        userId,
        targetUserId,
        text,
        firstName,
        lastName,
      });
    });
    

    socket.on('disconnect', () => {
      console.log('a user disconnected');
    });
  });

  return io;
};

module.exports = initializeServer;