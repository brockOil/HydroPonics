const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 }); // WebSocket server will listen on port 8080

wss.on('connection', function connection(ws) {
  console.log('Client connected');

  // Example: Send mock data every 5 seconds
  const sendMockData = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) { // Check if the connection is still open
      const ph = getRandomFloat(4, 10); // Replace with actual data from your sensors
      const ec = getRandomFloat(200, 2000); // Replace with actual data from your sensors
      const data = { ph, ec };
      ws.send(JSON.stringify(data));
    } else {
      clearInterval(sendMockData); // Stop the interval if the connection is closed
    }
  }, 5000); // Send data every 5 seconds

  ws.on('close', function close() {
    console.log('Client disconnected');
    clearInterval(sendMockData); // Stop sending data when client disconnects
  });
});

function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}