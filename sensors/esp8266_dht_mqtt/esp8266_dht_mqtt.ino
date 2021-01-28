#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <ArduinoJson.h>
#include <WiFiUdp.h>
#include <NTPClient.h>

const char* ssid = "Chewbacca";
const char* password = "pv2ohf2j1[pjgrf";
const char* mqtt_server = "192.168.7.79";
//const String clientId = "ESP8266-001";
//const String description = "Living Room";
//const char* mqtt_topic_temperature = "home/livingroom/temperature";
//const char* mqtt_topic_humidity = "home/livingroom/humidity";
const String clientId = "ESP8266-002";
const String description = "Basement";
const char* mqtt_topic_temperature = "home/basement/temperature";
const char* mqtt_topic_humidity = "home/basement/humidity";
const String sensor_type_humidity = "Humidity";
const String sensor_type_temperature = "Temperature";

WiFiClient espClient;
PubSubClient client(espClient);
unsigned long lastMsg = 0;
#define DHTPIN D5
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org");

void setup_wifi() {

  delay(10);
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  randomSeed(micros());

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect
    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
      publish();
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void publish() {
      timeClient.update();
      long epochTime = timeClient.getEpochTime();
      float humidity = dht.readHumidity();
      float temperature = dht.readTemperature(true); // true == farenheit
      client.publish(mqtt_topic_temperature, buildMessage(sensor_type_temperature, epochTime, "F", temperature));
      client.publish(mqtt_topic_humidity, buildMessage(sensor_type_humidity, epochTime, "%", humidity));
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

void setup() {
  Serial.begin(115200);
  dht.begin();
  timeClient.begin();
  setup_wifi();
  client.setServer(mqtt_server, 1883);
}

void loop() {

  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  unsigned long now = millis();
  if (now - lastMsg > 10000) {
    lastMsg = now;
    publish();
  }
}
