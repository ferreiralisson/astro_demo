import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

export function UserCounter() {
  const [usersOnline, setUsersOnline] = useState(0);

  useEffect(() => {
    const socket = io('http://192.168.1.33:3001'); // Conexão WebSocket

    // Atualiza o número de usuários online
    socket.on('users online', (count) => {
      console.log(`🟢 Atualizando usuários online: ${count}`);
      setUsersOnline(count);
    });

    // Cleanup ao desmontar o componente
    return () => {
      console.log('🔴 Desconectando do servidor WebSocket');
      socket.disconnect();
    };
  }, []);

  return (
    <div className="user-count">
      👥 {usersOnline} usuários online
    </div>
  );
}