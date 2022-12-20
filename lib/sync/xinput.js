/*
Copyright (c) Anthony Beaumont
This source code is licensed under the GNU AFFERO GENERAL PUBLIC LICENSE Version 3
found in the LICENSE file in the root directory of this source tree.
*/

import { Failure, errorLookup } from "@xan105/error";
import {
  isIntegerWithinRange,
  isNumber
} from "@xan105/is";
import {
  shouldBoolean,
  shouldIntegerWithinRange,
  shouldObj
} from "@xan105/is/assert";
import {
  asBoolean
} from "@xan105/is/opt";

import * as lib from "../ffi/XInput.js";
import { bitwise } from "../util/bitwise.js";
import * as CONTROLLER from "../constants.js";
import { hardwareID } from "../util/HardwareID.js";

function enable(enable){
  if (!lib.XInputEnable) 
    throw new Failure(...errorLookup(120), "win32");
  shouldBoolean(enable);
  
  lib.XInputEnable(enable ? 1 : 0);
}

function getBatteryInformation(option = {}){
  if (!lib.XInputGetBatteryInformation) 
    throw new Failure(...errorLookup(120), "win32");

  if (isNumber(option)) option = { dwUserIndex: option };
  shouldObj(option);
  
  const options = {
    dwUserIndex: option.dwUserIndex ?? 0,
    devType: Object.keys(CONTROLLER.BATTERY_DEVTYPE).includes(option.devType) ? option.devType : 0,
    translate: asBoolean(option.translate) ?? true
  };
  
  //Explicit error
  shouldIntegerWithinRange(options.dwUserIndex, 0, CONTROLLER.XUSER_MAX_COUNT - 1);
  
  let BatteryInformation = {};
  
  const code = lib.XInputGetBatteryInformation(options.dwUserIndex, options.devType, BatteryInformation);
  if (code !== 0) throw new Failure(...errorLookup(code));
  
  const result = {
    batteryType: options.translate ? CONTROLLER.BATTERY_TYPE[BatteryInformation.BatteryType] ?? 
                 BatteryInformation.BatteryType : BatteryInformation.BatteryType,
    batteryLevel: options.translate ? CONTROLLER.BATTERY_LEVEL[BatteryInformation.BatteryLevel] ?? 
                  BatteryInformation.BatteryLevel : BatteryInformation.BatteryLevel
  };

  return result;
}

function getCapabilities(option = {}){
  if (!lib.XInputGetCapabilities) 
    throw new Failure(...errorLookup(120), "win32");
  
  if (isNumber(option)) option = { dwUserIndex: option };
  shouldObj(option);
  
  const options = {
    dwUserIndex: option.dwUserIndex ?? 0,
    //Any values other than 0 or 1 (XINPUT_FLAG_GAMEPAD) are illegal and will result in an error break
    dwFlags: [0, CONTROLLER.FLAG_GAMEPAD].includes(option.dwFlags) ? option.dwFlags : CONTROLLER.FLAG_GAMEPAD,
    translate: asBoolean(option.translate) ?? true
  };
  
  //Explicit error
  shouldIntegerWithinRange(options.dwUserIndex, 0, CONTROLLER.XUSER_MAX_COUNT - 1);

  let Capabilities = {};

  const code = lib.XInputGetCapabilities(options.dwUserIndex, options.dwFlags, Capabilities);
  if (code !== 0) throw new Failure(...errorLookup(code));

  const result = {
    type: options.translate ? CONTROLLER.DEVTYPE[Capabilities.Type] ?? 
          Capabilities.Type : Capabilities.Type,
    subType: options.translate ? CONTROLLER.DEVSUBTYPE[Capabilities.SubType] ?? 
             Capabilities.SubType : Capabilities.SubType,
    flags: options.translate ? bitwise(Capabilities.Flags, CONTROLLER.FEATURES) : Capabilities.Flags,
    gamepad: {
      wButtons: options.translate ? bitwise(Capabilities.Gamepad.wButtons, CONTROLLER.BUTTONS) : Capabilities.Gamepad.wButtons,
      bLeftTrigger: Capabilities.Gamepad.bLeftTrigger,
      bRightTrigger: Capabilities.Gamepad.bRightTrigger,
      sThumbLX: Capabilities.Gamepad.sThumbLX,
      sThumbLY: Capabilities.Gamepad.sThumbLY,
      sThumbRX: Capabilities.Gamepad.sThumbRX,
      sThumbRY: Capabilities.Gamepad.sThumbRY
    },
    vibration: {
      wLeftMotorSpeed: Capabilities.Vibration.wLeftMotorSpeed,
      wRightMotorSpeed: Capabilities.Vibration.wRightMotorSpeed,
    }
  };

  return result;
}

