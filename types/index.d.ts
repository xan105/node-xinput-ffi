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

export function enable(enable: boolean): void;
export function GetBatteryInformation(gamepadIndex?: number): XINPUT_BATTERY_INFORMATION;
export function GetCapabilities(gamepadIndex?: number): XINPUT_CAPABILITIES;
export function getState(gamepadIndex?: number): XINPUT_STATE;
export function setState(lowFrequency: number, highFrequency: number, gamepadIndex?: number): void;

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

export function getButtonsDown(option?: IOptionsGetButtonsDown): IButtonsDown;

declare interface IOptionsRumble {
  force?: number | number[],
  duration?: number,
  forceEnableGamepad?: boolean,
  forceStateWhileRumble?: boolean,
  gamepadIndex?: number
}

export function rumble(option?: IOptionsRumble): void;
export function isConnected(gamepadIndex?: number): boolean;
export function listConnected(): boolean[];

export * as promises from "./promises.d.ts";