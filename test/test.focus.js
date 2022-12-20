import * as XInput from "../lib/index.js";

await XInput.promises.enable(false);
try{
  console.log(await XInput.promises.getStateEx());
}catch(err){
  console.log(err.code === "ERROR_DEVICE_NOT_CONNECTED");
}

await XInput.promises.enable(true);
console.log("should input", await XInput.promises.getStateEx());

await XInput.promises.enable(false);
console.log("should fake input", await XInput.promises.getStateEx());

setTimeout(()=>{}, 3 * 1000); //keep alive
await XInput.promises.enable(true);
console.log("rumble...");
await XInput.promises.setState(50,50,0);
setTimeout(()=>{
  XInput.promises.enable(false)
  .then(()=>{ console.log("interrupt!") });
}, 250);