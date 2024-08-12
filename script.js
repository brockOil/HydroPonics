const { JSDOM } = require('jsdom');
const { document } = (new JSDOM('')).window;
global.document = document;

// Now you can use `document` as if you were in a browser
// Place your script here or require a script file that uses `document`
document.addEventListener('DOMContentLoaded', function() {
    const connectBtn = document.getElementById('connectBtn');
    const connectionStatus = document.getElementById('connectionStatus');
    const phValueElem = document.getElementById('phValue');
    const ecValueElem = document.getElementById('ecValue');
    const sensorChartCtx = document.getElementById('sensorChart').getContext('2d');
    
    let sensorChart;
  
    connectBtn.addEventListener('click', function() {
      if (connectBtn.textContent === 'Connect') {
        connectBtn.textContent = 'Disconnect';
        connectToWebSocket();
      } else {
        connectBtn.textContent = 'Connect';
        disconnectWebSocket();
      }
    });
  
    function connectToWebSocket() {
      // Replace with your WebSocket server URL
      const ws = new WebSocket('ws://localhost:8080');
      
      ws.onopen = function() {
        console.log('WebSocket connected');
        connectionStatus.textContent = 'Connected';
      };
      
      ws.onmessage = function(event) {
        const data = JSON.parse(event.data);
        updateSensorValues(data.ph, data.ec);
        updateSensorChart(data.ph, data.ec);
      };
      
      ws.onclose = function() {
        console.log('WebSocket closed');
        connectionStatus.textContent = 'Disconnected';
        if (connectBtn.textContent === 'Disconnect') {
          connectBtn.textContent = 'Connect';
        }
      };
    }
  
    function disconnectWebSocket() {
      // Disconnect WebSocket
      // Implement this based on your WebSocket implementation
    }
  
    function updateSensorValues(ph, ec) {
      phValueElem.textContent = `pH Value: ${ph.toFixed(2)}`;
      ecValueElem.textContent = `EC Value: ${ec.toFixed(2)} µS/cm`;
    }
  
    function updateSensorChart(ph, ec) {
      if (!sensorChart) {
        sensorChart = new Chart(sensorChartCtx, {
          type: 'line',
          data: {
            labels: [],
            datasets: [
              {
                label: 'pH',
                data: [],
                borderColor: '#007bff',
                fill: false
              },
              {
                label: 'EC (µS/cm)',
                data: [],
                borderColor: '#28a745',
                fill: false
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              xAxes: [{
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: 'Time'
                }
              }],
              yAxes: [{
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: 'Value'
                }
              }]
            }
          }
        });
      }
  
      // Add data to the chart
      const timestamp = new Date().toLocaleTimeString();
      sensorChart.data.labels.push(timestamp);
      sensorChart.data.datasets[0].data.push(ph);
      sensorChart.data.datasets[1].data.push(ec);
  
      // Limit the number of data points shown (optional)
      const maxDataPoints = 10;
      if (sensorChart.data.labels.length > maxDataPoints) {
        sensorChart.data.labels.shift();
        sensorChart.data.datasets[0].data.shift();
        sensorChart.data.datasets[1].data.shift();
      }
  
      sensorChart.update();
    }
  });
  