// index.js

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 7071 });

const COMMANDS = {
	doRoomCreate: "RoomCreate",
  doRoomDestroy: "RoomDestroy",
  
  doRoomUserJoin: "RoomJoin",
  doRoomUserLeave: "RoomLeave",

}

const EVENTS = {
  onRoomStarted: "RoomStarted",
  onRoomFinished: "RoomFinished",
}

const rooms = new Map();

wss.on('connection', (ws) => {
  //const connectionId = uuidv4();
  //ws.send({})
});

ws.on('message', (message) => {
  const payload = JSON.parse(message);

  // No Command
  if(!(payload && payload.command)){
    return true;
  }

  // Command Cases
  switch (payload.command) {
    case COMMANDS.RoomCreate:
      break;
    case COMMANDS.doRoomDestroy:
      break;
    default:
      console.log(`Sorry, we are out of ${expr}.`);
  }
  
});  

wss.on("close", () => {
clients.delete(ws);
});

function uuidv4() {
return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
  var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
  return v.toString(16);
});
}

console.log("wss up");



// Add New Room
function FnCreateNewRoom(){

}