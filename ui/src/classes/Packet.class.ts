export default class Packet2 {
  isResponse = false;
  isError = false;

  command = "";
  payload = "";

  constructor(packet: string) {
    if (!packet) throw new Error("");
    if (!JSON.parse(packet)) throw new Error("");
    const obj = JSON.parse(packet);
    this.command = obj.command;
    this.payload = obj.payload;

    if (this.command === "ERROR") {
      this.isError = true;
    }

    if (this.command === "ROOM_CREATED_SUCCESFULL") {
      this.isResponse = true;
    }

    if (this.command === "ROOM_JOINED_SUCCESFULL") {
      this.isResponse = true;
    }
  }
}
