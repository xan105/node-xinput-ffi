import { XInputGamepad } from "../lib/promises.js";

const gamepad = new XInputGamepad({
  hz: 30,
  inputForceFeedback: true
});

gamepad.on("input", (buttons)=>{ 
  setImmediate(() => {
    console.log(buttons);
  });
});

gamepad.poll();

/* when done
gamepad.removeAllListeners();
gamepad.stop(); //stop gamepad eventloop (timersPromises.setInterval)
*/