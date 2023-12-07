import * as XInput from "../lib/index.js";

await XInput.enable(false);
try{
  console.log(await XInput.getStateEx());
}catch(err){
  console.log(err.code === "ERROR_DEVICE_NOT_CONNECTED");
}

await XInput.enable(true);
console.log("should input", await XInput.getStateEx());

await XInput.enable(false);
console.log("should fake input", await XInput.getStateEx());

setTimeout(()=>{}, 3 * 1000); //keep alive
await XInput.enable(true);
console.log("rumble...");
await XInput.setState(50,50,0);
setTimeout(()=>{
  XInput.enable(false)
  .then(()=>{ console.log("interrupt!") });
}, 250);