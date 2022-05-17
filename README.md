About
=====

XInput <abbr title="Foreign Function Interface">FFI</abbr> wrapper: access native XInput functions as well as some helpers based around them.

This lib hooks directly to the system's dll (xinput1_4.dll, xinput1_3.dll or xinput9_1_0.dll).<br/>
It aims to implement and expose XInput functions as close as possible to the document.<br/>
"Hidden" XInput functions such as `XInputGetCapabilitiesEx()` are exposed as well.<br/>

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

Direct use of XInput function

```js
import { promises as XInput } from "xinput-ffi";

const capabilities = await XInput.getCapabilities();
console.log(capabilities);
/* Output:
{
  type: 'XINPUT_DEVTYPE_GAMEPAD',
  subType: 'XINPUT_DEVSUBTYPE_GAMEPAD',
  flags: [ 'XINPUT_CAPS_VOICE_SUPPORTED', 'XINPUT_CAPS_PMD_SUPPORTED' ],
  gamepad: {
    wButtons: [
      'XINPUT_GAMEPAD_DPAD_UP',
      'XINPUT_GAMEPAD_DPAD_DOWN',
      'XINPUT_GAMEPAD_DPAD_LEFT',
      'XINPUT_GAMEPAD_DPAD_RIGHT',
      'XINPUT_GAMEPAD_START',
      'XINPUT_GAMEPAD_BACK',
      'XINPUT_GAMEPAD_LEFT_THUMB',
      'XINPUT_GAMEPAD_RIGHT_THUMB',
      'XINPUT_GAMEPAD_LEFT_SHOULDER',
      'XINPUT_GAMEPAD_RIGHT_SHOULDER',
      'XINPUT_GAMEPAD_A',
      'XINPUT_GAMEPAD_B',
      'XINPUT_GAMEPAD_X',
      'XINPUT_GAMEPAD_Y'
    ],
    bLeftTrigger: 255,
    bRightTrigger: 255,
    sThumbLX: -64,
    sThumbLY: -64,
    sThumbRX: -64,
    sThumbRY: -64
  },
  vibration: { wLeftMotorSpeed: 255, wRightMotorSpeed: 255 }
}
*/
```

If you prefer the raw data instead:

```js
import { promises as XInput } from "xinput-ffi";

const capabilities = await XInput.getCapabilities({translate: false});
console.log(capabilities);
/* Output:
{
  type: 1,
  subType: 1,
  flags: 12,
  gamepad: {
    wButtons: 62463,
    bLeftTrigger: 255,
    bRightTrigger: 255,
    sThumbLX: -64,
    sThumbLY: -64,
    sThumbRX: -64,
    sThumbRY: -64
  },
  vibration: { wLeftMotorSpeed: 255, wRightMotorSpeed: 255 }
}
*/
```

"Hidden" XInput function

```js
import { promises as XInput } from "xinput-ffi";

const state = await XInput.getStateEx();
console.log(state);
/*Output:
{
  dwPacketNumber: 6510,
  gamepad: {
    wButtons: [ 'XINPUT_GAMEPAD_GUIDE' ],
    bLeftTrigger: 0,
    bRightTrigger: 0,
    sThumbLX: -1024,
    sThumbLY: 767,
    sThumbRX: 257,
    sThumbRY: 767
  }
}
*/
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
npm install koffi
```

