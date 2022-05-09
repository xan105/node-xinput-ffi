/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

import ref from "ref-napi";
import { DWORD, BYTE } from "./WindowsDataTypes.js";
import {
  XINPUT_STATE,
  XINPUT_VIBRATION,
  XINPUT_BATTERY_INFORMATION,
  XINPUT_CAPABILITIES,
  //XINPUT_CAPABILITIES_EX,
  //XINPUT_BASE_BUS_INFORMATION
} from "./XInputStruct.js";

/*
XInputEnable | https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputenable
XInputGetBatteryInformation | https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputgetbatteryinformation
XInputGetCapabilities | https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputgetcapabilities
XInputGetState | https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputgetstate
XInputSetState | https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputsetstate
*/

const functionSymbol = {
  "xinput1_4": {
    XInputEnable: ["void", ["bool"]],
    XInputGetBatteryInformation: [DWORD, [DWORD, BYTE, ref.refType(XINPUT_BATTERY_INFORMATION)]],
    XInputGetCapabilities: [DWORD, [DWORD, DWORD, ref.refType(XINPUT_CAPABILITIES)]],
    XInputGetState: [DWORD, [DWORD, ref.refType(XINPUT_STATE)]],
    XInputSetState: [DWORD, [DWORD, ref.refType(XINPUT_VIBRATION)]]
    /*XInput hidden function | https://reverseengineerlog.blogspot.com/2016/06/xinputs-hidden-functions.html
    Can only be accessed by ordinal. As of this writing node-ffi(-napi) can only do it by name.*/
    /*XInputGetStateEx: [DWORD, [DWORD, ref.refType(XINPUT_STATE)]], //ordinal 100
    XInputWaitForGuideButton: [DWORD, [DWORD, DWORD, ref.refType(ref.types.void)]], //ordinal 101
    XInputCancelGuideButtonWait: [DWORD, [DWORD]], //ordinal 102
    XInputPowerOffController: [DWORD, [DWORD]], //ordinal 103
    XInputGetBaseBusInformation: [DWORD, [DWORD, ref.refType(XINPUT_BASE_BUS_INFORMATION)]], //ordinal 104
    XInputGetCapabilitiesEx: [DWORD, [DWORD, DWORD, DWORD, ref.refType(XINPUT_CAPABILITIES_EX)]] //ordinal 108*/
  },
  "xinput1_3": {
    XInputEnable: ["void", ["bool"]],
    XInputGetBatteryInformation: [DWORD, [DWORD, BYTE, ref.refType(XINPUT_BATTERY_INFORMATION)]],
    XInputGetCapabilities: [DWORD, [DWORD, DWORD, ref.refType(XINPUT_CAPABILITIES)]],
    XInputGetState: [DWORD, [DWORD, ref.refType(XINPUT_STATE)]],
    XInputSetState: [DWORD, [DWORD, ref.refType(XINPUT_VIBRATION)]]
  },
  "xinput9_1_0":{  
    XInputGetCapabilities: [DWORD, [DWORD, DWORD, ref.refType(XINPUT_CAPABILITIES)]],
    XInputGetState: [DWORD, [DWORD, ref.refType(XINPUT_STATE)]],
    XInputSetState: [DWORD, [DWORD, ref.refType(XINPUT_VIBRATION)]]
  }
};

export { functionSymbol };