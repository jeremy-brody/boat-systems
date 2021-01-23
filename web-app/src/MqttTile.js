import React, { useState, useEffect } from 'react';
import mqtt from 'mqtt';

function MqttTile({ mqttTopic }) {
    const placeholder = '--';
    const [topic, setTopic] = useState(mqttTopic);
    const [name, setName] = useState(placeholder);
    const [meta, setMeta] = useState(placeholder);
    const [bigValue, setBigValue] = useState(placeholder);
    const [littleValue, setLittleValue] = useState('');

    useEffect(() => {
        const client = mqtt.connect("mqtt://192.168.7.100:9001");
        client.subscribe(topic);
        client.on('message', (topic, payload, packet) => {
            console.log(payload.toString())
            let message = JSON.parse(payload.toString('utf-8'))
            let name = message.sensor.charAt(0).toUpperCase() + message.sensor.substr(1).toLowerCase();
            if (name.length > 8) name = name.substr(0,4);
            setName(name);
            setMeta(message.unit);
            setBigValue(Math.trunc(message.value));
            setLittleValue('.' + (message.value % 1).toFixed(1).split('.')[1]);
        });
    }, []);
    
    return (
        <div className="tile">
            <div className="tile-name">{name}</div>
            <div className="tile-meta">{meta}</div>
            <div className="tile-value">
                <span className="tile-value-big">{bigValue}</span>
                <span className="tile-value-small">{littleValue}</span>
            </div>
        </div>
    )

}

export default MqttTile;
