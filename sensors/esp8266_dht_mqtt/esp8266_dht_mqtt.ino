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

void begin_ota() {
  // Port defaults to 8266
  // ArduinoOTA.setPort(8266);

  // Hostname defaults to esp8266-[ChipID]
  // ArduinoOTA.setHostname("myesp8266");

  // No authentication by default
  // ArduinoOTA.setPassword((const char *)"123");

  ArduinoOTA.onStart([]() {
    Serial.println("Start");
  });
  ArduinoOTA.onEnd([]() {
    Serial.println("\nEnd");
  });
  ArduinoOTA.onProgress([](unsigned int progress, unsigned int total) {
    Serial.printf("Progress: %u%%\r", (progress / (total / 100)));
  });
  ArduinoOTA.onError([](ota_error_t error) {
    Serial.printf("Error[%u]: ", error);
    if (error == OTA_AUTH_ERROR) Serial.println("Auth Failed");
    else if (error == OTA_BEGIN_ERROR) Serial.println("Begin Failed");
    else if (error == OTA_CONNECT_ERROR) Serial.println("Connect Failed");
    else if (error == OTA_RECEIVE_ERROR) Serial.println("Receive Failed");
    else if (error == OTA_END_ERROR) Serial.println("End Failed");
  });
  ArduinoOTA.begin();
  Serial.println("[ OK ] OTA");
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
  begin_ota();
  connect_wifi();
  connect_mqtt();
  Serial.println("Boot Complete\r\n");
}

void loop() {
  ArduinoOTA.handle();
  
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
