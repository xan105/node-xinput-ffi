/*
Copyright (c) Anthony Beaumont
This source code is licensed under the GNU AFFERO GENERAL PUBLIC LICENSE Version 3
found in the LICENSE file in the root directory of this source tree.
*/

import koffi from "koffi";

//Types
import { 
  DWORD, 
  WORD, 
  BYTE, 
  SHORT, 
  WCHAR 
} from "./WindowsDataTypes.js";

//https://docs.microsoft.com/en-us/windows/win32/api/xinput/ns-xinput-xinput_gamepad
const XINPUT_GAMEPAD = koffi.struct("XINPUT_GAMEPAD", {
  wButtons: WORD,
  bLeftTrigger: BYTE,
  bRightTrigger: BYTE,
  sThumbLX: SHORT,
  sThumbLY: SHORT,
  sThumbRX: SHORT,
  sThumbRY: SHORT
});

//https://docs.microsoft.com/en-us/windows/win32/api/xinput/ns-xinput-xinput_state
const XINPUT_STATE = koffi.struct("XINPUT_STATE", {
  dwPacketNumber: DWORD,
  Gamepad: XINPUT_GAMEPAD
});

//https://docs.microsoft.com/en-us/windows/win32/api/xinput/ns-xinput-xinput_vibration
const XINPUT_VIBRATION = koffi.struct("XINPUT_VIBRATION", {
  wLeftMotorSpeed: WORD, //low-frequency rumble motor
  wRightMotorSpeed: WORD //high-frequency rumble motor
});

//https://docs.microsoft.com/en-us/windows/win32/api/xinput/ns-xinput-xinput_battery_information
const XINPUT_BATTERY_INFORMATION = koffi.struct("XINPUT_BATTERY_INFORMATION", {
  BatteryType: BYTE,
  BatteryLevel: BYTE
});

//https://docs.microsoft.com/en-us/windows/win32/api/xinput/ns-xinput-xinput_capabilities
const XINPUT_CAPABILITIES = koffi.struct("XINPUT_CAPABILITIES", {
  Type: BYTE,
  SubType: BYTE,
  Flags: WORD,
  Gamepad: XINPUT_GAMEPAD,
  Vibration: XINPUT_VIBRATION
});

//https://docs.microsoft.com/en-us/windows/win32/api/xinput/ns-xinput-xinput_keystroke
const XINPUT_KEYSTROKE = koffi.struct("XINPUT_KEYSTROKE",{
  VirtualKey: WORD,  
  Unicode: WCHAR,
  Flags: WORD,
  UserIndex: BYTE,
  HidCode: BYTE
});

//"Hidden" functions
//https://reverseengineerlog.blogspot.com/2016/06/xinputs-hidden-functions.html

const XINPUT_CAPABILITIES_EX = koffi.struct("XINPUT_CAPABILITIES_EX", {
  Capabilities: XINPUT_CAPABILITIES,
  VendorId: WORD,
  ProductId: WORD,
  VersionNumber: WORD,
	unk1: DWORD //unknown
});

const XINPUT_BASE_BUS_INFORMATION = koffi.struct("XINPUT_BASE_BUS_INFORMATION", {
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
  XINPUT_KEYSTROKE,
  XINPUT_CAPABILITIES_EX,
  XINPUT_BASE_BUS_INFORMATION
};