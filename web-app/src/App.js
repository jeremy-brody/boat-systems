import './App.css';
import MqttTile from './MqttTile';

function App() {
  return (
    <div className="App">
        <MqttTile mqttTopic={'home/livingroom/temperature'} />
    </div>
  );
}

export default App;
