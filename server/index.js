// index.js

const COMMANDS = require("./constants/commands");
const ERRORS = require("./constants/errors");

const uuidv4 = require("./helpers/uuidv4.js");
const RoomClass = require("./classes/room.class.js");

// ------------------------------------------------ //
// ----
// ------------------------------------------------ //
const express = require("express"); //llamamos a Express
var bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 7072; // establecemos nuestro puerto
app.use(
  cors({
    origin: "*",
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 7071 });
// ------------------------------------------------ //

// ------------------------------------------------ //
// -- Rooms --------------------------------------- //
const rooms = new Map();
rooms.set("9f6290f4436e5a2351f12e03b6433c3c", new RoomClass("Apple"));
console.log(rooms);
// ------------------------------------------------- //

// ------------------------------------------------ //
// REST Connections ------------------------------- //
// ------------------------------------------------//
app.get("/rooms", function (req, res) {
  try {
    const rooms = doGetRooms();
    res.json({ mensaje: "get /rooms", rooms: rooms });
  } catch (err) {
    console.log(err)
    res.json({ mensaje: "get /rooms", error: err });
  }
});
app.get("/rooms/:id", function (req, res) {
  try {
    const id = req.params.id;
    const room = doGetRoomById(id);
    console.log(' ')
    console.log(' ')
    console.log(' const id = req.params.id; ')
    console.log(id)
    console.log(' ')
    console.log(' rooms ')
    console.log(rooms)
    console.log(' ')
    console.log(' room ')
    console.log(room)
    console.log(' ')
    console.log(' ')
    
    res.json({
      mensaje: "get /rooms/" + id,
      room: {
        id: room.id,
        url: room.url,
        name: room.name,
        size: room.size,
      },
    });
  } catch (err) {
    console.log(err)
    res.json({ mensaje: "get id /rooms", error: err });
  }
});
app.post("/rooms", function (req, res) {
  try {
    const name = req.body.roomname;
    const room = doAddRoomByName(name);
    res.json({
      mensaje: "post /rooms",
      room: {
        id: room.id,
        url: room.url,
        name: room.name,
        size: room.size,
      },
    });
  } catch (err) {
    console.log(err);
    res.json({ mensaje: "post /rooms", error: err });
  }
});
app.patch("/rooms/:id", function (req, res) {
  try {
    const name = req.body.name;
    const room = doPatchRoomById(name);
    res.json({ mensaje: "patch /rooms", room: room });
  } catch (err) {
    console.log(err)
    res.json({ mensaje: "patch /rooms", error: err });
  }
});
app.delete("/rooms/:id", function (req, res) {
  try {
    const id = req.params.id;
    const room = doRemoveRoomById(id);
    res.json({ mensaje: "delete /rooms/" + id, room });
  } catch (err) {
    console.log(err)
    res.json({ mensaje: "delete /rooms", error: err });
  }
});
app.listen(port);
// ------------------------------------------------//

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
        FnCreateNewRoom(payload.value, ws);
        break;
      case COMMANDS.doRoomUserJoin:
        FnJoinRoom(payload.value, ws);
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
        url: rooms.get(room.id).url,
      },
    })
  );
  return room;
}

// Join in Existing Room
function FnJoinRoom(payload, ws) {
  const roomId = payload.roomId;
  const userName = payload.userName;
  if (!rooms.get(roomId)) {
    console.log("{ roomId , userName}");
    console.log({ roomId , userName});
    throw new Error("Room MD5 id not existing");
  }

  const room = rooms.get(roomId);
  const clientId = room.size;
  const clientName = userName;
  const clientColor = room.colors[clientId];
  const clientUUIDV4 = ws.uuidv4;

  const player = {
    id : clientId,
    name: clientName,
    color: clientColor,
    uuidv4 :  clientUUIDV4
  }

  rooms.get(roomId).addClientByUuidv4(ws.uuidv4, ws);
  rooms.get(roomId).addPlayerByUuidv4(player.uuidv4, player);

  const Room = rooms.get(roomId);
  const Player = Room.getPlayerByUuidv4(player.uuidv4);
  const Players = Object.fromEntries(Room.players);
  const Message = Room.size === 4 ? 'START' : 'WAIT';

  ws.send(
    JSON.stringify({
      command: "ROOM_JOINED_SUCCESFULL",
      value: {

        room: {
          id: Room.id,
          url: Room.url,
          name: Room.name,
        },

        player: Player,

        players: Players,
       
        message: Message,
      },
    })
  );

  return null;
}

function doGetRooms() {
  return rooms;
}
function doGetRoomById(id) {
  return rooms.get(id);
}
function doAddRoomByName(name) {
  const roomName = name;
  const room = new RoomClass(roomName);
  if (rooms.get(room.id)) throw new Error("Uh oh!");
  rooms.set(room.id, room);
  return room;
}
function doPatchRoomById(id, payload) {
  const roomId = id;
  const roomPayload = payload;
  const room = rooms.get(roomId);
  if (rooms.get(room.id)) throw new Error("Uh oh!");
  rooms.set(room.id, {
    ...room,
    ...roomPayload,
  });
  return room;
}
function doRemoveRoomById(id) {
  const roomId = id;
  const room = rooms.get(roomId);
  if (rooms.get(room.id)) throw new Error("Uh oh!");
  rooms.delete(id);
  return room;
}
