/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

import { dlopen } from "@xan105/ffi/koffi";
import { isWindows } from "@xan105/is";
import { 
  shouldStringNotEmpty,
  shouldArrayOfStringNotEmpty 
} from "@xan105/is/assert";

function dlopenEx(api, versions, symbols){
  
  shouldStringNotEmpty(api);
  shouldArrayOfStringNotEmpty(versions);
  
  if(isWindows()){
    for (const version of versions){
      try{
        return dlopen(api + version, symbols, { 
          abi: "stdcall", //__stdcall calling convention to call Win32 API functions (x86)
          ignoreMissing: true //Ignore missing name or ordinal from dll
        });
      }catch{
        continue;
      }
    }
  }
  return Object.create(null);
}

export { dlopenEx };