import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';

interface IMessageHistoryObject {
  from: string;
  to: string;
  message: string;
  date: Date;
}

const app = express();
const server = createServer(app);
const socketServer = new Server(server, {cors: {origin: 'http://localhost:3000', methods: ['GET', 'POST'],}});
let users: {name: string; socketId: string}[] = [];

socketServer.on('connection', (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);
    
    // send back the user socket id to the user
    socketServer.to(socket.id).emit('socketId', {name: socket.handshake.query.name, socketId: socket.id});

    // send all socket users to inform others
    users.push({name: socket.handshake.query.name as string, socketId: socket.id})
    socketServer.emit('sockets', users);

    socket.on('privateMessage', (data: IMessageHistoryObject) => {
      socketServer.to([data.from, data.to]).emit('privateMessage', data);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
      users = users.filter((user) => user.socketId !== socket.id);
      socketServer.emit('sockets', users);
    });
});

server.listen(8000, () => console.log('Server is awake on port 8000'));