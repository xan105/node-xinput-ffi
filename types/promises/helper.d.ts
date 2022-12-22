export function isConnected(gamepad?: number): Promise<boolean>;
export function listConnected(): Promise<boolean[]>;

declare interface OptionsA {
  gamepad?: number,
  deadzone?: number | number[],
  directionThreshold?: number,
  triggerThreshold?: number
}

export function getButtonsDown(option?: OptionsA): Promise<{
    packetNumber: number;
    buttons: string[] | number;
    trigger: {
        left: {
            active: boolean;
            force: number;
        };
        right: {
            active: boolean;
            force: number;
        };
    };
    thumb: {
        left: {
            x: number;
            y: number;
            magnitude: number;
            direction: string[];
        };
        right: {
            x: number;
            y: number;
            magnitude: number;
            direction: string[];
        };
    };
}>;

declare interface OptionsB {
  gamepad: number,
  force: number | number[],
  duration: number,
  forceEnableGamepad: boolean,
  forceStateWhileRumble: boolean
}

export function rumble(option?: OptionsB): Promise<void>;

declare interface OptionsC {
  XInputOnly?: boolean
}

export function identify(option?: OptionsC): Promise<{
  name: string;
  manufacturer: string;
  vendorID: number;
  productID: number;
  xinput: boolean;
  interfaces: string[];
  guid: string[];
}[]>;
