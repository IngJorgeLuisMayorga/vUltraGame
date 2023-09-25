import Packet from "@/classes/Packet.class";
import { createStore } from "vuex";
import { IPlayer, IRoom, IRoomResponse } from "./IRoomResponse";
import { IPayload } from "@/classes/packets/ConnectingRoomSuccesfull.packet";

export default createStore({
  // ----------------------------------------------------------- //
  // --- Vuex Store :: State ----------------------------------- //
  // ----------------------------------------------------------- //
  state: {
    room: {
      id: "",
      name: "",
      url: "",
      player: {
        id: 0,
        name: "iPhone",
        color: "",
        uuidv4: "",
      },
      players: {},
    },
  },
  // ----------------------------------------------------------- //

  // ----------------------------------------------------------- //
  // --- Vuex Store :: Getters --------------------------------- //
  // ----------------------------------------------------------- //
  getters: {
    room: (state) => state.room,
    player: (state) => state.room.player,
    players: (state) => state.room.players,
  },
  // ----------------------------------------------------------- //

  // ----------------------------------------------------------- //
  // --- Vuex Store :: Mutations ------------------------------- //
  // ----------------------------------------------------------- //
  mutations: {
    SET_ROOM: (state, payload: IRoom) => {
      state.room.id = payload.id;
      state.room.name = payload.name;
      state.room.url = payload.url;
    },
    SET_PLAYER: (state, payload: IPlayer) => {
      state.room.player.id = payload.id;
      state.room.player.name = payload.name;
      state.room.player.color = payload.color;
      state.room.player.uuidv4 = payload.uuidv4;
    },
    SET_PLAYERS: (state, payload: { [key: string]: IPlayer }) => {
      state.room.players = { ...payload };
    },
  },
  actions: {
    async newRoom({ commit }, payload) {
      const username = payload.username;
      const roomname = payload.roomname;
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username, roomname: roomname }),
      };
      const response = await fetch("http://localhost:7072/rooms", options);
      const json: IRoomResponse = await response.json();
      const room = json.room;
      commit("SET_ROOM", room);
      commit("SET_PLAYER", {
        id: undefined,
        color: undefined,
        name: username,
      });
      return room;
    },
    async joinRoom({ commit }, payload) {
      const roomid = payload.roomid;
      const username = payload.username;
      const options = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      };
      const id = roomid;
      const url = `http://localhost:7072/rooms/${id}`;
      const response = await fetch(url, options);
      const json: IRoomResponse = await response.json();
      const room = json.room;
      console.log(" if (room.size === 4) { ");
      console.log(json);
      if (room.size === 4) {
        throw new Error("Room is Full with 4 Players already");
      }
      commit("SET_ROOM", room);
      commit("SET_PLAYER", {
        id: undefined,
        color: undefined,
        name: username,
        uuidv4: undefined,
      });
      return room;
    },
    async startPlayer({ commit }, payload: IPayload) {
      // Validators
      if (!payload.room.id) {
        throw new Error("Room is Full with 4 Players already");
      }

      //
      commit("SET_PLAYER", payload.player);
      commit("SET_PLAYERS", payload.players);
      return {
        player: payload.player,
        players: payload.players,
      };
    },
  },
  modules: {},
});
