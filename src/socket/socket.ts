import { io, Socket } from "socket.io-client";

const apiBase = (import.meta.env.VITE_API_BASE_URL as string) || "";
const SOCKET_URL =
  (import.meta.env.VITE_SOCKET_URL as string) ||
  apiBase.replace(/\/api\/?$/, "") ||
  "http://localhost:5000";

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
  transports: ["websocket", "polling"],
});
