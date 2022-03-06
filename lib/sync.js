/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

import ref from "ref-napi";
import { lib } from "./util/ffi.js";
import { Failure } from "@xan105/error";
import { normalizeThumb } from "./util/analog.js";

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

const errors = {
 api: ["This API isn't available !", "ERR_XINPUT_API_NOT_FOUND"],
 controller: [`Index of the user's controller must be a value from 0 to ${CONTROLLER.MAX - 1}`, "ERR_INVALID_ARGS"]
};

function enable(enable){
  if (!lib.XInputEnable) 
    throw new Failure(...errors.api)
  lib.XInputEnable(enable);
}
    
function GetBatteryInformation(gamepadIndex = 0){
  if (!lib.XInputGetBatteryInformation)
    throw new Failure(...errors.api)
  if (!Number.isInteger(gamepadIndex) || gamepadIndex < 0 || gamepadIndex > CONTROLLER.MAX - 1)
    throw new Failure(...errors.controller);

  const BATTERY_DEVTYPE_GAMEPAD = 0;
  const BATTERY_DEVTYPE_HEADSET = 1;
  
  let battery = new XINPUT_BATTERY_INFORMATION();

  const code = lib.XInputGetBatteryInformation(gamepadIndex, BATTERY_DEVTYPE_GAMEPAD, battery.ref()); 
  //I don't see the use of BATTERY_DEVTYPE_HEADSET ? So I'm only using BATTERY_DEVTYPE_GAMEPAD

  if (code !== 0) throw new Failure(...translate.ERROR(code));

  const result = {
    BatteryType: translate.BATTERY_TYPE(battery.BatteryType),
    BatteryLevel: translate.BATTERY_LEVEL(battery.BatteryLevel),
  };

  return result;
}
    
