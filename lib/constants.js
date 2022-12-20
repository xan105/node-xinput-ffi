/*
Copyright (c) Anthony Beaumont
This source code is licensed under the GNU AFFERO GENERAL PUBLIC LICENSE Version 3
found in the LICENSE file in the root directory of this source tree.
*/

const XUSER_MAX_COUNT = { 
  XInput: 4,
  XInputOnGameInput: 8 //value has been increased from 4 to 8 to match the number of supported devices on Xbox One
};
const XUSER_INDEX_ANY = 255;
const MOTOR_SPEED = 65535;
const RUMBLE_DURATION = 2500; //~2sec (estimate)
const LEFT_THUMB_DEADZONE = 7849;
const RIGHT_THUMB_DEADZONE = 8689;
const TRIGGER_THRESHOLD = 30;
const THUMB_MAX = 32767;
const FLAG_GAMEPAD = 1; //Limit query to devices of Xbox 360 Controller type

const BATTERY_DEVTYPE = {
  0: "BATTERY_DEVTYPE_GAMEPAD",
  1: "BATTERY_DEVTYPE_HEADSET"
};

const BATTERY_TYPE = {
  0: "BATTERY_TYPE_DISCONNECTED", //The device is not connected
  1: "BATTERY_TYPE_WIRED", //The device is a wired device and does not have a battery
  2: "BATTERY_TYPE_ALKALINE", //The device has an alkaline battery
  3: "BATTERY_TYPE_NIMH", //The device has a nickel metal hydride battery
  255: "BATTERY_TYPE_UNKNOWN" //The device has an unknown battery type
};

const BATTERY_LEVEL = {
  0: "BATTERY_LEVEL_EMPTY", //Charge is between zero and 10%
  1: "BATTERY_LEVEL_LOW", //Charge is between 10% and 40%
  2: "BATTERY_LEVEL_MEDIUM", //Charge is between 40% and 70%
  3: "BATTERY_LEVEL_FULL" //Charge is between 70% and 100%
};

const DEVTYPE = {
  1: "XINPUT_DEVTYPE_GAMEPAD"
};

const DEVSUBTYPE = {
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
};

const FEATURES = {
  1: "XINPUT_CAPS_FFB_SUPPORTED", //Device supports force-feedback functionality. At this time, force-feedback features other than rumble are not supported through XINPUT on Windows
  2: "XINPUT_CAPS_WIRELESS", //Device is wireless
  4: "XINPUT_CAPS_VOICE_SUPPORTED", //Device has an integrated voice device
  8: "XINPUT_CAPS_PMD_SUPPORTED", //Device supports plug-in modules. At this time, plug-in modules (such as text input device (TID)) are not supported through XINPUT on Windows
  16: "XINPUT_CAPS_NO_NAVIGATION" //Device lacks the menu-navigation buttons: START, BACK, and DPAD
};

const BUTTONS = {
  1: "XINPUT_GAMEPAD_DPAD_UP",
  2: "XINPUT_GAMEPAD_DPAD_DOWN",
  4: "XINPUT_GAMEPAD_DPAD_LEFT",
  8: "XINPUT_GAMEPAD_DPAD_RIGHT",
  16: "XINPUT_GAMEPAD_START",
  32: "XINPUT_GAMEPAD_BACK",
  64: "XINPUT_GAMEPAD_LEFT_THUMB",
  128: "XINPUT_GAMEPAD_RIGHT_THUMB",
  256: "XINPUT_GAMEPAD_LEFT_SHOULDER",
  512: "XINPUT_GAMEPAD_RIGHT_SHOULDER",
  1024: "XINPUT_GAMEPAD_GUIDE",
  4096: "XINPUT_GAMEPAD_A",
  8192: "XINPUT_GAMEPAD_B",
  16384: "XINPUT_GAMEPAD_X",
  32768: "XINPUT_GAMEPAD_Y"
};

const VIRTUALKEY = {
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
  /*
    The above indicate controller input.
    In addition there are codes that indicate key presses which I'm not including.
    Since the Chatpad feature was not implemented in Windows.
  */
};

const VK_STATE = { //Chatpad
  1: "XINPUT_KEYSTROKE_KEYDOWN", 	//The key was pressed
  2: "XINPUT_KEYSTROKE_KEYUP", 	//The key was released
  4: "XINPUT_KEYSTROKE_REPEAT" //A repeat of a held key
};

export {
  XUSER_MAX_COUNT,
  XUSER_INDEX_ANY,
  MOTOR_SPEED,
  RUMBLE_DURATION,
  LEFT_THUMB_DEADZONE,
  RIGHT_THUMB_DEADZONE,
  TRIGGER_THRESHOLD,
  TRIGGER_THRESHOLD as XINPUT_GAMEPAD_TRIGGER_THRESHOLD, //alias
  THUMB_MAX,
  FLAG_GAMEPAD,
  FLAG_GAMEPAD as XINPUT_FLAG_GAMEPAD, //alias
  BATTERY_DEVTYPE,
  BATTERY_TYPE,
  BATTERY_LEVEL,
  DEVTYPE,
  DEVSUBTYPE,
  FEATURES,
  BUTTONS,
  VIRTUALKEY,
  VK_STATE
}