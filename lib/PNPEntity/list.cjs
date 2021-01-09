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

const Vendor = require("./vendor.json");

const { Win32_PNPEntity, getInterface, getVID, getPID } = require("./common.cjs");

async function listKnownDevice() {
  //Get all PNP devices which are HID or USB
  const PNPentities = await Win32_PNPEntity("^(HID|USB).+");

  //Parsing output
  let devices = [];

  for (let PNPentity of PNPentities) {
    if (PNPentity.deviceID.includes("VID_") && PNPentity.deviceID.includes("PID_")) {
      //Virtual devices, ROOT_HUB, etc don't have VID,PID

      //Extract values
      const Interface = getInterface(PNPentity.deviceID);
      const VID = getVID(PNPentity.deviceID);
      const PID = getPID(PNPentity.deviceID);
      const isXInput = PNPentity.deviceID.includes("IG_") ? true : false;

      const doublon = devices.find((device) => device.vid === VID && device.pid === PID);

      if (!doublon) {
        const brand = Vendor.find((vendor) => vendor.id === VID);
        if (brand) {
          const controller = brand.controller.find((controller) => controller.id === PID);
          if (controller) {
            const device = {
              manufacturer: brand.name,
              name: controller.name,
              vid: VID,
              pid: PID,
              interfaces: [Interface],
              guid: [PNPentity.classGuid],
              xinput: isXInput,
            };
            devices.push(device);
          }
        }
      } else {
        if (!doublon.interfaces.includes(Interface)) doublon.interfaces.push(Interface);

        if (!doublon.guid.includes(PNPentity.classGuid)) doublon.guid.push(PNPentity.classGuid);
      }
    }
  }

  return devices;
}

async function listXInput() {
  //Get all PNP devices where device ID contains "IG_" because if it does then it's an XInput device.
  const PNPentities = await Win32_PNPEntity("IG_");

  //Parsing output
  let devices = [];

  for (let PNPentity of PNPentities) {
    if (PNPentity.deviceID.includes("VID_") && PNPentity.deviceID.includes("PID_")) {
      //Better safe than sorry

      //Extract values
      const Interface = getInterface(PNPentity.deviceID);
      const VID = getVID(PNPentity.deviceID);
      const PID = getPID(PNPentity.deviceID);

      const doublon = devices.find(
        (device) => device.guid === PNPentity.classGuid && device.vid === VID && device.pid === PID
      );

      if (!doublon) {
        let device = {
          guid: PNPentity.classGuid,
          vid: VID,
          pid: PID,
          interfaces: [Interface],
          manufacturer:
            PNPentity.manufacturer.startsWith("(") && PNPentity.manufacturer.endsWith(")")
              ? null
              : PNPentity.manufacturer,
        };

        const brand = Vendor.find((vendor) => vendor.id === device.vid);
        if (brand) {
          if (!device.manufacturer) device.manufacturer = brand.name;
          const controller = brand.controller.find((controller) => controller.id === device.pid);
          if (controller) device.name = controller.name;
        }

        devices.push(device);
      } else if (!doublon.interfaces.includes(Interface)) {
        doublon.interfaces.push(Interface);
      }
    }
  }

  return devices;
}

module.exports = { listKnownDevice, listXInput };
