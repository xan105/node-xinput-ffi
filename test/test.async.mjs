import * as XInput from "../lib/esm.mjs";

(async () => {
  const available_gamepad = await XInput.listConnected();
  console.log(available_gamepad); //ok
  //const isConnected = await XInput.isConnected();console.log(isConnected); //ok

  /*async queue ok
  XInput.rumble()
  .then(()=>{ return XInput.rumble(); })
  .then(()=>{ console.log(2); })
  .catch(console.error);
  console.log(1);
  */

  //const state = await XInput.getState();console.log(state); //ok

  //await XInput.enable(false);await XInput.rumble(); //err device not connected triggered->ok

  //await XInput.setState(50,50,0);setTimeout(()=>{XInput.enable(false)},500); //rumble interrupt after 500ms->ok

  //await XInput.rumble({force: 50});await XInput.enable(false); //no interrupt->ok
})().catch(console.error);
