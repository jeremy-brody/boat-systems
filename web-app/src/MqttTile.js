import React, { useState, useEffect } from 'react';
import mqtt from 'mqtt';

function MqttTile({ mqttTopic }) {
    const placeholder = '--';
    const [topic, setTopic] = useState(mqttTopic);
    const [name, setName] = useState(placeholder);
    const [meta, setMeta] = useState(placeholder);
    const [textValue, setTextValue] = useState('');
    const [bigValue, setBigValue] = useState(placeholder);
    const [littleValue, setLittleValue] = useState('');
    const [description, setDescription] = useState(placeholder);

    useEffect(() => {
        const client = mqtt.connect("mqtt://192.168.7.100:9001");
        client.subscribe(topic);
        client.on('message', (topic, payload, packet) => {
            console.log(payload.toString())
            let message = JSON.parse(payload.toString('utf-8'))
            let name = message.sensor;
            if (name.length > 8) name = name.substr(0,4);
            setName(name);
            setMeta(message.unit);
            // TODO: clean this garbage up
            if (isNaN(message.value)) {
                if (message.length < 4) {
                    setTextValue(''); 
                    setBigValue(message.value);
                    setLittleValue('');
                } else {
                    setTextValue(message.value); 
                    setBigValue('');
                    setLittleValue('');
                }
                
            } else {
                setBigValue(Math.trunc(message.value));
                setLittleValue('.' + (message.value % 1).toFixed(1).split('.')[1]);
            }
            setDescription(message.description);
        });
    }, []);
    
    return (
        <div className="tile">
            <div className="tile-name">{name}</div>
            <div className="tile-meta">{meta}</div>
            <div className="tile-value">
                <span className="tile-value-text">{textValue}</span>
                <span className="tile-value-big">{bigValue}</span>
                <span className="tile-value-small">{littleValue}</span>
            </div>
            <div className="tile-description">{description}</div>
        </div>
    )

}

export default MqttTile;
