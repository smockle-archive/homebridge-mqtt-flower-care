const awsIot = require("aws-iot-device-sdk");
require("dotenv-safe").config();

const device = awsIot.device({
  keyPath: process.env.KEY_PATH,
  certPath: process.env.CERT_PATH,
  caPath: process.env.CA_PATH,
  clientId: process.env.CLIENT_ID,
  host: process.env.HOST,
  debug: true
});

device.on("connect", function() {
  console.log("connect");
  device.subscribe("topic_1");
  device.publish("topic_1", JSON.stringify({ test_data: 1 }));
});
device.on("close", function() {
  console.log("close");
});
device.on("reconnect", function() {
  console.log("reconnect");
});
device.on("offline", function() {
  console.log("offline");
});
device.on("error", function(error) {
  console.log("error", error);
});
device.on("message", function(topic, payload) {
  console.log("message", topic, payload.toString());
});
