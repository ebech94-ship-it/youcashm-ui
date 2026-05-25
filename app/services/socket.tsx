import  io  from "socket.io-client";

const socket = io("https://youcashm-backend.onrender.com", {
  transports: ["polling", "websocket"],
  forceNew: true,
  reconnection: true,
  reconnectionDelay: 1000,
});

export default socket;