function GetCapabilities(gamepadIndex = 0){
  if (!lib.XInputGetCapabilities)
    throw new Failure(...errors.api)
  if (!Number.isInteger(gamepadIndex) || gamepadIndex < 0 || gamepadIndex > CONTROLLER.MAX - 1)
    throw new Failure(...errors.controller);

  const XINPUT_FLAG_GAMEPAD = 1;
  /*
    only XINPUT_FLAG_GAMEPAD (1) is supported as of writing 
		Limit query to devices of Xbox 360 Controller type
		If this value is 0, then the capabilities of all controllers connected to the system are returned (???)
		Any values other than 0 or 1 are illegal and will result in an error break
	*/

  let capabilities = new XINPUT_CAPABILITIES();

  const code = lib.XInputGetCapabilities(gamepadIndex, XINPUT_FLAG_GAMEPAD, capabilities.ref());
  if (code !== 0) throw new Failure(...translate.ERROR(code));

  const gamepad = ref.get(capabilities.ref(), 6, XINPUT_GAMEPAD);
  const vibration = ref.get(capabilities.ref(), 20, XINPUT_VIBRATION);

  const result = {
    Type: translate.DEVTYPE(capabilities.Type),
    SubType: translate.DEVSUBTYPE(capabilities.SubType),
    Flags: translate.bitwise(capabilities.Flags, CONTROLLER.FLAGS),
    Gamepad: {
      wButtons: translate.bitwise(gamepad.wButtons, CONTROLLER.BUTTONS),
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

function GetCapabilitiesEx(gamepadIndex = 0){
  if (!lib.XInputGetCapabilitiesEx)
    throw new Failure(...errors.api)
  if (!Number.isInteger(gamepadIndex) || gamepadIndex < 0 || gamepadIndex > CONTROLLER.MAX - 1)
    throw new Failure(...errors.controller);

  let capabilitiesEx = new XINPUT_CAPABILITIES_EX();

  const code = lib.XInputGetCapabilitiesEx(1, gamepadIndex, 0, capabilitiesEx.ref());
  if (code !== 0) throw new Failure(...translate.ERROR(code));

  const capabilities = ref.get(capabilitiesEx.ref(), 0, XINPUT_CAPABILITIES);
  const gamepad = ref.get(capabilities.ref(), 6, XINPUT_GAMEPAD);
  const vibration = ref.get(capabilities.ref(), 20, XINPUT_VIBRATION);

  const result = {
    Capabilities: {
      Type: translate.DEVTYPE(capabilities.Type),
      SubType: translate.DEVSUBTYPE(capabilities.SubType),
      Flags: translate.bitwise(capabilities.Flags, CONTROLLER.FLAGS),
      Gamepad: {
        wButtons: translate.bitwise(gamepad.wButtons, CONTROLLER.BUTTONS),
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
    VendorId: capabilitiesEx.VendorId.toString(16),
    ProductId: capabilitiesEx.ProductId.toString(16),
    VersionNumber: capabilitiesEx.VersionNumber.toString(16),
    unk1: capabilitiesEx.unk1
  };

  return result;
}
    
function getState(gamepadIndex = 0){
  if (!lib.XInputGetState)
    throw new Failure(...errors.api)
  if (!Number.isInteger(gamepadIndex) || gamepadIndex < 0 || gamepadIndex > CONTROLLER.MAX - 1)
    throw new Failure(...errors.controller);

  let state = new XINPUT_STATE();

  const code = lib.XInputGetState(gamepadIndex, state.ref());
  if (code !== 0) throw new Failure(...translate.ERROR(code));

  const gamepad = ref.get(state.ref(), 4, XINPUT_GAMEPAD);
  const result = {
    dwPacketNumber: state.dwPacketNumber,
    Gamepad: {
      wButtons: translate.bitwise(gamepad.wButtons, CONTROLLER.BUTTONS), 
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
    
function setState(lowFrequency, highFrequency, gamepadIndex = 0){
  if (!lib.XInputSetState)
    throw new Failure(...errors.api)
  if (!Number.isInteger(gamepadIndex) || gamepadIndex < 0 || gamepadIndex > CONTROLLER.MAX - 1)
    throw new Failure(...errors.controller); 
  if (!Number.isInteger(lowFrequency) || lowFrequency < 0 || lowFrequency > 100)
    throw new Failure("Low-frequency rumble range 0-100%", "ERR_INVALID_ARGS"); 
  if (!Number.isInteger(highFrequency) || highFrequency < 0 || highFrequency > 100)
    throw new Failure("High-frequency rumble range 0-100%", "ERR_INVALID_ARGS");
    
  const forceFeedBack = (i) => (CONTROLLER.MOTOR_SPEED / 100) * i;

  const vibration = new XINPUT_VIBRATION({
    wLeftMotorSpeed: forceFeedBack(lowFrequency),
    wRightMotorSpeed: forceFeedBack(highFrequency),
  });

  const code = lib.XInputSetState(gamepadIndex, vibration.ref());
  if (code !== 0) throw new Failure(...translate.ERROR(code));
}
    
function getButtonsDown(option = {}){
  const options = {
    gamepadIndex: Number.isInteger(option.gamepadIndex) && option.gamepadIndex >= 0 && option.gamepadIndex < CONTROLLER.MAX - 1 ? option.gamepadIndex : 0,
    deadzone: option.deadzone && (Number.isInteger(option.deadzone) || Array.isArray(option.deadzone)) ? option.deadzone : [CONTROLLER.LEFT_THUMB_DEADZONE, CONTROLLER.RIGHT_THUMB_DEADZONE],
    directionThreshold: option.directionThreshold >= 0 && option.directionThreshold <= 1 ? option.directionThreshold : 0.2,
    triggerThreshold: Number.isInteger(option.triggerThreshold) && option.triggerThreshold >= 0 && option.triggerThreshold <= 255 ? option.triggerThreshold : CONTROLLER.TRIGGER_THRESHOLD
  };

  const state = getState(options.gamepadIndex);

  let result = {
    packetNumber: state.dwPacketNumber,
    buttons: state.Gamepad.wButtons,
    trigger: {
      left: {
        active: state.Gamepad.bLeftTrigger > options.triggerThreshold ? true : false,
        force: state.Gamepad.bLeftTrigger
      },
      right: {
        active: state.Gamepad.bRightTrigger > options.triggerThreshold ? true : false,
        force: state.Gamepad.bRightTrigger
      }
    }
  };

  if ( Array.isArray(options.deadzone) && options.deadzone.length === 2 && options.deadzone.every((i) => Number.isInteger(i)) ) {
    result.thumb = {
      left: normalizeThumb(state.Gamepad.sThumbLX, state.Gamepad.sThumbLY, options.deadzone[0], options.directionThreshold),
      right: normalizeThumb(state.Gamepad.sThumbRX, state.Gamepad.sThumbRY, options.deadzone[1], options.directionThreshold),
    };
  } else {
    result.thumb = {
      left: normalizeThumb(state.Gamepad.sThumbLX, state.Gamepad.sThumbLY, options.deadzone, options.directionThreshold),
      right: normalizeThumb(state.Gamepad.sThumbRX, state.Gamepad.sThumbRY, options.deadzone, options.directionThreshold)
    };
  }

  return result;
}
    
function rumble(option = {}){
  const options = {
    force: option.force && (Number.isInteger(option.force) || Array.isArray(option.force)) ? option.force : [50, 25],
    duration: option.duration && Number.isInteger(option.duration) && option.duration < CONTROLLER.RUMBLE_DURATION && option.duration > 0 ? option.duration : CONTROLLER.RUMBLE_DURATION,
    forceEnableGamepad: option.forceEnableGamepad || false,
    forceStateWhileRumble: option.forceStateWhileRumble || false,
    gamepadIndex: Number.isInteger(option.gamepadIndex) && option.gamepadIndex >= 0 && option.gamepadIndex < CONTROLLER.MAX - 1 ? option.gamepadIndex : 0
  };

  if (options.forceEnableGamepad) enable(true);

  let vibrate = ()=>{}; 
      
  if ( Array.isArray(options.force) && options.force.length === 2 && options.force.every((i) => Number.isInteger(i)) ) {
    vibrate = ()=>{ return setState(options.force[0], options.force[1], options.gamepadIndex) };
  } else {
    vibrate = ()=>{ return setState(options.force, options.force, options.gamepadIndex) };
  }
      
  vibrate(); //Start Rumbling
      
  //Block the event-loop for the rumble duration
  const endTime = Date.now() + options.duration;
  while (Date.now() < endTime) {
    if (options.forceStateWhileRumble) //enforce vibration
      vibrate();
  }

  setState(0, 0, options.gamepadIndex); //State reset
}
    
function isConnected(gamepadIndex = 0){
  if (!Number.isInteger(gamepadIndex) || gamepadIndex < 0 || gamepadIndex > CONTROLLER.MAX - 1)
    throw new Failure(...errors.controller);
    
  try {
    getState(gamepadIndex);
    return true;
  } catch {
    return false;
  }
}
    
function listConnected(){
  let connected = Array(CONTROLLER.MAX).fill(false);
  
  for (let i = 0; i < CONTROLLER.MAX - 1; i++)
    if (isConnected(i)) connected[i] = true;
      
  return connected;
}

export {
  enable,  
  GetBatteryInformation,   
  GetCapabilities, 
  //GetCapabilitiesEx,
  getState, 
  setState, 
  getButtonsDown, 
  rumble,
  isConnected,
  listConnected
};