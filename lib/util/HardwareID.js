/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

const hardwareID = {
  0x045E: {
    name: "Microsoft Corp.",
    controller: {
      0x028E: "Xbox360 Controller",
      0x02A1: "Xbox360 Controller",
      0x028F: "Xbox360 Wireless Controller",
      0x02E0: "Xbox One S Controller",
      0x02FF: "Xbox One Elite Controller",
      0x0202: "Xbox Controller",
      0x0285: "Xbox Controller S",
      0x0289: "Xbox Controller S",
      0x02E3: "Xbox One Elite Controller",
      0x02EA: "Xbox One S Controller",
      0x02FD: "Xbox One S Controller",
      0x02D1: "Xbox One Controller",
      0x02DD: "Xbox One Controller",
      0x0B13: "Xbox Series X/S controller"
    }
  },
  0x054C: {
    name: "Sony Corp.",
    controller: {
      0x0268: "DualShock 3 / Sixaxis",
      0x05C4: "DualShock 4",
      0x09CC: "DualShock 4 (v2)",
      0x0BA0: "DualShock 4 USB Wireless Adaptor",
      0x0CE6: "DualSense Wireless Controller" //PS5
    }
  },
  0x057E: {
    name: "Nintendo Co., Ltd",
    controller: {
      0x0306: "Wii Remote Controller",
      0x0337: "Wii U GameCube Controller Adapter",
      0x2006: "Joy-Con L",
      0x2007: "Joy-Con R",
      0x2009: "Switch Pro Controller",
      0x200E: "Joy-Con Charging Grip",
    }
  },
  0x28DE: {
    name: "Valve Corp.",
    controller: {
      0x11FC: "Steam Controller",
      0x1102: "Steam Controller",
      0x1142: "Wireless Steam Controller"
    }
  },
  0x046D: {
    name: "Logitech Inc.",
    controller: {
      0xC21D: "Logitech Gamepad F310",
      0xC21E: "Logitech Gamepad F510",
      0xC21F: "Logitech Gamepad F710",
      0xC242: "Logitech Chillstream Controller"
    }
  }
};

export { hardwareID };