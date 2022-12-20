/*
Copyright (c) Anthony Beaumont
This source code is licensed under the GNU AFFERO GENERAL PUBLIC LICENSE Version 3
found in the LICENSE file in the root directory of this source tree.
*/

import { EventEmitter } from "node:events";
import { setInterval } from "node:timers/promises";
import { shouldObj } from "@xan105/is/assert";
import { asIntegerWithinRange, asBoolean } from "@xan105/is/opt";
import { getButtonsDown, rumble } from "./helper.js";
import { enable } from "./xinput.js";

/*
This is a high level implementation of XInput to get the gamepad's input on the fly in a human readable way.
This serves as an example to demonstrate how to use the XInput functions and helpers based around them.
The purpose of this class is to drive a simple menu navigation system with a XInput compatible controller (real XInput or through XInput emulation).
This leverages the new Node.js timersPromises setInterval() to keep the event loop alive and do the gamepad polling.
*/

class XInputGamepad extends EventEmitter {
  
  #controller = new AbortController();
  #state = {
    previous: { packetNumber: 0, buttons: [] },
    current: { packetNumber: 0, buttons: [] }
  };
  
  constructor(option = {}){
    super();
    
    shouldObj(option);
    Object.defineProperty(this, "options", {
      value: Object.freeze({
        hz: asIntegerWithinRange(option.hz, 30, 250) ?? 30, /* This will determinate the polling rate. 
          Usually 60hz (1000/60 = ~16ms) is used. If I'm not mistaken this is what the Chrome browser uses.
          But for our use case we don't need to poll that fast.
          
          Increasing this value improves latency, but may cause a loss in performance due to more CPU time spent.
          */
        joystickAsDPAD: asBoolean(option.joystickAsDPAD) ?? true,
        inputForceFeedback: asBoolean(option.inputForceFeedback) ?? false
      }),
      writable: false,
      configurable: false,
      enumerable: true
    }); 
  }
  
  poll(){
    this.eventLoop()
    .catch((err)=>{
      if(err.code !== "ABORT_ERR") throw err;
    });
  }
  
  stop(){
    this.#controller.abort();
  }
  
  resume(){
    enable(true).catch(()=>{});
  }
  
  pause(){
    enable(false).catch(()=>{});
  }

  async eventLoop(){
    
    const pollingRate = 1000 / this.options.hz;
    /*
     30hz = ~33ms
     60hz = ~16ms
     120hz = ~8ms
     250hz = 4ms
     Decreasing the interval improves latency, but may cause a loss
     in performance due to more CPU time spent in the input polling.
    */
    
    const iterator = setInterval(
      pollingRate, 
      getButtonsDown, 
      { signal: this.#controller.signal }
    );
    
    for await (const value of iterator) 
    {
      try{
        this.#state.current = await value({directionThreshold : 0.6 });
      }catch(err){
        if (err === "ERROR_DEVICE_NOT_CONNECTED") continue;
      }

      if (this.#state.current.packetNumber > this.#state.previous.packetNumber) //State update
      { 
        /*Buttons previous state comparison:
          Handle button up (press down then release).
          Ignoring hold button until they are released.
        */
        let buttons = this.#state.previous.buttons.filter(btn => !this.#state.current.buttons.includes(btn));
        
        //Convert Triggers to on/off
        if (this.#state.previous?.trigger?.left?.active && !this.#state.current.trigger.left.active) 
          buttons.push("GAMEPAD_LEFT_TRIGGER"); //Not "real" XInput button name
        if (this.#state.previous?.trigger?.right?.active && !this.#state.current.trigger.right.active) 
          buttons.push("GAMEPAD_RIGHT_TRIGGER"); //Not "real" XInput button name
        
        //Left joystick to dpad emulation
        if (this.options.joystickAsDPAD && 
            this.#state.previous.thumb?.left?.direction?.length === 1 &&
            this.#state.current.thumb.left.direction.length === 0
        ){
          const joy2dpad = "XINPUT_GAMEPAD_DPAD_" + this.#state.previous.thumb.left.direction[0];
          if(!buttons.includes(joy2dpad)) buttons.push(joy2dpad);  
        }
        
        if (buttons.length > 0) {
          this.emit("input", buttons);
          if (this.options.inputForceFeedback){ //Just for fun
            rumble({
              force: [0, 50],
              duration: 128
            }).catch(()=>{});
          }
        }
      }
      this.#state.previous = this.#state.current;
    }
  }

};

export { XInputGamepad };