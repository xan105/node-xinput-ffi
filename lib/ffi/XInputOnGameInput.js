/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

import koffi from "koffi";
import { dlopen } from "./load.js";
//Types
import { DWORD, BOOL, HRESULT, BYTE } from "./windows.js";
import {
  XINPUT_STATE,
  XINPUT_VIBRATION,
  XINPUT_BATTERY_INFORMATION,
  XINPUT_CAPABILITIES,
  XINPUT_KEYSTROKE,
  XINPUT_VIBRATION_EX,
  APP_LOCAL_DEVICE_ID
} from "./struct.js";

const call = dlopen({XInputOnGameInput: true}); 

/*
  XInputOnGameInput (GDK) | https://learn.microsoft.com/en-us/gaming/gdk/_content/gc/reference/input/xinputongameinput/xinputongameinput_members
  The GameInput API is C++ and uses interfaces; although these interfaces may look like COM, they aren't.
*/

const XInputEnable = call("XInputEnable", "void", [BOOL]);
//XInputGetAudioDeviceIds | "This function is not yet implemented"
const XInputGetBatteryInformation = call("XInputGetBatteryInformation", DWORD, [DWORD, BYTE, koffi.out(koffi.pointer(XINPUT_BATTERY_INFORMATION))]);
const XInputGetCapabilities = call("XInputGetCapabilities", DWORD, [DWORD, DWORD, koffi.out(koffi.pointer(XINPUT_CAPABILITIES))]);
const XInputGetDeviceId = call("XInputGetDeviceId", DWORD, [DWORD, koffi.out(koffi.pointer(APP_LOCAL_DEVICE_ID))]);
const XInputGetKeystroke = call("XInputGetKeystroke", DWORD, [DWORD, DWORD, koffi.out(koffi.pointer(XINPUT_KEYSTROKE))]);
const XInputGetState = call("XInputGetState", DWORD, [DWORD, koffi.out(koffi.pointer(XINPUT_STATE))]);
const XInputGetStateWithToken = call("XInputGetStateWithToken", DWORD, [DWORD, koffi.types.uint64, koffi.out(koffi.pointer(XINPUT_STATE))]);
const XInputOnGameInputInitialize = call("XInputOnGameInputInitialize", HRESULT, []);
const XInputOnGameInputUninitialize  = call("XInputOnGameInputUninitialize", "void", []);
const XInputSetState = call("XInputSetState", DWORD, [DWORD, koffi.inout(koffi.pointer(XINPUT_VIBRATION))]);
const XInputSetStateEx = call("XInputSetStateEx", DWORD, [DWORD, koffi.in(koffi.pointer(XINPUT_VIBRATION_EX))]);

export {
  XInputEnable,
  XInputGetBatteryInformation,
  XInputGetCapabilities,
  XInputGetDeviceId,
  XInputGetKeystroke,
  XInputGetState,
  XInputGetStateWithToken,
  XInputOnGameInputInitialize,
  XInputOnGameInputUninitialize,
  XInputSetState,
  XInputSetStateEx 
};