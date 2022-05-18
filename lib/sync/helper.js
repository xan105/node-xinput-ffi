/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

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
import * as XInput from "./xinput.js";
import { normalizeThumb } from "../util/analog.js";
import * as CONTROLLER from "../data/XInputController.js";

function isConnected(gamepad = 0){
  shouldIntegerWithinRange(gamepad, 0, CONTROLLER.XUSER_MAX_COUNT - 1); 
  try {
    XInput.getState(gamepad);
    return true;
  } catch {
    return false;
  }
}
    
function listConnected(){
  let connected = Array(CONTROLLER.XUSER_MAX_COUNT).fill(false);
  
  for (let i = 0; i < CONTROLLER.XUSER_MAX_COUNT - 1; i++)
    if (isConnected(i)) connected[i] = true;

  return connected;
}

function getButtonsDown(option = {}){
  shouldObj(option);
  
  const options = {  
    gamepad: asIntegerWithinRange(option.gamepad, 0, CONTROLLER.XUSER_MAX_COUNT - 1) ?? 0,
    deadzone: asIntegerWithinRange(option.deadzone, 0, 65534) ?? asSizeArrayOfIntegerWithinRange(option.deadzone, 2, 0, 65534) ?? [CONTROLLER.LEFT_THUMB_DEADZONE, CONTROLLER.RIGHT_THUMB_DEADZONE],
    directionThreshold: asNumberWithinRange(option.directionThreshold, 0, 1) ?? 0.2,
    triggerThreshold: asIntegerWithinRange(option.triggerThreshold, 0, 255) ?? CONTROLLER.TRIGGER_THRESHOLD
  };

  const state = XInput.getState({ dwUserIndex: options.gamepad, translate: true });

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
    
function rumble(option = {}){
  shouldObj(option);
  
  const options = {
    gamepad: asIntegerWithinRange(option.gamepad, 0, CONTROLLER.XUSER_MAX_COUNT - 1) ?? 0,
    force: asIntegerWithinRange(option.force, 0, 100) ?? asSizeArrayOfIntegerWithinRange(option.force, 2, 0, 100) ?? [50, 25],
    duration: asIntegerWithinRange(option.duration, 0, CONTROLLER.RUMBLE_DURATION) ?? CONTROLLER.RUMBLE_DURATION,
    forceEnableGamepad: asBoolean(option.forceEnableGamepad) ?? false,
    forceStateWhileRumble: asBoolean(option.forceStateWhileRumble) ?? false
  };

  const vibrate = ()=>{ 
    XInput.setState(options.force?.[0] ?? options.force, 
                    options.force?.[1] ?? options.force, 
                   { dwUserIndex: options.gamepad, usePercent: true }) 
  };
      
  //Start Rumbling
  if (options.forceEnableGamepad) XInput.enable(true);
  vibrate();
  //Block the event-loop for the rumble duration
  const endTime = Date.now() + options.duration;
  while (Date.now() < endTime) {
    if (options.forceStateWhileRumble) vibrate(); //enforce vibration
  }
  XInput.setState(0, 0, { dwUserIndex: options.gamepad, usePercent: true }); //State reset
}

export {
  isConnected,
  listConnected,
  getButtonsDown,
  rumble
};