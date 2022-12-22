declare interface Options {
  XInputOnGameInput?: boolean
}

export function dlopen(option: Options): (...args: unknown[]) => any;
