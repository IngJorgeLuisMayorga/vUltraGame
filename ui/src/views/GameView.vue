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
import { Options, Vue } from "vue-class-component";
import PlayerTitle from "@/components/PlayerTitle.vue";
import HexBoard from "@/components/HexBoard.vue";
@Options({
  components: {
    PlayerTitle,
    HexBoard,
  },
})
export default class HomeView extends Vue {
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

  mounted() {
    setInterval(() => {
      const currentIndex = this.playerActive;
      const currentPlayer = this.players[currentIndex];

      if (currentPlayer.timer > 2) {
        this.players[currentIndex].timer -= 1;
      } else {
        const nextIndex =
          currentIndex === this.players.length - 1 ? 0 : currentIndex + 1;
        const nextPlayer = this.players[nextIndex];

        this.players[currentIndex].isActive = false;
        this.players[currentIndex].timer = 60;

        this.players[nextIndex].isActive = true;
        this.players[nextIndex].timer = 60;

        this.playerActive = nextIndex;
      }
    }, 1000);
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
