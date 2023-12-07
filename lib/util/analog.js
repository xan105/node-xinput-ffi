/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

import { shouldInteger, shouldNumber } from "@xan105/is/assert";
import { THUMB_MAX } from "../XInput/constants.js";

function normalizeThumb(x, y, deadzone, directionThreshold) {
  shouldInteger(x);
  shouldInteger(y);
  shouldInteger(deadzone);
  shouldNumber(directionThreshold)

  //cf: https://docs.microsoft.com/en-us/windows/win32/xinput/getting-started-with-xinput#dead-zone
  let magnitude = Math.sqrt(x * x + y * y);

  const normalizedX = x / magnitude;
  const normalizedY = y / magnitude;

  let normalizedMagnitude = 0.0;
  if (magnitude > deadzone) {
    //clip the magnitude at its expected maximum value
    if (magnitude > THUMB_MAX ) magnitude = THUMB_MAX;

    //adjust magnitude relative to the end of the dead zone
    magnitude -= deadzone;

    //optionally normalize the magnitude with respect to its expected range
    //giving a magnitude value of 0.0 to 1.0
    normalizedMagnitude = magnitude / (THUMB_MAX  - deadzone);
  } //if the controller is in the deadzone zero out the magnitude
  else {
    magnitude = 0.0;
    normalizedMagnitude = 0.0;
  }

  const result = { 
    x: normalizedX, 
    y: normalizedY, 
    magnitude: normalizedMagnitude,
    direction: normalizedMagnitude > 0 ? getThumbDirection(normalizedX, normalizedY, directionThreshold) : [] //out of the deadzone : in the deadzone
  };

  return result;
}

function getThumbDirection(x, y, threshold) {
  let direction = [];
  
  if (threshold > 0 && x > 0 && y >= -threshold && y <= threshold) direction = ["RIGHT"];
  else if (threshold > 0 && x < 0 && y >= -threshold && y <= threshold) direction = ["LEFT"];
  else if (threshold > 0 && y > 0 && x >= -threshold && x <= threshold) direction = ["UP"];
  else if (threshold > 0 && y < 0 && x >= -threshold && x <= threshold) direction = ["DOWN"];
  else if (y > 0 && x > 0) direction = ["UP", "RIGHT"];
  else if (y > 0 && x < 0) direction = ["UP", "LEFT"];
  else if (y < 0 && x < 0) direction = ["DOWN", "LEFT"];
  else if (y < 0 && x > 0) direction = ["DOWN", "RIGHT"];

  return direction;
}

export { normalizeThumb };