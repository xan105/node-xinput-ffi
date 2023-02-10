/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

import koffi from "koffi";

const DWORD = koffi.types.long;
const BOOL = koffi.types.int;
const WORD = koffi.types.uint16;
const SHORT = koffi.types.int16;
const BYTE = koffi.types.uint8;
const WCHAR = koffi.types.char16;

export { 
  DWORD,
  DWORD as HRESULT,
  BOOL,
  WORD, 
  BYTE, 
  SHORT, 
  WCHAR 
};