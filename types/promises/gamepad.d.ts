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
    eventLoop(): Promise<void>;
    #private;
}
import { EventEmitter } from "events";
