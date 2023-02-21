/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

import { dlopenEx } from "./load.js";
import { pointer } from "@xan105/ffi/koffi";
import {
  XINPUT_STATE,
  XINPUT_VIBRATION,
  XINPUT_BATTERY_INFORMATION,
  XINPUT_CAPABILITIES,
  XINPUT_KEYSTROKE,
  XINPUT_VIBRATION_EX,
  APP_LOCAL_DEVICE_ID
} from "./struct.js";

const XInput = dlopenEx("GameInput", [
    /*
    "", 
    "Redist"
    */
    
    /*
    "GameInput.dll", //XInputOnGameInput (GDK); Not yet implemented on Desktop win32 as redist dll ? only GameInputCreate() is exported.
    "GameInputRedist.dll", // ?
    NB: files are signed and in system32 and C:\Program Files (x86)\Microsoft GameInput\x64|x86
    */  
], {
  /*
    XInputOnGameInput (GDK) | https://learn.microsoft.com/en-us/gaming/gdk/_content/gc/reference/input/xinputongameinput/xinputongameinput_members
    The GameInput API is C++ and uses interfaces; although these interfaces may look like COM, they aren't.
  */
  XInputEnable: {
    parameters: ["BOOL"]
  },
  //XInputGetAudioDeviceIds | "This function is not yet implemented"
  XInputGetBatteryInformation: {
    result: "DWORD", 
    parameters: ["DWORD", "BYTE", pointer(XINPUT_BATTERY_INFORMATION, "out")]
  },
  XInputGetCapabilities: {
    result: "DWORD", 
    parameters: ["DWORD", "DWORD", pointer(XINPUT_CAPABILITIES, "out")]
  },
  XInputGetDeviceId: {
    result: "DWORD", 
    parameters: ["DWORD", pointer(APP_LOCAL_DEVICE_ID, "out")]
  },
  XInputGetKeystroke: {
    result: "DWORD", 
    parameters: ["DWORD", "DWORD", pointer(XINPUT_KEYSTROKE, "out")]
  },
  XInputGetState: {
    result: "DWORD", 
    parameters: ["DWORD", pointer(XINPUT_STATE, "out")]
  },
  XInputGetStateWithToken: {
    result: "DWORD", 
    parameters: ["DWORD", "uint64", pointer(XINPUT_STATE, "out")]
  },
  XInputOnGameInputInitialize: {
    result: "HRESULT"
  },
  XInputOnGameInputUninitialize: {},
  XInputSetState: {
    result: "DWORD", 
    parameters: ["DWORD", pointer(XINPUT_VIBRATION, "inout")]
  },
  XInputSetStateEx: {
    result: "DWORD", 
    parameters: ["DWORD", pointer(XINPUT_VIBRATION_EX)]
  }
});

export { XInput };