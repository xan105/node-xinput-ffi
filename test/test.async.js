import * as XInput from "../lib/index.js";

console.log(await XInput.promises.listConnected());
console.log(await XInput.promises.isConnected());
console.log(await XInput.promises.getBatteryInformation());
console.log(await XInput.promises.getCapabilitiesEx());
console.log(await XInput.promises.identify({XInputOnly: false}));

/*
//async queue ok
XInput.promises.rumble()
.then(()=>{ return XInput.promises.rumble(); })
.then(()=>{ console.log(2); })
.catch(console.error);
console.log(1);
*/

//console.log(await XInput.promises.getState()); //ok
//await XInput.promises.enable(false);await XInput.promises.rumble(); //err device not connected triggered->ok

//await XInput.promises.setState(50,50,0);setTimeout(()=>{XInput.promises.enable(false)},500); //rumble interrupt after 500ms->ok

//await XInput.promises.rumble({force: 50});await XInput.promises.enable(false); //no interrupt->ok

/*  
await XInput.promises.rumble();
setTimeout(async()=>{
  await XInput.promises.rumble({forceStateWhileRumble: true});
},1000)
*/