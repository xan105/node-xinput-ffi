export function enable(enable: boolean): Promise<void>;
export function getBatteryInformation(option?: number | object): Promise<object>;
export function getCapabilities(option?: number | object): Promise<object>;
export function getKeystroke(option?: number | object): Promise<object>;
export function getState(option?: number | object): Promise<object>;
export function setState(lowFrequency: number, highFrequency: number, option ?: number | object): Promise<void>;
export function getStateEx(option?: number | object): Promise<object>;
export function waitForGuideButton(option?: number | object): Promise<void>;
export function cancelGuideButtonWait(option?: number | object): Promise<void>;
export function powerOffController(option?: number | object): Promise<void>;
export function getBaseBusInformation(option?: number | object): Promise<object>;
export function getCapabilitiesEx(option?: number | object): Promise<object>;

export function isConnected(gamepad?: number): Promise<boolean>;
export function listConnected(): Promise<boolean[]>;
export function getButtonsDown(option?: object): Promise<object>;
export function rumble(option?: object): Promise<void>;
export function identify (option?: object): Promise<object[]>;