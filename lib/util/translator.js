/*
Copyright (c) Anthony Beaumont
This source code is licensed under the GNU AFFERO GENERAL PUBLIC LICENSE Version 3
found in the LICENSE file in the root directory of this source tree.
*/

import { windowsErrCodes } from "@xan105/error";

function bitwise(code, list) {
  let result = [];
  
  for (const [name, value] of Object.entries(list))
    if (code & value) result.push(name);
    
  return result;
}

function ERROR(code){
  return [ 
    windowsErrCodes[code]?.[0] ?? `Error ${code} (0x${code.toString(16).toUpperCase()})`, { code: 
    windowsErrCodes[code]?.[1] ?? null, info: "Foreign function interface" } 
  ];
}

export { bitwise, ERROR };
export * from "../data/XInputCode.js";