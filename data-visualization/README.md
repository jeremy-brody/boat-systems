# Data Visualization

## Prereq.

- Docker

## Setup

### Grafana

        docker run \
            --name grafana \
            --detach \
            --publish 3000:3000 \
            --restart always \
            grafana/grafana

