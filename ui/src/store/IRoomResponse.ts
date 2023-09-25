export type IRoom = {
  id: string;
  name: string;
  size: number;
  url: string;
};

export type IPlayer = {
  id: number;
  name: string;
  color: string;
  uuidv4: string;
};

export type IRoomResponse = {
  message: string;
  room: IRoom;
};
