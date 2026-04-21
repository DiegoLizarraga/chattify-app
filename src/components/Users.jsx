import React from 'react';
import './Users.css';

const Users = ({ users }) => {
  const onlineCount = users.filter(u => u.status === 'online').length;
  const idleCount = users.filter(u => u.status === 'idle').length;
  const offlineCount = users.filter(u => u.status === 'offline').length;

  return (
    <aside className="users-container">
      <div className="users-header">
        <h3>Miembros ({users.length})</h3>
      </div>

      <div className="users-stats">
        <div className="stat online">
          <span className="dot"></span>
          <span>{onlineCount} Online</span>
        </div>
        <div className="stat idle">
          <span className="dot"></span>
          <span>{idleCount} Idle</span>
        </div>
        <div className="stat offline">
          <span className="dot"></span>
          <span>{offlineCount} Offline</span>
        </div>
      </div>

      <ul className="users-list">
        {users.map((user) => (
          <li key={user.id} className={`user-item ${user.status}`}>
            <div className="user-avatar">
              <span className={`status-indicator ${user.status}`}></span>
              {user.username.charAt(0).toUpperCase()}
            </div>
            <span className="user-name">{user.username}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Users;