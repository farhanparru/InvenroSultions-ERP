// Backend API URL
const API_URL = 'http://localhost:8000/api/tyem/Whatsappget';
// WebSocket URL
const WEBSOCKET_URL = 'wss://tyem.invenro.site';

export const fetchOrders = async () => {
  try {
    const response = await fetch(API_URL);
    console.log(response);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error( error);
    throw error;
  }
};


export const connectWebSocket = (onMessage) => {
  const socket = new WebSocket(WEBSOCKET_URL);
  socket.onopen = () => {
    console.log('WebSocket connection established');
  };

  socket.onmessage = (event) => {
    const newOrder = JSON.parse(event.data);
    console.log('New order received via WebSocket:', newOrder);
    onMessage(newOrder);
  };

  socket.onclose = () => {
    console.log('WebSocket connection closed');
  };

  return socket;
};
