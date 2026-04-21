import React from 'react';
import './Channels.css';

const Channels = ({ channels, onSelectChannel, selectedChannel }) => {
  return (
    <aside className="channels-container">
      <div className="channels-header">
        <h2>Chatify</h2>
      </div>
      
      <nav className="channels-list">
        <div className="channels-section">
          <h3>Channels</h3>
          <ul>
            {channels.map((channel) => (
              <li key={channel.id}>
                <button
                  className={`channel-btn ${selectedChannel?.id === channel.id ? 'active' : ''}`}
                  onClick={() => onSelectChannel(channel)}
                >
                  {channel.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </aside>
  );
};

export default Channels;