import Tile from './Tile';
import React, { useState, useEffect } from 'react';
import mqtt from 'mqtt';

function MqttTile({ mqttAddress, mqttTopic }) {
    const placeholder = '--';
    const [topic, setTopic] = useState(mqttTopic);
    const [name, setName] = useState(placeholder);
    const [meta, setMeta] = useState(placeholder);
    const [textValue, setTextValue] = useState('');
    const [bigValue, setBigValue] = useState(placeholder);
    const [littleValue, setLittleValue] = useState('');
    const [description, setDescription] = useState(placeholder);
    const [secondValue, setSecondValue] = useState('');

    useEffect(() => {
        const client = mqtt.connect(mqttAddress);
        client.subscribe(topic);
        client.on('message', (topic, payload, packet) => {
            console.log(payload.toString())
            let message;
            try {
                message = JSON.parse(payload.toString('utf-8'))
            } catch (e) {
                // occasionally, a sensor sends an incomplete json string
                return;
            }
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
            if (message.hasOwnProperty('rawValue') && !isNaN(message.rawValue)) {
                setSecondValue(Math.round(message.rawValue * 10) / 10);
            } 
        });
    }, []);

    const Value = () => 
        <div>
            <span className="tile-value-text">{textValue}</span>
            <span className="tile-value-big">{bigValue}</span>
            <span className="tile-value-small">{littleValue}</span>
        </div>
    
    return (
        <Tile name={name} 
            meta={meta} 
            value={<Value />} 
            description={description}
            secondValue={secondValue} />
    )

}

export default MqttTile;
