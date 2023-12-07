About
=====

Access native XInput functions as well as some helpers based around them.

This lib hooks directly to the system's dll (xinput1_4.dll, xinput1_3.dll or xinput9_1_0.dll).<br/>
It aims to implement and expose XInput functions as close as possible to the document.<br/>

🔍 "Hidden" XInput functions such as `XInputGetCapabilitiesEx()` are exposed as well.

Examples
========

<details>
  <summary>Vibration via helper function</summary>
  
```js
import { rumble } from "xinput-ffi";

//Rumble 1st XInput gamepad
await rumble();

//Now with 100% force
await rumble({force: 100}); 

//low-frequency rumble motor(left) at 50% 
//and high-frequency rumble motor (right) at 25%
await rumble({force: [50,25]});
```

</details>

<details>
  <summary>XInput function</summary>
  
```js
import * as XInput from "xinput-ffi";

const capabilities = await XInput.getCapabilities({translate: true});
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
      //etc...
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

</details>

<details>
  <summary>"Hidden" XInput function</summary>
  
```js
import * as XInput from "xinput-ffi";

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

</details>

<details>
  <summary>Miscellaneous</summary>
  
```js 
import * as XInput from "xinput-ffi";

//Check connected status for all controller
console.log(await XInput.listConnected());
// [true,false,false,false] Only 1st gamepad is connected
  
//Identify connected XInput devices
console.log (await XInput.identify({XInputOnly: true})); 
/* Output:
  [
    {
      name: 'Xbox360 Controller',
      manufacturer: 'Microsoft Corp.',
      vendorID: 1118,
      productID: 654,
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

</details>

### Electron

<details>
  <summary>Simple XInput menu navigation</summary>
  
Here is an example of a simple XInput menu navigation system using the high level XInput implementation found in this module (helper).

+ main process

```js

let gamepad;

mainWin.once("ready-to-show", async() => { 

  const { XInputGamepad } = await import("xinput-ffi/promises");
  gamepad = new XInputGamepad();
  
  //send input to renderer
  gamepad.on("input", (buttons)=>{ 
    setImmediate(() => {
      mainWin.webContents.send("onGamepadInput", buttons); 
    });
  });
  
  gamepad.poll(); //gamepad event loop
  mainWin.show();
  mainWin.focus();
  
});

//gain/loose focus
mainWin.on("blur", () => {
  gamepad?.pause();
});
mainWin.on("focus", () => {
  gamepad?.resume();
});

//clean up
mainWin.on("close", () => {
  gamepad?.stop();
  gamepad = null; //deref
});

mainWin.on("closed", () => {
  mainWin = null; //deref
});

mainWin.loadFile(path/to/file);
```

+  contextBridge (preload)

```js
contextBridge.exposeInMainWorld("ipcRenderer", {
  onGamepadInput: (callback) => ipcRenderer.on("onGamepadInput", callback)
});
```

+ renderer

```js
window.ipcRenderer.onGamepadInput((event, input) => {
    switch(input[0]){
      case "XINPUT_GAMEPAD_DPAD_UP":
        //do something
        break;
      default:
        console.log(input);
    }
  });
```

</details>

Installation
============

```
npm install xinput-ffi
```

API
===

⚠️ This module is only available as an ECMAScript module (ESM) starting with version 2.0.0.<br />
Previous version(s) are CommonJS (CJS) with an ESM wrapper.

## Named export

Summary:

- [constants](#const-constants--object)
- [XInput function](#xinput-function)
- [Helper functions](#helper-functions)
- [Identify device | VID/PID](#identify-device--vidpid)
- [High level implementation of XInput](#high-level-implementation-of-xinput)

### `const constants = object`

  XInput controller constants for convenience.
  
```js  
  import { constants } from "xinput-ffi";
  console.log(constants.XUSER_MAX_COUNT); //4
```
  
💡 Also available under its own namespace.
  
```js
  import { XUSER_MAX_COUNT } from "xinput-ffi/constants";
  console.log(XUSER_MAX_COUNT); //4
