import React, { useState, useRef, useEffect } from 'react';
import { socket } from '../socket';
import './Chat.css';

const Chat = ({ selectedChannel, username, onSetUsername, usernameSet }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [tempUsername, setTempUsername] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages([]);

    if (!selectedChannel) return;

    const handleLoadMessages = (loadedMessages) => {
       console.log('Mensajes cargados:', loadedMessages);
      setMessages(loadedMessages);
    };

    const handleReceiveMessage = (message) => {
      console.log('Mensaje recibido:', message);
      setMessages(prev => [...prev, message]);

    };

    const handleUserJoined = (data) => {
      console.log(`${data.username} se unió al canal`);
    };

    socket.on('load-messages', handleLoadMessages);
    socket.on('receive-message', handleReceiveMessage);
    socket.on('user-joined', handleUserJoined);

    return () => {
      socket.off('load-messages', handleLoadMessages);
      socket.off('receive-message', handleReceiveMessage);
      socket.off('user-joined', handleUserJoined);
    };
  }, [selectedChannel]);

  const handleSetUsername = (e) => {
    e.preventDefault();
    if (tempUsername.trim() && selectedChannel) {
      onSetUsername(tempUsername);
      setTempUsername('');
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && selectedChannel && usernameSet) {
      socket.emit('chat-message', {
        message: inputMessage,
        channelId: selectedChannel.id,
      });
      setInputMessage('');
    }
  };

  if (!selectedChannel) {
    return (
      <div className="chat-container">
        <div className="chat-header">
          <h2>Selecciona un canal</h2>
        </div>
        <div className="messages-area" style={{justifyContent: 'center', alignItems: 'center'}}>
          <p>Elige un canal para comenzar a chatear</p>
        </div>
      </div>
    );
  }

  if (!usernameSet) {
    return (
      <div className="chat-container">
        <div className="chat-header">
          <h2>{selectedChannel.name}</h2>
          <p>Ingresa tu nombre de usuario</p>
        </div>
        <div className="messages-area" style={{justifyContent: 'center', alignItems: 'center'}}>
          <form onSubmit={handleSetUsername} style={{width: '100%', maxWidth: '400px'}}>
            <input
              type="text"
              placeholder="Tu nombre de usuario..."
              value={tempUsername}
              onChange={(e) => setTempUsername(e.target.value)}
              className="message-input"
              autoFocus
            />
            <button type="submit" className="send-btn">Entrar al canal</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>{selectedChannel.name}</h2>
        <p>Conectado como: <strong>{username}</strong></p>
      </div>

      <div className="messages-area">
        {messages.length === 0 ? (
          <div style={{textAlign: 'center', color: 'var(--text)', opacity: 0.7}}>
            <p>No hay mensajes aún. ¡Sé el primero en escribir!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="message">
              <div className="message-user">
                <span className="user-name">{msg.user}</span>
                <span className="message-time">{msg.timestamp}</span>
              </div>
              <p className="message-content">{msg.message}</p>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="message-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder={`Escribe algo en ${selectedChannel.name}...`}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="message-input"
        />
        <button type="submit" className="send-btn">Enviar</button>
      </form>
    </div>
  );
};

export default Chat;