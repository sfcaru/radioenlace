const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static('public'));

// Array para almacenar los clientes conectados
let clients = [];

wss.on('connection', (ws) => {
  // Agregar el nuevo cliente al array
  clients.push(ws);
  console.log('Nuevo cliente conectado');

  // Configurar evento para manejar mensajes entrantes
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    console.log("Mensaje recibido en servidor:", data);

    switch (data.type) {
      case 'offer':
      case 'answer':
      case 'candidate':
        // Reenvía el mensaje a todos los clientes conectados excepto el remitente
        clients.forEach(client => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
            console.log(`Mensaje ${data.type} reenviado a otros clientes`);
          }
        });
        break;
    }
  });

  // Cuando un cliente se desconecta, lo eliminamos del array
  ws.on('close', () => {
    clients = clients.filter(client => client !== ws);
    console.log('Cliente desconectado');
  });
});

server.listen(3000, () => {
  console.log('Servidor escuchando en http://localhost:3000');
});