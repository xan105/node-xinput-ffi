declare interface Options {
  hz?: number,
  multitap?: boolean,
  joystickAsDPAD?: boolean,
  inputFeedback?: boolean,
}

export class XInputGamepad extends EventEmitter {
    constructor(option?: Options);
    poll(): void;
    stop(): void;
    resume(): void;
    pause(): void;
    vibrate(option?: {force?: number | number[], duration?: number}): Promise<void>;
    #private;
}
import { EventEmitter } from "events";
