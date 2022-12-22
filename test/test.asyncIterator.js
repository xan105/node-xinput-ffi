import { XInputGamepad } from "../lib/promises.js";

const gamepad = new XInputGamepad({
  hz: 30,
  inputFeedback: true
});

gamepad.on("input", (buttons)=>{ 
  setImmediate(() => {
  
    switch(buttons[0]) {
      case "XINPUT_GAMEPAD_GUIDE":
        console.log(buttons, "=> Exiting ...");
        gamepad.removeAllListeners(); //free
        gamepad.stop(); //stop gamepad eventloop (timersPromises.setInterval)
        break;
      default:
        console.log(buttons);
    } 
    
  });
});

try{
  gamepad.poll();
}catch(err){
  console.error(err);
}