/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

function ERROR(code) {
  if (code === 1167)
    return ["The device is not connected", "ERR_DEVICE_NOT_CONNECTED"];
  else
    return [`Error ${code} (0x${code.toString(16)})`,"ERR_UNEXPECTED"];
}

const BATTERY_DEVTYPE = (code) => {
  return ({
    0: "BATTERY_DEVTYPE_GAMEPAD",
    1: "BATTERY_DEVTYPE_HEADSET",
  })[code] ?? code; //As of writing there are only these values. So return code as is.
}

const BATTERY_TYPE = (code) => {
  return ({
    0: "BATTERY_TYPE_DISCONNECTED",
    1: "BATTERY_TYPE_WIRED",
    2: "BATTERY_TYPE_ALKALINE",
    3: "BATTERY_TYPE_NIMH",
    255: "BATTERY_TYPE_UNKNOWN",
  })[code] ?? code; //As of writing there are only these values. So return code as is.
}

const BATTERY_LEVEL = (code) => {
  return ({
    0: "BATTERY_LEVEL_EMPTY",
    1: "BATTERY_LEVEL_LOW",
    2: "BATTERY_LEVEL_MEDIUM",
    3: "BATTERY_LEVEL_FULL"
  })[code] ?? code; //As of writing there are only these values. So return code as is.
}

const DEVTYPE = (code) => {
  return ({
    1: "XINPUT_DEVTYPE_GAMEPAD"
  })[code] ?? code; //As of writing there are only these values. So return code as is.
}

const DEVSUBTYPE = (code) => {
  return ({
    0: "XINPUT_DEVSUBTYPE_UNKNOWN",
    1: "XINPUT_DEVSUBTYPE_GAMEPAD",
    2: "XINPUT_DEVSUBTYPE_WHEEL",
    3: "XINPUT_DEVSUBTYPE_ARCADE_STICK",
    4: "XINPUT_DEVSUBTYPE_FLIGHT_SICK",
    5: "XINPUT_DEVSUBTYPE_DANCE_PAD",
    6: "XINPUT_DEVSUBTYPE_GUITAR",
    7: "XINPUT_DEVSUBTYPE_GUITAR_ALTERNATE",
    8: "XINPUT_DEVSUBTYPE_DRUM_KIT",
    11: "XINPUT_DEVSUBTYPE_GUITAR_BASS",
    19: "XINPUT_DEVSUBTYPE_ARCADE_PAD",
  })[code] ?? code; //As of writing there are only these values. So return code as is.
}

function bitwise(code, XINPUT_CONSTANT) {
  let result = [];
  
  for (const [name, value] of Object.entries(XINPUT_CONSTANT))
    if (code & value) result.push(name);

  return result;
}

export {
  ERROR,
  BATTERY_DEVTYPE,
  BATTERY_TYPE,
  BATTERY_LEVEL,
  DEVTYPE,
  DEVSUBTYPE,
  bitwise
};