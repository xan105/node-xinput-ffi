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

const ffi = require("ffi-napi");
const ref = require("ref-napi");
const PNPEntity = require("./PNPEntity/list.cjs");

// Types
const { DWORD, BYTE } = require("./types/WindowsDataTypes.cjs");

const {
  XINPUT_GAMEPAD,
  XINPUT_STATE,
  XINPUT_VIBRATION,
  XINPUT_BATTERY_INFORMATION,
  XINPUT_CAPABILITIES,
} = require("./types/XinputStruct.cjs");

/*=========
Xinput init 
==========*/
const Versions = [
  "xinput1_4", //Windows 8
  "xinput1_3", //Windows 7 (DirectX SDK)
  "xinput9_1_0", //Windows Vista (Legacy)
];

const FunctionDefinitions = {
  //1_4, 1_3 | https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputenable
  XInputEnable: ["void", ["bool"]],
  //1_4, 1_3, 9_1_0 | https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputgetstate
  XInputGetState: [DWORD, [DWORD, ref.refType(XINPUT_STATE)]],
  // 1_4, 9_1_0 | https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputsetstate
  XInputSetState: [DWORD, [DWORD, ref.refType(XINPUT_VIBRATION)]],
  //1_4 | https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputgetbatteryinformation
  XInputGetBatteryInformation: [DWORD, [DWORD, BYTE, ref.refType(XINPUT_BATTERY_INFORMATION)]],
  //1_4, 1_3, 9_1_0 | https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputgetcapabilities
  XInputGetCapabilities: [DWORD, [DWORD, DWORD, ref.refType(XINPUT_CAPABILITIES)]],
};

let lib;
for (let version of Versions) {
  try {
    lib = ffi.Library(version, FunctionDefinitions);
    break;
  } catch {
    lib = null;
  }
}
if (!lib) throw "ERROR_LOADING_XINPUT";

/*================
end of Xinput init 
=================*/

// constroller constants
const CONTROLLER = require("./controller.cjs");
// code translator
const whatIs = require("./code.cjs");