function getKeystroke(option = {}){
  if (!lib.XInputGetKeystroke) 
    throw new Failure(...errorLookup(120), "win32");
    
  if (isNumber(option)) option = { dwUserIndex: option };
  shouldObj(option);
  
  const options = {
    dwUserIndex: option.dwUserIndex ?? 0,
    translate: asBoolean(option.translate) ?? true
  };
  
  //Explicit error
  if (
    !( isIntegerWithinRange(options.dwUserIndex, 0, CONTROLLER.XUSER_MAX_COUNT - 1) || 
       options.dwUserIndex === CONTROLLER.XUSER_INDEX_ANY )
  ){
    throw new Failure("Expecting an integer between the specified range or equals to 255 !", { 
      code: 1, 
      info: { 
        type: typeof options.dwUserIndex, 
        value: options.dwUserIndex, 
        range: [0, CONTROLLER.XUSER_MAX_COUNT - 1], 
        alternate: CONTROLLER.XUSER_INDEX_ANY 
      }
    });
  }
  
  let Keystroke = {};
  
  const code = lib.XInputGetKeystroke(options.dwUserIndex, 0, Keystroke);
  if (code !== 0) throw new Failure(...errorLookup(code));
  
  const result = {
    virtualKey: options.translate ? CONTROLLER.VIRTUALKEY[Keystroke.VirtualKey] ?? 
                Keystroke.VirtualKey : Keystroke.VirtualKey,
    unicode: Keystroke.Unicode,
    flags: options.translate ? bitwise(Keystroke.Flags, CONTROLLER.VK_STATE) : Keystroke.Flags,
    userIndex: Keystroke.UserIndex,
    hidCode: Keystroke.HidCode,
  };
  
  return result;
}

function getState(option = {}){
  if (!lib.XInputGetState) 
    throw new Failure(...errorLookup(120), "win32");
  
  if (isNumber(option)) option = { dwUserIndex: option };
  shouldObj(option);
  
  const options = {
    dwUserIndex: option.dwUserIndex ?? 0,
    translate: asBoolean(option.translate) ?? true
  };
  
  //Explicit error
  shouldIntegerWithinRange(options.dwUserIndex, 0, CONTROLLER.XUSER_MAX_COUNT - 1);
  
  let State = {};

  const code = lib.XInputGetState(options.dwUserIndex, State);
  if (code !== 0) throw new Failure(...errorLookup(code));

  const result = {
    dwPacketNumber: State.dwPacketNumber,
    gamepad: {
      wButtons: options.translate ? bitwise(State.Gamepad.wButtons, CONTROLLER.BUTTONS): State.Gamepad.wButtons, 
      bLeftTrigger: State.Gamepad.bLeftTrigger,
      bRightTrigger: State.Gamepad.bRightTrigger,
      sThumbLX: State.Gamepad.sThumbLX,
      sThumbLY: State.Gamepad.sThumbLY,
      sThumbRX: State.Gamepad.sThumbRX,
      sThumbRY: State.Gamepad.sThumbRY
    }
  };

  return result;
}

