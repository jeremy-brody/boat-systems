import './App.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import MqttTile from './MqttTile';

function App() {
  return (
    <div className="App">
      <Swiper> 
        <SwiperSlide><MqttTile mqttTopic={'home/livingroom/temperature'} /></SwiperSlide>
        <SwiperSlide><MqttTile mqttTopic={'home/livingroom/humidity'} /></SwiperSlide>
      </Swiper>
    </div>
  );
}

export default App;
