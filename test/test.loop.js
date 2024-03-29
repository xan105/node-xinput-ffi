import { getButtonsDown } from "../lib/index.js";

let state = {
  previous : {
    packetNumber: 0,
    buttons: []
  },
  current : {}
};

/*
Handle button up (press down then release).
Ignoring hold button until they are released.
Set pressRelease to true.
*/
const pressRelease = false;

function loop(){

  getButtonsDown()
  .then((controller)=>{
    
    state.current = controller;
    
    if (state.current.packetNumber > state.previous.packetNumber){ //State update
    
      //Buttons
      if(pressRelease === true){ //"keyup"
        //check against the previous buttons state
        const diff = state.previous.buttons.filter(btn => !state.current.buttons.includes(btn))
        if (diff.length > 0) console.log(diff);
      } else {
        if (state.current.buttons.length > 0) console.log(state.current.buttons)
      }
      
      //Trigger
      if (state.current.trigger.left.active) 
        console.log("trigger L " + state.current.trigger.left.force);
      if (state.current.trigger.right.active) 
        console.log("trigger R " + state.current.trigger.right.force);
      
      //JY
      if (state.current.thumb.left.direction.length > 0)
        console.log(state.current.thumb.left.direction, Math.ceil( state.current.thumb.left.magnitude * 100 ) + "% (J LEFT)");
      if (state.current.thumb.right.direction.length > 0)
        console.log(state.current.thumb.right.direction, Math.ceil( state.current.thumb.right.magnitude * 100 ) + "% (J RIGHT)");
    }
    
    state.previous = state.current;  //store previous state
  })
  .catch((err)=>{
    console.warn(err);
  })
  .finally(()=>{
    start();
  });
}

function start(){
  if (typeof window !== 'undefined' && typeof window.document !== 'undefined')
    window.requestAnimationFrame(loop); //electron (renderer)
  else
    setTimeout(loop, 1000 / 250 /*Usually 60 hz*/ ); //Node.js
}

start();