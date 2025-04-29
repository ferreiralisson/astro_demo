const socket = io('http://192.168.1.33:3001');

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input.value.trim()) {
    // Envia a mensagem
    socket.emit('chat message', input.value);
    input.value = '';
  }
});

// Envia o status de digitação
input.addEventListener('input', () => {
  socket.emit('typing', input.value.trim().length > 0);
});

// Escuta as mensagens do servidor
socket.on('chat message', (msg) => {
  const item = document.createElement('li');
  item.textContent = msg;
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
});