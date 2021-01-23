#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <WiFiUdp.h>
#include <NTPClient.h>

const String client_id = "ESP8266-002";
const char* ssid = "Chewbacca";
const char* password = "pv2ohf2j1[pjgrf";
const char* mqtt_server = "192.168.7.100";
const char* mqtt_topic = "boat/battery/house";
const String description = "House Battery";
const String sensor_type = "battery";

WiFiClient espClient;
PubSubClient client(espClient);
unsigned long lastMsg = 0;
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org");

int V_IN = A0;
const float max_input_voltage = 3.3;
const float adc_resolution = 1024;
const float r1 = 100000;
const float r2 = 10000;
const float voltage_drop_factor = 0.9565; // note: remeasure when soldered
const float battery_charge_voltage = 13.0; // note: above this means lead acid batteries are charging
const float battery_full_voltage = 12.7; // note: this is the "full" level for lead acid
const float battery_safe_empty = 12.0; // note: this is the lowest healthy discharge for lead acid ~50%

float battery_voltage(int adc_reading) {
  float vOut = (adc_reading / adc_resolution) * max_input_voltage;
  return (vOut * (r1 + r2) / r2) / voltage_drop_factor;
}

String battery_level(float battery_voltage) {
  if (battery_voltage > battery_charge_voltage) {
    return "Charging";
  } else if (battery_voltage > battery_full_voltage) {
    return "100";
  } else if (battery_voltage < battery_safe_empty) {
    return "LOW!";
  } else {
    return String((battery_full_voltage - battery_voltage) / (battery_full_voltage - battery_safe_empty));
  }
}

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
    if (client.connect(client_id.c_str())) {
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
      float voltage = battery_voltage(analogRead(V_IN));
      String value = battery_level(voltage);
      if (epochTime < 1600000000) { 
        return; // avoid timeClient startup bug
      }
      client.publish(mqtt_topic, buildMessage(sensor_type, epochTime, "%", value, voltage, description)); 
}

char* buildMessage(String sensor, long epochTime, String unit, String value, float rawValue, String description) {
      StaticJsonDocument<256> doc;

      doc["sensor"] = sensor;
      doc["time"] = epochTime;
      doc["unit"] = unit;
      doc["value"] = value;
      doc["rawValue"] = rawValue;
      doc["description"] = description;
      
      char output[256];
      serializeJson(doc, output);

      Serial.println(output);
      return output;
}

void setup() {
  Serial.begin(115200);
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
