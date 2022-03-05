/*
MIT License
Copyright (c) 2020-2021 Anthony Beaumont
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import ffi from "ffi-napi";
import ref from "ref-napi";
import { Failure } from "./util/error.js";

//Types
import { DWORD, BYTE } from "./data/WindowsDataTypes.js";
import {
  XINPUT_STATE,
  XINPUT_VIBRATION,
  XINPUT_BATTERY_INFORMATION,
  XINPUT_CAPABILITIES,
  XINPUT_CAPABILITIES_EX,
  XINPUT_BASE_BUS_INFORMATION
} from "./data/XInputStruct.js";

/*
XInputEnable | https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputenable
XInputGetBatteryInformation | https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputgetbatteryinformation
XInputGetCapabilities | https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputgetcapabilities
XInputGetState | https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputgetstate
XInputSetState | https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputsetstate
*/
const versions = [
  {
    name: "xinput1_4", //Windows 8
    fn: {
      XInputEnable: ["void", ["bool"]],
      XInputGetBatteryInformation: [DWORD, [DWORD, BYTE, ref.refType(XINPUT_BATTERY_INFORMATION)]],
      XInputGetCapabilities: [DWORD, [DWORD, DWORD, ref.refType(XINPUT_CAPABILITIES)]],
      XInputGetState: [DWORD, [DWORD, ref.refType(XINPUT_STATE)]],
      XInputSetState: [DWORD, [DWORD, ref.refType(XINPUT_VIBRATION)]]
    },
    hidden: { //XInput hidden function | https://reverseengineerlog.blogspot.com/2016/06/xinputs-hidden-functions.html
      XInputGetStateEx: [DWORD, [DWORD, ref.refType(XINPUT_STATE)]], //ordinal 100
      XInputWaitForGuideButton: [DWORD, [DWORD, DWORD, ref.refType(ref.types.void)]], //ordinal 101
      XInputCancelGuideButtonWait: [DWORD, [DWORD]], //ordinal 102
      XInputPowerOffController: [DWORD, [DWORD]], //ordinal 103
      XInputGetBaseBusInformation: [DWORD, [DWORD, ref.refType(XINPUT_BASE_BUS_INFORMATION)]], //ordinal 104
      //https://stackoverflow.com/questions/64251320/is-it-possible-to-get-an-xinput-devices-name-product-id-vendor-id-or-some-oth/68879988#68879988
      XInputGetCapabilitiesEx: [DWORD, [DWORD, DWORD, DWORD, ref.refType(XINPUT_CAPABILITIES_EX)]] //ordinal 108
    }
  },
  {
    name: "xinput1_3", //Windows 7 (DirectX SDK)
    fn: {
      XInputEnable: ["void", ["bool"]],
      XInputGetBatteryInformation: [DWORD, [DWORD, BYTE, ref.refType(XINPUT_BATTERY_INFORMATION)]],
      XInputGetCapabilities: [DWORD, [DWORD, DWORD, ref.refType(XINPUT_CAPABILITIES)]],
      XInputGetState: [DWORD, [DWORD, ref.refType(XINPUT_STATE)]],
      XInputSetState: [DWORD, [DWORD, ref.refType(XINPUT_VIBRATION)]]
    }
  },
  {
    name: "xinput9_1_0", //Windows Vista (Legacy)
    fn: {
      XInputGetCapabilities: [DWORD, [DWORD, DWORD, ref.refType(XINPUT_CAPABILITIES)]],
      XInputGetState: [DWORD, [DWORD, ref.refType(XINPUT_STATE)]],
      XInputSetState: [DWORD, [DWORD, ref.refType(XINPUT_VIBRATION)]],
    }
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