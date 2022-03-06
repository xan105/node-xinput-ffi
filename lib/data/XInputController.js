/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

const MAX = 4;
const MOTOR_SPEED = 65535;
const RUMBLE_DURATION = 2500; //~2sec (estimate)
const LEFT_THUMB_DEADZONE = 7849;
const RIGHT_THUMB_DEADZONE = 8689;
const TRIGGER_THRESHOLD = 30;
const THUMB_MAX = 32767;
const BUTTONS = [
  { name: "XINPUT_GAMEPAD_DPAD_UP", value: 1 },
  { name: "XINPUT_GAMEPAD_DPAD_DOWN", value: 2 },
  { name: "XINPUT_GAMEPAD_DPAD_LEFT", value: 4 },
  { name: "XINPUT_GAMEPAD_DPAD_RIGHT", value: 8 },
  { name: "XINPUT_GAMEPAD_START", value: 16 },
  { name: "XINPUT_GAMEPAD_BACK", value: 32 },
  { name: "XINPUT_GAMEPAD_LEFT_THUMB", value: 64 },
  { name: "XINPUT_GAMEPAD_RIGHT_THUMB", value: 128 },
  { name: "XINPUT_GAMEPAD_LEFT_SHOULDER", value: 256 },
  { name: "XINPUT_GAMEPAD_RIGHT_SHOULDER", value: 512 },
  { name: "XINPUT_GAMEPAD_A", value: 4096 },
  { name: "XINPUT_GAMEPAD_B", value: 8192 },
  { name: "XINPUT_GAMEPAD_X", value: 16384 },
  { name: "XINPUT_GAMEPAD_Y", value: 32768 },
];
const FLAGS = [
  { name: "XINPUT_CAPS_FFB_SUPPORTED", value: 1 },
  { name: "XINPUT_CAPS_WIRELESS", value: 2 },
  { name: "XINPUT_CAPS_VOICE_SUPPORTED", value: 4 },
  { name: "XINPUT_CAPS_PMD_SUPPORTED", value: 8 },
  { name: "XINPUT_CAPS_NO_NAVIGATION", value: 16 }
];

export {
  MAX,
  MOTOR_SPEED,
  RUMBLE_DURATION,
  LEFT_THUMB_DEADZONE,
  RIGHT_THUMB_DEADZONE,
  TRIGGER_THRESHOLD,
  THUMB_MAX,
  BUTTONS,
  FLAGS
};
