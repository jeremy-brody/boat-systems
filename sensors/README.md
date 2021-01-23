# Sensors

## ESP8266 NodeMCU Setup
- for: https://www.amazon.com/gp/product/B081CSJV2V
1. install arduino ide
1. arduino ide -> preferences -> additional board manager urls
        https://github.com/esp8266/Arduino/releases/download/2.3.0/package_esp8266com_index.json
1. arduino ide -> tools -> board: -> boards manager
    1. search for `esp8266`
    1. install esp8266 by esp8266 community, close
1. arduino ide -> tools -> board: -> `NodeMCU 1.0 (ESP-12E Module)`
1. arduino ide -> tools -> flash size -> `4M (3M SPIFFS)`
1. arduino ide -> tools -> CPU Frequency -> `80 Mhz`
1. arduino ide -> tools -> Upload Speed -> `921600`
1. arduino ide -> tools -> port -> `dev/cu.usbserial-0001`
1. arduino ide -> sketch -> include library -> manage libraries...
    1. search for and install any needed libraries
