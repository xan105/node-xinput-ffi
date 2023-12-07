/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

import { dlopen } from "@xan105/ffi/koffi";
import { isWindows } from "@xan105/is";
import {
  shouldObj,
  shouldStringNotEmpty,
  shouldArrayOfStringNotEmpty 
} from "@xan105/is/assert";

function dlopenEx(api, versions, symbols, option = {}){
  
  shouldStringNotEmpty(api);
  shouldArrayOfStringNotEmpty(versions);
  shouldObj(option);
  
  if(isWindows()){
    for (const version of versions){
      try{
        return dlopen(api + version, symbols, {
          ...option,
          ignoreLoadingFail: false,
          ignoreMissingSymbol: true,
          stub: false
        });
      }catch{
        continue;
      }
    }
  }
  return Object.create(null);
}

export { dlopenEx };