/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

import ffi from "ffi-napi";
import { Failure } from "@xan105/error";
import { functionSymbol } from "../data/XInputFn.js";

let lib;
for (const version of Object.keys(functionSymbol)) {
  try {
    lib = ffi.Library(version, functionSymbol[version]);
    break;
  } catch {
    lib = null;
  }
}

if (!lib) throw new Failure("Can't find xinput1_4.dll, xinput1_3.dll or xinput9_1_0.dll ! Please verify your system and/or update your DirectX Runtime","ERR_LOADING_XINPUT");

export { lib };