import React, { useState, useRef, useEffect } from 'react';
import { socket } from '../socket';
import './Chat.css';

const formatTime = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return timestamp;
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const Chat = ({ username, onSetUsername, usernameSet }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [tempUsername, setTempUsername] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const handleLoadMessages = (loadedMessages) => {
      console.log('load-messages:', loadedMessages);
      setMessages(loadedMessages);
    };

    const handleReceiveMessage = (message) => {
      console.log('receive-message:', message);
      setMessages(prev => [...prev, message]);
    };

    socket.on('load-messages', handleLoadMessages);
    socket.on('receive-message', handleReceiveMessage);

    return () => {
      socket.off('load-messages', handleLoadMessages);
      socket.off('receive-message', handleReceiveMessage);
    };
  }, []);

  const handleSetUsername = (e) => {
    e.preventDefault();
    if (tempUsername.trim()) {
      onSetUsername(tempUsername.trim());
      setTempUsername('');
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && usernameSet) {
      socket.emit('chat-message', {
        message: inputMessage.trim(),
        channelId: 'general',
        username: username,
      });
      setInputMessage('');
    }
  };

  if (!usernameSet) {
    return (
      <div className="chat-container">
        <div className="chat-header">
          <h2>#general</h2>
          <p>Ingresa tu nombre de usuario para chatear</p>
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
            <button type="submit" className="send-btn">Entrar</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>#general</h2>
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
                <span className="user-name">{msg.user || msg.username}</span>
                <span className="message-time">{formatTime(msg.timestamp)}</span>
              </div>
              <p className="message-content">{msg.message || msg.text || msg.content}</p>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="message-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Escribe un mensaje..."
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