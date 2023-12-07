/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

import { setTimeout } from "node:timers/promises";
import { 
  shouldObj, 
  shouldIntegerWithinRange 
} from "@xan105/is/assert";
import { 
  asIntegerWithinRange,
  asSizeArrayOfIntegerWithinRange,
  asNumberWithinRange,
  asBoolean
} from "@xan105/is/opt";
import * as XInput from "../XInput/XInput.js";
import * as CONTROLLER from "../XInput/constants.js";
import { normalizeThumb } from "../util/analog.js";
import { listDevices } from "../util/PNPEntity.js";

async function isConnected(gamepad = 0){
  shouldIntegerWithinRange(gamepad, 0, CONTROLLER.XUSER_MAX_COUNT - 1); 
  try {
    await XInput.getState(gamepad);
    return true;
  } catch {
    return false;
  }
}
    
async function listConnected(){
  const connected = Array(CONTROLLER.XUSER_MAX_COUNT).fill(false);
  
  for (let i = 0; i < CONTROLLER.XUSER_MAX_COUNT; i++)
    if (await isConnected(i)) connected[i] = true;

  return connected;
}

async function getStateFallback(dwUserIndex){
  try{
    const state = await XInput.getStateEx({ dwUserIndex, translate: true }); //Include the guide button
    return state;
  }catch(err){
    if (err.code === "ERROR_CALL_NOT_IMPLEMENTED"){
      const state = await XInput.getState({ dwUserIndex, translate: true }) //Fallback
      return state;
    } else { throw err }
  }
}

async function getButtonsDown(option = {}){
  shouldObj(option);
  
  const options = {  
    gamepad: asIntegerWithinRange(option.gamepad, 0, CONTROLLER.XUSER_MAX_COUNT - 1) ?? 0,
    deadzone: asIntegerWithinRange(option.deadzone, 0, CONTROLLER.MOTOR_SPEED - 1) ?? 
              asSizeArrayOfIntegerWithinRange(option.deadzone, 2, 0, CONTROLLER.MOTOR_SPEED - 1) ?? 
              [CONTROLLER.LEFT_THUMB_DEADZONE, CONTROLLER.RIGHT_THUMB_DEADZONE],
    directionThreshold: asNumberWithinRange(option.directionThreshold, 0, 1) ?? 0.2,
    triggerThreshold: asIntegerWithinRange(option.triggerThreshold, 0, 255) ?? CONTROLLER.TRIGGER_THRESHOLD
  };

  const state = await getStateFallback(options.gamepad);

  const result = {
    packetNumber: state.dwPacketNumber,
    buttons: state.gamepad.wButtons,
    trigger: {
      left: {
        active: state.gamepad.bLeftTrigger > options.triggerThreshold,
        force: state.gamepad.bLeftTrigger
      },
      right: {
        active: state.gamepad.bRightTrigger > options.triggerThreshold,
        force: state.gamepad.bRightTrigger
      }
    },
    thumb: {
      left: normalizeThumb(state.gamepad.sThumbLX, state.gamepad.sThumbLY, options.deadzone?.[0] ?? options.deadzone, options.directionThreshold),
      right: normalizeThumb(state.gamepad.sThumbRX, state.gamepad.sThumbRY, options.deadzone?.[1] ?? options.deadzone, options.directionThreshold)
    }
  };

  return result;
}
    
async function rumble(option = {}){
  shouldObj(option);
  
  const options = {
    gamepad: asIntegerWithinRange(option.gamepad, 0, CONTROLLER.XUSER_MAX_COUNT - 1) ?? 0,
    force: asIntegerWithinRange(option.force, 0, 100) ?? 
           asSizeArrayOfIntegerWithinRange(option.force, 2, 0, 100) ?? 
           [50, 25],
    duration: asIntegerWithinRange(option.duration, 0, CONTROLLER.RUMBLE_DURATION) ?? CONTROLLER.RUMBLE_DURATION,
    forceEnableGamepad: asBoolean(option.forceEnableGamepad) ?? false,
    forceStateWhileRumble: asBoolean(option.forceStateWhileRumble) ?? false
  };
  
  const args = [
    options.force?.[0] ?? options.force,
    options.force?.[1] ?? options.force,
    { dwUserIndex: options.gamepad, usePercent: true }
  ];

  //Start Rumbling
  if (options.forceEnableGamepad) await XInput.enable(true);
  await XInput.setState(...args);
  if (options.forceStateWhileRumble) {
    const endTime = Date.now() + options.duration;
    while (Date.now() < endTime) await XInput.setState(...args); //enforce vibration
  } else {
    await setTimeout(options.duration, { ref: true }).catch(() => {}); //Keep the event-loop alive for the rumble duration
  }
  await XInput.setState(0, 0, args[2]); //State reset
}

async function identify(option = {}){
  shouldObj(option);
  
  const options = {
    XInputOnly: option.XInputOnly ?? true
  };
  
  const devices = await listDevices();
  
  return options.XInputOnly ? devices.filter( device => device.xinput === true) : devices;
}

export {
  isConnected,
  listConnected,
  getButtonsDown,
  rumble,
  identify
};