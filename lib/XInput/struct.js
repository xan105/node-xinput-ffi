/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

import { struct } from "@xan105/ffi/koffi"; 

//https://docs.microsoft.com/en-us/windows/win32/api/xinput/ns-xinput-xinput_gamepad
const XINPUT_GAMEPAD = struct({
  wButtons: "WORD",
  bLeftTrigger: "BYTE",
  bRightTrigger: "BYTE",
  sThumbLX: "SHORT",
  sThumbLY: "SHORT",
  sThumbRX: "SHORT",
  sThumbRY: "SHORT"
});

//https://docs.microsoft.com/en-us/windows/win32/api/xinput/ns-xinput-xinput_state
const XINPUT_STATE = struct({
  dwPacketNumber: "DWORD",
  Gamepad: XINPUT_GAMEPAD
});

//https://docs.microsoft.com/en-us/windows/win32/api/xinput/ns-xinput-xinput_vibration
const XINPUT_VIBRATION = struct({
  wLeftMotorSpeed: "WORD", //low-frequency rumble motor (left)
  wRightMotorSpeed: "WORD "//high-frequency rumble motor (right)
});

//https://docs.microsoft.com/en-us/windows/win32/api/xinput/ns-xinput-xinput_battery_information
const XINPUT_BATTERY_INFORMATION = struct({
  BatteryType: "BYTE",
  BatteryLevel: "BYTE"
});

//https://docs.microsoft.com/en-us/windows/win32/api/xinput/ns-xinput-xinput_capabilities
const XINPUT_CAPABILITIES = struct({
  Type: "BYTE",
  SubType: "BYTE",
  Flags: "WORD",
  Gamepad: XINPUT_GAMEPAD,
  Vibration: XINPUT_VIBRATION
});

//https://docs.microsoft.com/en-us/windows/win32/api/xinput/ns-xinput-xinput_keystroke
const XINPUT_KEYSTROKE = struct({
  VirtualKey: "WORD",  
  Unicode: "WCHAR",
  Flags: "WORD",
  UserIndex: "BYTE",
  HidCode: "BYTE"
});

//"Hidden" functions
//https://reverseengineerlog.blogspot.com/2016/06/xinputs-hidden-functions.html
//https://github.com/Nemirtingas/OpenXinput/blob/OpenXinput1_4/src/OpenXinput.h

const XINPUT_CAPABILITIES_EX = struct({
  Capabilities: XINPUT_CAPABILITIES,
  VendorId: "WORD",
  ProductId: "WORD",
  ProductVersion: "WORD",
  unk1: "WORD", //unknown
  unk2: "DWORD" //unknown
});

const XINPUT_BASE_BUS_INFORMATION = struct({
 VendorId: "WORD", //unknown
 ProductId: "WORD", //unknown
 InputId: "WORD", //unknown
 Field_6: "WORD", //unknown
 Field_8: "DWORD", //unknown
 Field_C: "BYTE", //unknown
 Field_D: "BYTE", //unknown
 Field_E: "BYTE", //unknown
 Field_F: "BYTE" //unknown
});

const XINPUT_LISTEN_STATE = struct({
  Status: "DWORD",
  unk1: "DWORD", //unknown
  unk2: "WORD", //unknown
  unk3: "BYTE", //unknown
  unk4: "BYTE", //unknown
  unk5: "WORD", //unknown
  unk6: "WORD", //unknown
  unk7: "WORD", //unknown
  unk8: "WORD" //unknown
});

//XInputOnGameInput (GDK)
//https://learn.microsoft.com/en-us/gaming/gdk/_content/gc/reference/input/xinputongameinput/structs/xinput_vibration_ex
const XINPUT_VIBRATION_EX = struct({
  wLeftMotorSpeed: "WORD", //low-frequency rumble motor (left)
  wRightMotorSpeed: "WORD", //high-frequency rumble motor (right)
  wLeftTriggerSpeed: "WORD", //haptic feedback through the left trigger 
  wRightTriggerSpeed: "WORD" //haptic feedback through the right trigger
});

//https://learn.microsoft.com/en-us/gaming/gdk/_content/gc/reference/system/xuser/structs/app_local_device_id
const APP_LOCAL_DEVICE_ID = struct({
  value: "BYTE"
});

export {
  XINPUT_GAMEPAD,
  XINPUT_STATE,
  XINPUT_VIBRATION,
  XINPUT_BATTERY_INFORMATION,
  XINPUT_CAPABILITIES,
  XINPUT_KEYSTROKE,
  XINPUT_CAPABILITIES_EX,
  XINPUT_BASE_BUS_INFORMATION,
  XINPUT_LISTEN_STATE,
  XINPUT_VIBRATION_EX,
  APP_LOCAL_DEVICE_ID
};