/*
Copyright (c) Anthony Beaumont
This source code is licensed under the GNU AFFERO GENERAL PUBLIC LICENSE Version 3
found in the LICENSE file in the root directory of this source tree.
*/

import { Failure } from "@xan105/error";
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

import * as lib from "../util/ffi.js";
import * as translate from "../util/translator.js";
import * as CONTROLLER from "../data/XInputController.js";
import { hardwareID } from "../data/HardwareID.js";

function enable(enable){
  if (!lib.XInputEnable) 
    throw new Failure(...translate.ERROR(120));
  shouldBoolean(enable);
  
  lib.XInputEnable(enable);
}

function getBatteryInformation(option = {}){
  if (!lib.XInputGetBatteryInformation) 
    throw new Failure(...translate.ERROR(120));

  if (isNumber(option)) option = { dwUserIndex: option };
  shouldObj(option);
  
  const options = {
    dwUserIndex: option.dwUserIndex ?? 0,
    devType: [0,1].includes(option.devType) ? option.devType : 0, // BATTERY_DEVTYPE_GAMEPAD (0), BATTERY_DEVTYPE_HEADSET (1)
    translate: asBoolean(option.translate) ?? true
  };
  
  shouldIntegerWithinRange(options.dwUserIndex, 0, CONTROLLER.XUSER_MAX_COUNT - 1);
  
  let BatteryInformation = {};
  
  const code = lib.XInputGetBatteryInformation(options.dwUserIndex, options.devType, BatteryInformation);
  if (code !== 0) throw new Failure(...translate.ERROR(code));
  
  const result = {
    batteryType: options.translate ? translate.BATTERY_TYPE(BatteryInformation.BatteryType) : BatteryInformation.BatteryType,
    batteryLevel: options.translate ? translate.BATTERY_LEVEL(BatteryInformation.BatteryLevel) : BatteryInformation.BatteryLevel
  };

  return result;
}

