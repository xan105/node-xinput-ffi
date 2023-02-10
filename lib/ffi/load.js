/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

import koffi from "koffi";
import { Failure } from "@xan105/error";
import { isWindows } from "@xan105/is";
import { shouldObj } from "@xan105/is/assert";
import { asBoolean } from "@xan105/is/opt";

function load(option = {}){
  
  shouldObj(option);
  
  const options = {
    XInputOnGameInput: asBoolean(option.XInputOnGameInput) ?? false
  };
  
  const versions = { 
    XInput: [
      //"Uap", //XInput for UWP but UWP App should use the Windows.Gaming.Input namespace (WinRT) instead.
      "1_4", 
      "1_3",
      //"1_2", // ? Not listed in MS doc
      //"1_1" // ? Not listed in MS doc
      "9_1_0"
    ],
    XInputOnGameInput: [
      //"GameInput.dll", //XInputOnGameInput (GDK); Not yet implemented on Desktop win32 as redist dll ? only GameInputCreate() is exported.
      //"GameInputRedist.dll", // ?
      //NB: files are signed and in system32 and C:\Program Files (x86)\Microsoft GameInput\x64|x86
    ]
  };
  
  //Load dynamic library
  if(isWindows()){
    const api = options.XInputOnGameInput ? versions.XInputOnGameInput : versions.XInput;
    for (const version of api) {
      try{
        const name = options.XInputOnGameInput ? version : "xinput" + version;
        return koffi.load(name + ".dll");
      }catch{
        continue; //Ignore missing
      }
    }
  }
  return undefined;
}

function dlopen(option){
  const abi = load(option);
  return function(...args){
    try{
      if(typeof abi?.stdcall === "function")
        return abi.stdcall(...args); //__stdcall calling convention to call Win32 API functions (x86)
      else
        return undefined;
    }catch(err){
      if (err.message.startsWith("Cannot find function") && err.message.endsWith("in shared library"))
        return undefined; //Ignore missing name or ordinal from dll
     else
        throw new Failure(err.message, {code: 0, cause: err});
    }
  }
}

export { dlopen };