const XInput = {
  sync: {
    enable: function (enable) {
      lib.XInputEnable(enable);
    },
    GetBatteryInformation: function (gamepadIndex = 0) {
      if (!Number.isInteger(gamepadIndex) || gamepadIndex < 0 || gamepadIndex > CONTROLLER.MAX - 1)
        throw `Index of the user's controller must be a value from 0 to ${CONTROLLER.MAX - 1}.`;

      let battery = new XINPUT_BATTERY_INFORMATION();

      const code = lib.XInputGetBatteryInformation(
        gamepadIndex,
        0 /*BATTERY_DEVTYPE_GAMEPAD (0) | BATTERY_DEVTYPE_HEADSET (1)
		I don't see the use of BATTERY_DEVTYPE_HEADSET ? So I'm only using 0
		*/,
        battery.ref()
      );

      if (code !== 0) throw `${whatIs.ERROR(code)}`;

      const result = {
        BatteryType: whatIs.BATTERY_TYPE(battery.BatteryType),
        BatteryLevel: whatIs.BATTERY_LEVEL(battery.BatteryLevel),
      };

      return result;
    },
    GetCapabilities: function (gamepadIndex = 0) {
      if (!Number.isInteger(gamepadIndex) || gamepadIndex < 0 || gamepadIndex > CONTROLLER.MAX - 1)
        throw `Index of the user's controller must be a value from 0 to ${CONTROLLER.MAX - 1}.`;

      let capabilities = new XINPUT_CAPABILITIES();

      const code = lib.XInputGetCapabilities(
        gamepadIndex,
        1 /*only XINPUT_FLAG_GAMEPAD (1) is supported as of writing 
		  Limit query to devices of Xbox 360 Controller type
		  If this value is 0, then the capabilities of all controllers connected to the system are returned (???)
		  Any values other than 0 or 1 are illegal and will result in an error break
		  */,
        capabilities.ref()
      );

      if (code !== 0) throw `${whatIs.ERROR(code)}`;

      const result = {
        Type: whatIs.DEVTYPE(capabilities.Type),
        SubType: whatIs.DEVSUBTYPE(capabilities.SubType),
        Flags: whatIs.CAPS(capabilities.Flags),
      };

      return result;
    },
    getState: function (gamepadIndex = 0) {
      if (!Number.isInteger(gamepadIndex) || gamepadIndex < 0 || gamepadIndex > CONTROLLER.MAX - 1)
        throw `Index of the user's controller must be a value from 0 to ${CONTROLLER.MAX - 1}.`;

      let state = new XINPUT_STATE();

      const code = lib.XInputGetState(gamepadIndex, state.ref());

      if (code !== 0) throw `${whatIs.ERROR(code)}`;

      const gamepad = ref.get(state.ref(), 4, XINPUT_GAMEPAD);
      const result = {
        dwPacketNumber: state.dwPacketNumber,
        Gamepad: {
          wButtons: gamepad.wButtons,
          bLeftTrigger: gamepad.bLeftTrigger,
          bRightTrigger: gamepad.bRightTrigger,
          sThumbLX: gamepad.sThumbLX,
          sThumbLY: gamepad.sThumbLY,
          sThumbRX: gamepad.sThumbRX,
          sThumbRY: gamepad.sThumbRY,
        },
      };

      return result;
    },
    setState: function (lowFrequency, highFrequency, gamepadIndex = 0) {
      if (!Number.isInteger(gamepadIndex) || gamepadIndex < 0 || gamepadIndex > CONTROLLER.MAX - 1)
        throw `Index of the user's controller must be a value from 0 to ${CONTROLLER.MAX - 1}.`;
      if (!Number.isInteger(lowFrequency) || lowFrequency < 0 || lowFrequency > 100)
        throw "Low-frequency rumble range 0-100%.";
      if (!Number.isInteger(highFrequency) || highFrequency < 0 || highFrequency > 100)
        throw "High-frequency rumble rumble range 0-100%.";

      const forceFeedBack = (i) => (CONTROLLER.MOTOR_SPEED / 100) * i;

      const vibration = new XINPUT_VIBRATION({
        wLeftMotorSpeed: forceFeedBack(lowFrequency),
        wRightMotorSpeed: forceFeedBack(highFrequency),
      });

      const code = lib.XInputSetState(gamepadIndex, vibration.ref());

      if (code !== 0) throw `${whatIs.ERROR(code)}`;
    },
    getButtonsDown: function (gamepadIndex = 0) {
      if (!Number.isInteger(gamepadIndex) || gamepadIndex < 0 || gamepadIndex > CONTROLLER.MAX - 1)
        throw `Index of the user's controller must be a value from 0 to ${CONTROLLER.MAX - 1}.`;

      const state = this.getState(gamepadIndex);

      let result = {
        packetNumber: state.dwPacketNumber,
        buttons: whatIs.BUTTONS(state.Gamepad.wButtons),
        trigger: {
          left: state.Gamepad.bLeftTrigger,
          right: state.Gamepad.bRightTrigger,
        },
        thumb: {
          left: {
            x: state.Gamepad.sThumbLX,
            y: state.Gamepad.sThumbLY,
          },
          right: {
            x: state.Gamepad.sThumbRX,
            y: state.Gamepad.sThumbRY,
          },
        },
      };

      return result;
    },
    rumble: function (option = {}) {
      const options = {
        force:
          option.force && (Number.isInteger(option.force) || Array.isArray(option.force))
            ? option.force
            : [50, 25],
        duration:
          option.duration &&
          Number.isInteger(option.duration) &&
          option.duration < CONTROLLER.RUMBLE_DURATION &&
          option.duration > 0
            ? option.duration
            : CONTROLLER.RUMBLE_DURATION,
        forceEnableGamepad: option.forceEnableGamepad || false,
        gamepadIndex:
          Number.isInteger(option.gamepadIndex) &&
          option.gamepadIndex >= 0 &&
          option.gamepadIndex < CONTROLLER.MAX - 1
            ? option.gamepadIndex
            : 0,
      };

      if (options.forceEnableGamepad) this.enable(true);

      if (
        Array.isArray(options.force) &&
        options.force.length === 2 &&
        options.force.every((i) => Number.isInteger(i))
      ) {
        this.setState(options.force[0], options.force[1], options.gamepadIndex);
      } else {
        this.setState(options.force, options.force, options.gamepadIndex);
      }

      //Block the event-loop for the rumble duration
      const end = Date.now() + options.duration;
      while (Date.now() < end) {
        /*Do nothing*/
      }

      this.setState(0, 0, options.gamepadIndex); //State reset
    },
    isConnected: function (gamepadIndex = 0) {
      if (!Number.isInteger(gamepadIndex) || gamepadIndex < 0 || gamepadIndex > CONTROLLER.MAX - 1)
        throw `Index of the user's controller must be a value from 0 to ${CONTROLLER.MAX - 1}.`;
      try {
        this.getState(gamepadIndex);
        return true;
      } catch {
        return false;
      }
    },
    listConnected: function () {
      let connected = Array(CONTROLLER.MAX).fill(false);
      for (let i = 0; i < CONTROLLER.MAX - 1; i++) if (this.isConnected(i)) connected[i] = true;
      return connected;
    },
  }, //End of sync
  enable: function (enable) {
    return new Promise((resolve, reject) => {
      lib.XInputEnable.async(enable, (err) => {
        if (err) return reject(err);
        else return resolve();
      });
    });
  },
  GetBatteryInformation: function (gamepadIndex = 0) {
    return new Promise((resolve, reject) => {
      if (!Number.isInteger(gamepadIndex) || gamepadIndex < 0 || gamepadIndex > CONTROLLER.MAX - 1)
        return reject(
          `Index of the user's controller must be a value from 0 to ${CONTROLLER.MAX - 1}.`
        );

      let battery = new XINPUT_BATTERY_INFORMATION();

      lib.XInputGetBatteryInformation.async(
        gamepadIndex,
        0 /*BATTERY_DEVTYPE_GAMEPAD (0) | BATTERY_DEVTYPE_HEADSET (1)
			I don't see the use of BATTERY_DEVTYPE_HEADSET ? So I'm only using 0
			*/,
        battery.ref(),
        (err, code) => {
          if (err) return reject(err);
          if (code === 0) {
            const result = {
              BatteryType: whatIs.BATTERY_TYPE(battery.BatteryType),
              BatteryLevel: whatIs.BATTERY_LEVEL(battery.BatteryLevel),
            };
            return resolve(result);
          } else {
            return reject(whatIs.ERROR(code));
          }
        }
      );
    });
  },
  GetCapabilities: function (gamepadIndex = 0) {
    return new Promise((resolve, reject) => {
      if (!Number.isInteger(gamepadIndex) || gamepadIndex < 0 || gamepadIndex > CONTROLLER.MAX - 1)
        return reject(
          `Index of the user's controller must be a value from 0 to ${CONTROLLER.MAX - 1}.`
        );

      let capabilities = new XINPUT_CAPABILITIES();

      lib.XInputGetCapabilities.async(
        gamepadIndex,
        1 /*only XINPUT_FLAG_GAMEPAD (1) is supported as of writing 
			  Limit query to devices of Xbox 360 Controller type
			  If this value is 0, then the capabilities of all controllers connected to the system are returned (???)
			  Any values other than 0 or 1 are illegal and will result in an error break
			  */,
        capabilities.ref(),
        (err, code) => {
          if (err) return reject(err);
          if (code === 0) {
            const result = {
              Type: whatIs.DEVTYPE(capabilities.Type),
              SubType: whatIs.DEVSUBTYPE(capabilities.SubType),
              Flags: whatIs.CAPS(capabilities.Flags),
            };
            return resolve(result);
          } else {
            return reject(whatIs.ERROR(code));
          }
        }
      );
    });
  },
  getState: function (gamepadIndex = 0) {
    return new Promise((resolve, reject) => {
      if (!Number.isInteger(gamepadIndex) || gamepadIndex < 0 || gamepadIndex > CONTROLLER.MAX - 1)
        return reject(
          `Index of the user's controller must be a value from 0 to ${CONTROLLER.MAX - 1}.`
        );

      let state = new XINPUT_STATE();

      lib.XInputGetState.async(gamepadIndex, state.ref(), (err, code) => {
        if (err) return reject(err);
        if (code === 0) {
          const gamepad = ref.get(state.ref(), 4, XINPUT_GAMEPAD);
          const result = {
            dwPacketNumber: state.dwPacketNumber,
            Gamepad: {
              wButtons: gamepad.wButtons,
              bLeftTrigger: gamepad.bLeftTrigger,
              bRightTrigger: gamepad.bRightTrigger,
              sThumbLX: gamepad.sThumbLX,
              sThumbLY: gamepad.sThumbLY,
              sThumbRX: gamepad.sThumbRX,
              sThumbRY: gamepad.sThumbRY,
            },
          };
          return resolve(result);
        } else {
          return reject(whatIs.ERROR(code));
        }
      });
    });
  },
  setState: function (lowFrequency, highFrequency, gamepadIndex = 0) {
    return new Promise((resolve, reject) => {
      if (!Number.isInteger(gamepadIndex) || gamepadIndex < 0 || gamepadIndex > CONTROLLER.MAX - 1)
        return reject(
          `Index of the user's controller must be a value from 0 to ${CONTROLLER.MAX - 1}.`
        );
      if (!Number.isInteger(lowFrequency) || lowFrequency < 0 || lowFrequency > 100)
        return reject("Low-frequency rumble range 0-100%.");
      if (!Number.isInteger(highFrequency) || highFrequency < 0 || highFrequency > 100)
        return reject("High-frequency rumble rumble range 0-100%.");

      const forceFeedBack = (i) => (CONTROLLER.MOTOR_SPEED / 100) * i;

      const vibration = new XINPUT_VIBRATION({
        wLeftMotorSpeed: forceFeedBack(lowFrequency),
        wRightMotorSpeed: forceFeedBack(highFrequency),
      });

      lib.XInputSetState.async(gamepadIndex, vibration.ref(), (err, code) => {
        if (err) return reject(err);
        if (code === 0) {
          return resolve();
        } else {
          return reject(whatIs.ERROR(code));
        }
      });
    });
  },
  getButtonsDown: async function (gamepadIndex = 0) {
    if (!Number.isInteger(gamepadIndex) || gamepadIndex < 0 || gamepadIndex > CONTROLLER.MAX - 1)
      throw `Index of the user's controller must be a value from 0 to ${CONTROLLER.MAX - 1}.`;

    const state = await this.getState(gamepadIndex);

    let result = {
      packetNumber: state.dwPacketNumber,
      buttons: whatIs.BUTTONS(state.Gamepad.wButtons),
      trigger: {
        left: state.Gamepad.bLeftTrigger,
        right: state.Gamepad.bRightTrigger,
      },
      thumb: {
        left: {
          x: state.Gamepad.sThumbLX,
          y: state.Gamepad.sThumbLY,
        },
        right: {
          x: state.Gamepad.sThumbRX,
          y: state.Gamepad.sThumbRY,
        },
      },
    };

    return result;
  },
  rumble: async function (option = {}) {
    const options = {
      force:
        option.force && (Number.isInteger(option.force) || Array.isArray(option.force))
          ? option.force
          : [50, 25],
      duration:
        option.duration &&
        Number.isInteger(option.duration) &&
        option.duration < CONTROLLER.RUMBLE_DURATION &&
        option.duration > 0
          ? option.duration
          : CONTROLLER.RUMBLE_DURATION,
      forceEnableGamepad: option.forceEnableGamepad || false,
      gamepadIndex:
        Number.isInteger(option.gamepadIndex) &&
        option.gamepadIndex >= 0 &&
        option.gamepadIndex < CONTROLLER.MAX - 1
          ? option.gamepadIndex
          : 0,
    };

    if (options.forceEnableGamepad) await this.enable(true);

    if (
      Array.isArray(options.force) &&
      options.force.length === 2 &&
      options.force.every((i) => Number.isInteger(i))
    ) {
      await this.setState(options.force[0], options.force[1], options.gamepadIndex);
    } else {
      await this.setState(options.force, options.force, options.gamepadIndex);
    }
    await new Promise((resolve) => setTimeout(resolve, options.duration)).catch(() => {}); //Keep the event-loop alive for the rumble duration
    await this.setState(0, 0, options.gamepadIndex); //State reset
  },
  isConnected: async function (gamepadIndex = 0) {
    if (!Number.isInteger(gamepadIndex) || gamepadIndex < 0 || gamepadIndex > CONTROLLER.MAX - 1)
      throw `Index of the user's controller must be a value from 0 to ${CONTROLLER.MAX - 1}.`;
    try {
      await this.getState(gamepadIndex);
      return true;
    } catch {
      return false;
    }
  },
  listConnected: async function () {
    let connected = Array(CONTROLLER.MAX).fill(false);
    for (let i = 0; i < CONTROLLER.MAX - 1; i++) if (await this.isConnected(i)) connected[i] = true;
    return connected;
  },
  //Identify
  identify: {
    knownDevices: async function () {
      return await PNPEntity.listKnownDevice();
    },
    XInputDevices: async function () {
      return await PNPEntity.listXInput();
    },
  },
};

module.exports = XInput;
