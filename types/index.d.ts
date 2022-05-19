export function enable(enable: boolean): void;
export function getBatteryInformation(option?: number | object): object;
export function getCapabilities(option?: number | object): object;
export function getKeystroke(option?: number | object): object;
export function getState(option?: number | object): object;
export function setState(lowFrequency: number, highFrequency: number, option ?: number | object): void;
export function getStateEx(option?: number | object): object;
export function waitForGuideButton(option?: number | object): void;
export function cancelGuideButtonWait(option?: number | object): void;
export function powerOffController(option?: number | object): void;
export function getBaseBusInformation(option?: number | object): object;
export function getCapabilitiesEx(option?: number | object): object;

export function isConnected(gamepad?: number): boolean;
export function listConnected(): boolean[];
export function getButtonsDown(option?: object): object;
export function rumble(option?: object): void;
export function identify (option?: object): object[];