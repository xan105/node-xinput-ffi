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

"use strict";

const util = require("util");
const { exec } = require("child_process");

async function Win32_PNPEntity(match){

  const WMI_query =
    `Get-CimInstance -ClassName Win32_PNPEntity | Where-Object DeviceID -Match '${match}' | Select-Object -Property ClassGuid, DeviceID, Manufacturer | Format-List`;

  const ps = await util.promisify(exec)(`powershell -NoProfile "${WMI_query}"`, {
    windowsHide: true,
  });
  if (ps.stderr) throw ps.stderr;

  //Cleaning output
  const output = ps.stdout.split("\r\n\r\n").filter((line) => line != ""); //Filter out blank space

  const PNPentities = output.map((line) => {
    const col = line.trim().split("\r\n");
    const getValue = (string) => string.substring(string.indexOf(":") + 1, string.length).trim();

    return {
      classGuid: getValue(col[0]),
      deviceID: getValue(col[1]),
      manufacturer: getValue(col[2]),
    };
  });
  
  return PNPentities;
}

function getInterface(string){
	return string.substring(0, string.indexOf("\\"));
}

function getVID(string){
	return string.match(/VID_([\da-fA-F]{4})/)[0].replace("VID_", "");
}
function getPID(string){
	return string.match(/PID_([\da-fA-F]{4})/)[0].replace("PID_", "");
}

module.exports = { Win32_PNPEntity, getInterface, getVID, getPID };