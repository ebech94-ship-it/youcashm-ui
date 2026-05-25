
import socketIOClient from "socket.io-client";

const socket = socketIOClient(
  "https://youcashm-backend.onrender.com",
  {
    transports: ["polling", "websocket"],
  forceNew: true,
  reconnection: true,
  reconnectionDelay: 1000,}
);

export default socket;