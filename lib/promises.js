/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

import { promisify } from "node:util";
import ref from "ref-napi";
import { Failure } from "@xan105/error";
import { shouldIntegerWithinRange } from "@xan105/is/assert";
import {
  isIntegerWithinRange,
  isSizeArrayOfIntegerWithinRange,
  isNumber,
  isNumberWithinRange
} from "@xan105/is";
import * as lib from "./util/ffi.js";
import { normalizeThumb } from "./util/analog.js";
import { listDevices } from "./util/PNPEntity.js";

import {
  XINPUT_BATTERY_INFORMATION,
  XINPUT_CAPABILITIES,
  XINPUT_CAPABILITIES_EX,
  XINPUT_STATE,
  XINPUT_GAMEPAD,
  XINPUT_VIBRATION
} from "./data/XInputStruct.js";

//constroller constants
import * as CONTROLLER from "./data/XInputController.js";
//code translator
import * as translate from "./data/XInputCode.js";

const NOT_FOUND = ["This API isn't available !", "ERR_XINPUT_API_NOT_FOUND"];

async function enable(enable){
  if (!lib.XInputEnable) throw new Failure(...NOT_FOUND)
  await promisify(lib.XInputEnable.async)(enable);
}
    
async function getBatteryInformation(option = {}){
  if (!lib.XInputGetBatteryInformation) throw new Failure(...NOT_FOUND)
  
  if (isNumber(option)) option = { gamepadIndex: option };
  
  const options = {
    gamepadIndex: option.gamepadIndex ?? 0,
    devType: [0,1].includes(option.devType) ? option.devType : 0, // BATTERY_DEVTYPE_GAMEPAD (0), BATTERY_DEVTYPE_HEADSET (1)
    translate: option.translate ?? true
  };
  
  shouldIntegerWithinRange(options.gamepadIndex, 0, CONTROLLER.MAX - 1);

  let battery = new XINPUT_BATTERY_INFORMATION();

  const code = await promisify(lib.XInputGetBatteryInformation.async)(options.gamepadIndex, options.devType, battery.ref()); 
  if (code !== 0) throw new Failure(...translate.ERROR(code));

  const result = {
    BatteryType: options.translate ? translate.BATTERY_TYPE(battery.BatteryType) : battery.BatteryType,
    BatteryLevel: options.translate ? translate.BATTERY_LEVEL(battery.BatteryLevel) : battery.BatteryLevel
  };

  return result;
}
    
async function getCapabilities(option = {}){
  if (!lib.XInputGetCapabilities) throw new Failure(...NOT_FOUND)
  
  if (isNumber(option)) option = { gamepadIndex: option };
  
  const options = {
    gamepadIndex: option.gamepadIndex ?? 0,
    flags: [0,1].includes(option.flags) ? option.flags : 1, //Any values other than 0 or 1 (XINPUT_FLAG_GAMEPAD) are illegal and will result in an error break
    translate: option.translate ?? true
  };
  
  shouldIntegerWithinRange(options.gamepadIndex, 0, CONTROLLER.MAX - 1)

  let capabilities = new XINPUT_CAPABILITIES();

  const code = await promisify(lib.XInputGetCapabilities.async)(options.gamepadIndex, options.flags, capabilities.ref());
  if (code !== 0) throw new Failure(...translate.ERROR(code));

  const gamepad = ref.get(capabilities.ref(), 4, XINPUT_GAMEPAD);
  const vibration = ref.get(capabilities.ref(), 16, XINPUT_VIBRATION);

  const result = {
    Type: options.translate ? translate.DEVTYPE(capabilities.Type) : capabilities.Type,
    SubType: options.translate ? translate.DEVSUBTYPE(capabilities.SubType) : capabilities.SubType,
    Flags: options.translate ? translate.bitwise(capabilities.Flags, CONTROLLER.FLAGS) : capabilities.Flags,
    Gamepad: {
      wButtons: options.translate ? translate.bitwise(gamepad.wButtons, CONTROLLER.BUTTONS) : gamepad.wButtons,
      bLeftTrigger: gamepad.bLeftTrigger,
      bRightTrigger: gamepad.bRightTrigger,
      sThumbLX: gamepad.sThumbLX,
      sThumbLY: gamepad.sThumbLY,
      sThumbRX: gamepad.sThumbRX,
      sThumbRY: gamepad.sThumbRY,
    },
    Vibration: {
      wLeftMotorSpeed: vibration.wLeftMotorSpeed,
      wRightMotorSpeed: vibration.wRightMotorSpeed,
    }
  };

  return result;
}

