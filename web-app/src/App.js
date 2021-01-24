import './App.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import MqttTile from './MqttTile';
import TideTile from './TideTile';

function App() {
  return (
    <div className="App">
      <Swiper> 
        <SwiperSlide><MqttTile mqttTopic={'home/livingroom/temperature'} /></SwiperSlide>
        <SwiperSlide><MqttTile mqttTopic={'home/livingroom/humidity'} /></SwiperSlide>
        <SwiperSlide><MqttTile mqttTopic={'boat/battery/house'} /></SwiperSlide>
        <SwiperSlide><TideTile /></SwiperSlide>
      </Swiper>
    </div>
  );
}

export default App;
