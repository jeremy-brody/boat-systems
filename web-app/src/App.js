import './App.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import MqttTile from './MqttTile';
import TideTile from './TideTile';
import TideChartTile from './TideChartTile';
import ReloadTile from './ReloadTile';

const mqttAddress = "mqtt://192.168.7.79:9001";

function App() {
  return (
    <div className="App">
      <Swiper> 
        <SwiperSlide><MqttTile mqttAddress={mqttAddress} mqttTopic={'home/livingroom/temperature'} /></SwiperSlide>
        <SwiperSlide><MqttTile mqttAddress={mqttAddress} mqttTopic={'home/livingroom/humidity'} /></SwiperSlide>
        <SwiperSlide><MqttTile mqttAddress={mqttAddress} mqttTopic={'home/basement/temperature'} /></SwiperSlide>
        <SwiperSlide><MqttTile mqttAddress={mqttAddress} mqttTopic={'home/basement/humidity'} /></SwiperSlide>
        <SwiperSlide><MqttTile mqttAddress={mqttAddress} mqttTopic={'boat/battery/house'} /></SwiperSlide>
        <SwiperSlide><TideTile /></SwiperSlide>
        <SwiperSlide><TideChartTile /></SwiperSlide>
        <SwiperSlide><ReloadTile /></SwiperSlide>
      </Swiper>
    </div>
  );
}

export default App;