async function getCapabilitiesEx(option = {}){
  if (!lib.XInputGetCapabilitiesEx) throw new Failure(...NOT_FOUND)
  
  if (isNumber(option)) option = { gamepadIndex: option };
  
  const options = {
    gamepadIndex: option.gamepadIndex ?? 0,
    translate: option.translate ?? true
  };
  
  shouldIntegerWithinRange(options.gamepadIndex, 0, CONTROLLER.MAX - 1)

  let capabilitiesEx = new XINPUT_CAPABILITIES_EX();

  const code = await promisify(lib.XInputGetCapabilitiesEx.async)(1, options.gamepadIndex, 0, capabilitiesEx.ref());
  if (code !== 0) throw new Failure(...translate.ERROR(code));

  const capabilities = ref.get(capabilitiesEx.ref(), 0, XINPUT_CAPABILITIES);
  const gamepad = ref.get(capabilities.ref(), 4, XINPUT_GAMEPAD);
  const vibration = ref.get(capabilities.ref(), 16, XINPUT_VIBRATION);

  const result = {
    Capabilities: {
      Type: options.translate ? translate.DEVTYPE(capabilities.Type) : capabilities.Type,
      SubType: options.translate ? translate.DEVSUBTYPE(capabilities.SubType) : capabilities.SubType,
      Flags: options.translate ? translate.bitwise(capabilities.Flags, CONTROLLER.FLAGS) : capabilities.Flags,
      Gamepad: {
        wButtons: options.translate ? translate.bitwise(gamepad.wButtons, CONTROLLER.BUTTONS) : gamepad.wButtons,
        bLeftTrigger: gamepad.bLeftTrigger,
        bRightTrigger: gamepad.bRightTrigger,
        sThumbLX: gamepad.sThumbLX,
        sThumbLY: gamepad.sThumbLY,
        sThumbRX: gamepad.sThumbRX,
        sThumbRY: gamepad.sThumbRY,
      },
      Vibration: {
        wLeftMotorSpeed: vibration.wLeftMotorSpeed,
        wRightMotorSpeed: vibration.wRightMotorSpeed,
      }
    },
    VendorId: capabilitiesEx.VendorId.toString(16).toUpperCase(),
    ProductId: capabilitiesEx.ProductId.toString(16).toUpperCase(),
    VersionNumber: capabilitiesEx.VersionNumber.toString(16).toUpperCase(),
    unk1: capabilitiesEx.unk1
  };

  return result;
}
    
async function getState(option = {}){
  if (!lib.XInputGetState) throw new Failure(...NOT_FOUND)
  
  if (isNumber(option)) option = { gamepadIndex: option };
  
  const options = {
    gamepadIndex: option.gamepadIndex ?? 0,
    translate: option.translate ?? true
  };
  
  shouldIntegerWithinRange(options.gamepadIndex, 0, CONTROLLER.MAX - 1)
  
  let state = new XINPUT_STATE();

  const code = await promisify(lib.XInputGetState.async)(options.gamepadIndex, state.ref());
  if (code !== 0) throw new Failure(...translate.ERROR(code));

  const gamepad = ref.get(state.ref(), 4, XINPUT_GAMEPAD);
  const result = {
    dwPacketNumber: state.dwPacketNumber,
    Gamepad: {
      wButtons: options.translate ? translate.bitwise(gamepad.wButtons, CONTROLLER.BUTTONS): gamepad.wButtons, 
      bLeftTrigger: gamepad.bLeftTrigger,
      bRightTrigger: gamepad.bRightTrigger,
      sThumbLX: gamepad.sThumbLX,
      sThumbLY: gamepad.sThumbLY,
      sThumbRX: gamepad.sThumbRX,
      sThumbRY: gamepad.sThumbRY,
    }
  };

  return result;
}
    
async function setState(lowFrequency, highFrequency, gamepadIndex = 0){
  if (!lib.XInputSetState) throw new Failure(...NOT_FOUND)
  shouldIntegerWithinRange(gamepadIndex, 0, CONTROLLER.MAX - 1); 
  shouldIntegerWithinRange(lowFrequency, 0, 100);
  shouldIntegerWithinRange(highFrequency, 0, 100);
    
  const forceFeedBack = (i) => (CONTROLLER.MOTOR_SPEED / 100) * i;

  const vibration = new XINPUT_VIBRATION({
    wLeftMotorSpeed: forceFeedBack(lowFrequency),
    wRightMotorSpeed: forceFeedBack(highFrequency),
  });

  const code = await promisify(lib.XInputSetState.async)(gamepadIndex, vibration.ref());
  if (code !== 0) throw new Failure(...translate.ERROR(code));
}
    
