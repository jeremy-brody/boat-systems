# Raspberry Pi

## Reference

- https://www.raspberrypi.org/documentation/configuration/wireless/headless.md
- https://www.raspberrypi.org/documentation/remote-access/ssh/README.md

## Setup

## Headless

1. Image micro sd card with Rasperian Lite. Raspberry Pi Imager application is by far the easiest way: https://www.raspberrypi.org/software/
    - If using Imager: Choose OS -> Rasperry Pi OS (Other) -> Rasperry Pi OS Lite
1. Imager ejects the card. either remount of pull out and plug back in
1. `cp wpa_supplicant.conf /Volumes/boot/` (mac location)
1. update `SSID` and `PASSWORD` in wpa_supplicant.conf    
1. `touch /Volumes/boot/ssh` (mac location) - enables ssh access
1. eject, put card into pi, and power up
1. ssh in `ssh pi@IP_ADDRESS_OF_PI` obviously update the ip address that was assigned to the pi. the defauly password is `raspberry`. change it.

## Docker (optional)

1. `curl -fsSL https://get.docker.com -o get-docker.sh`
1. `sudo sh get-docker.sh`
1. `sudo usermod -aG docker pi` (swap in the username) - allows `pi` user to run docker commands
1. `sudo reboot` - confirms permission change and docker start on boot
1. `docker info` - confirm docker is running

## Kiosk (optional)

- reference https://desertbot.io/blog/raspberry-pi-touchscreen-kiosk-setup)    
1. `sudo apt-get install xserver-xorg x11-xserver-utils xinit openbox`
1. `sudo apt-get install chromium-browser`
1. ... fill out remaining steps here in case site goes away