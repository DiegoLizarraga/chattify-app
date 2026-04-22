import { useEffect, useState } from 'react'
import './App.css'
import { socket } from './socket'
import Channels from './components/Channels'
import Chat from './components/Chat'
import Users from './components/Users'

function App() {
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [channels, setChannels] = useState([]);
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [usernameSet, setUsernameSet] = useState(false);

  useEffect(() => {
    const onConnect = () => {
      console.log("✅ Conectado al servidor");
      setIsConnected(true);
    };

    const onDisconnect = () => {
      console.log("❌ Desconectado del servidor");
      setIsConnected(false);
    };

    const onChannelsList = (channelsList) => {
      setChannels(channelsList);
      if (channelsList.length > 0 && !selectedChannel) {
        setSelectedChannel(channelsList[0]);
      }
    };

    const onUsersList = (usersList) => {
      setUsers(usersList);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('channels-list', onChannelsList);
    socket.on('users-list', onUsersList);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('channels-list', onChannelsList);
      socket.off('users-list', onUsersList);
    };
  }, [selectedChannel]);

  const handleSetUsername = (name) => {
    setUsername(name);
    setUsernameSet(true);
    if (selectedChannel) {
      socket.emit('join-channel', selectedChannel.id, name);
    }
  };

  const handleSelectChannel = (channel) => {
    setSelectedChannel(channel);
    if (usernameSet) {
      socket.emit('join-channel', channel.id, username);
    }
  };

  return (
    <div className="app-container">
      <Channels 
        channels={channels}
        onSelectChannel={handleSelectChannel} 
        selectedChannel={selectedChannel} 
      />
      <Chat 
        selectedChannel={selectedChannel}
        username={username}
        onSetUsername={handleSetUsername}
        usernameSet={usernameSet}
      />
      <Users users={users} />
      
      {/* Estado de conexión */}
      <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
        {isConnected ? '🟢 Conectado' : '🔴 Desconectado'}
      </div>
    </div>
  );
}

export default App;