async function getButtonsDown(option = {}){
  const options = {  
    gamepadIndex: isIntegerWithinRange(option.gamepadIndex, 0, CONTROLLER.MAX - 1) ? option.gamepadIndex : 0,
    deadzone: isIntegerWithinRange(option.deadzone, 0, 65534) || isSizeArrayOfIntegerWithinRange(option.deadzone, 2, 0, 65534) ? option.deadzone : [CONTROLLER.LEFT_THUMB_DEADZONE, CONTROLLER.RIGHT_THUMB_DEADZONE],
    directionThreshold: isNumberWithinRange(option.directionThreshold, 0, 1) ? option.directionThreshold : 0.2,
    triggerThreshold: isIntegerWithinRange(option.triggerThreshold, 0, 255) ? option.triggerThreshold : CONTROLLER.TRIGGER_THRESHOLD
  };

  const state = await getState({ gamepadIndex: options.gamepadIndex, translate: true });

  const result = {
    packetNumber: state.dwPacketNumber,
    buttons: state.Gamepad.wButtons,
    trigger: {
      left: {
        active: state.Gamepad.bLeftTrigger > options.triggerThreshold,
        force: state.Gamepad.bLeftTrigger
      },
      right: {
        active: state.Gamepad.bRightTrigger > options.triggerThreshold,
        force: state.Gamepad.bRightTrigger
      }
    },
    thumb: {
      left: normalizeThumb(state.Gamepad.sThumbLX, state.Gamepad.sThumbLY, options.deadzone?.[0] ?? options.deadzone, options.directionThreshold),
      right: normalizeThumb(state.Gamepad.sThumbRX, state.Gamepad.sThumbRY, options.deadzone?.[1] ?? options.deadzone, options.directionThreshold)
    }
  };

  return result;
}
    
async function rumble(option = {}){
  const options = {
    gamepadIndex: isIntegerWithinRange(option.gamepadIndex, 0, CONTROLLER.MAX - 1) ? option.gamepadIndex : 0,
    force: isIntegerWithinRange(option.force, 0, 100) || isSizeArrayOfIntegerWithinRange(option.force, 2, 0, 100) ? option.force : [50, 25],
    duration: isIntegerWithinRange(option.duration, 0, CONTROLLER.RUMBLE_DURATION) ? option.duration : CONTROLLER.RUMBLE_DURATION,
    forceEnableGamepad: option.forceEnableGamepad || false,
    forceStateWhileRumble: option.forceStateWhileRumble || false
  };

  const vibrate = ()=>{ return setState(options.force?.[0] ?? options.force, options.force?.[1] ?? options.force, options.gamepadIndex) };
      
  //Start Rumbling
  if (options.forceEnableGamepad) await enable(true);
  await vibrate();
  if (options.forceStateWhileRumble) {
    const endTime = Date.now() + options.duration;
    while (Date.now() < endTime) await vibrate(); //enforce vibration
  } else {
    await new Promise((resolve) => setTimeout(resolve, options.duration)).catch(() => {}); //Keep the event-loop alive for the rumble duration
  }
  await setState(0, 0, options.gamepadIndex); //State reset
}
    
async function isConnected(gamepadIndex = 0){
  shouldIntegerWithinRange(gamepadIndex, 0, CONTROLLER.MAX - 1); 
  try {
    await getState(gamepadIndex);
    return true;
  } catch {
    return false;
  }
}
    
async function listConnected(){
  let connected = Array(CONTROLLER.MAX).fill(false);
  
  for (let i = 0; i < CONTROLLER.MAX - 1; i++)
    if (await isConnected(i)) connected[i] = true;
      
  return connected;
}

async function identify(option = {}){
  const options = {
    XInputOnly: option.XInputOnly ?? true
  };
  
  const devices = await listDevices();
  
  return options.XInputOnly ? devices.filter( device => device.xinput === true) : devices;
}

export {
  enable,  
  getBatteryInformation,   
  getCapabilities, 
  getCapabilitiesEx,
  getState, 
  setState, 
  getButtonsDown, 
  rumble,
  isConnected,
  listConnected,
  identify
};