function setState(lowFrequency, highFrequency, option = {}){
  if (!lib.XInputSetState) 
    throw new Failure(...errorLookup(120), "win32");
    
  if (isNumber(option)) option = { dwUserIndex: option };
  shouldObj(option);
  
  const options = {
    dwUserIndex: option.dwUserIndex ?? 0,
    usePercent: option.usePercent ?? true
  };
  
  //Explicit error
  shouldIntegerWithinRange(options.dwUserIndex, 0, CONTROLLER.XUSER_MAX_COUNT - 1);

  const forceFeedBack = function(i){
    shouldIntegerWithinRange(i, 0, 100);
    return Math.floor((CONTROLLER.MOTOR_SPEED / 100) * i);
  };

  const Vibration = {
    wLeftMotorSpeed: options.usePercent ? forceFeedBack(lowFrequency) : lowFrequency,
    wRightMotorSpeed: options.usePercent ? forceFeedBack(highFrequency) : highFrequency
  };
  
  //Explicit error
  shouldIntegerWithinRange(Vibration.wLeftMotorSpeed, 0, CONTROLLER.MOTOR_SPEED);
  shouldIntegerWithinRange(Vibration.wRightMotorSpeed, 0, CONTROLLER.MOTOR_SPEED);

  const code = lib.XInputSetState(options.dwUserIndex, Vibration);
  if (code !== 0) throw new Failure(...errorLookup(code));
}

function getStateEx(option = {}){
  if (!lib.XInputGetStateEx) 
    throw new Failure(...errorLookup(120), "win32");
  
  if (isNumber(option)) option = { dwUserIndex: option };
  shouldObj(option);
  
  const options = {
    dwUserIndex: option.dwUserIndex ?? 0,
    translate: asBoolean(option.translate) ?? true
  };
  
  //Explicit error
  shouldIntegerWithinRange(options.dwUserIndex, 0, CONTROLLER.XUSER_MAX_COUNT - 1);
  
  let State = {};

  const code = lib.XInputGetStateEx(options.dwUserIndex, State);
  if (code !== 0) throw new Failure(...errorLookup(code));

  const result = {
    dwPacketNumber: State.dwPacketNumber,
    gamepad: {
      wButtons: options.translate ? bitwise(State.Gamepad.wButtons, CONTROLLER.BUTTONS): State.Gamepad.wButtons, 
      bLeftTrigger: State.Gamepad.bLeftTrigger,
      bRightTrigger: State.Gamepad.bRightTrigger,
      sThumbLX: State.Gamepad.sThumbLX,
      sThumbLY: State.Gamepad.sThumbLY,
      sThumbRX: State.Gamepad.sThumbRX,
      sThumbRY: State.Gamepad.sThumbRY
    }
  };

  return result;
}

function waitForGuideButton(option = {}){
  if (!lib.XInputWaitForGuideButton) 
    throw new Failure(...errorLookup(120), "win32");
  
  if (isNumber(option)) option = { dwUserIndex: option };
  shouldObj(option);
  
  const options = {
    dwUserIndex: option.dwUserIndex ?? 0,
    dwFlags: [0,1].includes(option.dwFlags) ? option.dwFlags : 0 //async(1) blocking(0)
  };
  
  //Explicit error
  shouldIntegerWithinRange(options.dwUserIndex, 0, CONTROLLER.XUSER_MAX_COUNT - 1);
  
  const code = lib.XInputWaitForGuideButton(options.dwUserIndex, options.dwFlags, []);
  if (code !== 0) throw new Failure(...errorLookup(code));
}

function cancelGuideButtonWait(option = {}){
  if (!lib.XInputCancelGuideButtonWait) 
    throw new Failure(...errorLookup(120), "win32");
  
  if (isNumber(option)) option = { dwUserIndex: option };
  shouldObj(option);
  
  const options = {
    dwUserIndex: option.dwUserIndex ?? 0
  };
  
  //Explicit error
  shouldIntegerWithinRange(options.dwUserIndex, 0, CONTROLLER.XUSER_MAX_COUNT - 1);
  
  const code = lib.XInputCancelGuideButtonWait(options.dwUserIndex);
  if (code !== 0) throw new Failure(...errorLookup(code));
}

function powerOffController(option = {}){
  if (!lib.XInputPowerOffController) 
    throw new Failure(...errorLookup(120), "win32");
  
  if (isNumber(option)) option = { dwUserIndex: option };
  shouldObj(option);
  
  const options = {
    dwUserIndex: option.dwUserIndex ?? 0
  };
  
  //Explicit error
  shouldIntegerWithinRange(options.dwUserIndex, 0, CONTROLLER.XUSER_MAX_COUNT - 1);
  
  const code = lib.XInputPowerOffController(options.dwUserIndex);
  if (code !== 0) throw new Failure(...errorLookup(code));
}

