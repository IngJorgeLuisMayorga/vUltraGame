var md5 = require('md5');

class RoomClass{

    constructor(name) {
        this._name = name;
        this._id = md5(name);
        this._url = `http://localhost:8080/game/room/${this._id}`
        this._clients = new Map();
        this._players = new Map();
        this._colors = [
            'blue',
            'green',
            'red',
            'purple'
        ]
    }

    get id(){
        return this._id;
    }
    get name(){
        return this._id;
    }
    get url(){
        return this._url;
    }
    get size(){
        return this._clients.size
    }
    get colors(){
        return this._colors;
    }
    get players(){
        return this._players;
    }
    getplayersRaw(){
        return { ...null, ...this._players.entries} ;
    }


    isInThisRoom(){}

    addPlayerByUuidv4(uuidv4, player){
        return this._players.set(uuidv4, player);
    }

    getPlayerByUuidv4(uuidv4){
        return this._players.get(uuidv4);
    }

    addClientByUuidv4(uuidv4, ws){
        return this._clients.set(uuidv4, ws);
    }
    
    getClientByUuidv4(uuidv4){
        return this._clients.get(uuidv4);
    }

    removeClientByUuidv4(uuidv4){
        this._clients.delete(uuidv4);
    }




}
module.exports = RoomClass
