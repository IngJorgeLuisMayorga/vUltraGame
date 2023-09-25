import { IPlayer } from "@/store/IRoomResponse";
import { Packet } from "./ConnectingRoom.packet";
export type IPayload = {
  room: {
    id: string;
    url: string;
    name: string;
  };
  player: IPlayer;
  players: {
    [key: string]: IPlayer;
  };
  message: string;
};
export class ConnectingRoomSuccesfullPacket extends Packet {
  //command
  private _command = "ROOM_JOINED_SUCCESFULL";

  //parameter
  private _wait = false;
  private _start = false;

  private _payload: IPayload | null = null;

  constructor(payload: IPayload) {
    super({});
    if (!payload || !payload.room || !payload.player || !payload.players) {
      console.error("payload", payload);
      throw new Error("Packet payload info is not valid");
    }
    if (payload.message === "START") {
      this._start = true;
    } else if (payload.message === "WAIT") {
      this._wait = true;
    } else {
      this._wait = false;
      this._start = false;
    }
    this._payload = payload;
  }
  get wait() {
    return this._wait;
  }
  get start() {
    return this._start;
  }
  get payload() {
    return this._payload;
  }
  toRaw() {
    return JSON.stringify({
      command: this._command,
      value: this._payload,
    });
  }
}
