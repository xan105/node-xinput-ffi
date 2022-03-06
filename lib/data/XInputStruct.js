/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

import ref from "ref-napi";
import StructType from "ref-struct-di";
const Struct = StructType(ref);

//Types
import { DWORD, WORD, BYTE, SHORT } from "./WindowsDataTypes.js";

/*XINPUT Structure
==================*/

//https://docs.microsoft.com/en-us/windows/win32/api/xinput/ns-xinput-xinput_gamepad
const XINPUT_GAMEPAD = Struct({
  wButtons: WORD,
  bLeftTrigger: BYTE,
  bRightTrigger: BYTE,
  sThumbLX: SHORT,
  sThumbLY: SHORT,
  sThumbRX: SHORT,
  sThumbRY: SHORT,
});

//https://docs.microsoft.com/en-us/windows/win32/api/xinput/ns-xinput-xinput_state
const XINPUT_STATE = Struct({
  dwPacketNumber: DWORD,
  Gamepad: ref.refType(XINPUT_GAMEPAD),
});

//https://docs.microsoft.com/en-us/windows/win32/api/xinput/ns-xinput-xinput_vibration
const XINPUT_VIBRATION = Struct({
  wLeftMotorSpeed: WORD, //low-frequency rumble motor
  wRightMotorSpeed: WORD, //high-frequency rumble motor
});

//https://docs.microsoft.com/en-us/windows/win32/api/xinput/ns-xinput-xinput_battery_information
const XINPUT_BATTERY_INFORMATION = Struct({
  BatteryType: BYTE,
  BatteryLevel: BYTE,
});

//https://docs.microsoft.com/en-us/windows/win32/api/xinput/ns-xinput-xinput_capabilities
const XINPUT_CAPABILITIES = Struct({
  Type: BYTE,
  SubType: BYTE,
  Flags: WORD,
  Gamepad: ref.refType(XINPUT_GAMEPAD),
  Vibration: ref.refType(XINPUT_VIBRATION),
});

/*
//https://docs.microsoft.com/en-us/windows/win32/api/xinput/ns-xinput-xinput_keystroke
const XINPUT_KEYSTROKE = Struct({
  VirtualKey: WORD  
  Unicode: WCHAR, //https://github.com/TooTallNate/ref-wchar -> https://github.com/Janealter/ref-wchar-napi ? Dependencies (2) ref-napi,iconv 
  Flags: WORD,
  UserIndex: BYTE,
  HidCode: BYTE
});*/
//I'm not too keen on pulling iconv just for this single WCHAR :-/

/*XINPUT Hidden Structure
=========================
https://reverseengineerlog.blogspot.com/2016/06/xinputs-hidden-functions.html
Used with hidden functions;
These are undocumented :*/

//https://stackoverflow.com/questions/64251320/is-it-possible-to-get-an-xinput-devices-name-product-id-vendor-id-or-some-oth/68879988#68879988
const XINPUT_CAPABILITIES_EX = Struct({
  Capabilities: ref.refType(XINPUT_CAPABILITIES),
  VendorId: WORD,
  ProductId: WORD,
  VersionNumber: WORD,
	unk1: DWORD //unknown
});

const XINPUT_BASE_BUS_INFORMATION = Struct({
 unk1: WORD, //unknown
 unk2: WORD, //unknown
 unk3: DWORD, //unknown
 Flags: DWORD, //probably
 unk4: BYTE, //unknown
 unk5: BYTE, //unknown
 unk6: BYTE, //unknown
 reserved: BYTE //unknown
});

export {
  XINPUT_GAMEPAD,
  XINPUT_STATE,
  XINPUT_VIBRATION,
  XINPUT_BATTERY_INFORMATION,
  XINPUT_CAPABILITIES,
  XINPUT_CAPABILITIES_EX,
  XINPUT_BASE_BUS_INFORMATION
};