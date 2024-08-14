#define BLYNK_TEMPLATE_ID "TMPL37_m7NvlU"
#define BLYNK_TEMPLATE_NAME "Hydroponics"
#define BLYNK_AUTH_TOKEN "1fvpgxwyr6HNyjLtty_sL3-oWI167YLg"

/* Comment this out to disable prints and save space */
#define BLYNK_PRINT Serial

#include <ESP8266WiFi.h>
#include <BlynkSimpleEsp8266.h>

// Define the analog pins for the sensors
#define PH_PIN A0  // ESP8266 has only one ADC pin, A0
#define EC_PIN D7  // Use the same pin for demonstration purposes

// Your WiFi credentials
const char* ssid = "Chicks_Hicks";
const char* password = "12345678";

float phValue;
float tdsValue;
int rawPhValue;
int rawEcValue;

// Conversion factor for TDS calculation
const float TDS_CONVERSION_FACTOR = 0.5; // Adjust based on your sensor

BlynkTimer timer;

// Function to read sensor data and send to Blynk
void sendSensorData() {
  // Read raw analog values from the sensors
  rawPhValue = analogRead(PH_PIN);
  rawEcValue = analogRead(EC_PIN);

  // Convert raw values to voltages
  float phVoltage = rawPhValue * (3.3 / 1023.0);
  float ecVoltage = rawEcValue * (3.3 / 1023.0);

  // Convert voltages to pH and EC values using appropriate formulas
  // For pH: assuming a linear relationship for demonstration purposes
  phValue = 3.5 * phVoltage;

  // Convert EC voltage to TDS value
  // EC in µS/cm = (EC_voltage / 3.3) * 1000
  // TDS in ppm = EC in µS/cm * TDS_CONVERSION_FACTOR
  float ecValue = (ecVoltage / 3.3) * 1000;
  tdsValue = ecValue * TDS_CONVERSION_FACTOR+850.6;

  // Send data to Blynk
  Blynk.virtualWrite(V0, phValue);
  Blynk.virtualWrite(V1, tdsValue);

  Serial.print("Raw pH Value: ");
  Serial.print(rawPhValue);
  Serial.print(" | pH Voltage: ");
  Serial.print(phVoltage);
  Serial.print(" | pH Value: ");
  Serial.println(phValue);

  Serial.print("Raw EC Value: ");
  Serial.print(rawEcValue);
  Serial.print(" | EC Voltage: ");
  Serial.print(ecVoltage);
  Serial.print(" | TDS Value: ");
  Serial.println(tdsValue);
}

void setup() {
  // Initialize serial communication at 115200 baud
  Serial.begin(115200);

  // Set the pH and EC pins as inputs
  pinMode(PH_PIN, INPUT);
  pinMode(EC_PIN, INPUT);

  // Initialize Blynk
  Blynk.begin(BLYNK_AUTH_TOKEN, ssid, password);

  // Setup a timer to send sensor data to Blynk every second
  timer.setInterval(1000L, sendSensorData);
}

void loop() {
  Blynk.run();
  timer.run();
}
