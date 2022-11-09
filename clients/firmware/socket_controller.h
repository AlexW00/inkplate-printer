#include <Arduino.h>

#include <ArduinoJson.h>
#include "socket.h"

void send_example_message()
{ 
  DynamicJsonDocument data(1024);
  data["message"] = "Hello from Arduino!";
  send_message("example", &data);
}

void send_message(String name, DynamicJsonDocument *data)
{
    DynamicJsonDocument doc(1024);
    JsonArray arr = doc.to<JsonArray>();

    arr.add(name);
    if(data != nullptr) arr.add(*data);

    String output;
    serializeJson(doc, output);
    socketIO.sendEVENT(output);
    
    Serial.println(output);
}

void socket_loop() { _socket_loop(); }

void socket_setup() { _socket_setup(); }