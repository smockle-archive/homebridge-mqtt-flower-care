// @ts-check
const { random } = require("lodash");

/**
 * Returns a soil fertility value (in µS/cm) between 0 and 2,000
 * @param {number} previousConductivity soil fertility value (in µS/cm)
 * @param {number} previousUpdatedAt time (in milliseconds)
 */
const nextConductivity = (previousConductivity, previousUpdatedAt) => {
  // Amount of fertilizer added since last reading, if any
  const addedFertilizer = Number(random(0, 300) === 300) * 1000;

  // Amount of fertilizer lost since last reading
  const depletionPerMillisecond = 0.00000003159;
  const depletedFertilizer =
    (Date.now() - previousUpdatedAt) * depletionPerMillisecond;

  return Math.min(
    Math.max(previousConductivity + addedFertilizer - depletedFertilizer, 0),
    2000
  );
};

/**
 * Returns a light intensity value (in lux) between 0 and 120,000
 */
const nextLight = () => {
  // Boundary times
  const sunrise = 26400;
  const sunset = 60720;
  const zenith = (sunrise + sunset) / 2;
  const luxAtZenith = 120000;
  const depletionPerSecond = luxAtZenith / (zenith - sunrise);

  // Current time
  const date = new Date();
  const now =
    date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();

  switch (true) {
    case now < sunrise:
    case now > sunset:
      return 0;
    default:
      return Math.min(
        Math.max(luxAtZenith - Math.abs(zenith - now) * depletionPerSecond, 0),
        luxAtZenith
      );
  }
};

/**
 * Returns a soil moisture value (in %) between 0 and 100
 * @param {number} previousMoisture moisture value (in %)
 * @param {number} previousUpdatedAt time (in milliseconds)
 */
const nextMoisture = (previousMoisture, previousUpdatedAt) => {
  // Amount of water added since last reading, if any
  const addedWater = Number(random(0, 7) === 7) * 100;

  // Amount of fertilizer lost since last reading
  const depletionPerMillisecond = 0.0000001653439;
  const depletedWater =
    (Date.now() - previousUpdatedAt) * depletionPerMillisecond;

  return Math.min(
    Math.max(previousMoisture + addedWater - depletedWater, 0),
    100
  );
};

/**
 * Returns a temperature value (in °C) between -25 and 55
 * @param {number} previousTemperature moisture value (in %)
 * @param {number} previousUpdatedAt time (in milliseconds)
 */
const nextTemperature = (previousTemperature, previousUpdatedAt) => {
  // Boundary times
  const sunrise = 26400;
  const sunset = 60720;
  const zenith = (sunrise + sunset) / 2;
  const range = 6;

  // Previous time
  const previousDate = new Date(previousUpdatedAt);
  const then =
    previousDate.getHours() * 3600 +
    previousDate.getMinutes() * 60 +
    previousDate.getSeconds();
  const previousOffset = (Math.abs(zenith - then) / 43200) * range;
  const zenithTemperature = previousTemperature + previousOffset;

  // Current time
  const date = new Date();
  const now =
    date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
  const currentOffset = (Math.abs(zenith - now) / 43200) * range;
  return Math.min(Math.max(zenithTemperature - currentOffset, -25), 55);
};
nextTemperature(30, 1545017013181);

/**
 * Returns a battery charge value (in %) between 0 and 100
 * @param {number} previousBattery battery charge value (in %)
 * @param {number} previousUpdatedAt time (in milliseconds)
 */
const nextBattery = (previousBattery, previousUpdatedAt) => {
  // Amount of charge added since last reading, if any
  const addedCharge = Number(random(0, 365) === 365) * 100;

  // Amount of fertilizer lost since last reading
  const depletionPerMillisecond = 0.0000000031709;
  const depletedCharge =
    (Date.now() - previousUpdatedAt) * depletionPerMillisecond;

  return Math.min(
    Math.max(previousBattery + addedCharge - depletedCharge, 0),
    100
  );
};

const initialState = {
  conductivity: random(0, 2000, true),
  light: nextLight(),
  moisture: random(0, 100, false),
  temperature: random(-25, 55, true),
  battery: random(0, 100, false)
};

function* Sensor() {
  let { conductivity, light, moisture, temperature, battery } = initialState;
  let updatedAt = Date.now();
  while (true) {
    conductivity = nextConductivity(conductivity, updatedAt);
    light = nextLight();
    moisture = nextMoisture(moisture, updatedAt);
    temperature = nextTemperature(temperature, updatedAt);
    battery = nextBattery(battery, updatedAt);
    updatedAt = Date.now();
    yield { conductivity, light, moisture, temperature, battery, updatedAt };
  }
}

module.exports = { Sensor };