function getCapabilities(option = {}){
  if (!lib.XInputGetCapabilities) 
    throw new Failure(...translate.ERROR(120));
  
  if (isNumber(option)) option = { dwUserIndex: option };
  shouldObj(option);
  
  const options = {
    dwUserIndex: option.dwUserIndex ?? 0,
    dwFlags: [0,1].includes(option.dwFlags) ? option.dwFlags : 1, //Any values other than 0 or 1 (XINPUT_FLAG_GAMEPAD) are illegal and will result in an error break
    translate: asBoolean(option.translate) ?? true
  };
  
  shouldIntegerWithinRange(options.dwUserIndex, 0, CONTROLLER.XUSER_MAX_COUNT - 1);

  let Capabilities = {};

  const code = lib.XInputGetCapabilities(options.dwUserIndex, options.dwFlags, Capabilities);
  if (code !== 0) throw new Failure(...translate.ERROR(code));

  const result = {
    type: options.translate ? translate.DEVTYPE(Capabilities.Type) : Capabilities.Type,
    subType: options.translate ? translate.DEVSUBTYPE(Capabilities.SubType) : Capabilities.SubType,
    flags: options.translate ? translate.bitwise(Capabilities.Flags, CONTROLLER.FEATURES) : Capabilities.Flags,
    gamepad: {
      wButtons: options.translate ? translate.bitwise(Capabilities.Gamepad.wButtons, CONTROLLER.BUTTONS) : Capabilities.Gamepad.wButtons,
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
    throw new Failure(...translate.ERROR(120));
    
  if (isNumber(option)) option = { dwUserIndex: option };
  shouldObj(option);
  
  const options = {
    dwUserIndex: option.dwUserIndex ?? 0,
    translate: asBoolean(option.translate) ?? true
  };
  
  if (!(isIntegerWithinRange(options.dwUserIndex, 0, CONTROLLER.XUSER_MAX_COUNT - 1) || options.dwUserIndex === CONTROLLER.XUSER_INDEX_ANY)){
    throw new Failure("Expecting an integer between the specified range or equals to 255 !", { code: 1, info: { 
      type: typeof options.dwUserIndex, value: options.dwUserIndex, range: [0, CONTROLLER.XUSER_MAX_COUNT - 1], alternate: CONTROLLER.XUSER_INDEX_ANY 
    }});
  }
  
  let Keystroke = {};
  
  const code = lib.XInputGetKeystroke(options.dwUserIndex, 0, Keystroke);
  if (code !== 0) throw new Failure(...translate.ERROR(code));
  
  const result = {
    virtualKey: options.translate ? translate.VIRTUALKEY(Keystroke.VirtualKey) : Keystroke.VirtualKey,
    unicode: Keystroke.Unicode,
    flags: options.translate ? translate.bitwise(Keystroke.Flags, CONTROLLER.VK_STATE) : Keystroke.Flags,
    userIndex: Keystroke.UserIndex,
    hidCode: Keystroke.HidCode,
  };
  
  return result;
}

function getState(option = {}){
  if (!lib.XInputGetState) 
    throw new Failure(...translate.ERROR(120));
  
  if (isNumber(option)) option = { dwUserIndex: option };
  shouldObj(option);
  
  const options = {
    dwUserIndex: option.dwUserIndex ?? 0,
    translate: asBoolean(option.translate) ?? true
  };
  
  shouldIntegerWithinRange(options.dwUserIndex, 0, CONTROLLER.XUSER_MAX_COUNT - 1);
  
  let State = {};

  const code = lib.XInputGetState(options.dwUserIndex, State);
  if (code !== 0) throw new Failure(...translate.ERROR(code));

  const result = {
    dwPacketNumber: State.dwPacketNumber,
    gamepad: {
      wButtons: options.translate ? translate.bitwise(State.Gamepad.wButtons, CONTROLLER.BUTTONS): State.Gamepad.wButtons, 
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
    throw new Failure(...translate.ERROR(120));
    
  if (isNumber(option)) option = { dwUserIndex: option };
  shouldObj(option);
  
  const options = {
    dwUserIndex: option.dwUserIndex ?? 0,
    usePercent: option.usePercent ?? true
  };
  
  shouldIntegerWithinRange(options.dwUserIndex, 0, CONTROLLER.XUSER_MAX_COUNT - 1);

  const forceFeedBack = function(i){
    shouldIntegerWithinRange(i, 0, 100);
    return Math.floor((CONTROLLER.MOTOR_SPEED / 100) * i);
  };

  const Vibration = {
    wLeftMotorSpeed: options.usePercent ? forceFeedBack(lowFrequency) : lowFrequency,
    wRightMotorSpeed: options.usePercent ? forceFeedBack(highFrequency) : highFrequency
  };
  
  shouldIntegerWithinRange(Vibration.wLeftMotorSpeed, 0, CONTROLLER.MOTOR_SPEED);
  shouldIntegerWithinRange(Vibration.wRightMotorSpeed, 0, CONTROLLER.MOTOR_SPEED);

  const code = lib.XInputSetState(options.dwUserIndex, Vibration);
  if (code !== 0) throw new Failure(...translate.ERROR(code));
}

function getStateEx(option = {}){
  if (!lib.XInputGetStateEx) 
    throw new Failure(...translate.ERROR(120));
  
  if (isNumber(option)) option = { dwUserIndex: option };
  shouldObj(option);
  
  const options = {
    dwUserIndex: option.dwUserIndex ?? 0,
    translate: asBoolean(option.translate) ?? true
  };
  
  shouldIntegerWithinRange(options.dwUserIndex, 0, CONTROLLER.XUSER_MAX_COUNT - 1);
  
  let State = {};

  const code = lib.XInputGetStateEx(options.dwUserIndex, State);
  if (code !== 0) throw new Failure(...translate.ERROR(code));

  const result = {
    dwPacketNumber: State.dwPacketNumber,
    gamepad: {
      wButtons: options.translate ? translate.bitwise(State.Gamepad.wButtons, CONTROLLER.BUTTONS): State.Gamepad.wButtons, 
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
    throw new Failure(...translate.ERROR(120));
  
  if (isNumber(option)) option = { dwUserIndex: option };
  shouldObj(option);
  
  const options = {
    dwUserIndex: option.dwUserIndex ?? 0,
    dwFlags: [0,1].includes(option.dwFlags) ? option.dwFlags : 0 //async(1) blocking(0)
  };
  
  shouldIntegerWithinRange(options.dwUserIndex, 0, CONTROLLER.XUSER_MAX_COUNT - 1);
  
  // [DWORD, DWORD, void*] should be correct but somehow this result in ERROR_BAD_ARGUMENTS.
  const code = lib.XInputWaitForGuideButton(options.dwUserIndex, options.dwFlags, null);
  if (code !== 0) throw new Failure(...translate.ERROR(code));
}

function cancelGuideButtonWait(option = {}){
  if (!lib.XInputCancelGuideButtonWait) 
    throw new Failure(...translate.ERROR(120));
  
  if (isNumber(option)) option = { dwUserIndex: option };
  shouldObj(option);
  
  const options = {
    dwUserIndex: option.dwUserIndex ?? 0
  };
  
  shouldIntegerWithinRange(options.dwUserIndex, 0, CONTROLLER.XUSER_MAX_COUNT - 1);
  
  const code = lib.XInputCancelGuideButtonWait(options.dwUserIndex);
  if (code !== 0) throw new Failure(...translate.ERROR(code));
}

function powerOffController(option = {}){
  if (!lib.XInputPowerOffController) 
    throw new Failure(...translate.ERROR(120));
  
  if (isNumber(option)) option = { dwUserIndex: option };
  shouldObj(option);
  
  const options = {
    dwUserIndex: option.dwUserIndex ?? 0
  };
  
  shouldIntegerWithinRange(options.dwUserIndex, 0, CONTROLLER.XUSER_MAX_COUNT - 1);
  
  const code = lib.XInputPowerOffController(options.dwUserIndex);
  if (code !== 0) throw new Failure(...translate.ERROR(code));
}

function getBaseBusInformation(option = {}){
  if (!lib.XInputGetBaseBusInformation) 
    throw new Failure(...translate.ERROR(120));
  
  if (isNumber(option)) option = { dwUserIndex: option };
  shouldObj(option);
  
  const options = {
    dwUserIndex: option.dwUserIndex ?? 0
  };
  
  shouldIntegerWithinRange(options.dwUserIndex, 0, CONTROLLER.XUSER_MAX_COUNT - 1);
  
  let Information = {};
  
  const code = lib.XInputGetBaseBusInformation(options.dwUserIndex, Information);
  if (code !== 0) throw new Failure(...translate.ERROR(code));
  
  return Information;
}

function getCapabilitiesEx(option = {}){
  if (!lib.XInputGetCapabilitiesEx)
    throw new Failure(...translate.ERROR(120));
  
  if (isNumber(option)) option = { dwUserIndex: option };
  shouldObj(option);
  
  const options = {
    dwUserIndex: option.dwUserIndex ?? 0,
    translate: asBoolean(option.translate) ?? true
  };
  
  shouldIntegerWithinRange(options.dwUserIndex, 0, CONTROLLER.XUSER_MAX_COUNT - 1);

  const dwFlags = 0; //unknown
  let Capabilities = {};

  const code = lib.XInputGetCapabilitiesEx(1 /*unknown*/, options.dwUserIndex, dwFlags, Capabilities);
  if (code !== 0) throw new Failure(...translate.ERROR(code));

  const result = {
    capabilities: {
      type: options.translate ? translate.DEVTYPE(Capabilities.Capabilities.Type) : Capabilities.Capabilities.Type,
      dubType: options.translate ? translate.DEVSUBTYPE(Capabilities.Capabilities.SubType) : Capabilities.Capabilities.SubType,
      flags: options.translate ? translate.bitwise(Capabilities.Capabilities.Flags, CONTROLLER.FEATURES) : Capabilities.Capabilities.Flags,
      gamepad: {
        wButtons: options.translate ? translate.bitwise(Capabilities.Capabilities.Gamepad.wButtons, CONTROLLER.BUTTONS) : Capabilities.Capabilities.Gamepad.wButtons,
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
    vendorId: options.translate ? hardwareID[Capabilities.VendorId]?.name ?? Capabilities.VendorId : Capabilities.VendorId,
    productId: options.translate ? hardwareID[Capabilities.VendorId]?.controller?.[Capabilities.ProductId] ?? Capabilities.ProductId : Capabilities.ProductId,
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