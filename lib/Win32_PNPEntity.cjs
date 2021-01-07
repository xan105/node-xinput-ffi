"use strict";

const util = require("util");
const { exec } = require("child_process");

async function list() {
  //Get all PNP device where device ID contains "IG_" because if it does then it's an XInput device.
  const WMI_query =
    "Get-CimInstance -ClassName Win32_PNPEntity | Where-Object DeviceID -Match 'IG_' | Select-Object -Property ClassGuid, DeviceID, Manufacturer | Format-List";

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

  //Parsing output
  let devices = [];

  for (let PNPentity of PNPentities) {
    //Extract values
    const Interface = PNPentity.deviceID.substring(0, PNPentity.deviceID.indexOf("\\"));
    const VID = PNPentity.deviceID.match(/VID_([\da-fA-F]{4})/)[0].replace("VID_", "");
    const PID = PNPentity.deviceID.match(/PID_([\da-fA-F]{4})/)[0].replace("PID_", "");

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

      devices.push(device);
    } else {
      doublon.interfaces.push(Interface);
    }
  }

  return devices;
}

module.exports = { list };
