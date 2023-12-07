/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

import { pointer } from "@xan105/ffi/koffi";
import {
  XINPUT_STATE,
  XINPUT_VIBRATION,
  XINPUT_BATTERY_INFORMATION,
  XINPUT_CAPABILITIES,
  XINPUT_KEYSTROKE,
  XINPUT_CAPABILITIES_EX,
  XINPUT_BASE_BUS_INFORMATION,
  XINPUT_LISTEN_STATE
} from "./struct.js";

/*
The XInput API is a collection of flat C functions.
    
XInputEnable | https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputenable
XInputGetAudioDeviceIds | deprecated: doesn't work on modern Windows system.
XInputGetBatteryInformation | https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputgetbatteryinformation
XInputGetCapabilities | https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputgetcapabilities
XInputGetDSoundAudioDeviceGuids | deprecated: doesn't work on modern Windows system.
XInputGetKeystroke | https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputgetkeystroke
XInputGetState | https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputgetstate
XInputSetState | https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputsetstate
*/

export const symbols = {
    XInputEnable: { //1_4, 1_3
      parameters: ["BOOL"]
    },
    XInputGetBatteryInformation: { //1_4, 1_3
      result: "DWORD", 
      parameters: ["DWORD", "BYTE", pointer(XINPUT_BATTERY_INFORMATION, "out")]
    },
    XInputGetCapabilities: { //1_4, 1_3, 9_1_0
      result: "DWORD", 
      parameters: ["DWORD", "DWORD", pointer(XINPUT_CAPABILITIES, "out")]
    },
    XInputGetKeystroke: { //1_4, 1_3
      result: "DWORD", 
      parameters: ["DWORD", "DWORD", pointer(XINPUT_KEYSTROKE, "out")]
    },
    XInputGetState: { //1_4, 1_3, 9_1_0
      result: "DWORD", 
      parameters: ["DWORD", pointer(XINPUT_STATE, "out")]
    }, 
    XInputSetState: { //1_4, 1_3, 9_1_0
      result: "DWORD", 
      parameters: ["DWORD", pointer(XINPUT_VIBRATION, "inout")] 
    },   
    //"Hidden" functions | https://reverseengineerlog.blogspot.com/2016/06/xinputs-hidden-functions.html
    XInputGetStateEx: { //1_4, 1_3
      result: "DWORD", 
      parameters: ["DWORD", pointer(XINPUT_STATE, "out")],
      symbol: 100
    },
    XInputWaitForGuideButton: { //1_4, 1_3
      result: "DWORD", 
      parameters: ["DWORD", "DWORD", pointer(XINPUT_LISTEN_STATE, "out")],
      symbol: 101
    },
    XInputCancelGuideButtonWait: { //1_4, 1_3
      result: "DWORD", 
      parameters: ["DWORD"],
      symbol: 102
    },
    XInputPowerOffController: { //1_4, 1_3
      result: "DWORD", 
      parameters: ["DWORD"],
      symbol: 103
    },
    XInputGetBaseBusInformation: { //1_4
      result: "DWORD", 
      parameters: ["DWORD", pointer(XINPUT_BASE_BUS_INFORMATION, "out")],
      symbol: 104
    },
    XInputGetCapabilitiesEx: { //1_4 
      result: "DWORD", 
      parameters: ["DWORD", "DWORD", "DWORD", pointer(XINPUT_CAPABILITIES_EX, "out")],
      symbol: 108
    }
};