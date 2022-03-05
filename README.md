About
=====

XInput wrapper via [node-ffi-napi](https://www.npmjs.com/package/ffi-napi). Access native xinput functions as well as some helpers based around them.

This lib hooks directly to the system dll (xinput1_4.dll, xinput1_3.dll or xinput9_1_0.dll).

Examples
========

Vibration (_helper fn_)

```js
import { rumble } from "xinput-ffi/promises";

//Rumble 1st XInput gamepad
await rumble();

//Now with 100% force
await rumble({force: 100}); 

//low-frequency rumble motor(left) at 50% 
//and high-frequency rumble motor (right) at 25%
await rumble({force: [50,25]});
```

Direct use of XInput functions

```js
import { promises as XInput } from "xinput-ffi";

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
```

Misc

```js 
import { promises as XInput } from "xinput-ffi";

//Check connected status for all controller
console.log(await XInput.listConnected());
// [true,false,false,false] Only 1st gamepad is connected
  
//Identify connected XInput devices
console.log (await XInput.identify({XInputOnly: true})); 
/* Output:
  [
    {
      manufacturer: 'Microsoft Corp.',
      name: 'Xbox360 Controller',
      vid: '045E',
      pid: '028E',
      xinput: true,
      interfaces: [ 'USB', 'HID' ],
      guid: [
        '{745a17a0-74d3-11d0-b6fe-00a0c90f57da}',
        '{d61ca365-5af4-4486-998b-9db4734c6ca3}'
      ]
    }
  ]
*/
```

Installation
============

```
npm install xinput-ffi
```

_Prerequisite: C/C++ build tools and Python 3.x (node-gyp) in order to build [node-ffi-napi](https://www.npmjs.com/package/ffi-napi)._

API
===

⚠️ This module is only available as an ECMAScript module (ESM) starting with version 2.0.0.<br />
Previous version(s) are CommonJS (CJS) with an ESM wrapper.

💡 Promises are under the `promises` namespace.
```js
import * as XInput from 'xinput-ffi';
XInput.promises.isConnected() //Promise
XInput.isConnected() //Sync

import * as XInput from "xinput-ffi/promises"
XInput.isConnected() //Promise
```

## Named export

### 1️⃣ XInput fn 

Access XInput functions as documented by Microsoft.<br/>
Trying to expose them in js as close as possible to the document.<br/>
📖 https://docs.microsoft.com/en-us/windows/win32/xinput/functions

#### `enable(enable: bool): void`

Enable/Disable all XInput gamepads.

NB:
 - Stop any rumble currently playing when set to false.
 - setState will throw "ERR_DEVICE_NOT_CONNECTED" when set to false.
 
📖 [XInputEnable](https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputenable)
 
#### `GetBatteryInformation(gamepadIndex?: number): obj`

Retrieves the battery type and charge status of the specified controller.

gamepadIndex: Index of the user's controller. Can be a value from 0 to 3.<br />
gamepadIndex defaults to 0 (1st XInput gamepad)<br />
If gamepad is not connected throw "ERR_DEVICE_NOT_CONNECTED".

Returns an object like a 📖 [XINPUT_BATTERY_INFORMATION](https://docs.microsoft.com/en-us/windows/win32/api/xinput/ns-xinput-xinput_battery_information) structure.

💡 When a value is known it will be 'translated' to its string equivalent value otherwise its integer value.

Output example
```js
{
  BatteryType: 'BATTERY_TYPE_WIRED',
  BatteryLevel: 'BATTERY_LEVEL_FULL'
}
```

📖 [XInputGetBatteryInformation](https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputgetbatteryinformation)

#### `GetCapabilities(gamepadIndex?: number): obj`

Retrieves the capabilities and features of the specified controller.

gamepadIndex: Index of the user's controller. Can be a value from 0 to 3.<br />
gamepadIndex defaults to 0 (1st XInput gamepad)<br />
If gamepad is not connected throw "ERROR_DEVICE_NOT_CONNECTED".

Returns an object like a 📖  [XINPUT_CAPABILITIES](https://docs.microsoft.com/en-us/windows/win32/api/xinput/ns-xinput-xinput_capabilities) structure.
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

📖 [XInputGetCapabilities](https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputgetcapabilities)
 
#### `getState(gamepadIndex?: number): obj`

Retrieves the current state of the specified controller.

gamepadIndex: Index of the user's controller. Can be a value from 0 to 3.<br />
gamepadIndex defaults to 0 (1st XInput gamepad)<br />
If gamepad is not connected throw "ERROR_DEVICE_NOT_CONNECTED".

Returns an object like a 📖 [XINPUT_STATE](https://docs.microsoft.com/en-us/windows/win32/api/xinput/ns-xinput-xinput_state) structure.

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

💡 To know which button**s** are currently pressed down you need to _bitwise AND (&)_ wButtons with all 📖 [XINPUT BUTTONS](https://docs.microsoft.com/en-us/windows/win32/api/xinput/ns-xinput-xinput_gamepad#members)
You can use [getButtonsDown()](https://github.com/xan105/node-xinput-ffi#getbuttonsdown-option-obj-obj) for this (see below in helper fn ...)

💡 Thumbsticks: as explained by Microsoft you should [implement dead zone correctly](https://docs.microsoft.com/en-us/windows/win32/xinput/getting-started-with-xinput#dead-zone)
This is also done for you in [getButtonsDown()](https://github.com/xan105/node-xinput-ffi#getbuttonsdown-option-obj-obj)

📖 [XInputGetState](https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputgetstate)

#### `setState(lowFrequency: number, highFrequency: number, gamepadIndex?: number): void`

Sends data to a connected controller. This function is used to activate the vibration function of a controller.

gamepadIndex: Index of the user's controller. Can be a value from 0 to 3.<br />
gamepadIndex defaults to 0 (1st XInput gamepad)<br />
If gamepad is not connected throw "ERROR_DEVICE_NOT_CONNECTED".

NB:
- You need to keep the event-loop alive otherwise the vibration will terminate with your program.<br />
- You need to reset the state to 0 for both frequency before using setState again.<br />

Both are done for you with [rumble()](https://github.com/xan105/node-xinput-ffi#rumble-option-obj-void) (see below in Helper fn...)

📖 [XInputSetState](https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputsetstate)

<hr>

### 2️⃣ Helper fn

The following are sugar/helper functions based upon the previous XInput functions.

#### `getButtonsDown(option?: obj): obj`

getState() wrapper to know more easily which buttons are pressed if any.

Also returns the rest of getState() information normalized for convenience such as<br/> 
ThumbStick position, magnitude, direction (taking the deadzone into account).<br/> 
Trigger state and force (taking threshold into account).<br/> 

⚙️ options:

- gamepadIndex: 

Index of the user's controller. Can be a value from 0 to 3. _defaults to 0 (1st XInput gamepad)_

- deadzone: 

thumbstick deadzone(s)<br/>
Either an integer (both thumbstick with the same value) or an array of 2 integer: [left,right]<br/>
_defaults to XInput default's values of [7849,8689]_<br/> 
	    
- directionThreshold: 

float [0.0,1.0] to handle cardinal direction.<br/>
 Set it to 0 to only get "UP RIGHT", "UP LEFT", "DOWN LEFT", "DOWN RIGHT".<br/>
Otherwise add "RIGHT", "LEFT", "UP", "DOWN" to the previous using threshold to <br/>
differentiate the 2 axes by using range of [-threshold,threshold].<br/>
_defaults to 0.2_<br/>
		      
- triggerThreshold: 

int [0,255] trigger activation threshold.<br/>
 _defaults to XInput value of 30_<br/>

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

<details>
 <summary>Electron example:</summary>
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
			if (controller.trigger.left.active) 
				console.log(`trigger L (${controller.trigger.left.force})`);
			if (controller.trigger.right.active) 
				console.log(`trigger R (${controller.trigger.right.force})`);
			
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
</details>
			
#### `rumble(option?: obj): void`

This function is used to activate the vibration function of a controller.<br />

⚙️ options:
  - force : Rumble force to apply to the motors. 
            Either an integer (both motor with the same value) or an array of 2 integer: [left,right]
            _defaults to [50,25]_
  - duration: Rumble duration in ms. Max: 2500 ms. _defaults to max_
  - forceEnableGamepad: Use **enable()** to force the activation of XInput gamepad before rumble. _defaults to false_
  - forceStateWhileRumble: Bruteforce _-ly_ (spam) set state() for the duration of the vibration. Use this when a 3rd party reset your state or whatever. Usage of this option is not recommended and default to false. Use only when needed.
  - gamepadIndex: Index of the user's controller. Can be a value from 0 to 3. _defaults to 0 (1st XInput gamepad)_
  
#### `isConnected(gamepadIndex?: number): bool`

whether the specified controller is connected or not.<br />
Returns true/false

#### `listConnected(): bool[]`

Returns an array of connected status for all controller.<br />
eg: [true,false,false,false] //Only 1st gamepad is connected

<hr>

### 3️⃣ Identify device (VID,PID,GUID,Name, ...)

Since XInput doesn't provide VID/PID **by design**, query WMI _Win32_PNPEntity_ via PowerShell instead.<br />
It won't tell you which is connected to which XInput slot tho.

#### `identify(option?: obj): Promise<obj[]>`

⚠️ Promise only.

List all **known** HID and USB connected devices **by matching with entries in** `./lib/data/HardwareID.js`

⚙️ options:

- XInputOnly: Return only XInput gamepad. _defaults to true_

Return an array of obj where
- string manufacturer : vendor name
- string name : device name
- string vid : vendor id (unique)
- string pid : product id (unique)
- string[] interfaces : PNPentity interface(s) found; Available: HID and USB
- string[] guid: classguid(s) found
- bool xinput: If it's a XInput device or not

💡 obj are unique by their vid/pid

Output example with a DS4(wireless) and ds4windows(_DirectInput -> XInput wrapper_):
```js
[
  {
    manufacturer: 'Sony Corp.',
    name: 'DualShock 4',
    vid: '054C',
    pid: '09CC',
    xinput: false,
    interfaces: [ 'USB', 'HID' ],
    guid: [
      '{36fc9e60-c465-11cf-8056-444553540000}',
      '{745a17a0-74d3-11d0-b6fe-00a0c90f57da}',
      '{4d36e96c-e325-11ce-bfc1-08002be10318}'
    ]
  },
  {
    manufacturer: 'Sony Corp.',
    name: 'DualShock 4 USB Wireless Adaptor',
    vid: '054C',
    pid: '0BA0',
    xinput: false,
    interfaces: [ 'USB', 'HID' ],
    guid: [
      '{745a17a0-74d3-11d0-b6fe-00a0c90f57da}',
      '{36fc9e60-c465-11cf-8056-444553540000}',
      '{4d36e96c-e325-11ce-bfc1-08002be10318}'
    ]
  },
  {
    manufacturer: 'Microsoft Corp.',
    name: 'Xbox360 Controller',
    vid: '045E',
    pid: '028E',
    xinput: true,
    interfaces: [ 'USB', 'HID' ],
    guid: [
      '{745a17a0-74d3-11d0-b6fe-00a0c90f57da}',
      '{d61ca365-5af4-4486-998b-9db4734c6ca3}'
    ]
  }
]
```

Compatibility
=============

- Windows 8: xinput1_4
- Windows 7 (DirectX SDK): xinput1_3
- Windows Vista (Legacy): xinput9_1_0

Identify device requires PowerShell.