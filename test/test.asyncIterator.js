import { XInputGamepad } from "../lib/index.js";

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

console.log("Start");
gamepad.vibrate()
.then(()=>{
  console.log("Press any button ...");
  gamepad.poll();
})
.catch(console.error);
