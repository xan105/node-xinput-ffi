import * as XInput from "../lib/index.js";

const available_gamepad = XInput.listConnected();
console.log(available_gamepad); //ok
console.log(XInput.GetBatteryInformation());
console.log(XInput.GetCapabilities());

/*
//const isConnected = XInput.isConnected(0); //ok
//const isConnected = XInput.isConnected(); //ok
//const isConnected = XInput.isConnected("string"); //err->ok
//const isConnected = XInput.isConnected(-1); //err->ok
//const isConnected = XInput.isConnected(6); //err->ok
//const isConnected = XInput.isConnected(null); //err->ok
console.log(isConnected);
*/

/*
XInput.rumble(); //ok
XInput.rumble({force: 100}); //ok
XInput.rumble({force: [25,25]}); //ok
XInput.rumble({duration: 500}); //ok
XInput.rumble({duration: 5000}); //ok
XInput.rumble({gamepadIndex: 10}); //ok
console.log(1);XInput.rumble();console.log(2);XInput.rumble();console.log("end"); //ok
*/

/*
//XInput.setState(10000,50,0); //err->ok
//XInput.setState(null,50,0); //err->ok
//XInput.setState("string",50,0); //err->ok
//XInput.setState(50,10000,0); //err->ok
//XInput.setState(50,null,0); //err->ok
//XInput.setState(50,"string",0); //err->ok
//XInput.setState(50,50);setTimeout(()=>{}, 2500) //ok
//XInput.setState(50,50,10000); //err->ok
//XInput.setState(50,50,"string"); //err->ok
//XInput.setState(50,50,null); //err->ok
*/

/*
//const state = XInput.getState(); //ok
//const state = XInput.getState(0); //ok
//console.log(state);
//XInput.getState(1000); //err->ok
//XInput.getState("string"); //err->ok
//XInput.getState(null); //err->ok
*/

/*
//XInput.enable(false);XInput.rumble(); //err device not connected triggered->ok
//XInput.setState(50,50,0);setTimeout(()=>{XInput.enable(false);},500); //rumble interrupt after 500ms->ok
*/