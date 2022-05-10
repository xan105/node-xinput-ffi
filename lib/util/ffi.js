/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

import ffi from "ffi-napi";
import ref from "ref-napi";
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
  XINPUT_CAPABILITIES_EX,
  XINPUT_BASE_BUS_INFORMATION
} from "../data/XInputStruct.js";

function load(){
  for (const version of ["1_4", "1_3", "9_1_0"]) {
    try{
      return new ffi.DynamicLibrary("xinput" + version + ".dll", ffi.DynamicLibrary.FLAGS.RTLD_NOW);
    }catch{ //Ignore missing
      continue;
    }
  }
  throw new Failure("XInput library could not be found! Please verify your system and/or update your DirectX Runtime","ERR_LOADING_XINPUT");
}

const lib = load();

function call(name, resultType, paramType){
  try{
    const fptr = lib.get(name);
    if (fptr.isNull()) return null;
    return ffi.ForeignFunction(fptr, resultType, paramType);
  }catch{ //Ignore missing
    return null;
  }
}

/*
  XInputEnable | https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputenable
  XInputGetBatteryInformation | https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputgetbatteryinformation
  XInputGetCapabilities | https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputgetcapabilities
  XInputGetState | https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputgetstate
  XInputSetState | https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputsetstate
  "Hidden" functions | https://reverseengineerlog.blogspot.com/2016/06/xinputs-hidden-functions.html
*/

const XInputEnable = call("XInputEnable", "void", ["bool"]);
const XInputGetBatteryInformation = call("XInputGetBatteryInformation", DWORD, [DWORD, BYTE, ref.refType(XINPUT_BATTERY_INFORMATION)]);
const XInputGetCapabilities = call("XInputGetCapabilities", DWORD, [DWORD, DWORD, ref.refType(XINPUT_CAPABILITIES)]);
const XInputGetState = call("XInputGetState", DWORD, [DWORD, ref.refType(XINPUT_STATE)]);
const XInputSetState = call("XInputSetState", DWORD, [DWORD, ref.refType(XINPUT_VIBRATION)]);
const XInputGetStateEx = call("100", DWORD, [DWORD, ref.refType(XINPUT_STATE)]);
const XInputWaitForGuideButton = call("101", DWORD, [DWORD, DWORD, ref.refType(ref.types.void)]);
const XInputCancelGuideButtonWait = call("102", DWORD, [DWORD]);
const XInputPowerOffController = call("103", DWORD, [DWORD]);
const XInputGetBaseBusInformation = call("104", DWORD, [DWORD, ref.refType(XINPUT_BASE_BUS_INFORMATION)]);
const XInputGetCapabilitiesEx = call("108", DWORD, [DWORD, DWORD, DWORD, ref.refType(XINPUT_CAPABILITIES_EX)]);

export {
  XInputEnable,
  XInputGetBatteryInformation,
  XInputGetCapabilities,
  XInputGetState,
  XInputSetState,
  XInputGetStateEx,
  XInputWaitForGuideButton,
  XInputCancelGuideButtonWait,
  XInputPowerOffController,
  XInputGetBaseBusInformation,
  XInputGetCapabilitiesEx
};