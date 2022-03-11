declare interface XINPUT_BATTERY_INFORMATION {
  BatteryType: number | string,
  BatteryLevel: number | string
}

declare interface XINPUT_GAMEPAD {
  wButtons: number | string[],
  bLeftTrigger: number,
  bRightTrigger: number,
  sThumbLX: number,
  sThumbLY: number,
  sThumbRX: number,
  sThumbRY: number
}

declare interface XINPUT_VIBRATION {
  wLeftMotorSpeed: number,
  wRightMotorSpeed: number
}

declare interface XINPUT_CAPABILITIES {
  Type: number | string,
  SubType: number | string,
  Flags: number | string[],
  Gamepad: XINPUT_GAMEPAD,
  Vibration: XINPUT_VIBRATION
}

declare interface XINPUT_CAPABILITIES_EX {
  Type: number | string,
  SubType: number | string,
  Flags: number | string,
  Gamepad: XINPUT_GAMEPAD,
  Vibration: XINPUT_VIBRATION,
  VendorId: string,
  ProductId: string,
  VersionNumber: string,
  unk1: number
}

declare interface XINPUT_STATE {
  dwPacketNumber: number,
  Gamepad: XINPUT_GAMEPAD
}

export function enable(enable: boolean): Promise<void>;

declare interface IOptionGetBatteryInformation {
  gamepadIndex?: number,
  devType?: number,
  translate?: boolean
}

export function GetBatteryInformation(option?: number | IOptionGetBatteryInformation): Promise<XINPUT_BATTERY_INFORMATION>;

declare interface IOptionGetCapabilities {
  gamepadIndex?: number,
  flags?: number,
  translate?: boolean
}

export function GetCapabilities(option?: number | IOption): Promise<XINPUT_CAPABILITIES>;

declare interface IOption {
  gamepadIndex?: number,
  translate?: boolean
}

export function GetCapabilitiesEx(option?: number | IOption): Promise<XINPUT_CAPABILITIES_EX>;
export function getState(option?: number | IOption): Promise<XINPUT_STATE>;
export function setState(lowFrequency: number, highFrequency: number, gamepadIndex?: number): Promise<void>;

declare interface IOptionsGetButtonsDown {
  gamepadIndex?: number,
  deadzone?: number | number[],
  directionThreshold?: number,
  triggerThreshold?: number
}

declare interface IButtonsDownTrigger {
  active: boolean,
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
  forceEnableGamepad?: boolean,
  forceStateWhileRumble?: boolean,
  gamepadIndex?: number
}

export function rumble(option?: IOptionsRumble): Promise<void>;
export function isConnected(gamepadIndex?: number): Promise<boolean>;
export function listConnected(): Promise<boolean[]>;

declare interface IOptionsIdentify {
  XInputOnly?: boolean
}

declare interface IIdentify {
  manufacturer: string,
  name: string,
  vid: string,
  pid: string,
  interfaces: string[],
  guid: string[],
  xinput: boolean 
}

export function identify (option?: IOptionsIdentify): Promise<IIdentify[]>;