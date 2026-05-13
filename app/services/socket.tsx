import { io } from "socket.io-client";

const socket = io("https://youcashm-backend.onrender.com", {
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: 10,
});

export default socket;