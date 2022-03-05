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
  { name: "XINPUT_DPAD_UP", wButtons: 1 },
  { name: "XINPUT_GAMEPAD_DPAD_DOWN", wButtons: 2 },
  { name: "XINPUT_GAMEPAD_DPAD_LEFT", wButtons: 4 },
  { name: "XINPUT_GAMEPAD_DPAD_RIGHT", wButtons: 8 },
  { name: "XINPUT_GAMEPAD_START", wButtons: 16 },
  { name: "XINPUT_GAMEPAD_BACK", wButtons: 32 },
  { name: "XINPUT_GAMEPAD_LEFT_THUMB", wButtons: 64 },
  { name: "XINPUT_GAMEPAD_RIGHT_THUMB", wButtons: 128 },
  { name: "XINPUT_GAMEPAD_LEFT_SHOULDER", wButtons: 256 },
  { name: "XINPUT_GAMEPAD_RIGHT_SHOULDER", wButtons: 512 },
  { name: "XINPUT_GAMEPAD_A", wButtons: 4096 },
  { name: "XINPUT_GAMEPAD_B", wButtons: 8192 },
  { name: "XINPUT_GAMEPAD_X", wButtons: 16384 },
  { name: "XINPUT_GAMEPAD_Y", wButtons: 32768 },
];

export {
  MAX,
  MOTOR_SPEED,
  RUMBLE_DURATION,
  LEFT_THUMB_DEADZONE,
  RIGHT_THUMB_DEADZONE,
  TRIGGER_THRESHOLD,
  THUMB_MAX,
  BUTTONS
};
