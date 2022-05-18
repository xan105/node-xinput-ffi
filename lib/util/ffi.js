/*
Copyright (c) Anthony Beaumont
This source code is licensed under the GNU AFFERO GENERAL PUBLIC LICENSE Version 3
found in the LICENSE file in the root directory of this source tree.
*/

import koffi from "koffi";
import { Failure } from "@xan105/error";

//Types
import { 
  DWORD, 
  BYTE
} from "../data/WindowsDataTypes.js";
import {
  XINPUT_STATE,
  XINPUT_VIBRATION,
  XINPUT_BATTERY_INFORMATION,
  XINPUT_CAPABILITIES,
  XINPUT_KEYSTROKE,
  XINPUT_CAPABILITIES_EX,
  XINPUT_BASE_BUS_INFORMATION
} from "../data/XInputStruct.js";

//Load xinput dynamic library
function load(){
  for (const version of ["1_4", "1_3", "9_1_0"]) {
    try{
      return koffi.load("xinput" + version + ".dll");
    }catch{
      continue; //Ignore missing
    }
  }
  throw new Failure("Failed to load XInput library! Please verify your system and/or update your DirectX Runtime","ERR_LOADING_XINPUT");
}
const { stdcall } = load(); // __stdcall calling convention to call Win32 API functions.

//Calling functions
function call(...args){
  try{
    return stdcall(...args);
  }catch(err){
    if (err.message.startsWith("Cannot find function") && err.message.endsWith("in shared library"))
      return null; //Ignore missing
    else
      throw new Failure(err.message, {code: 0, cause: err});
  }
}

/*
  XInputEnable | https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputenable
  XInputGetAudioDeviceIds | deprecated: doesn't work on modern Windows system.
  XInputGetBatteryInformation | https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputgetbatteryinformation
  XInputGetCapabilities | https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputgetcapabilities
  XInputGetDSoundAudioDeviceGuids | deprecated: doesn't work on modern Windows system.
  XInputGetKeystroke | https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputgetkeystroke
  XInputGetState | https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputgetstate
  XInputSetState | https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputsetstate
  "Hidden" functions | https://reverseengineerlog.blogspot.com/2016/06/xinputs-hidden-functions.html
*/
const XInputEnable = call("XInputEnable", "void", ["bool"]); //1_4, 1_3
const XInputGetBatteryInformation = call("XInputGetBatteryInformation", DWORD, [DWORD, BYTE, koffi.out(koffi.pointer(XINPUT_BATTERY_INFORMATION))]); //1_4, 1_3
const XInputGetCapabilities = call("XInputGetCapabilities", DWORD, [DWORD, DWORD, koffi.out(koffi.pointer(XINPUT_CAPABILITIES))]); //1_4, 1_3, 9_1_0
const XInputGetKeystroke = call("XInputGetKeystroke", DWORD, [DWORD, DWORD, koffi.out(koffi.pointer(XINPUT_KEYSTROKE))]); //1_4, 1_3
const XInputGetState = call("XInputGetState", DWORD, [DWORD, koffi.out(koffi.pointer(XINPUT_STATE))]); //1_4, 1_3, 9_1_0
const XInputSetState = call("XInputSetState", DWORD, [DWORD, koffi.inout(koffi.pointer(XINPUT_VIBRATION))]); //1_4, 1_3, 9_1_0
const XInputGetStateEx = call(100, DWORD, [DWORD, koffi.out(koffi.pointer(XINPUT_STATE))]); //1_4, 1_3
const XInputWaitForGuideButton = call(101, DWORD, [DWORD, DWORD, koffi.pointer("void")]); //1_4, 1_3
const XInputCancelGuideButtonWait = call(102, DWORD, [DWORD]); //1_4, 1_3
const XInputPowerOffController = call(103, DWORD, [DWORD]); //1_4, 1_3
const XInputGetBaseBusInformation = call(104, DWORD, [DWORD, koffi.out(koffi.pointer(XINPUT_BASE_BUS_INFORMATION))]); //1_4
const XInputGetCapabilitiesEx = call(108, DWORD, [DWORD, DWORD, DWORD, koffi.out(koffi.pointer(XINPUT_CAPABILITIES_EX))]); //1_4

export {
  XInputEnable,
  XInputGetBatteryInformation,
  XInputGetCapabilities,
  XInputGetKeystroke,
  XInputGetState,
  XInputSetState,
  XInputGetStateEx,
  XInputWaitForGuideButton,
  XInputCancelGuideButtonWait,
  XInputPowerOffController,
  XInputGetBaseBusInformation,
  XInputGetCapabilitiesEx
};