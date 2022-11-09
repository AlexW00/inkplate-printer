#include <Arduino.h>

#include <ArduinoJson.h>
#include "socket.h"

void send_example_message()
{
  // creat JSON message for Socket.IO (event)
  DynamicJsonDocument doc(1024);
  JsonArray array = doc.to<JsonArray>();

  // add evnet name
  // Hint: socket.on('event_name', ....
  array.add("example");

  // add payload (parameters) for the event
  JsonObject param1 = array.createNestedObject();
  param1["exampleData"] = "hi";

  // JSON to String (serializion)
  String output;
  serializeJson(doc, output);

  // Send event
  socketIO.sendEVENT(output);

  // Print JSON for debugging
  USE_SERIAL.println(output);
}

void socket_loop()
{
  _socket_loop();
}

void socket_setup()
{
  _socket_setup();
}