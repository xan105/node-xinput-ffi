/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

import ffi from "ffi-napi";
import ref from "ref-napi";
import { Failure } from "@xan105/error";

//Types
import { DWORD, BYTE } from "../data/WindowsDataTypes.js";
import {
  XINPUT_STATE,
  XINPUT_VIBRATION,
  XINPUT_BATTERY_INFORMATION,
  XINPUT_CAPABILITIES,
  XINPUT_CAPABILITIES_EX,
  XINPUT_BASE_BUS_INFORMATION
} from "../data/XInputStruct.js";

/*
XInputEnable | https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputenable
XInputGetBatteryInformation | https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputgetbatteryinformation
XInputGetCapabilities | https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputgetcapabilities
XInputGetState | https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputgetstate
XInputSetState | https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputsetstate
*/
const functionSymbol = [
{
  XInputEnable: ["void", ["bool"]],
  XInputGetBatteryInformation: [DWORD, [DWORD, BYTE, ref.refType(XINPUT_BATTERY_INFORMATION)]]
},
{
  XInputGetCapabilities: [DWORD, [DWORD, DWORD, ref.refType(XINPUT_CAPABILITIES)]],
  XInputGetState: [DWORD, [DWORD, ref.refType(XINPUT_STATE)]],
  XInputSetState: [DWORD, [DWORD, ref.refType(XINPUT_VIBRATION)]]
},
{
  /*XInput hidden function | https://reverseengineerlog.blogspot.com/2016/06/xinputs-hidden-functions.html
  Can only be accessed by ordinal. As of this writing node-ffi(-napi) can only do it by name (?).*/
  XInputGetStateEx: [DWORD, [DWORD, ref.refType(XINPUT_STATE)]], //ordinal 100
  XInputWaitForGuideButton: [DWORD, [DWORD, DWORD, ref.refType(ref.types.void)]], //ordinal 101
  XInputCancelGuideButtonWait: [DWORD, [DWORD]], //ordinal 102
  XInputPowerOffController: [DWORD, [DWORD]], //ordinal 103
  XInputGetBaseBusInformation: [DWORD, [DWORD, ref.refType(XINPUT_BASE_BUS_INFORMATION)]], //ordinal 104
  XInputGetCapabilitiesEx: [DWORD, [DWORD, DWORD, DWORD, ref.refType(XINPUT_CAPABILITIES_EX)]] //ordinal 108
}
];

const versions = [
  {
    name: "xinput1_4", //Windows 8
    fn: {...functionSymbol[0], ...functionSymbol[1]},
    hidden: functionSymbol[2]
  },
  {
    name: "xinput1_3", //Windows 7 (DirectX SDK)
    fn: {...functionSymbol[0], ...functionSymbol[1]}
  },
  {
    name: "xinput9_1_0", //Windows Vista (Legacy)
    fn: functionSymbol[1]
  }
];

let lib;
for (const version of versions) {
  try {
    lib = ffi.Library(version.name, version.fn);
    break;
  } catch {
    lib = null;
  }
}

if (!lib) throw new Failure("Can't find xinput1_4.dll, xinput1_3.dll or xinput9_1_0.dll ! Please verify your system and/or update your DirectX Runtime","ERR_LOADING_XINPUT");

export { lib };