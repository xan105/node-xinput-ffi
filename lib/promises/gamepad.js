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
import { XUSER_MAX_COUNT } from "../constants.js";

/*
This is a high level implementation of XInput to get the gamepad's input on the fly in a human readable way.
This serves as an example to demonstrate how to use the XInput functions and helpers based around them.
The purpose of this class is to drive a simple menu navigation system with a XInput compatible controller (real XInput or through XInput emulation).
This leverages the new Node.js timersPromises setInterval() to keep the event loop alive and do the gamepad polling.
*/

class XInputGamepad extends EventEmitter {
  
  #controller = new AbortController();
  #state = Array(XUSER_MAX_COUNT.XInput).fill({
    previous: { packetNumber: 0, buttons: [] },
    current: { packetNumber: 0, buttons: [] }
  });
  
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
        multitap: asBoolean(option.multitap) ?? true,
        joystickAsDPAD: asBoolean(option.joystickAsDPAD) ?? true,
        inputFeedback: asBoolean(option.inputFeedback) ?? false,
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
  
  rumble(option){
    return rumble(option);
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
    
    const max = this.options.multitap ? XUSER_MAX_COUNT.XInput : 1;
    
    for await (const value of iterator) 
    {
      for (let gamepad = 0; gamepad < max; gamepad++)
      {
        try{
          this.#state[gamepad].current = await value({ gamepad, directionThreshold : 0.6 });
          
          const current = this.#state[gamepad].current;
          const previous = this.#state[gamepad].previous;
          
          if (current.packetNumber > previous.packetNumber) //State update
          { 
            /*Buttons previous state comparison:
              Handle button up (press down then release).
              Ignoring hold button until they are released.
            */
            let buttons = previous.buttons.filter(btn => !current.buttons.includes(btn));
            
            //Convert Triggers to on/off
            if (previous.trigger?.left?.active && !current.trigger.left.active) 
              buttons.push("GAMEPAD_LEFT_TRIGGER"); //Not "real" XInput button name
            if (previous.trigger?.right?.active && !current.trigger.right.active) 
              buttons.push("GAMEPAD_RIGHT_TRIGGER"); //Not "real" XInput button name
            
            //Left joystick to dpad emulation
            if (this.options.joystickAsDPAD && 
                previous.thumb?.left?.direction?.length === 1 &&
                current.thumb.left.direction.length === 0
            ){
              const joy2dpad = "XINPUT_GAMEPAD_DPAD_" + previous.thumb.left.direction[0];
              if(!buttons.includes(joy2dpad)) buttons.push(joy2dpad);  
            }
            
            if (buttons.length > 0) {
              this.emit("input", buttons);
              if (this.options.inputFeedback){ //Just for fun and/or debug
                rumble({
                  force: [0, 50],
                  duration: 128
                }).catch(()=>{});
              }
            }
          }
          this.#state[gamepad].previous = this.#state[gamepad].current;
          break;
          
        }catch(err){
          if (err.code === "ERROR_DEVICE_NOT_CONNECTED") continue;
        }
      }
    }
  }

};

export { XInputGamepad };