import { io } from "socket.io-client";

const socket = io("https://roomy-backend-1hsr.onrender.com", {
  autoConnect: true,
});

export default socket;