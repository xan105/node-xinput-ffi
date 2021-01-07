"use strict";

const XInput = require("../lib/xinput.cjs");

const available_gamepad = XInput.sync.listConnected();
console.log(available_gamepad); //ok

/*
const isConnected = XInput.sync.isConnected(0); //ok
const isConnected = XInput.sync.isConnected(); //ok
const isConnected = XInput.sync.isConnected("string"); //err->ok
const isConnected = XInput.sync.isConnected(-1); //err->ok
const isConnected = XInput.sync.isConnected(6); //err->ok
const isConnected = XInput.sync.isConnected(null); //err->ok
console.log(isConnected);
*/

/*
XInput.sync.rumble(); //ok
XInput.sync.rumble({force: 100}); //ok
XInput.sync.rumble({force: [25,25]}); //ok
XInput.sync.rumble({duration: 500}); //ok
XInput.sync.rumble({duration: 5000}); //ok
XInput.sync.rumble({gamepadIndex: 10}); //ok
console.log(1);XInput.sync.rumble();console.log(2);XInput.sync.rumble();console.log("end"); //ok
*/

/*
XInput.sync.setState(10000,50,0); //err->ok
XInput.sync.setState(null,50,0); //err->ok
XInput.sync.setState("string",50,0); //err->ok
XInput.sync.setState(50,10000,0); //err->ok
XInput.sync.setState(50,null,0); //err->ok
XInput.sync.setState(50,"string",0); //err->ok
XInput.sync.setState(50,50);setTimeout(()=>{}, CONTROLLER_RUMBLE_DURATION) //ok
XInput.sync.setState(50,50,10000); //err->ok
XInput.sync.setState(50,50,"string"); //err->ok
XInput.sync.setState(50,50,null); //err->ok
*/

/*
const state = XInput.sync.getState(); //ok
const state = XInput.sync.getState(0); //ok
console.log(state);
XInput.sync.getState(1000); //err->ok
XInput.sync.getState("string"); //err->ok
XInput.sync.getState(null); //err->ok
*/

/*
XInput.sync.enable(false);XInput.sync.rumble(); //err device not connected triggered->ok
XInput.sync.setState(50,50,0);setTimeout(()=>{XInput.sync.enable(false);},500); //rumble interrupt after 500ms->ok
*/
