#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <ArduinoJson.h>
#include <WiFiUdp.h>
#include <NTPClient.h>
#include <ArduinoOTA.h>

const int interval = 10000; // ms
const char* ssid = "Chewbacca";
const char* password = "pv2ohf2j1[pjgrf";
const char* mqtt_server = "192.168.7.79";
const String sensor_type_humidity = "Humidity";
const String sensor_type_temperature = "Temperature";
const String temperature_unit = "F";
const String humidity_unit = "%";

const String clientId = "ESP8266-001";
const String description = "Living Room";
const char* mqtt_topic_temperature = "home/livingroom/temperature";
const char* mqtt_topic_humidity = "home/livingroom/humidity";

//const String clientId = "ESP8266-002";
//const String description = "Basement";
//const char* mqtt_topic_temperature = "home/basement/temperature";
//const char* mqtt_topic_humidity = "home/basement/humidity";

WiFiClient espClient;
PubSubClient client(espClient);
unsigned long lastMsg = 0;
#define DHTPIN D5
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org");

void begin_dht() {
  dht.begin();
  Serial.println("[ OK ] DHT");
}

void begin_ntp() {
  timeClient.begin();
  Serial.println("[ OK ] NTP");
}

void connect_wifi() {
  delay(10);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
  randomSeed(micros());
  Serial.print("[ OK ] WiFi, IP: ");
  Serial.println(WiFi.localIP());
}

void connect_mqtt() {
  client.setServer(mqtt_server, 1883);
  while (!client.connected()) {
    if (!client.connect(clientId.c_str())) {
      delay(5000);
    }
  }
  Serial.println("[ OK ] MQTT");
}

char* buildMessage(String sensor, long epochTime, String unit, float value) {
      StaticJsonDocument<256> doc;
      doc["sensor"] = sensor;
      doc["time"] = epochTime;
      doc["unit"] = unit;
      doc["value"] = value;
      doc["description"] = description;
      char output[256];
      serializeJson(doc, output);
      Serial.println(output);
      return output;
}

void publish() {
      timeClient.update();
      long epochTime = timeClient.getEpochTime();
      float humidity = dht.readHumidity();
      float temperature = dht.readTemperature(true); // true == farenheit
      client.publish(mqtt_topic_temperature, buildMessage(sensor_type_temperature, epochTime, temperature_unit, temperature));
      client.publish(mqtt_topic_humidity, buildMessage(sensor_type_humidity, epochTime, humidity_unit, humidity));
}

void setup() {
  Serial.begin(115200);
  Serial.println("\r\n\r\nBooting");
  begin_dht();
  begin_ntp();
  connect_wifi();
  connect_mqtt();
  Serial.println("Boot Complete\r\n");
}

void loop() {
  if (!client.connected()) {
    connect_mqtt();
  }
  client.loop();

  unsigned long now = millis();
  if (now - lastMsg > interval) {
    lastMsg = now;
    publish();
  }
}
