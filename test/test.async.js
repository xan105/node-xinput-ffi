import * as XInput from "../lib/index.js";

console.log(
  await XInput.promises.identify({XInputOnly: false}),
  await XInput.promises.listConnected(),
  await XInput.promises.getBatteryInformation(),
  await XInput.promises.getCapabilities(),
  await XInput.promises.getCapabilitiesEx()
);

console.log("press guide button to continue...");
await XInput.promises.waitForGuideButton();

console.log(
  await XInput.promises.getState({translate: false}),
  await XInput.promises.getStateEx()
);

//async queue
console.log(0);
XInput.promises.rumble()
.then(()=>{ return XInput.promises.rumble(); })
.then(()=>{ console.log(2); })
.catch(console.error);
console.log(1);