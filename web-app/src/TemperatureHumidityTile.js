import TwoValueTile from './TwoValueTile';
import React, { useState, useEffect } from 'react';
import mqtt from 'mqtt';

function TemperatureHumidityTile({ mqttBrokerAddress, description, temperatureTopic, humidityTopic }) {
    const placeholder = '--';
    const [temperature, setTemperature] = useState(placeholder);
    const [humidity, setHumidity] = useState(placeholder);

    useEffect(() => {
        const client = mqtt.connect(mqttBrokerAddress);
        client.subscribe(temperatureTopic);
        client.subscribe(humidityTopic);
        client.on('message', (topic, payload, packet) => {
            console.log(topic, payload.toString())
            
            let message;
            try {
                message = JSON.parse(payload.toString('utf-8'))
            } catch (e) {
                // occasionally, a sensor sends an incomplete json string. maybe track it down sometime
                return;
            }
            const roundedValue = Math.round(message.value);
            if (topic == temperatureTopic) {
                setTemperature(roundedValue)
            } else if (topic == humidityTopic) {
                setHumidity(roundedValue)
            }
        });
    }, []);
    
    return ( 
        <TwoValueTile 
                description={description} 
                value1={temperature}
                value1Unit={'F'}  
                value2={humidity} 
                value2Unit={'%'}  /> 
    )

}

export default TemperatureHumidityTile;
