import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://192.168.1.33:4321", // Permite apenas essa origem
    methods: ["GET", "POST"], // Permite os métodos HTTP necessários
    allowedHeaders: ["my-custom-header"], // Se necessário, adicione cabeçalhos específicos
    credentials: true // Permite o envio de credenciais, como cookies
  }
});

let usersOnline = 0; // Contador de usuários conectados

// Mantemos um array de sockets conectados para garantir que não há duplicações
const connectedSockets = new Set();

io.on('connection', (socket) => {
  // Verifica se o socket já está na lista de sockets conectados
  if (connectedSockets.has(socket.id)) {
    console.log(`🔴 Conexão duplicada detectada para socket ID: ${socket.id}`);
    return; // Se já estiver, não incrementa o contador
  }

  // Adiciona o socket à lista de conectados
  connectedSockets.add(socket.id);

  // Incrementa o contador de usuários online
  usersOnline++;
  console.log(`🟢 Novo usuário conectado. Usuários online: ${usersOnline} | Socket ID: ${socket.id}`);

  // Envia o número de usuários online para todos os clientes
  io.emit('users online', usersOnline);

  // Quando uma nova mensagem chegar
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  // Quando alguém está digitando
  socket.on('typing', (isTyping) => {
    socket.broadcast.emit('typing', isTyping);
  });

  // Quando alguém se desconectar
  socket.on('disconnect', () => {
    // Remove o socket da lista de conectados
    connectedSockets.delete(socket.id);
    
    usersOnline--; // Decrementa o contador de usuários online
    console.log(`🔴 Usuário desconectado. Usuários online: ${usersOnline} | Socket ID: ${socket.id}`);
    io.emit('users online', usersOnline);
  });
});

server.listen(3001, '0.0.0.0', () => {
  console.log('✅ Servidor WebSocket rodando em http://192.168.1.33:3001');
});

