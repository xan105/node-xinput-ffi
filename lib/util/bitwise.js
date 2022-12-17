/*
Copyright (c) Anthony Beaumont
This source code is licensed under the GNU AFFERO GENERAL PUBLIC LICENSE Version 3
found in the LICENSE file in the root directory of this source tree.
*/

function bitwise(code, list) {
  let result = [];
  
  for (const [value, name] of Object.entries(list))
    if (code & value) result.push(name);
    
  return result;
}

export { bitwise };