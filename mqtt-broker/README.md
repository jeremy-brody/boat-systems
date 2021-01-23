# MQTT Broker

## Prereq.

- Docker

## Setup
1. copy conf file: `scp mosquitto.conf pi@IP_ADDRESS:/tmp` - update ip address
1. ssh in to machine running docker and: 

        docker run \
            --name mqtt \
            --detach \
            --publish 1883:1883 \
            --publish 9001:9001 \
            --volume /tmp/mosquitto.conf:/mosquitto/config/mosquitto.conf \
            --restart always \
            eclipse-mosquitto


<!-- docker run \
    --name mqtt \
    --detach \
    --publish 1883:1883 \
    --publish 9001:9001 \
    --volume mqtt_data:/mosquitto/data \
    --volume mqtt_log:/mosquitto/log \
    --volume /tmp/mosquitto.conf:/mosquitto/config/mosquitto.conf \
    --restart always \
    eclipse-mosquitto -->

        
## CLI Testing

### Setup

    npm install mqtt -g

### Subscribe

    mqtt sub -t 'TOPIC' -h 'IP_ADDRESS' -v

### Publish

    mqtt pub -t 'TOPIC' -h 'IP_ADDRESS' -p PORT -m 'test message'
note: default port is: `1883`