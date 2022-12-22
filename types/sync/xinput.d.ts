export function enable(enable: boolean): void;

declare interface OptionsA {
  dwUserIndex?: number,
  devType?: number,
  translate?: boolean
}

export function getBatteryInformation(option?: OptionsA | number): {
    batteryType: number | string;
    batteryLevel: number | string;
};

declare interface OptionsB {
  dwUserIndex?: number,
  dwFlags?: number,
  translate?: boolean
}

export function getCapabilities(option?: OptionsB | number): {
    type: number | string;
    subType: number | string;
    flags: number | string[];
    gamepad: {
        wButtons: number | string[];
        bLeftTrigger: number;
        bRightTrigger: number;
        sThumbLX: number;
        sThumbLY: number;
        sThumbRX: number;
        sThumbRY: number;
    };
    vibration: {
        wLeftMotorSpeed: number;
        wRightMotorSpeed: number;
    };
};

declare interface OptionsC {
  dwUserIndex?: number,
  translate?: boolean
}

export function getKeystroke(option?: OptionsC | number): {
    virtualKey: number | string;
    unicode: number;
    flags: number | string[];
    userIndex: number;
    hidCode: number;
};

export function getState(option?: OptionsC | number): {
    dwPacketNumber: number;
    gamepad: {
        wButtons: number | string[];
        bLeftTrigger: number;
        bRightTrigger: number;
        sThumbLX: number;
        sThumbLY: number;
        sThumbRX: number;
        sThumbRY: number;
    };
};

declare interface OptionsD {
  dwUserIndex?: number,
  usePercent?: boolean
}

export function setState(lowFrequency: number, highFrequency: number, option?: OptionsD | number): void;

export function getStateEx(option?: OptionsC | number): {
    dwPacketNumber: number;
    gamepad: {
        wButtons: number | string[];
        bLeftTrigger: number;
        bRightTrigger: number;
        sThumbLX: number;
        sThumbLY: number;
        sThumbRX: number;
        sThumbRY: number;
    };
};

declare interface OptionsE {
  dwUserIndex?: number,
  dwFlags?: number
}

export function waitForGuideButton(option?: OptionsE | number): void;

declare interface OptionsF {
  dwUserIndex?: number
}

export function cancelGuideButtonWait(option?: OptionsF | number): void;

export function powerOffController(option?: OptionsF | number): void;

declare interface OptionsG {
  dwBusIndex?: number
}

export function getBaseBusInformation(option?: OptionsG | number): object;

export function getCapabilitiesEx(option?: OptionsB | number): {
    capabilities: {
      type: number | string;
      subType: number | string;
      flags: number | string[];
      gamepad: {
          wButtons: number | string[];
          bLeftTrigger: number;
          bRightTrigger: number;
          sThumbLX: number;
          sThumbLY: number;
          sThumbRX: number;
          sThumbRY: number;
      };
      vibration: {
          wLeftMotorSpeed: number;
          wRightMotorSpeed: number;
      };
    };
    vendorId: number | string;
    productId: number | string;
    productVersion: number;
    unk1: number;
    unk2: number;
};
