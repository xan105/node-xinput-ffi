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

function normalizeThumb(x, y, deadzone, directionThreshold){

	if (!Number.isInteger(x)) throw "X is not an integer !";
	if (!Number.isInteger(y)) throw "Y is not an integer !";
	if (!Number.isInteger(deadzone)) throw "deadzone is not an integer !";

	//cf: https://docs.microsoft.com/en-us/windows/win32/xinput/getting-started-with-xinput#dead-zone
	let magnitude = Math.sqrt( (x*x) + (y*y) );

	const normalizedX = x / magnitude;
	const normalizedY = y / magnitude;
	
	const XINPUT_THUMB_MAX = 32767;
	
	let normalizedMagnitude = 0.0;
	if (magnitude > deadzone)
	{
		//clip the magnitude at its expected maximum value
		if (magnitude > XINPUT_THUMB_MAX) magnitude = XINPUT_THUMB_MAX;

		//adjust magnitude relative to the end of the dead zone
		magnitude -= deadzone;

		//optionally normalize the magnitude with respect to its expected range
		//giving a magnitude value of 0.0 to 1.0
		normalizedMagnitude = magnitude / (XINPUT_THUMB_MAX - deadzone);
	}
	else //if the controller is in the deadzone zero out the magnitude
	{
		magnitude = 0.0;
		normalizedMagnitude = 0.0;
	}
	
	let result = { x: normalizedX, y: normalizedY, magnitude: normalizedMagnitude };
	
	if (normalizedMagnitude > 0){ // out of the deadzone
		result.direction = getThumbDirection(normalizedX, normalizedY, directionThreshold);
	} else {
		result.direction = [];
	}
	
	return result;
}

function getThumbDirection(x, y, threshold){

	let direction = [];

	if (threshold > 0 && x > 0 && (y >= -threshold && y <= threshold)) direction = ["RIGHT"];
	else if (threshold > 0 && x < 0 && (y >= -threshold && y <= threshold)) direction = ["LEFT"];	
	else if (threshold > 0 && y > 0 && (x >= -threshold && x <= threshold)) direction = ["UP"];
	else if (threshold > 0 && y < 0 && (x >= -threshold && x <= threshold)) direction = ["DOWN"];	
				
	else if (y > 0 && x > 0) direction = ["UP", "RIGHT"];
	else if (y > 0 && x < 0) direction = ["UP", "LEFT"];		
	else if (y < 0 && x < 0) direction = ["DOWN", "LEFT"];
	else if (y < 0 && x > 0) direction = ["DOWN", "RIGHT"];
	
	return direction;
}

module.exports = { normalizeThumb };