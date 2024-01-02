#include <ArduinoJson.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <Wire.h>
#include <Adafruit_ADS1X15.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME280.h>
#include <SD_ZH03B.h>
#include <SoftwareSerial.h>

Adafruit_ADS1115 ads; // Use default I2C address 0x48
Adafruit_BME280 bme;
SoftwareSerial ZHSerial(17, 16); // RX, TX
SD_ZH03B ZH03B(ZHSerial, SD_ZH03B::SENSOR_ZH03B);

// // WiFi credentials
// const char* ssid = "RUMAHbarokah";
// const char* password = "AxelReno@1324";

// // WiFi credentials
// const char* ssid = "";
// const char* password = "";

const char *ssid = "1";
const char *password = "";

// // MQTT Broker settings
// const char* mqtt_server = "broker.emqx.io";
// const int mqtt_port = 1883;
// const char* mqtt_username = "emqx";
// const char* mqtt_password = "public";

// MQTT Broker settings
const char *mqtt_server = "132.145.112.175";
const int mqtt_port = 1883;
const char *mqtt_username = "axel";
const char *mqtt_password = "axel123";

WiFiClient espClient;
PubSubClient client(espClient);

unsigned long lastMsg = 0;
unsigned long sampletime_ms = 120000; // Sample time for sensor data collection

float mg_m3Ozone = 0;
float mgPerCubicMeterCO = 0;
float mgPerCubicMeterNO2 = 0;

float concentrationPM1 = 0;
float concentrationPM25 = 0;
float concentrationPM10 = 0;

float temperature;
float humidity;
float pressure;

void setup()
{
    Serial.begin(115200);

    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(".");
    }

    client.setServer(mqtt_server, mqtt_port);
    while (!client.connected())
    {
        String client_id = "ESP32Client-";
        client_id += String(WiFi.macAddress());
        if (client.connect(client_id.c_str(), mqtt_username, mqtt_password))
        {
            Serial.println("MQTT broker connected");
        }
        else
        {
            Serial.print("MQTT connection failed, rc=");
            Serial.print(client.state());
            delay(5000);
        }
    }

    if (!ads.begin())
    {
        Serial.println("Failed to initialize ADS.");
        while (1)
            ;
    }

    if (!bme.begin(0x76))
    {
        Serial.println("Could not find a valid BME280 sensor, check wiring!");
        while (1)
            ;
    }

    ZHSerial.begin(9600);
    ZH03B.setQandAmode(); // Set to Q&A mode for ZH03B
}

void loop()
{
    if (!client.connected())
    {
        reconnect();
    }
    client.loop();

    unsigned long currentMillis = millis();
    if (currentMillis - lastMsg > sampletime_ms)
    {
        lastMsg = currentMillis;

        temperature = bme.readTemperature();
        humidity = bme.readHumidity();
        pressure = bme.readPressure() / 100.0F;

        readZH03B();
        readMQ131();
        readMiCS6814();

        publishAllSensors();
    }
}

// Function to read temperature from BME280
float readTemperature()
{
    float temperature = bme.readTemperature();
    return temperature;
}

float readHumidity()
{
    float humidity = bme.readHumidity();
    return humidity;
}

float readPressure()
{
    float pressure = bme.readPressure();
    pressure /= 100.0F;
    return pressure;
}

void readZH03B()
{
    if (ZH03B.readData())
    {
        concentrationPM1 = ZH03B.getPM1_0();
        concentrationPM25 = ZH03B.getPM2_5();
        concentrationPM10 = ZH03B.getPM10_0();
    }
    else
    {
        Serial.println("ZH03B Error reading stream or Check Sum Error");
    }
}

void readMQ131()
{
    // Assuming the MQ131 is connected to channel 0
    int16_t adcReadingOzone = ads.readADC_SingleEnded(0);
    float voltage = ads.computeVolts(adcReadingOzone);
    float ppmOzone = map(adcReadingOzone, 0, 32767, 10, 2000);
    mg_m3Ozone = ppmOzone * (48.0 / 24.45);
}

void readMiCS6814()
{
    // Assuming the MiCS-6814 CO is connected to channel 1 and NO2 is connected to channel 3
    int16_t adcReadingCO = ads.readADC_SingleEnded(1);
    int16_t adcReadingNO2 = ads.readADC_SingleEnded(3);
    float ppmCO = (adcReadingCO / 32767.0) * (1000.0 - 1.0) + 1.0;
    float ppmNO2 = (adcReadingNO2 / 32767.0) * (10.0 - 0.05) + 0.05;
    mgPerCubicMeterCO = ppmCO * (28.01 / 24.45);
    mgPerCubicMeterNO2 = ppmNO2 * (46.0055 / 24.45);
}

void publishAllSensors()
{
    StaticJsonDocument<200> doc; // Sesuaikan ukuran dengan kebutuhan
    doc["pm1"] = concentrationPM1;
    doc["pm25"] = concentrationPM25;
    doc["pm10"] = concentrationPM10;
    doc["ozone"] = mg_m3Ozone;
    doc["co"] = mgPerCubicMeterCO;
    doc["no2"] = mgPerCubicMeterNO2;
    doc["temperature"] = temperature;
    doc["humidity"] = humidity;
    doc["pressure"] = pressure;

    char jsonBuffer[512];
    serializeJson(doc, jsonBuffer);                     // Mengubah JSON ke dalam string
    client.publish("emqx/esp32/allsensor", jsonBuffer); // Menggunakan topic tunggal untuk semua data sensor
}

void publishMQTT(const char *topic, float value)
{
    char msg[50];
    dtostrf(value, 6, 2, msg);
    client.publish(topic, msg);
}

void reconnect()
{
    while (!client.connected())
    {
        String clientId = "ESP32Client-";
        clientId += String(WiFi.macAddress());
        if (client.connect(clientId.c_str(), mqtt_username, mqtt_password))
        {
            Serial.println("Reconnected to MQTT broker");
        }
        else
        {
            Serial.print("MQTT reconnect failed, rc=");
            Serial.print(client.state());
            delay(5000);
        }
    }
}