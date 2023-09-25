<template>
  <div class="view view__game">
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/game/room/554">Game Board</router-link>
    </nav>
    <PlayerTitle
      v-bind:index="player.index"
      v-bind:title="player.title"
      v-bind:timer="player.timer"
      v-bind:color="player.color"
      v-bind:isActive="player.isActive"
      v-bind:key="player.index"
      :class="{
        player__0: player.index === 0,
        player__1: player.index === 1,
        player__2: player.index === 2,
        player__3: player.index === 3,
      }"
      v-for="player in players"
    ></PlayerTitle>

    <div class="view__board">
      <HexBoard :players="players"></HexBoard>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted } from "vue";
import { Computed, useStore } from "vuex";
import { Options, Vue } from "vue-class-component";
import PlayerTitle from "@/components/PlayerTitle.vue";
import HexBoard from "@/components/HexBoard.vue";
import { ConnectingRoomPacket } from "../classes/packets/ConnectingRoom.packet";
import { ConnectingRoomSuccesfullPacket } from "../classes/packets/ConnectingRoomSuccesfull.packet";
import { useToast } from "primevue/usetoast";
@Options({
  components: {
    PlayerTitle,
    HexBoard,
  },
})
export default class HomeView extends Vue {
  public connection: any = null;

  public store = useStore();
  public playerActive = 0;

  public players = [
    {
      index: 0,
      title: "Esben",
      color: "blue",
      timer: 60,
      isActive: true,
    },
    {
      index: 1,
      title: "Fei",
      timer: 60,
      color: "green",
      isActive: false,
    },
    {
      index: 2,
      title: "Carolina",
      color: "red",
      timer: 60,
      isActive: false,
    },
    {
      index: 3,
      title: "Hikaru",
      color: "purple",
      timer: 60,
      isActive: false,
    },
  ];

  public toast = useToast();

  get player() {
    return { ...this.store.getters.player };
  }

  get room() {
    return { ...this.store.getters.room };
  }

  async mounted() {
    const roomId = this.$route.params.roomId;
    const room = await this.store.dispatch("joinRoom", {
      roomid: roomId,
      username: this.player.name,
    });

    setTimeout(() => {
      this.connection = new WebSocket("ws://localhost:7071");
      this.connection.onopen = this.onopen;
      this.connection.onclose = this.onclose;
      this.connection.onmessage = this.onmessage;
    }, 2500);

    /*
    console.log(" Room Id", roomId);
    console.log(" player ");
    console.log(this.player);
    */
  }

  onopen(event: Event) {
    const roomid = this.room.id;
    const username = this.player.name;
    const packet = new ConnectingRoomPacket({ roomid, username });
    this.connection.send(packet.toRaw());
  }
  onclose(event: Event) {
    console.log("Close WB Connection");
  }
  onmessage(event: MessageEvent) {
    const message = JSON.parse(event.data);
    const command = message.command;
    switch (command) {
      case "ROOM_JOINED_SUCCESFULL": {
        const packet = new ConnectingRoomSuccesfullPacket(message.value);
        if (!packet.payload) {
          console.error(packet);
          throw new Error(" No packet Payload here");
        }
        console.warn(message);
        if (!packet.wait) {
          this.toast.add({
            severity: "success",
            summary: "Un jugador se ha conectado, esperando que sean 4",
            life: 3000,
          });
          return null;
        }
        this.store
          .dispatch("startPlayer", packet.payload)
          .then((response) => {
            console.log(" ");
            console.log(" START GAME!!!! ");
            console.log(response);
            console.log(" ");
          })
          .catch((error) => console.error(error));
        break;
      }
      default: {
        console.log("onmessage::");
        console.log(message);
        console.log(message.command);
        console.log(message.command === "ROOM_JOINED_SUCCESFULL");
      }
    }
  }
}

/*

import WebSocket from 'ws';

const ws = new WebSocket('ws://www.host.com/path');

ws.on('error', console.error);

ws.on('open', function open() {
  ws.send('something');
});

ws.on('message', function message(data) {
  console.log('received: %s', data);
});
*/
</script>
<style scoped lang="scss">
// PlayerTitle Layout

.player__0 {
  top: 0px;
  left: 0px;
  bottom: auto;
  right: auto;
}
.player__1 {
  top: 0px;
  left: auto;
  bottom: auto;
  right: 0px;
}
.player__2 {
  top: auto;
  left: 0px;
  bottom: 0px;
  right: auto;
}
.player__3 {
  top: auto;
  left: auto;
  bottom: 0px;
  right: 0px;
}

/*
.player__title:nth-child(1) {
  top: 10px;
  left: 0px;
  bottom: auto;
  right: auto;
}
.player__title:nth-child(2) {
  top: 0px;
  left: auto;
  bottom: auto;
  right: 0px;
}
.player__title:nth-child(3) {
  top: auto;
  left: 0px;
  bottom: 0px;
  right: auto;
}
.player__title:nth-child(4) {
  top: auto;
  left: auto;
  bottom: 0px;
  right: 0px;
}
*/
</style>
