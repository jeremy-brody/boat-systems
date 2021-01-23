# Square Display

## Hardware

- Rasperry Pi Zero WH
    - https://www.raspberrypi.org/products/raspberry-pi-zero-w/
    - wireless version with headers already soldered on
- Pimoroni HyperPixel 4.0 Square 
    - https://www.adafruit.com/product/4499
    - https://shop.pimoroni.com/products/hyperpixel-4-square?variant=30138251444307
    - 720x720 4" IPS display
    - build in header connection for pi for data and power
    - iPad-level retina display (~260ppi)

## Setup

1. setup pi Headless (docker not needed) ../rasperry-pi/README.md
1. setup kiosk mode, updating to web app static content server location ../rasperry-pi/README.md
1. attach display carefully, without putting point pressure on glass screen
1. install display drivers: `curl https://get.pimoroni.com/hyperpixel4 | bash` (follow prompts. pi zero is a "3 or older")
1. reboot and it should come up with the full page web app of the url you entered