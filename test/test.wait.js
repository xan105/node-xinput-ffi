import { setTimeout } from "timers/promises";
import * as XInput from "../lib/index.js";

console.log("0");

console.log("press guide button to continue...");
await XInput.promises.waitForGuideButton();
console.log("1");

await setTimeout(1000 / 60); //one frame delay

console.log("press guide button (again) to continue...");
await XInput.promises.waitForGuideButton();
console.log("2");