function getBaseBusInformation(option = {}){
  if (!lib.XInputGetBaseBusInformation) 
    throw new Failure(...errorLookup(120), "win32");
  
  if (isNumber(option)) option = { dwUserIndex: option };
  shouldObj(option);
  
  const options = {
    dwUserIndex: option.dwUserIndex ?? 0
  };
  
  //Explicit error
  shouldIntegerWithinRange(options.dwUserIndex, 0, CONTROLLER.XUSER_MAX_COUNT - 1);
  
  let Information = {};
  
  const code = lib.XInputGetBaseBusInformation(options.dwUserIndex, Information);
  if (code !== 0) throw new Failure(...errorLookup(code));
  
  return Information;
}

function getCapabilitiesEx(option = {}){
  if (!lib.XInputGetCapabilitiesEx)
    throw new Failure(...errorLookup(120), "win32");
  
  if (isNumber(option)) option = { dwUserIndex: option };
  shouldObj(option);
  
  const options = {
    dwUserIndex: option.dwUserIndex ?? 0,
    translate: asBoolean(option.translate) ?? true
  };
  
  //Explicit error
  shouldIntegerWithinRange(options.dwUserIndex, 0, CONTROLLER.XUSER_MAX_COUNT - 1);

  const dwFlags = 0; //unknown
  let Capabilities = {};

  const code = lib.XInputGetCapabilitiesEx(1 /*unknown*/, options.dwUserIndex, dwFlags, Capabilities);
  if (code !== 0) throw new Failure(...errorLookup(code));

  const result = {
    capabilities: {
      type: options.translate ? CONTROLLER.DEVTYPE[Capabilities.Capabilities.Type] ?? 
            Capabilities.Capabilities.Type : Capabilities.Capabilities.Type,
      dubType: options.translate ? CONTROLLER.DEVSUBTYPE[Capabilities.Capabilities.SubType] ?? 
               Capabilities.Capabilities.SubType : Capabilities.Capabilities.SubType,
      flags: options.translate ? bitwise(Capabilities.Capabilities.Flags, CONTROLLER.FEATURES) : Capabilities.Capabilities.Flags,
      gamepad: {
        wButtons: options.translate ? bitwise(Capabilities.Capabilities.Gamepad.wButtons, CONTROLLER.BUTTONS) : Capabilities.Capabilities.Gamepad.wButtons,
        bLeftTrigger: Capabilities.Capabilities.Gamepad.bLeftTrigger,
        bRightTrigger: Capabilities.Capabilities.Gamepad.bRightTrigger,
        sThumbLX: Capabilities.Capabilities.Gamepad.sThumbLX,
        sThumbLY: Capabilities.Capabilities.Gamepad.sThumbLY,
        sThumbRX: Capabilities.Capabilities.Gamepad.sThumbRX,
        sThumbRY: Capabilities.Capabilities.Gamepad.sThumbRY,
      },
      vibration: {
        wLeftMotorSpeed: Capabilities.Capabilities.Vibration.wLeftMotorSpeed,
        wRightMotorSpeed: Capabilities.Capabilities.Vibration.wRightMotorSpeed,
      }
    },
    vendorId: options.translate ? hardwareID[Capabilities.VendorId]?.name ?? 
              Capabilities.VendorId : Capabilities.VendorId,
    productId: options.translate ? hardwareID[Capabilities.VendorId]?.controller?.[Capabilities.ProductId] ?? 
               Capabilities.ProductId : Capabilities.ProductId,
    versionNumber: Capabilities.VersionNumber,
    unk1: Capabilities.unk1
  };

  return result;
}

export {
  enable,
  getBatteryInformation,
  getCapabilities,
  getKeystroke,
  getState,
  setState,
  getStateEx,
  waitForGuideButton,
  cancelGuideButtonWait,
  powerOffController,
  getBaseBusInformation,
  getCapabilitiesEx
};