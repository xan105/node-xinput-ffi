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

import ref from "ref-napi";
import StructType from "ref-struct-di";
const Struct = StructType(ref);

//Types
import { DWORD, WORD, BYTE, SHORT } from "./WindowsDataTypes.js";

//XINPUT Structure
const XINPUT_GAMEPAD = Struct({
  //https://docs.microsoft.com/en-us/windows/win32/api/xinput/ns-xinput-xinput_gamepad
  wButtons: WORD,
  bLeftTrigger: BYTE,
  bRightTrigger: BYTE,
  sThumbLX: SHORT,
  sThumbLY: SHORT,
  sThumbRX: SHORT,
  sThumbRY: SHORT,
});

const XINPUT_STATE = Struct({
  //https://docs.microsoft.com/en-us/windows/win32/api/xinput/ns-xinput-xinput_state
  dwPacketNumber: DWORD,
  Gamepad: ref.refType(XINPUT_GAMEPAD),
});

const XINPUT_VIBRATION = Struct({
  //https://docs.microsoft.com/en-us/windows/win32/api/xinput/ns-xinput-xinput_vibration
  wLeftMotorSpeed: WORD, //low-frequency rumble motor
  wRightMotorSpeed: WORD, //high-frequency rumble motor
});

const XINPUT_BATTERY_INFORMATION = Struct({
  //https://docs.microsoft.com/en-us/windows/win32/api/xinput/ns-xinput-xinput_battery_information
  BatteryType: BYTE,
  BatteryLevel: BYTE,
});

const XINPUT_CAPABILITIES = Struct({
  //https://docs.microsoft.com/en-us/windows/win32/api/xinput/ns-xinput-xinput_capabilities
  Type: BYTE,
  SubType: BYTE,
  Flags: WORD,
  Gamepad: ref.refType(XINPUT_GAMEPAD),
  Vibration: ref.refType(XINPUT_VIBRATION),
});

const XINPUT_CAPABILITIES_EX = Struct({
  //https://stackoverflow.com/questions/64251320/is-it-possible-to-get-an-xinput-devices-name-product-id-vendor-id-or-some-oth/68879988#68879988
  Capabilities: ref.refType(XINPUT_CAPABILITIES),
  vendorId: WORD,
  productId: WORD,
  revisionId: WORD,
  a4: DWORD //unknown
});

/*
const XINPUT_KEYSTROKE = Struct({ //https://docs.microsoft.com/en-us/windows/win32/api/xinput/ns-xinput-xinput_keystroke
  VirtualKey: WORD  
  Unicode: WCHAR, //https://github.com/TooTallNate/ref-wchar -> https://github.com/Janealter/ref-wchar-napi ? Dependencies (2) ref-napi,iconv 
  Flags: WORD,
  UserIndex: BYTE,
  HidCode: BYTE
});*/

export {
  XINPUT_GAMEPAD,
  XINPUT_STATE,
  XINPUT_VIBRATION,
  XINPUT_BATTERY_INFORMATION,
  XINPUT_CAPABILITIES,
  XINPUT_CAPABILITIES_EX,
};