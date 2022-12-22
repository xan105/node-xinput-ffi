export function isConnected(gamepad?: number): boolean;
export function listConnected(): boolean[];

declare interface OptionsA {
  gamepad?: number,
  deadzone?: number | number[],
  directionThreshold?: number,
  triggerThreshold?: number
}

export function getButtonsDown(option?: OptionsA): {
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
};

declare interface OptionsB {
  gamepad: number,
  force: number | number[],
  duration: number,
  forceEnableGamepad: boolean,
  forceStateWhileRumble: boolean
}

export function rumble(option?: OptionsB): void;
