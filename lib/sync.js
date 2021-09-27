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

import ref from "ref-napi";
import { lib } from "./ffi.js";
import { Failure } from "./util/error.js";
import { normalizeThumb } from "./util/analog.js";

import {
  XINPUT_BATTERY_INFORMATION,
  XINPUT_CAPABILITIES,
  XINPUT_STATE,
  XINPUT_GAMEPAD,
  XINPUT_VIBRATION
} from "./data/XInputStruct.js";

//constroller constants
import * as CONTROLLER from "./data/XInputController.js";
//code translator
import * as whatIs from "./data/XInputCode.js";

function enable(enable){
  lib.XInputEnable(enable);
}
    
function GetBatteryInformation(gamepadIndex = 0){
  if (!Number.isInteger(gamepadIndex) || gamepadIndex < 0 || gamepadIndex > CONTROLLER.MAX - 1)
    throw new Failure(`Index of the user's controller must be a value from 0 to ${CONTROLLER.MAX - 1}`, "ERR_INVALID_ARGS");

  let battery = new XINPUT_BATTERY_INFORMATION();

  const code = lib.XInputGetBatteryInformation(gamepadIndex, 0, battery.ref()); 
  /*
    BATTERY_DEVTYPE_GAMEPAD (0) | BATTERY_DEVTYPE_HEADSET (1)
		I don't see the use of BATTERY_DEVTYPE_HEADSET ? So I'm only using 0
  */

  if (code !== 0) throw new Failure(...whatIs.ERROR(code));

  const result = {
    BatteryType: whatIs.BATTERY_TYPE(battery.BatteryType),
    BatteryLevel: whatIs.BATTERY_LEVEL(battery.BatteryLevel),
  };

  return result;
}
    
function GetCapabilities(gamepadIndex = 0){
  if (!Number.isInteger(gamepadIndex) || gamepadIndex < 0 || gamepadIndex > CONTROLLER.MAX - 1)
    throw new Failure(`Index of the user's controller must be a value from 0 to ${CONTROLLER.MAX - 1}`, "ERR_INVALID_ARGS");

  let capabilities = new XINPUT_CAPABILITIES();

  const code = lib.XInputGetCapabilities(gamepadIndex, 1, capabilities.ref());
  /*
    only XINPUT_FLAG_GAMEPAD (1) is supported as of writing 
		Limit query to devices of Xbox 360 Controller type
		If this value is 0, then the capabilities of all controllers connected to the system are returned (???)
		Any values other than 0 or 1 are illegal and will result in an error break
	*/
	
  if (code !== 0) throw new Failure(...whatIs.ERROR(code));

  const result = {
    Type: whatIs.DEVTYPE(capabilities.Type),
    SubType: whatIs.DEVSUBTYPE(capabilities.SubType),
    Flags: whatIs.CAPS(capabilities.Flags),
  };

  return result;
}
    
function getState(gamepadIndex = 0){
  if (!Number.isInteger(gamepadIndex) || gamepadIndex < 0 || gamepadIndex > CONTROLLER.MAX - 1)
    throw new Failure(`Index of the user's controller must be a value from 0 to ${CONTROLLER.MAX - 1}`, "ERR_INVALID_ARGS");

  let state = new XINPUT_STATE();

  const code = lib.XInputGetState(gamepadIndex, state.ref());

  if (code !== 0) throw new Failure(...whatIs.ERROR(code));

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
}
    
function setState(lowFrequency, highFrequency, gamepadIndex = 0){
  if (!Number.isInteger(gamepadIndex) || gamepadIndex < 0 || gamepadIndex > CONTROLLER.MAX - 1)
    throw new Failure(`Index of the user's controller must be a value from 0 to ${CONTROLLER.MAX - 1}`, "ERR_INVALID_ARGS"); 
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

  if (code !== 0) throw new Failure(...whatIs.ERROR(code));
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
    buttons: whatIs.BUTTONS(state.Gamepad.wButtons),
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
    throw new Failure(`Index of the user's controller must be a value from 0 to ${CONTROLLER.MAX - 1}`, "ERR_INVALID_ARGS");
    
  try {
    getState(gamepadIndex);
    return true;
  } catch {
    return false;
  }
}
    
function listConnected(){
  let connected = Array(CONTROLLER.MAX).fill(false);
  
  for (let i = 0; i < CONTROLLER.MAX - 1; i++){ 
    if (this.isConnected(i)){
      connected[i] = true;
    }
  }
      
  return connected;
}

export {
  enable,  
  GetBatteryInformation,   
  GetCapabilities,   
  getState, 
  setState, 
  getButtonsDown, 
  rumble,
  isConnected,
  listConnected
};