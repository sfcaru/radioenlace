const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado:', socket.id);

  socket.on('signal', (data) => {
    console.log("Mensaje de señalización recibido:", data);
    socket.broadcast.emit('signal', data); // Retransmitir a todos menos el remitente
  });

  // Maneja el mensaje de reconexión del receptor
  socket.on('reconnect-request', () => {
    console.log("Solicitud de reconexión recibida del receptor");
    socket.broadcast.emit('reconnect'); // Enviar señal de reconexión a los emisores
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

server.listen(3000, () => {
  console.log('Servidor escuchando en http://localhost:3000');
});