_Prerequisite: C/C++ build tools and [CMake meta build system](https://cmake.org/) in order to build [koffi](https://www.npmjs.com/package/koffi)._<br/>
_💡 [koffi](https://www.npmjs.com/package/koffi) provides prebuilt binaries so in most cases the above mentioned prerequisites aren't needed._

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

### 1️⃣  XInput fn 

Access XInput functions as documented by Microsoft.<br/>
📖 [Microsoft documentation](https://docs.microsoft.com/en-us/windows/win32/xinput/functions)

- ✔️ [XInputEnable](https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputenable)
- ❌ [XInputGetAudioDeviceIds]() _> deprecated: doesn't work on modern Windows system._
- ✔️ [XInputGetBatteryInformation](https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputgetbatteryinformation)
- ✔️ [XInputGetCapabilities](https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputgetcapabilities) 
- ❌ [XInputGetDSoundAudioDeviceGuids]() _> deprecated: doesn't work on modern Windows system._
- ✔️ [XInputGetKeystroke](https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputgetkeystroke)
- ✔️ [XInputGetState](https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputgetstate)
- ✔️ [XInputSetState](https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputsetstate)

"Hidden" and undocumented functions<br/>
📖 [Reverse Engineer's log](https://reverseengineerlog.blogspot.com/2016/06/xinputs-hidden-functions.html)

- ✔️ XInputGetStateEx
- ⚠️ XInputWaitForGuideButton _> calling triggers ERROR_BAD_ARGUMENTS (to-do: fixme)._
- ✔️ XInputCancelGuideButtonWait
- ✔️ XInputPowerOffController
- ⚠️ XInputGetBaseBusInformation _> Not working with all gamepad._
- ✔️ XInputGetCapabilitiesEx;

NB: Depending on which XInput dll version you are using _(1_4, 1_3, 9_1_0)_ some functions won't be available.

#### `enable(enable: boolean): void`

Enable/Disable all XInput gamepads.<br/>
This function is meant to be called when an application gains or loses focus.

NB:
 - Stop any rumble currently playing when set to false.
 - setState will throw "ERR_DEVICE_NOT_CONNECTED" when this is set to false.
 
📖 [XInputEnable](https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputenable)
 
#### `getBatteryInformation(option?: number | object): object`

Retrieves the battery type and charge status of a wireless controller.

⚙️ options:

- dwUserIndex?: number (0)

Index of the user's controller. Can be a value from 0 to 3.

- devType?: number (0)

Specifies which device associated with this controller should be queried.<br/>
0: GAMEPAD or 1: HEADSET

- translate?: boolean (true)

When a value is known it will be 'translated' to its string equivalent value otherwise its integer value.<br/>
If you want the raw data only set it to false.

💡 If `option` is a number it will be used as dwUserIndex.<br/>

Returns an object like a 📖 [XINPUT_BATTERY_INFORMATION](https://docs.microsoft.com/en-us/windows/win32/api/xinput/ns-xinput-xinput_battery_information) structure.

Example
```js
getBatteryInformation();
getBatteryInformation(0);
getBatteryInformation({dwUserIndex: 0});
//output
{
  batteryType: 'BATTERY_TYPE_WIRED',
  batteryLevel: 'BATTERY_LEVEL_FULL'
}
```

If you want raw data output
```js
getBatteryInformation({translate: false});
//output
{
  batteryType: 1,
  batteryLevel: 3
}
```

📖 [XInputGetBatteryInformation](https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputgetbatteryinformation)

#### `getCapabilities(option?: number | object): object`

Retrieves the capabilities and features of the specified controller.

⚙️ options:

- dwUserIndex?: number (0)

Index of the user's controller. Can be a value from 0 to 3.

- dwFlags?: number (1)

Input flags that identify the controller type. <br/>
If this value is 0, then the capabilities of all controllers connected to the system are returned.<br/>
Currently, only 1: XINPUT_FLAG_GAMEPAD is supported.

- translate?: boolean (true)

When a value is known it will be 'translated' to its string equivalent value otherwise its integer value.<br/>
If you want the raw data only set it to false.

💡 If `option` is a number it will be used as dwUserIndex.<br/>

Returns an object like a 📖 [XINPUT_CAPABILITIES](https://docs.microsoft.com/en-us/windows/win32/api/xinput/ns-xinput-xinput_capabilities) structure.

Example
```js
getCapabilities();
getCapabilities(0);
getCapabilities({gamepadIndex: 0});
//Output
{
  type: 'XINPUT_DEVTYPE_GAMEPAD',
  subType: 'XINPUT_DEVSUBTYPE_GAMEPAD',
  flags: [ 'XINPUT_CAPS_VOICE_SUPPORTED', 'XINPUT_CAPS_PMD_SUPPORTED' ],
  gamepad: {
    wButtons: [
      'XINPUT_GAMEPAD_DPAD_UP',
      'XINPUT_GAMEPAD_DPAD_DOWN',
      'XINPUT_GAMEPAD_DPAD_LEFT',
      'XINPUT_GAMEPAD_DPAD_RIGHT',
      'XINPUT_GAMEPAD_START',
      'XINPUT_GAMEPAD_BACK',
      'XINPUT_GAMEPAD_LEFT_THUMB',
      'XINPUT_GAMEPAD_RIGHT_THUMB',
      'XINPUT_GAMEPAD_LEFT_SHOULDER',
      'XINPUT_GAMEPAD_RIGHT_SHOULDER',
      'XINPUT_GAMEPAD_A',
      'XINPUT_GAMEPAD_B',
      'XINPUT_GAMEPAD_X',
      'XINPUT_GAMEPAD_Y'
    ],
    bLeftTrigger: 255,
    bRightTrigger: 255,
    sThumbLX: -64,
    sThumbLY: -64,
    sThumbRX: -64,
    sThumbRY: -64
  },
  vibration: { wLeftMotorSpeed: 255, wRightMotorSpeed: 255 }
}
```

If you want raw data output
```js
getCapabilities({translate: false});
//output
{
  type: 1,
  subType: 1,
  flags: 12,
  gamepad: {
    wButtons: 65535,
    bLeftTrigger: 255,
    bRightTrigger: 255,
    sThumbLX: -64,
    sThumbLY: -64,
    sThumbRX: -64,
    sThumbRY: -64
  },
  vibration: { wLeftMotorSpeed: 255, wRightMotorSpeed: 255 }
}
```

📖 [XInputGetCapabilities](https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputgetcapabilities)

### `getKeystroke(option?: number | object): object`

Retrieves a gamepad input event.<br/>
To be honest, this isn't really useful since the chatpad feature wasn't implemented on Windows.<br/>
NB: If no new keys have been pressed, this will throw with ERROR_EMPTY.

⚙️ options:

- dwUserIndex?: number (0)

Index of the user's controller. Can be a value from 0 to 3.

- translate?: boolean (true)

When a value is known it will be 'translated' to its string equivalent value otherwise its integer value.<br/>
If you want the raw data only set it to false.

💡 If `option` is a number it will be used as dwUserIndex.<br/>

Returns an object like a 📖 [XINPUT_KEYSTROKE](https://docs.microsoft.com/en-us/windows/win32/api/xinput/ns-xinput-xinput_keystroke) structure.

Example
```js
getKeystroke();
getKeystroke(0);
getKeystroke({dwUserIndex: 0});
//Output
{
  virtualKey: 'VK_PAD_A',
  unicode: 0,
  flags: [ 'XINPUT_KEYSTROKE_KEYDOWN' ],
  userIndex: 0,
  hidCode: 0
}
```

If you want raw data output
```js
getKeystroke({translate: false});
//output
{ 
  virtualKey: 22528, 
  unicode: 0, 
  flags: 1, 
  userIndex: 0, 
  hidCode: 0 
}
```

📖 [XInputGetKeystroke](https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputgetkeystroke)

#### `getState(option?: number | obj): obj`

Retrieves the current state of the specified controller.

⚙️ options:

- gamepadIndex?: number 

Index of the user's controller. Can be a value from 0 to 3. _defaults to 0 (1st XInput gamepad)_

- translate?: boolean

When a value is known it will be 'translated' to its string equivalent value otherwise its integer value (_defaults to true_).<br/>
If you want the raw data output set it to false.

If `option` is a number it will be used as gamepadIndex.<br/>
If gamepad is not connected throw "ERROR_DEVICE_NOT_CONNECTED".

Returns an object like a 📖 [XINPUT_STATE](https://docs.microsoft.com/en-us/windows/win32/api/xinput/ns-xinput-xinput_state) structure.

Example
```js
getState();
getState(0);
//Output
{
  dwPacketNumber: 322850,
  Gamepad: { 
    wButtons: ['XINPUT_GAMEPAD_A'],
    bLeftTrigger: 0,
    bRightTrigger: 0,
    sThumbLX: 128,
    sThumbLY: 641,
    sThumbRX: -1156,
    sThumbRY: -129
  }
}
```

If you want raw data output
```js
getState({translate: false});
//output
{
  dwPacketNumber: 18165,
  Gamepad: {
    wButtons: 4096,
    bLeftTrigger: 0,
    bRightTrigger: 0,
    sThumbLX: 257,
    sThumbLY: 767,
    sThumbRX: 773,
    sThumbRY: 1279
  }
}
```

💡 Thumbsticks: as explained by Microsoft you should [implement dead zone correctly](https://docs.microsoft.com/en-us/windows/win32/xinput/getting-started-with-xinput#dead-zone)
This is done for you in [getButtonsDown()](https://github.com/xan105/node-xinput-ffi#getbuttonsdown-option-obj-obj)

📖 [XInputGetState](https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputgetstate)

#### `setState(lowFrequency: number, highFrequency: number, gamepadIndex?: number): void`

Sends data to a connected controller. This function is used to activate the vibration function of a controller.

gamepadIndex: Index of the user's controller. Can be a value from 0 to 3.<br />
gamepadIndex defaults to 0 (1st XInput gamepad)<br />
If gamepad is not connected throw "ERROR_DEVICE_NOT_CONNECTED".

💡 `XInputSetState` valid values are in the range 0 to 65535.<br />
Zero signifies no motor use; 65535 signifies 100 percent motor use.<br />
`lowFrequency` and `highFrequency` are in % (0-100) for convenience.

NB:
- You need to keep the event-loop alive otherwise the vibration will terminate with your program.<br />
- You need to reset the state to 0 for both frequency before using setState again.<br />

Both are done for you with [rumble()](https://github.com/xan105/node-xinput-ffi#rumble-option-obj-void) (see below in Helper fn...)

📖 [XInputSetState](https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputsetstate)

<hr>

### 2️⃣ Helper fn

The following are sugar/helper functions based upon the previous XInput functions.

#### `getButtonsDown(option?: obj): obj`

Normalize getState() information for convenience:<br/> 
ThumbStick position, magnitude, direction (taking the deadzone into account).<br/> 
Trigger state and force (taking threshold into account).<br/>
Which buttons are pressed if any.<br/>

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
	+ boolean active : is the trigger pressed down ? (below triggerThreshold will not set active to true)
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
  - gamepadIndex: Index of the user's controller. Can be a value from 0 to 3. _defaults to 0 (1st XInput gamepad)_
  - force : Rumble force in % (0-100) to apply to the motors. 
            Either an integer (both motor with the same value) or an array of 2 integer: [left,right]
            _defaults to [50,25]_
  - duration: Rumble duration in ms. Max: 2500 ms. _defaults to max_
  - forceEnableGamepad: Use **enable()** to force the activation of XInput gamepad before rumble. _defaults to false_
  - forceStateWhileRumble: Bruteforce _-ly_ (spam) set state() for the duration of the vibration. Use this when a 3rd party reset your state or whatever. Usage of this option is not recommended and default to false. Use only when needed.
  
#### `isConnected(gamepadIndex?: number): boolean`

whether the specified controller is connected or not.<br />
Returns true/false

#### `listConnected(): boolean[]`

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
- boolean xinput: If it's a XInput device or not

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