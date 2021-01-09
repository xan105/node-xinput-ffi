XInput wrapper via [ffi-napi](https://www.npmjs.com/package/ffi-napi)

Quick Examples
==============

```js
const XInput = require("xinput-ffi"); //CommonJS
//OR
import * as XInput from "xinput-ffi"; //ES Module

//Check connected status for all controller
console.log( XInput.sync.listConnected() )
// [true,false,false,false] Only 1st gamepad is connected

XInput.sync.rumble(); //Rumble 1st XInput gamepad
XInput.sync.rumble({force: 100}); //Now with 100% force

//low-frequency rumble motor(left) at 50% 
//and high-frequency rumble motor (right) at 25%
XInput.sync.rumble({force: [50,25]});

//Promises
(async()=>{

  //Rumble 2nd XInput gamepad shortly for 1sec
  await XInput.rumble({duration: 1000, gamepadIndex: 1});

  const state = await XInput.getState();
  console.log(state);
  /* Output:
    {
      dwPacketNumber: 322850,
      Gamepad: { wButtons: 0,
        bLeftTrigger: 0,
        bRightTrigger: 0,
        sThumbLX: 128,
        sThumbLY: 641,
        sThumbRX: -1156,
        sThumbRY: -129
      }
    }
  */
  
  //Set 1st XInput gamepad state to 50% left/right; 
  //Wait 2sec; Reset state to idle
  await XInput.setState(50,50);
  await new Promise(resolve => setTimeout(resolve, 2000)).catch(()=>{});
  await XInput.setState(0,0);
  
  //Set 1st XInput gamepad state to 50% left/right; 
  //Wait 500ms and disable all XInput gamepads
  await XInput.setState(50,50);
  await new Promise(resolve => setTimeout(resolve, 500)).catch(()=>{});
  await XInput.enable(false);
  
  //Identify all connected XInput devices
  console.log ( await XInput.identify.XInputDevices() ); 
  /* Output:
	[
	  {
		guid: '{745a17a0-74d3-11d0-b6fe-00a0c90f57da}',
		vid: '045E',
		pid: '028E',
		interfaces: [ 'USB', 'HID' ],
		manufacturer: 'Microsoft Corp.',
		name: 'Xbox360 Controller'
	  },...
	]
  */
  
  //Identify all known HID,USB connected devices
  console.log ( await XInput.identify.knownDevices() );
  /* Output:
	[
	  {
		manufacturer: 'Sony Corp.',
		name: 'DualShock 4 USB Wireless Adaptor',
		vid: '054C',
		pid: '0BA0',
		interfaces: [ 'USB', 'HID' ],
		guid: [
		  '{745a17a0-74d3-11d0-b6fe-00a0c90f57da}',
		  '{36fc9e60-c465-11cf-8056-444553540000}',
		  '{4d36e96c-e325-11ce-bfc1-08002be10318}'
		],
		xinput: false
	  },...
	]
  */

})().catch(console.error);

```

Installation
============

```npm install xinput-ffi```

Prequisites: C/C++ build tools (Visual Studio) and Python 2.7 (node-gyp) in order to build [ffi-napi](https://www.npmjs.com/package/ffi-napi).

API
===

> sync method starts with **sync**._name_ otherwise it's a promise.

💡 I recommend you do use promise so that you will not block Node's event loop.

## XInput fn 
cf: https://docs.microsoft.com/en-us/windows/win32/xinput/functions

### void enable(bool enable)
cf: [XInputEnable](https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputenable) (1_4,1_3)<br />
Enable/Disable all XInput gamepads.

NB:
 - Stop any rumble currently playing when set to false.
 - setState will throw "ERROR_DEVICE_NOT_CONNECTED" when set to false.
 
### obj GetBatteryInformation(int [gamepadIndex]) 
cf: [XInputGetBatteryInformation](https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputgetbatteryinformation) (1_4)<br />
Retrieves the battery type and charge status of the specified controller.

gamepadIndex: Index of the user's controller. Can be a value from 0 to 3.<br />
gamepadIndex defaults to 0 (1st XInput gamepad)<br />
If gamepad is not connected throw "ERROR_DEVICE_NOT_CONNECTED".

Returns an object like a [XINPUT_BATTERY_INFORMATION](https://docs.microsoft.com/en-us/windows/win32/api/xinput/ns-xinput-xinput_battery_information) structure.

💡 When a value is known it will be 'translated' to its string equivalent value otherwise its integer value.

Output example
```js
{
  BatteryType: 'BATTERY_TYPE_WIRED',
  BatteryLevel: 'BATTERY_LEVEL_FULL'
}
```

### obj GetCapabilities(int [gamepadIndex])
cf: [XInputGetCapabilities](https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputgetcapabilities) (1_4,1_3,9_1_0)<br />
Retrieves the capabilities and features of the specified controller.

gamepadIndex: Index of the user's controller. Can be a value from 0 to 3.<br />
gamepadIndex defaults to 0 (1st XInput gamepad)<br />
If gamepad is not connected throw "ERROR_DEVICE_NOT_CONNECTED".

Returns an object like a [XINPUT_CAPABILITIES](https://docs.microsoft.com/en-us/windows/win32/api/xinput/ns-xinput-xinput_capabilities) structure.
But without :
- XINPUT_GAMEPAD Gamepad
- XINPUT_VIBRATION Vibration

💡 When a value is known it will be 'translated' to its string equivalent value otherwise its integer value.

Output example
```js
{
  Type: 'XINPUT_DEVTYPE_GAMEPAD',
  SubType: 'XINPUT_DEVSUBTYPE_GAMEPAD',
  Flags: 12
}
```
 
### obj getState(int [gamepadIndex])
cf: [XInputGetState](https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputgetstate) (1_4,1_3,9_1_0)<br />
Retrieves the current state of the specified controller.

gamepadIndex: Index of the user's controller. Can be a value from 0 to 3.<br />
gamepadIndex defaults to 0 (1st XInput gamepad)<br />
If gamepad is not connected throw "ERROR_DEVICE_NOT_CONNECTED".

Returns an object like a [XINPUT_STATE](https://docs.microsoft.com/en-us/windows/win32/api/xinput/ns-xinput-xinput_state) structure.

💡 To know which button**s** are currently pressed down you need to _bitwise AND (&)_ wButtons with all [XINPUT BUTTONS](https://docs.microsoft.com/en-us/windows/win32/api/xinput/ns-xinput-xinput_gamepad#members)
You can use [getButtonsDown()](https://github.com/xan105/node-xinput-ffi#obj-getbuttonsdownint-gamepadindex) for this (see below in helper fn ...)

Output example
```js
    {
      dwPacketNumber: 322850,
      Gamepad: { wButtons: 0,
        bLeftTrigger: 0,
        bRightTrigger: 0,
        sThumbLX: 128,
        sThumbLY: 641,
        sThumbRX: -1156,
        sThumbRY: -129
      }
    }
```

### void setState(int lowFrequency, int highFrequency, int [gamepadIndex])
cf: [XInputSetState](https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputsetstate) (1_4,9_1_0)<br />
Sends data to a connected controller. This function is used to activate the vibration function of a controller.

gamepadIndex: Index of the user's controller. Can be a value from 0 to 3.<br />
gamepadIndex defaults to 0 (1st XInput gamepad)<br />
If gamepad is not connected throw "ERROR_DEVICE_NOT_CONNECTED".

NB:
- You need to keep the event-loop alive otherwise the vibration will terminate with your program.<br />
- You need to reset the state to 0 for both frequency before using setState again.<br />

Both are done for you with [rumble()](https://github.com/xan105/node-xinput-ffi#void-rumbleobj-option) (see below in Helper fn...)

<hr>

## Helper fn

> The following are sugar functions based upon previous functions.

### obj getButtonsDown(obj [option])
getState() wrapper to know more easily which buttons are pressed if any.
Also returns the rest of getState() information normalized for convenience such as 
ThumbStick position, magnitude, direction (taking the deadzone into account).
Trigger state and force (taking threshold into account).

options:
	- gamepadIndex: Index of the user's controller. Can be a value from 0 to 3. _defaults to 0 (1st XInput gamepad)_
	- deadzone: thumbstick deadzone(s)
				Either an integer (both thumbstick with the same value) or an array of 2 integer: [left,right]
				_defaults to XInput default's values of [7849,8689]_
	- directionThreshold: float [0.0,1.0] to handle cardinal direction.
						  Set it to 0 to only get "UP RIGHT", "UP LEFT", "DOWN LEFT", "DOWN RIGHT".
						  Otherwise add "RIGHT", "LEFT", "UP", "DOWN" to the previous using threshold to 
						  differentiate the 2 axes by using range of [-threshold,threshold].
						  _defaults to 0.2_
	- triggerThreshold: int [0,255] trigger activation threshold.
						_defaults to XInput value of 30_

Returns an object where:
- int packetNumber : dwPacketNumber; This value is increased every time the state of the controller has changed.
- []string buttons : list of currently pressed [buttons](https://docs.microsoft.com/en-us/windows/win32/api/xinput/ns-xinput-xinput_gamepad#members)
- trigger.left/right :
	+ bool active : is the trigger pressed down ? (below triggerThreshold will not set active to true)
	+ int force : by how much ? [0,255]
- thumb.left/right :
	+ float x: normalized (deadzone) x axis [0.0,1.0]. 0 is centered. Negative values is left. Positive values is right.
	+ float y: normalized (deadzone) y axis [0.0,1.0]. 0 is centered. Negative values is down. Positive values is up.
	+ float magnitude: normalized (deadzone) magnitude [0.0,1.0] (by how far is the thumbstick from the center ? 1 is fully pushed).
	+ []string direction: Human readable direction of the thumbstick. eg: ["UP", "RIGHT"]. See directionThreshold above for details.

Electron example:
```js

let state = { previous : 0, current : 0 };

function inputLoop(){

	XInput.getButtonsDown()
	.then((controller)=>{
		
		state.current = controller.packetNumber; 
		
		if (state.current > state.previous){ //State update
			//Current buttons down
			console.log(controller.buttons)
			
			//Current thumbstick direction
			console.log(controller.thumb.left.direction);
			console.log(controller.thumb.right.direction);
			
			//Current trigger status
			if (controller.trigger.left.active) console.log(`trigger L (${controller.trigger.left.force})`);
			if (controller.trigger.right.active) console.log(`trigger R (${controller.trigger.right.force})`);
			
		}
		
		state.previous = state.current;

	})
	.catch((err)=>{
		console.warn(err);
	})
	.finally(()=>{
		window.requestAnimationFrame(inputLoop); 
	});
}
window.requestAnimationFrame(inputLoop);
```

NB: To handle button up (press down then release)<br/>
ignoring hold button until they are released<br/>
You should store the previous buttons state and check it against the current.<br/>

Example:		
```js

let state = {
	previous : {
		packetNumber: 0,
		buttons: []
	}, current : {}
};

function inputLoop(){

	XInput.getButtonsDown()
	.then((controller)=>{
	
		state.current = controller;
		if (state.current.packetNumber > state.previous.packetNumber){ //State update		
			const diff = state.previous.buttons.filter(btn => !state.current.buttons.includes(btn)) 
			console.log(diff);
		}
		
		...
```
			
### void rumble(obj [option])
This function is used to activate the vibration function of a controller.<br />

options:
  - force : Rumble force to apply to the motors. 
            Either an integer (both motor with the same value) or an array of 2 integer: [left,right]
            _defaults to [50,25]_
  - duration: Rumble duration in ms. Max: 2500 ms. _defaults to max_
  - forceEnableGamepad: Use **enable()** to force the activation of XInput gamepad before rumble. _defaults to false_
  - gamepadIndex: Index of the user's controller. Can be a value from 0 to 3. _defaults to 0 (1st XInput gamepad)_
  
### bool isConnected(int [gamepadIndex])
whether the specified controller is connected or not.<br />
Returns true/false

### Array listConnected(void)
Returns an array of connected status for all controller.<br />
eg: [true,false,false,false] //Only 1st gamepad is connected

<hr>

## Identify device (VID,PID,GUID,Name, ...)

⚠️ The following functions are only available as Promise.

Since XINPUT doesn't provide VID/PID by design, query WMI _Win32_PNPEntity_ via PowerShell.

> method starts with **identify**._name_

### []obj XInputDevices(void)
List all connected **XInput** device information.

Return an array of obj where
- string guid : the classguid (unique)
- string vid : vendor id
- string pid : product id
- []string interfaces : PNPentity interface(s) found (eg: HID, USB, ...)
- string|null manufacturer: The PNPentity's manufacturer. _Null_ when non-english local generic value like "(something)". If the manufacturer is _Null_ but the vid is known in `lib/PNPEntity/vendor.json` then it will be replaced.
- string [name] : If found, the device name from `lib/PNPEntity/vendor.json`

💡 obj are unique by their guid

Output example with a DS4(wireless) and ds4windows(_DirectInput -> XInput wrapper_):
```js
console.log ( await XInput.identify.XInputDevices() )
[
	{
		guid: '{745a17a0-74d3-11d0-b6fe-00a0c90f57da}',
		vid: '045E',
		pid: '028E',
		interfaces: [ 'USB', 'HID' ],
		manufacturer: 'Microsoft Corp.',
		name: 'Xbox360 Controller'
	}
]
```

### []obj knownDevices(void)
List all **known** HID and USB connected devices **by matching with entries in** `lib/PNPEntity/vendor.json`

⚠️ Unlike the previous function if it's not in vendor.json it won't be listed **but** other devices than XInput such as DirectInput, HID only powered device will (= Not XInput exclusive). 

Return an array of obj where
- string manufacturer : vendor name
- string name : device name
- string vid : vendor id (unique)
- string pid : product id (unique)
- []string interfaces : PNPentity interface(s) found; Available: HID and USB
- []string guid: classguid(s) found
- bool xinput: If it's a XInput device or not

💡 obj are unique by their vid/pid

Output example with a DS4(wireless) and ds4windows(_DirectInput -> XInput wrapper_):
```js
console.log ( await XInput.identify.knownDevices() )
[
  {
    manufacturer: 'Sony Corp.',
    name: 'DualShock 4 USB Wireless Adaptor',
    vid: '054C',
    pid: '0BA0',
    interfaces: [ 'USB', 'HID' ],
    guid: [
      '{745a17a0-74d3-11d0-b6fe-00a0c90f57da}',
      '{36fc9e60-c465-11cf-8056-444553540000}',
      '{4d36e96c-e325-11ce-bfc1-08002be10318}'
    ],
    xinput: false
  },
  {
    manufacturer: 'Microsoft Corp.',
    name: 'Xbox360 Controller',
    vid: '045E',
    pid: '028E',
    interfaces: [ 'USB', 'HID' ],
    guid: [
      '{745a17a0-74d3-11d0-b6fe-00a0c90f57da}',
      '{d61ca365-5af4-4486-998b-9db4734c6ca3}'
    ],
    xinput: true
  }
]
```

Compatibility
=============

- Windows 8: xinput1_4
- Windows 7 (DirectX SDK): xinput1_3
- Windows Vista (Legacy): xinput9_1_0

Identify device requires PowerShell
