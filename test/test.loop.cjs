"use strict";

const XInput = require("../lib/xinput.cjs");

let state = {
	previous : {
		packetNumber: 0,
		buttons: []
	},
	current : {}
};

function inputLoop(){

	XInput.getButtonsDown({
		directionThreshold: 0,
		triggerThreshold: 200
	})
	.then((controller)=>{
		
		state.current = controller; 
		
		if (state.current.packetNumber > state.previous.packetNumber){ //State update
			//console.log(controller.buttons)
			
			//Ignore continous press => continous press = normal press on release
			const diff = state.previous.buttons.filter(btn => !state.current.buttons.includes(btn))
			console.log(diff);
			
			if (controller.trigger.left.active) console.log(`trigger L (${controller.trigger.left.force})`);
			if (controller.trigger.right.active) console.log(`trigger R (${controller.trigger.right.force})`);
			
			console.log(controller.thumb.left.direction);
			console.log(controller.thumb.right.direction);
			
		}
		
		state.previous = state.current;

	})
	.catch((err)=>{
		console.warn(err);
	})
	.finally(()=>{
		setTimeout(inputLoop, 1000 / 60 );
	});
}

inputLoop();