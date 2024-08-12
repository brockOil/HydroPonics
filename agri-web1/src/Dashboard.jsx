import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './styles.css';
// Import the useEffect hook
import { useEffect } from 'react';
import { useState } from 'react';
const Dashboard = () => {
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [phValue, setPhValue] = useState('-');
  const [ecValue, setEcValue] = useState('-');
  const [sensorData, setSensorData] = useState({ labels: [], datasets: [] });

  const fetchData = async () => {
    try {
      const response = await fetch('http://192.168.9.122'); 
      const data = await response.json();
      setPhValue(data.ph);
      setEcValue(data.ec);
      setSensorData(prevState => ({
        labels: [...prevState.labels, new Date().toLocaleTimeString()],
        datasets: [
          {
            ...prevState.datasets[0],
            data: [...prevState.datasets[0].data, data.ph]
          },
          {
            ...prevState.datasets[1],
            data: [...prevState.datasets[1].data, data.ec]
          }
        ]
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(fetchData, 2000); 
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="container">
      <header>
        <h1>ESP32 Sensor Dashboard</h1>
        <button id="connectBtn" onClick={() => setConnectionStatus('Connected')}>
          Connect
        </button>
        <div id="connectionStatus">{connectionStatus}</div>
      </header>
      <section id="sensorReadings">
        <h2>Sensor Readings</h2>
        <div className="sensor-value" id="phValue">pH Value: {phValue}</div>
        <div className="sensor-value" id="ecValue">EC Value: {ecValue}</div>
      </section>
      <section id="sensorGraph">
        <h2>Live Graph</h2>
        <Line data={sensorData} />
      </section>
    </div>
  );
};

export default Dashboard;