```

### XInput function

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
- ✔️ XInputWaitForGuideButton
- ✔️ XInputCancelGuideButtonWait
- ✔️ XInputPowerOffController
- ⚠️ XInputGetBaseBusInformation _> Not working with all gamepad._
- ✔️ XInputGetCapabilitiesEx

NB: Depending on which XInput dll version you are using *(1_4, 1_3, 9_1_0)* some functions won't be available.

#### `enable(enable: boolean): Promise<void>`

Enable/Disable all XInput gamepads.<br/>
This function is meant to be called when an application gains or loses focus.

NB:
 - Stop any rumble currently playing when set to false.
 - This may trigger `ERR_DEVICE_NOT_CONNECTED` for set/getState(Ex) when set to false and there was no prior input ever.
 
📖 [XInputEnable](https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputenable)
 
#### `getBatteryInformation(option?: number | object): Promise<object>`

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

#### `getCapabilities(option?: number | object): Promise<object>`

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

#### `getKeystroke(option?: number | object): Promise<object>`

Retrieves a gamepad input event.<br/>
To be honest, this isn't really useful since the chatpad feature wasn't implemented on Windows.<br/>
⚠️ NB: If no new keys have been pressed, this will throw with ERROR_EMPTY.

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

#### `getState(option?: number | object): Promise<object>`

Retrieves the current state of the specified controller.

⚙️ options:

- dwUserIndex?: number (0)

Index of the user's controller. Can be a value from 0 to 3.

- translate?: boolean (true)

When a value is known it will be 'translated' to its string equivalent value otherwise its integer value.<br/>
If you want the raw data only set it to false.

💡 If `option` is a number it will be used as dwUserIndex.<br/>

Returns an object like a 📖 [XINPUT_STATE](https://docs.microsoft.com/en-us/windows/win32/api/xinput/ns-xinput-xinput_state) structure.

Example
```js
getState();
getState(0);
getState({dwUserIndex: 0});
//Output
{
  dwPacketNumber: 18165,
  gamepad: { 
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
  dwPacketNumber: 322850,
  gamepad: {
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

💡 Thumbsticks: as explained by Microsoft you should [implement dead zone correctly](https://docs.microsoft.com/en-us/windows/win32/xinput/getting-started-with-xinput#dead-zone).<br/>
This is done for you in [getButtonsDown()](https://github.com/xan105/node-xinput-ffi#getbuttonsdown-option-object-object)

📖 [XInputGetState](https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputgetstate)

#### `setState(lowFrequency: number, highFrequency: number, option ?: number | object): Promise<void>`

Sends data to a connected controller. This function is used to activate the vibration function of a controller.

⚙️ options:

- dwUserIndex?: number (0)

Index of the user's controller. Can be a value from 0 to 3.

- usePercent?: boolean (true)

`XInputSetState` valid values are in the range 0 to 65535.<br />
Zero signifies no motor use; 65535 signifies 100 percent motor use.<br />
`lowFrequency` and `highFrequency` are in % (0-100) for convenience when you set this to true.

💡 If `option` is a number it will be used as dwUserIndex.<br/>

NB:
- You need to keep the event-loop alive otherwise the vibration will terminate with your program.<br />
- You need to reset the state to 0 for both frequency before using setState again.<br />

Both are done for you with [rumble()](https://github.com/xan105/node-xinput-ffi#rumble-option-object-void)

📖 [XInputSetState](https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputsetstate)

#### `getStateEx(option?: number | object): Promise<object>`

The same as `XInputGetState`, adding the "Guide" button (0x0400).

⚙️ options:

- dwUserIndex?: number (0)

Index of the user's controller. Can be a value from 0 to 3.

- translate?: boolean (true)

When a value is known it will be 'translated' to its string equivalent value otherwise its integer value.<br/>
If you want the raw data only set it to false.

💡 If `option` is a number it will be used as dwUserIndex.<br/>

Returns an object like a 📖 [XINPUT_STATE](https://docs.microsoft.com/en-us/windows/win32/api/xinput/ns-xinput-xinput_state) structure.

Example
```js
getStateEx();
getStateEx(0);
getStateEx({dwUserIndex: 0});
//Output
{
  dwPacketNumber: 18165,
  gamepad: { 
    wButtons: ['XINPUT_GAMEPAD_GUIDE'],
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
getStateEx({translate: false});
//output
{
  dwPacketNumber: 322850,
  gamepad: {
    wButtons: 1024,
    bLeftTrigger: 0,
    bRightTrigger: 0,
    sThumbLX: 257,
    sThumbLY: 767,
    sThumbRX: 773,
    sThumbRY: 1279
  }
}
```

#### `waitForGuideButton(option?: number | object): Promise<void>`

Wait until Guide button is pressed.

⚙️ options:

- dwUserIndex?: number (0)

Index of the user's controller. Can be a value from 0 to 3.

- dwFlags?: number (0)

Wait behavior:<br/>
0: Blocking 1: Async<br/>
It's not clear on how to get the async option to report.

💡 If `option` is a number it will be used as dwUserIndex.<br/>

#### `cancelGuideButtonWait(option?: number | object): Promise<void>`

If `XInputWaitForGuideButton` was activated in async mode, this will stop it.

⚙️ options:

- dwUserIndex?: number (0)

Index of the user's controller. Can be a value from 0 to 3.

💡 If `option` is a number it will be used as dwUserIndex.<br/>

#### `powerOffController(option?: number | object): Promise<void>`

Power off a controller.

⚙️ options:

- dwUserIndex?: number (0)

Index of the user's controller. Can be a value from 0 to 3.

💡 If `option` is a number it will be used as dwUserIndex.<br/>

#### `getBaseBusInformation(option?: number | object): Promise<object>`

⚠️ Not working on all gamepads. It can refuse and return `ERROR_DEVICE_NOT_CONNECTED`, even if connected.

⚙️ options:

- dwBusIndex?: number (0)

Bus index. Can be a value from 0 to 16.

💡 If `option` is a number it will be used as dwBusIndex?.<br/>

Returns an object like the following structure:
```c++
struct XINPUT_BASE_BUS_INFORMATION
{
  WORD VendorId, //unknown
  WORD ProductId, //unknown
  WORD InputId, //unknown
  WORD Field_6, //unknown
  DWORD Field_8, //unknown
  BYTE Field_C, //unknown
  BYTE Field_D, //unknown
  BYTE Field_E, //unknown
  BYTE Field_F //unknown
 }
```

#### `getCapabilitiesEx(option?: number | object): Promise<object>`

The same as `XInputGetCapabilities` but with added properties such as vendorID and productID.

⚙️ options:

- dwUserIndex?: number (0)

Index of the user's controller. Can be a value from 0 to 3.

- translate?: boolean (true)

When a value is known it will be 'translated' to its string equivalent value otherwise its integer value.<br/>
If you want the raw data only set it to false.

💡 If `option` is a number it will be used as dwUserIndex.<br/>

Returns an object similar to 📖 [XINPUT_CAPABILITIES](https://docs.microsoft.com/en-us/windows/win32/api/xinput/ns-xinput-xinput_capabilities) structure.<br/>
See below for details.

Example
```js
getCapabilitiesEx();
getCapabilitiesEx(0);
getCapabilitiesEx({gamepadIndex: 0});
//Output
{
  capabilities: {
    type: 'XINPUT_DEVTYPE_GAMEPAD',
    dubType: 'XINPUT_DEVSUBTYPE_GAMEPAD',
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
  },
  vendorId: 'Microsoft Corp.',
  productId: 'Xbox360 Controller',
  productVersion: 276,
}
```

If you want raw data output
```js
getCapabilitiesEx({translate: false});
//output
{
  capabilities: {
    type: 1,
    dubType: 1,
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
    vibration: { 
      wLeftMotorSpeed: 255, 
      wRightMotorSpeed: 255 
    }
  },
  vendorId: 1118,
  productId: 654,
  productVersion: 276,
}
```

</details>

### Helper functions

The following are sugar/helper functions based upon the previous XInput functions.

#### `isConnected(gamepad?: number): Promise<boolean>`

Whether the specified controller is connected or not.<br />
Returns true/false.

#### `listConnected(): Promise<boolean[]>`

Returns an array of connected status for all controller.<br />
eg: [true,false,false,false] => Only 1st gamepad is connected

#### `getButtonsDown(option?: object): Promise<object>`

Normalize `getState()` information for convenience:<br/> 
ThumbStick position, magnitude, direction (taking the deadzone into account).<br/> 
Trigger state and force (taking threshold into account).<br/>
Which buttons are pressed if any.<br/>

⚙️ options:

- gamepad?: number (0) 

Index of the user's controller. Can be a value from 0 to 3.

- deadzone?: number | number[] ( [7849,8689] )

Thumbstick deadzone(s):<br/>
Either an integer (both thumbstick with the same value) or an array of 2 integer: [left,right]<br/>
      
- directionThreshold?: number (0.2)

float [0.0,1.0] to handle cardinal direction.<br/>
Set it to `0` so `direction[]` only reports "UP RIGHT", "UP LEFT", "DOWN LEFT", "DOWN RIGHT".<br/>
Otherwise "RIGHT", "LEFT", "UP", "DOWN" will be added to the above using threshold to <br/>
differentiate the 2 axes by using range of [-threshold,threshold].

💡 If you **just** want "RIGHT", "LEFT", "UP" and "DOWN" the easiest way is to set this to `0.8` with the default deadzone.<br/>
Alternatively play with this value and/or deadzone to decide on a thresold and ignore when `direction[]` has a length of 2.
          
- triggerThreshold?: number (30)

Trigger activation threshold. Range [0,255].

=> Returns an object where:
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

```js
{
  packetNumber: 132309,
  buttons: [ 'XINPUT_GAMEPAD_A' ],
  trigger: {
    left: { active: true, force: 255 },
    right: { active: false, force: 0 }
  },
  thumb: {
    left: {
      x: -0.6960457056589758,
      y: 0.717997476063599,
      magnitude: 1,
      direction: [ 'UP', 'LEFT' ]
    },
    right: {
      x: 0.039307955814283674,
      y: 0.9992271436513833,
      magnitude: 1,
      direction: [ 'UP' ]
    }
  }
}
```
  
#### `rumble(option?: object): Promise<void>`

This function is used to activate the vibration function of a controller.<br />

⚙️ options:

- gamepad?: number (0) 

Index of the user's controller. Can be a value from 0 to 3.

- force?: number | number[] ([50,25])

Vibration force in % (0-100) to apply to the motors.<br/>
Either an integer (both motor with the same value) or an array of 2 integer: [left,right]

- duration?: number (2500)

Vibration duration in ms. Max: ~2500 ms.

- forceEnableGamepad?: boolean (false)

Use `enable()` to force the activation of XInput gamepad before vibration.
 
- forceStateWhileRumble?: boolean (false)

Bruteforce _-ly_ (spam) `setState()` for the duration of the vibration. Use this when a 3rd party reset your state or whatever.<br/> 
⚠️ Usage of this option is not recommended use only when needed.

### Identify device | VID/PID

XInput doesn't provide VID/PID **by design**.<br />
Even if with `XInputGetCapabilitiesEx` you can get the vendorID and productID, it will most likely be a Xbox Controller (real one or through XInput emulation).<br />

Use `identify()` (see below) to query `WMI _Win32_PNPEntity` to scan for known gamepads.<br />
It won't tell you which is connected to which XInput slot tho.

#### `identify(option?: object): Promise<object[]>`

⚠️ Requires PowerShell.

List all **known** HID and USB connected devices **by matching with entries in** `./lib/data/HardwareID.js`

⚙️ options:

- XInputOnly?: boolean (true)

Return only XInput gamepad.

=> Return an array of object where
- string name : device name
- string manufacturer : vendor name
- number vendorID : vendor id
- number productID : product id
- string[] interfaces : PNPentity interface(s) found; Available: HID and USB
- string[] guid: classguid(s) found
- boolean xinput: a XInput device or not

💡 object are unique by their vid/pid

Output example with a DS4(wireless) and ds4windows(XInput wrapper):
```js
import { identify } from "xinput-ffi/promises";
await identify();
//Output
[
  {
    name: 'DualShock 4 (v2)',
    manufacturer: 'Sony Corp.',
    vendorID: 1356,
    productID: 2508,
    xinput: false,
    interfaces: [ 'USB', 'HID' ],
    guid: [
      '{36fc9e60-c465-11cf-8056-444553540000}',
      '{745a17a0-74d3-11d0-b6fe-00a0c90f57da}',
      '{4d36e96c-e325-11ce-bfc1-08002be10318}'
    ]
  },
  {
    name: 'DualShock 4 USB Wireless Adaptor',
    manufacturer: 'Sony Corp.',
    vendorID: 1356,
    productID: 2976,
    xinput: false,
    interfaces: [ 'USB', 'HID' ],
    guid: [
      '{745a17a0-74d3-11d0-b6fe-00a0c90f57da}',
      '{36fc9e60-c465-11cf-8056-444553540000}',
      '{4d36e96c-e325-11ce-bfc1-08002be10318}'
    ]
  },
  {
    name: 'Xbox360 Controller',
    manufacturer: 'Microsoft Corp.',
    vendorID: 1118,
    productID: 654,
    xinput: true,
    interfaces: [ 'USB', 'HID' ],
    guid: [
      '{745a17a0-74d3-11d0-b6fe-00a0c90f57da}',
      '{d61ca365-5af4-4486-998b-9db4734c6ca3}'
    ]
  }
]
```

### High level implementation of XInput

This is a high level implementation of XInput to get the gamepad's input on the fly in a human readable way.
This serves as an example to demonstrate how to use the XInput functions and helpers based around them.
The purpose of this class is to drive a simple navigation menu system with a XInput compatible controller (real XInput or through XInput emulation).

This leverages the new Node.js timersPromises setInterval() to keep the event loop alive and do the gamepad polling.

#### `XInputGamepad(option: object): Class`

> This class extends EventEmitter from node:events

**Options**

- hz?: number (30)

  This will determinate the polling rate. Usually 60hz (1000/60 = ~16ms) is used. If I'm not mistaken this is what the Chrome browser uses. But for our use case we don't need to poll that fast so it defaults to 30hz (~33ms). Increasing this value improves latency, but may cause a loss in performance due to more CPU time spent. The max accepted is 250hz (4ms).

- multitap?: boolean (true)

  Scan for all 4 XInput slots to find any Gamepad. Set to false to only poll XInput slot 0 and potentially reduce the number of FFI calls per gamepad tick (event loop).

- joystickAsDPAD?: boolean (true)

  Convert the left joystick analog axis to DPAD buttons. For our use case, driving a simple navigation menu, this is useful.

- inputFeedback?: boolean (false)
  
  Vibrate shortly and lightly on any button activation. This is just for fun and/or debug.

**Events**

`input(buttons: string[])`

List of activated buttons (human readable) of the first controller found.<br />
A button is "activated" on press (button down) then release (button up).

💡 NB: Triggers axis are converted into non standard XInput button name : `GAMEPAD_LEFT_TRIGGER` and `GAMEPAD_RIGHT_TRIGGER` (_on/off behavior_).

<details><summary>XInput Button names:</summary>

```
"XINPUT_GAMEPAD_DPAD_UP",
"XINPUT_GAMEPAD_DPAD_DOWN",
"XINPUT_GAMEPAD_DPAD_LEFT",
"XINPUT_GAMEPAD_DPAD_RIGHT",
"XINPUT_GAMEPAD_START",
"XINPUT_GAMEPAD_BACK",
"XINPUT_GAMEPAD_LEFT_THUMB",
"XINPUT_GAMEPAD_RIGHT_THUMB",
"XINPUT_GAMEPAD_LEFT_SHOULDER",
"XINPUT_GAMEPAD_RIGHT_SHOULDER",
"XINPUT_GAMEPAD_GUIDE",
"XINPUT_GAMEPAD_A",
"XINPUT_GAMEPAD_B",
"XINPUT_GAMEPAD_X",
"XINPUT_GAMEPAD_Y"
```

💡 NB: XInput constants are available under the `constants` namespace.

```js
import { constants } from "xinput-ffi";
//or
import { BUTTONS } from "xinput-ffi/constants";
```

</details>

Example:

```js
import { XInputGamepad } from "xinput-ffi";

const gamepad = new XInputGamepad({ hz: 60 });

gamepad.on("input", (buttons)=>{ 
  setImmediate(() => {
    console.log(buttons);
  });
});

gamepad.poll();
```
  
**Methods**

##### `poll()`

Start the gamepad event loop. This will keep the Node.js event loop going.

❌ Will throw on unexpected error.

##### `stop()`

Stop the gamepad event loop.

NB: This method will remove every event listener.

##### `pause()`

This function is meant to be called when an application loses focus.

_cf: [XInputEnable](https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputenable)_

##### `resume()`

This function is meant to be called when an application gains focus.

_cf: [XInputEnable](https://docs.microsoft.com/en-us/windows/win32/api/xinput/nf-xinput-xinputenable)_

#### `vibrate(option: object): Promise<void>`

Vibrate the first controller found. Shorthand to the helper fn `rumble()`.

💡 Expose only `force` and `duration` options of `rumble()`.

❌ Will throw on error other than `ERROR_DEVICE_NOT_CONNECTED`.