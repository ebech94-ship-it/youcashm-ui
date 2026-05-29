
/*(import socketIOClient from "socket.io-client";

const socket = socketIOClient(
  "https://youcashm-backend.onrender.com",
  {
    transports: ["polling", "websocket"],
  forceNew: true,
  reconnection: true,
  reconnectionDelay: 1000,}
);

export default socket;)*/
import socketIOClient from "socket.io-client";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const socket = socketIOClient(BACKEND_URL, {
  transports: ["polling", "websocket"],
  forceNew: true,
  reconnection: true,
  reconnectionDelay: 1000,
});

export default socket;