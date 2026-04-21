import React, { useState } from "react";
import { socket } from "./socket";
import "./MyForm.css";

const MyForm = () => {
  const [message, setMessage] = useState("");

  const handleOnChange = (e) => {
    setMessage(e.target.value);
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("chat message", message);
      setMessage("");
    }
  };

  return (
    <div className="form-container">
      <form className="message-form">
        <input
          type="text"
          name="message"
          value={message}
          onChange={handleOnChange}
          placeholder="Escribe tu mensaje..."
          className="message-input"
        />
        <button onClick={handleClick} className="send-button">
          Enviar
        </button>
      </form>
    </div>
  );
};

export default MyForm;
