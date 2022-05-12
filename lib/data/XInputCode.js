/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

const BATTERY_DEVTYPE = (code) => {
  return {
    0: "BATTERY_DEVTYPE_GAMEPAD",
    1: "BATTERY_DEVTYPE_HEADSET "
  }[code] ?? code;
}

const BATTERY_TYPE = (code) => {
  return {
    0: "BATTERY_TYPE_DISCONNECTED",
    1: "BATTERY_TYPE_WIRED",
    2: "BATTERY_TYPE_ALKALINE",
    3: "BATTERY_TYPE_NIMH",
    255: "BATTERY_TYPE_UNKNOWN"
  }[code] ?? code;
}

const BATTERY_LEVEL = (code) => {
  return {
    0: "BATTERY_LEVEL_EMPTY",
    1: "BATTERY_LEVEL_LOW",
    2: "BATTERY_LEVEL_MEDIUM",
    3: "BATTERY_LEVEL_FULL"
  }[code] ?? code;
}

const DEVTYPE = (code) => {
  return {
    1: "XINPUT_DEVTYPE_GAMEPAD"
  }[code] ?? code;
}

const DEVSUBTYPE = (code) => {
  return {
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
    19: "XINPUT_DEVSUBTYPE_ARCADE_PAD"
  }[code] ?? code;
}

const VIRTUALKEY = (code) => {
  return {
    22528: "VK_PAD_A",
    22529: "VK_PAD_B",
    22530: "VK_PAD_X",
    22531: "VK_PAD_Y",
    22532: "VK_PAD_RSHOULDER",
    22533: "VK_PAD_LSHOULDER",
    22534: "VK_PAD_LTRIGGER",
    22535: "VK_PAD_RTRIGGER",
    22544: "VK_PAD_DPAD_UP",
    22545: "VK_PAD_DPAD_DOWN",
    22546: "VK_PAD_DPAD_LEFT",
    22547: "VK_PAD_DPAD_RIGHT",
    22548: "VK_PAD_START",
    22549: "VK_PAD_BACK",
    22550: "VK_PAD_LTHUMB_PRESS",
    22551: "VK_PAD_RTHUMB_PRESS",
    22560: "VK_PAD_LTHUMB_UP",
    22561: "VK_PAD_LTHUMB_DOWN",
    22562: "VK_PAD_LTHUMB_RIGHT",
    22563: "VK_PAD_LTHUMB_LEFT",
    22564: "VK_PAD_LTHUMB_UPLEFT",
    22565: "VK_PAD_LTHUMB_UPRIGHT",
    22566: "VK_PAD_LTHUMB_DOWNRIGHT",
    22567: "VK_PAD_LTHUMB_DOWNLEFT",
    22576: "VK_PAD_RTHUMB_UP",
    22577: "VK_PAD_RTHUMB_DOWN",
    22578: "VK_PAD_RTHUMB_RIGHT",
    22579: "VK_PAD_RTHUMB_LEFT",
    22580: "VK_PAD_RTHUMB_UPLEFT",
    22581: "VK_PAD_RTHUMB_UPRIGHT",
    22582: "VK_PAD_RTHUMB_DOWNRIGHT",
    22583: "VK_PAD_RTHUMB_DOWNLEFT"
  }[code] ?? code;
  /*
    The above indicate controller input.
    In addition there are codes that indicate key presses which I'm not including.
    Since the Chatpad feature was not implemented in Windows.
  */
}

export {
  BATTERY_DEVTYPE,
  BATTERY_TYPE,
  BATTERY_LEVEL,
  DEVTYPE,
  DEVSUBTYPE,
  VIRTUALKEY
};