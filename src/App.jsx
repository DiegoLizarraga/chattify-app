import { useEffect, useState } from 'react'
import './App.css'
import { socket } from './socket'
import Chat from './components/Chat'
import Users from './components/Users'

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [usernameSet, setUsernameSet] = useState(false);

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
      socket.emit('join-channel', 'general', username);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    const onUsersList = (usersList) => {
      setUsers(usersList);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('users-list', onUsersList);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('users-list', onUsersList);
    };
  }, [username]);

  const handleSetUsername = (name) => {
    setUsername(name);
    setUsernameSet(true);
    socket.emit('join-channel', 'general', name);
  };

  return (
    <div className="app-container">
      <Chat
        username={username}
        onSetUsername={handleSetUsername}
        usernameSet={usernameSet}
      />
      <Users users={users} />

      <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
        {isConnected ? '🟢 Conectado' : '🔴 Desconectado'}
      </div>
    </div>
  );
}

export default App;