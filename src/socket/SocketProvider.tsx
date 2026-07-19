import React, { createContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { socket } from "./socket";
import { useAuth } from "../context/AuthContext";

interface SocketContextType {
  socket: Socket;
  isConnected: boolean;
}

export const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    if (user && user.id) {
      if (!socket.connected) {
        socket.connect();
      }

      const onConnect = () => {
        setIsConnected(true);
        console.log("⚡ Socket connected:", socket.id);
        socket.emit("join-user", user.id);
      };

      const onDisconnect = () => {
        setIsConnected(false);
        console.log("🔌 Socket disconnected");
      };

      socket.on("connect", onConnect);
      socket.on("disconnect", onDisconnect);

      if (socket.connected) {
        socket.emit("join-user", user.id);
      }

      return () => {
        socket.off("connect", onConnect);
        socket.off("disconnect", onDisconnect);
      };
    } else {
      if (socket.connected) {
        socket.disconnect();
      }
      setIsConnected(false);
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
