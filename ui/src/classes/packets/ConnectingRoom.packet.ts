export class Packet {
  constructor(payload: any) {
    //
  }
  toRaw() {
    return JSON.stringify({});
  }
}

export class ConnectingRoomPacket extends Packet {
  //command
  private _command = "RoomJoin";

  //parameters
  private _roomid = "";
  private _username = "";

  constructor(payload: { roomid: string; username: string }) {
    super({});
    if (!payload || !payload.roomid || !payload.username) {
      console.error("payload", payload);
      throw new Error("Packet payload info is not valid");
    }
    this._roomid = payload.roomid;
    this._username = payload.username;
  }
  toRaw() {
    return JSON.stringify({
      command: this._command,
      value: {
        roomId: this._roomid,
        userName: this._username,
      },
    });
  }
}
