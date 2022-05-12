/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

/*
const id = {
  0x045E: {
    name: "Microsoft Corp.",
    controller: {
      0x028E: "Xbox360 Controller",
      ...
    }
  }
};
*/

const hardware = [
	{
		name: "Microsoft Corp.",
		id: "045E",
		controller: [
			{id: "028E", name: "Xbox360 Controller"},
			{id: "02A1", name: "Xbox360 Controller"},
			{id: "028F", name: "Xbox360 Wireless Controller"},
			{id: "02E0", name: "Xbox One S Controller"},
			{id: "02FF", name: "Xbox One Elite Controller"},
			{id: "0202", name: "Xbox Controller"},
			{id: "0285", name: "Xbox Controller S"},
			{id: "0289", name: "Xbox Controller S"},
			{id: "02E3", name: "Xbox One Elite Controller"},
			{id: "02EA", name: "Xbox One S Controller"},
			{id: "02FD", name: "Xbox One S Controller"},
			{id: "02D1", name: "Xbox One Controller"},
			{id: "02DD", name: "Xbox One Controller"},
			{id: "0B13", name: "Xbox Series X/S controller"}
		]
	},
	{
		name: "Sony Corp.",
		id: "054C",
		controller: [
			{id: "0268", name: "DualShock 3 / Sixaxis"},
			{id: "05C4", name: "DualShock 4"},
			{id: "09CC", name: "DualShock 4"}, //v2
			{id: "0BA0", name: "DualShock 4 USB Wireless Adaptor"},
			{id: "0CE6", name: "DualSense Wireless Controller"} //PS5
		]
	},
	{
		name: "Nintendo Co., Ltd",
		id: "057E",
		controller: [
			{id: "0337", name: "Wii U GameCube Controller Adapter"},
			{id: "2006", name: "Joy-Con L"},
			{id: "2007", name: "Joy-Con R"},
			{id: "2009", name: "Switch Pro Controller"},
			{id: "200E", name: "Joy-Con Charging Grip"},
			{id: "0306", name: "Wii Remote Controller"}
		]
	},
	{
		name: "Valve Corp.",
		id: "28DE",
		controller: [
			{id: "11FC", name: "Steam Controller"},
			{id: "1102", name: "Steam Controller"},
			{id: "1142", name: "Wireless Steam Controller"}
		]
	},
	{
		name: "Logitech Inc.",
		id: "046D",
		controller: [
			{id: "C21D", name: "Logitech Gamepad F310"},
			{id: "C21E", name: "Logitech Gamepad F510"},
			{id: "C21F", name: "Logitech Gamepad F710"},
			{id: "C242", name: "Logitech Chillstream Controller"}
		]
	},
	{
		name: "BigBen Interactive Limited",
		id: "146B",
		controller: [
			{id: "0601", name: "BigBen Interactive XBOX 360 Controller"}
		]
	},
	{
		name: "Razer USA, Ltd",
		id: "1532",
		controller: [
			{id: "0037", name: "Razer Sabertooth"},
			{id: "0A00", name: "Razer Atrox Arcade Stick"},
			{id: "0A03", name: "Razer Wildcat"}
		]
	},
	{
		name: "Razer USA, Ltd",
		id: "1689",
		controller: [
			{id: "FD00", name: "Razer Onza Tournament Edition"},
			{id: "FD01", name: "Razer Onza Classic Edition"},
			{id: "FE00", name: "Razer Sabertooth Elite"}
		]
	},
	{
		name: "ThrustMaster, Inc.",
		id: "24C6",
		controller: [
			{id: "FAFD", name: "Afterglow Gamepad for Xbox 360"},
			{id: "FAFE", name: "Rock Candy Gamepad for Xbox 360"},
			{id: "5B02", name: "GPX Controller"},
			{id: "5D04", name: "Sabertooth Elite"},
			{id: "FAFB", name: "Aplay Controller"},
			{id: "551A", name: "Fusion Pro Controller"},
			{id: "561A", name: "Fusion Controller for Xbox One"},
			{id: "5B00", name: "Ferrari 458 Italia Racing Wheel"},
			{id: "5503", name: "Hori Fighting Edge for Xbox 360"},
			{id: "5506", name: "Hori Soulcalibur V Stick for Xbox 360"},
			{id: "550D", name: "Hori Gem Controller for Xbox 360"},
			{id: "550E", name: "Real Arcade Pro V Kai for Xbox One / Xbox 360"},
			{id: "5501", name: "Hori Real Arcade Pro.VX-SA for Xbox 360"},
			{id: "5502", name: "Hori Fighting Stick VX Alt for Xbox 360"},
			{id: "542A", name: "Spectra for Xbox One"},
			{id: "543A", name: "PowerA Wired Controller for Xbox One"},
			{id: "5500", name: "Horipad EX2 Turbo"},
			{id: "531A", name: "Pro Ex mini for XBOX"},
			{id: "5397", name: "FUS1ON Tournament Controller"},
			{id: "541A", name: "PowerA CPFA115320-01 [Mini Controller for Xbox One]"},
			{id: "5303", name: "Airflo Wired Controller for Xbox 360"},
			{id: "530A", name: "ProEX Controller for Xbox 360"},
			{id: "5000", name: "Razer Atrox Gaming Arcade Stick"},
			{id: "5300", name: "PowerA Mini ProEX Controller for Xbox 360"}
		]
	}
];

export { hardware }