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

//async queue ok
console.log(0);
XInput.promises.rumble()
.then(()=>{ return XInput.promises.rumble(); })
.then(()=>{ console.log(2); })
.catch(console.error);
console.log(1);

//await XInput.promises.enable(false);await XInput.promises.rumble(); //err device not connected triggered->ok
//await XInput.promises.setState(50,50,0);setTimeout(()=>{XInput.promises.enable(false)},500); //rumble interrupt after 500ms->ok
//await XInput.promises.rumble({force: 50});await XInput.promises.enable(false); //no interrupt->ok
/*  
await XInput.promises.rumble();
setTimeout(async()=>{
  await XInput.promises.rumble({forceStateWhileRumble: true});
},1000)
*/