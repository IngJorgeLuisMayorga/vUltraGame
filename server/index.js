// index.js

const COMMANDS = require("./constants/commands");
const ERRORS = require("./constants/errors");

const uuidv4 = require("./helpers/uuidv4.js");
const RoomClass = require("./classes/room.class.js");

// ------------------------------------------------ //
// ----
// ------------------------------------------------ //
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 7071 });
// ------------------------------------------------ //

// ------------------------------------------------ //
// -- Rooms --------------------------------------- //
const rooms = new Map();
// ------------------------------------------------- //

// ------------------------------------------------ //
// WebSocket Connections -------------------------- //
// ------------------------------------------------//
wss.on("connection", (ws) => {
  ws.uuidv4 = uuidv4();

  ws.on("message", (packet) => {
    const message = packet.toString();
    const payload = JSON.parse(message);

    // No Command
    if (!(payload && payload.command)) {
      return true;
    }

    // Command Cases
    switch (payload.command) {
      case COMMANDS.doRoomCreate:
        try {
          const room = FnCreateNewRoom(payload.value, ws);
        } catch (err) {
          console.error(err);
          ws.send(
            JSON.stringify({
              command: COMMANDS.ERROR,
              payload: ERRORS.RoomNameAlreadyExists,
            })
          );
        }
        break;
      case COMMANDS.doRoomUserJoin:
        try {
          const room = FnJoinRoom(payload.value, ws);
        } catch (err) {
          console.error(err);
          ws.send(
            JSON.stringify({
              command: COMMANDS.ERROR,
              payload: ERRORS.RoomNameAlreadyExists,
            })
          );
        }
      case COMMANDS.doRoomDestroy:
        break;
      default:
        console.log({
          COMMANDS: COMMANDS,
          must: COMMANDS.RoomCreate,
          butIs: payload.command,
        });
        console.log(`ERROR:NO COMMAND`);
    }
  });

  ws.on("close", () => {
    const clientUUIDV4 = ws.uuidv4;
    const clientRoomId = [...rooms.entries()]
      .filter(({ 1: value }) => value.getClientByUuidv4(clientUUIDV4))
      .map(([k]) => k)[0];
    const clientRoom = rooms.get(clientRoomId);

    if (!clientRoom) return null;

    clientRoom.removeClientByUuidv4(clientUUIDV4);
    if (clientRoom.size === 0) {
      delete clientRoom;
      rooms.delete(clientRoomId);
    }

    //clients.delete(ws);
  });
});

// ------------------------------------------------ //

// Add New Room
function FnCreateNewRoom(roomName, ws) {
  const room = new RoomClass(roomName, ws);
  // A room with same name exists
  if (rooms.get(room.id)) throw new Error("Uh oh!");
  rooms.set(room.id, room);
  ws.send(
    JSON.stringify({
      command: "ROOM_CREATED_SUCCESFULL",
      payload: {
        id: rooms.get(room.id).id,
        name: rooms.get(room.id).name,
        url: rooms.get(room.id).url
      },
    })
  );
  return room;
}

// Join in Existing Room
function FnJoinRoom(roomURL, ws) {
  const match = /(?<=room\/)\w*/.exec(roomURL);
  const roomMD5 = match ? match[0] : null;
  if (!roomMD5) throw new Error("Uh oh!");
  if (!rooms.get(roomMD5)) throw new Error("Uh oh!");
  rooms.get(roomMD5).addClientByUuidv4(ws.uuidv4, ws);

  ws.send(
    JSON.stringify({
      COMMANDS: "CONNECTION_SUCCESFULL",
      value: {
        id: rooms.get(roomMD5).id,
        url: rooms.get(roomMD5).url,
        name: rooms.get(roomMD5).name,
        clientUUIDV4: ws.uuidv4,
        message: "Welcome",
      },
    })
  );

  return null;
}
