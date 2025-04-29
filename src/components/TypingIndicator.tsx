import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

export function TypingIndicator() {
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const socket = io('http://192.168.1.33:3001'); // Conexão WebSocket

    // Atualiza o status de digitação
    socket.on('typing', (status: boolean) => {
      setIsTyping(status);
    });

    // Cleanup ao desmontar o componente
    return () => {
      socket.disconnect();
    };
  }, []);

  if (!isTyping) return null;

  return (
    <div className="typing-indicator">
      ✍️ Alguém está digitando...
    </div>
  );
}