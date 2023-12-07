import * as XInput from "../lib/index.js";

console.log(
  await XInput.identify({XInputOnly: false}),
  await XInput.listConnected(),
  await XInput.getBatteryInformation(),
  await XInput.getCapabilities(),
  await XInput.getCapabilitiesEx()
);

console.log("press guide button to continue...");
await XInput.waitForGuideButton();

console.log(
  await XInput.getState({translate: false}),
  await XInput.getStateEx()
);

//async queue
console.log(0);
XInput.rumble()
.then(()=>{ return XInput.rumble(); })
.then(()=>{ console.log(2); })
.catch(console.error);
console.log(1);