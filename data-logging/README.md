# Data Logging

## Prereq.

- Docker

## Setup

### InfluxDB
time series database

        docker volume create influxdb
        docker run \
            --name influxdb \
            --detach \
            --publish 8086:8086 \
            --volume influxdb:/var/lib/influxdb \
            --env INFLUXDB_DB=sensors \
            --env INFLUXDB_ADMIN_USER=telegraf \
            --env INFLUXDB_ADMIN_PASSWORD=telegraf \
            --restart always \
            influxdb

### Telegraf
connector between mqtt server and influxdb

        <!-- doesn't work on master... just grabbed the conf from github -->
        <!-- docker run --rm telegraf telegraf config > telegraf.conf -->

        scp telegraf.conf pi@192.168.7.75:/tmp 

        docker run \
            --name telegraf \
            --detach \
            --volume /Users/jeremybrody/code/boat/mqtt/telegraf.conf:/etc/telegraf/telegraf.conf:ro \
            --restart always \
            telegraf


