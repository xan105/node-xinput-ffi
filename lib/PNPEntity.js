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

import { promisify } from "node:util";
import { exec } from "node:child_process";
import { hardware } from "./data/HardwareID.js";

async function Win32_PNPEntity(match) {
  const WMI_query = `Get-CimInstance -ClassName Win32_PNPEntity | Where-Object DeviceID -Match '${match}' | Select-Object -Property ClassGuid, DeviceID, Manufacturer | Format-List`;

  const ps = await promisify(exec)(`powershell -NoProfile "${WMI_query}"`, {windowsHide: true});
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

function getInterface(string) {
  return string.substring(0, string.indexOf("\\"));
}

function getVID(string) {
  return string.match(/VID_([\da-fA-F]{4})/)[0].replace("VID_", "");
}
function getPID(string) {
  return string.match(/PID_([\da-fA-F]{4})/)[0].replace("PID_", "");
}

async function listDevices() {
  //Get all PNP devices which are HID or USB
  const PNPentities = await Win32_PNPEntity("^(HID|USB).+");

  //Parsing output
  let devices = [];

  for (const PNPentity of PNPentities) {
    
    //Virtual devices, ROOT_HUB, etc don't have VID,PID
    if (PNPentity.deviceID.includes("VID_") && PNPentity.deviceID.includes("PID_")) { 

      //Extract values
      const Interface = getInterface(PNPentity.deviceID);
      const VID = getVID(PNPentity.deviceID);
      const PID = getPID(PNPentity.deviceID);
      const isXInput = PNPentity.deviceID.includes("IG_") ? true : false;

      const doublon = devices.find((device) => device.vid === VID && device.pid === PID);
      if (!doublon) 
      { 
        const brand = hardware.find((vendor) => vendor.id === VID);
        if (brand) {
          const controller = brand.controller.find((controller) => controller.id === PID);
          if (controller) {
            const device = {
              manufacturer: brand.name,
              name: controller.name,
              vid: VID,
              pid: PID,
              xinput: isXInput,
              interfaces: [Interface],
              guid: [PNPentity.classGuid]
            };
            devices.push(device);
          }
        }

      } 
      else 
      {
        if (!doublon.interfaces.includes(Interface)) 
          doublon.interfaces.push(Interface);
        if (!doublon.guid.includes(PNPentity.classGuid)) 
          doublon.guid.push(PNPentity.classGuid);
        if (!doublon.isXInput && isXInput)
          doublon.xinput = true;
      }
    }
  }

  return devices;
}

export { listDevices };