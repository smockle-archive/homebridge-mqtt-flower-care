# homebridge-mqtt-flower-care 🌱

## About

The [Huahuacaocao Flower Care Smart Monitor](https://www.huahuacaocao.com/product?locale=en-US) (sometimes labelled Xiaomi or Mi Flora) can report temperature, sunlight intensity, soil moisture, soil fertility and battery status over Bluetooth Low Energy.

[homebridge-mi-flower-care](https://github.com/honkmaster/homebridge-mi-flower-care) can read this data over Bluetooth and report it to HomeKit. It seems like a really neat project, and you should check it out.

I wanted something a little different though. Bluetooth Low Energy has limited range, and I wanted 24/7 access to the latest sensor data. I discovered [Xiaomi Mi Flora Plant Sensor MQTT Client/Daemon](https://github.com/ThomDietrich/miflora-mqtt-daemon) can publish to an an [AWS IoT MQTT broker](https://console.aws.amazon.com/iot/home) and started work on this project.

**homebridge-mqtt-flower-care** subscribes to an AWS IoT MQTT broker and uses [Homebridge](https://github.com/nfarina/homebridge) to present Flower Care data as HomeKit sensors.

## Setup: AWS IoT

NB: This costs money. Here is the [pricing for AWS IoT Core](https://aws.amazon.com/iot-core/pricing/).

1. Create a Thing, e.g. “Aloe Plant”

2. Create a ThingType, e.g. “FlowerCareSensor”

3. Create a certificate, public & private key.

4. Activate the certificate. Attach it to the Thing.

5. Create a policy. Attach it to the certificate. Here is a sample:

```JSON
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "iot:*",
      "Resource": "arn:aws:iot:us-east-1:*:*"
    }
  ]
}
```

## Setup: Local

1. Clone this repostitory:

```Bash
$ git clone https://github.com/smockle/homebridge-mqtt-flower-care
```

2. Download the certificate, public & private key, and [Amazon Root CA](https://www.amazontrust.com/repository/AmazonRootCA1.pem). Move them to the `certificates` directory.

3. Create a `.env` file based on `.env.example`:

- `KEY_PATH`: relative path to the `.pem.key` file
- `CERT_PATH`: relative path to the `.pem.crt` file
- `CA_PATH`: relative path to the `AmazonRootCA1.pem` file
- `CLIENT_ID`: the ARN of your Thing
- `HOST`: the URL of your AWS IoT MQTT broker

## Disclaimer

Xiaomi and Mi Flora are registered trademarks of BEIJING XIAOMI TECHNOLOGY CO., LTD.

This project is in no way affiliated with, authorized, maintained, sponsored or endorsed by Xiaomi or any of its affiliates or subsidiaries.
