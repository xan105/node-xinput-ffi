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
  XINPUT_CAPABILITIES_EX
} from "./data/XInputStruct.js";

const Versions = [
  "xinput1_4", //Windows 8
  "xinput1_3", //Windows 7 (DirectX SDK)
  "xinput9_1_0", //Windows Vista (Legacy)
];

const FunctionDeclaration = {
  //1_4, 1_3 | https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputenable
  XInputEnable: ["void", ["bool"]],
  //1_4, 1_3, 9_1_0 | https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputgetstate
  XInputGetState: [DWORD, [DWORD, ref.refType(XINPUT_STATE)]],
  // 1_4, 9_1_0 | https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputsetstate
  XInputSetState: [DWORD, [DWORD, ref.refType(XINPUT_VIBRATION)]],
  //1_4 | https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputgetbatteryinformation
  XInputGetBatteryInformation: [DWORD, [DWORD, BYTE, ref.refType(XINPUT_BATTERY_INFORMATION)]],
  //1_4, 1_3, 9_1_0 | https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputgetcapabilities
  XInputGetCapabilities: [DWORD, [DWORD, DWORD, ref.refType(XINPUT_CAPABILITIES)]],
  //1_4 | Undocumented: //https://stackoverflow.com/questions/64251320/is-it-possible-to-get-an-xinput-devices-name-product-id-vendor-id-or-some-oth/68879988#68879988
  //ordinal(108) //https://reverseengineerlog.blogspot.com/2016/06/xinputs-hidden-functions.html
  //_XInputGetCapabilitiesEx: [DWORD, [DWORD, DWORD, DWORD, ref.refType(XINPUT_CAPABILITIES_EX)]]
};



let lib;
for (const version of Versions) {
  try {
    lib = ffi.Library(version, FunctionDeclaration);
    //console.log(version);
    break;
  } catch(err) {
    //console.error(err);
    lib = null;
  }
}
if (!lib) throw new Failure("Can't find xinput1_4.dll, xinput1_3.dll or xinput9_1_0.dll ! Please verify your system and/or update your DirectX Runtime","ERR_LOADING_XINPUT");

export { lib };