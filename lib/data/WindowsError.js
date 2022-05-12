/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

// System Error Codes (0-499) (WinError.h)
// https://docs.microsoft.com/en-us/windows/win32/debug/system-error-codes--0-499-

function ERROR(code) {
  return {
    0: ["The operation completed successfully", "ERR_SUCCESS"],
    120: ["This function is not supported on this system", "ERR_CALL_NOT_IMPLEMENTED"],
    160: ["One or more arguments are not correct", "ERR_BAD_ARGUMENTS"],
    //XInput Errors
    1167: ["The device is not connected", "ERR_DEVICE_NOT_CONNECTED"],
    4306: ["No new keys have been pressed", "ERR_EMPTY"]
  }[code] ?? [`Error ${code} (0x${code.toString(16).toUpperCase()})`,"ERR_UNEXPECTED"];
};

export { ERROR };