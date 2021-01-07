/*
MIT License
Copyright (c) 2020-2021 Anthony Beaumont
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

"use strict";

function ERROR(code) {
  let result;

  if (code === 1167) result = "ERROR_DEVICE_NOT_CONNECTED";
  else result = `UNEXPECTED_ERROR (${code})`;

  return result;
}

function BATTERY_DEVTYPE(code) {
  let result;

  if (code === 0) result = "BATTERY_DEVTYPE_GAMEPAD";
  else if (code === 1) result = "BATTERY_DEVTYPE_HEADSET";
  else result = code; //As of writing there are only these values. So return code as is.

  return result;
}

function BATTERY_TYPE(code) {
  let result;

  if (code === 0) result = "BATTERY_TYPE_DISCONNECTED";
  else if (code === 1) result = "BATTERY_TYPE_WIRED";
  else if (code === 2) result = "BATTERY_TYPE_ALKALINE";
  else if (code === 3) result = "BATTERY_TYPE_NIMH";
  else if (code === 255) result = "BATTERY_TYPE_UNKNOWN";
  else result = code; //As of writing there are only these values. So return code as is.

  return result;
}

function BATTERY_LEVEL(code) {
  let result;

  if (code === 0) result = "BATTERY_LEVEL_EMPTY";
  else if (code === 1) result = "BATTERY_LEVEL_LOW";
  else if (code === 2) result = "BATTERY_LEVEL_MEDIUM";
  else if (code === 3) result = "BATTERY_LEVEL_FULL";
  else result = code; //As of writing there are only these values. So return code as is.

  return result;
}

function DEVTYPE(code) {
  let result;

  if (code === 1) result = "XINPUT_DEVTYPE_GAMEPAD";
  else result = code; //As of writing there are only these values. So return code as is.

  return result;
}

function DEVSUBTYPE(code) {
  let result;

  if (code === 0) result = "XINPUT_DEVSUBTYPE_UNKNOWN";
  else if (code === 1) result = "XINPUT_DEVSUBTYPE_GAMEPAD";
  else if (code === 2) result = "XINPUT_DEVSUBTYPE_WHEEL";
  else if (code === 3) result = "XINPUT_DEVSUBTYPE_ARCADE_STICK";
  else if (code === 4) result = "XINPUT_DEVSUBTYPE_FLIGHT_SICK";
  else if (code === 5) result = "XINPUT_DEVSUBTYPE_DANCE_PAD";
  else if (code === 6) result = "XINPUT_DEVSUBTYPE_GUITAR";
  else if (code === 7) result = "XINPUT_DEVSUBTYPE_GUITAR_ALTERNATE";
  else if (code === 8) result = "XINPUT_DEVSUBTYPE_DRUM_KIT";
  else if (code === 11) result = "XINPUT_DEVSUBTYPE_GUITAR_BASS";
  else if (code === 19) result = "XINPUT_DEVSUBTYPE_ARCADE_PAD";
  else result = code; //As of writing there are only these values. So return code as is.

  return result;
}

function CAPS(code) {
  let result;

  if (code === 1) result = "XINPUT_CAPS_FFB_SUPPORTED";
  else if (code === 2) result = "XINPUT_CAPS_WIRELESS";
  else if (code === 4) result = "XINPUT_CAPS_VOICE_SUPPORTED";
  else if (code === 8) result = "XINPUT_CAPS_PMD_SUPPORTED";
  else if (code === 16) result = "XINPUT_CAPS_NO_NAVIGATION";
  else result = code; //As of writing there are only these values. So return code as is.

  return result;
}

function BUTTONS(code) {
  let result;

  if (code === 1) result = "XINPUT_GAMEPAD_DPAD_UP";
  else if (code === 2) result = "XINPUT_GAMEPAD_DPAD_DOWN";
  else if (code === 4) result = "XINPUT_GAMEPAD_DPAD_LEFT";
  else if (code === 8) result = "XINPUT_GAMEPAD_DPAD_RIGHT";
  else if (code === 16) result = "XINPUT_GAMEPAD_START";
  else if (code === 32) result = "XINPUT_GAMEPAD_BACK";
  else if (code === 64) result = "XINPUT_GAMEPAD_LEFT_THUMB";
  else if (code === 128) result = "XINPUT_GAMEPAD_RIGHT_THUMB";
  else if (code === 256) result = "XINPUT_GAMEPAD_LEFT_SHOULDER";
  else if (code === 512) result = "XINPUT_GAMEPAD_RIGHT_SHOULDER";
  else if (code === 4096) result = "XINPUT_GAMEPAD_A";
  else if (code === 8192) result = "XINPUT_GAMEPAD_B";
  else if (code === 16384) result = "XINPUT_GAMEPAD_X";
  else if (code === 32768) result = "XINPUT_GAMEPAD_Y";
  else result = code; //As of writing there are only these values. So return code as is.

  return result;
}

module.exports = {
  ERROR,
  BATTERY_DEVTYPE,
  BATTERY_TYPE,
  BATTERY_LEVEL,
  DEVTYPE,
  DEVSUBTYPE,
  CAPS,
  BUTTONS,
};
