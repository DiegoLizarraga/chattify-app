import React, { useState } from "react";
import { socket } from "./socket";
import "./ManagerConnection.css";

const ManagerConnection = () => {
  const [isConnected, setIsConnected] = useState(false);

  // Función que se ejecuta cuando se conecta
  const onConnect = () => {
    console.log("✅ Conectado al servidor");
    setIsConnected(true);
  };

  // Función que se ejecuta cuando se desconecta
  const onDisconnect = () => {
    console.log("❌ Desconectado del servidor");
    setIsConnected(false);
  };

  // Manejador de conexión/desconexión
  const handleConnection = (action) => {
    switch (action) {
      case "on":
        socket.on("connect", onConnect);
        socket.connect();
        break;
      case "off":
        socket.on("disconnect", onDisconnect);
        socket.disconnect();
        break;
      default:
        break;
    }
  };

  return (
    <div className="manager-connection">
      <div className="connection-card">
        <div className="connection-header">
          <h2>Conexión del Servidor</h2>
          <div className={`status-badge ${isConnected ? "online" : "offline"}`}>
            <span className="status-dot"></span>
            {isConnected ? "Conectado" : "Desconectado"}
          </div>
        </div>

        <div className="connection-buttons">
          <button
            className="btn btn-connect"
            onClick={() => handleConnection("on")}
            disabled={isConnected}
          >
            🔗 Conectar
          </button>
          <button
            className="btn btn-disconnect"
            onClick={() => handleConnection("off")}
            disabled={!isConnected}
          >
            🔌 Desconectar
          </button>
        </div>

        <div className="connection-info">
          <p>
            <strong>Estado:</strong>{" "}
            <span className={isConnected ? "text-success" : "text-error"}>
              {isConnected ? "✅ En línea" : "❌ Sin conexión"}
            </span>
          </p>
          <p>
            <strong>Socket ID:</strong> {socket.id || "No asignado"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ManagerConnection;
