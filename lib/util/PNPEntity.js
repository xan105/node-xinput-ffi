/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

import { promisify } from "node:util";
import { exec } from "node:child_process";
import { Failure } from "@xan105/error";
import { hardware } from "../data/HardwareID.js";

async function Win32_PNPEntity(match) {
  const WMI_query = `Get-CimInstance -ClassName Win32_PNPEntity | Where-Object DeviceID -Match '${match}' | Select-Object -Property ClassGuid, DeviceID, Manufacturer | Format-List`;

  const ps = await promisify(exec)(`powershell -NoProfile "${WMI_query}"`, {windowsHide: true});
  if (ps.stderr) throw new Failure(ps.stderr, "ERR_UNEXPECTED_POWERSHELL_FAIL");

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