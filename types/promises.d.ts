declare interface XINPUT_BATTERY_INFORMATION {
  BatteryType: number | string,
  BatteryLevel: number | string
}

declare interface XINPUT_CAPABILITIES {
  Type: number | string,
  SubType: number | string,
  Flags: number | string
}

declare interface XINPUT_GAMEPAD {
  wButtons: number,
  bLeftTrigger: number,
  bRightTrigger: number,
  sThumbLX: number,
  sThumbLY: number,
  sThumbRX: number,
  sThumbRY: number
}

declare interface XINPUT_STATE {
  dwPacketNumber: number,
  Gamepad: XINPUT_GAMEPAD
}

export function enable(enable: bool): Promise<void>;
export function GetBatteryInformation(gamepadIndex?: number): Promise<XINPUT_BATTERY_INFORMATION>;
export function GetCapabilities(gamepadIndex?: number): Promise<XINPUT_CAPABILITIES>;
export function getState(gamepadIndex?: number): Promise<XINPUT_STATE>;
export function setState(lowFrequency: number, highFrequency: number, gamepadIndex?: number): Promise<void>;

declare interface IOptionsGetButtonsDown {
  gamepadIndex?: number,
  deadzone?: number | number[],
  directionThreshold?: number,
  triggerThreshold?: number
}

declare interface IButtonsDownTrigger {
  active: bool,
  force: number
}

declare interface IButtonsDownThumb {
  x: number,
  y: number,
  magnitude: number,
  direction: string[]
}

declare interface IButtonsDownThumbs {
  left: IButtonsDownThumb
  right: IButtonsDownThumb
}

declare interface IButtonsDownTriggers {
  left: IButtonsDownTrigger
  right: IButtonsDownTrigger
}

declare interface IButtonsDown {
  packetNumber: number,
  buttons: string[],
  trigger: IButtonsDownTriggers,
  thumb: IButtonsDownThumbs
}

export function getButtonsDown(option?: IOptionsGetButtonsDown): Promise<IButtonsDown>;

declare interface IOptionsRumble {
  force?: number | number[],
  duration?: number,
  forceEnableGamepad?: bool,
  forceStateWhileRumble?: bool,
  gamepadIndex?: number
}

export function rumble(option?: IOptionsRumble): Promise<void>;
export function isConnected(gamepadIndex?: number): Promise<bool>;
export function listConnected(): Promise<bool[]>;

declare interface IOptionsIdentify {
  XInputOnly?: bool
}

declare interface IIdentify {
  manufacturer: string,
  name: string,
  vid: string,
  pid: string,
  interfaces: string[],
  guid: string[],
  xinput: bool 
}

export function identify (option?: IOptionsIdentify): Promise<IIdentify[]>;