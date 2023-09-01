<template>
  <div class="board">
    <div
      class="board__row"
      v-for="row in rows"
      :key="row.index"
      :class="{ row__size: row.index }"
      :style="{ top: 0 - 12 * row.index + 'px' }"
    >
      <HexCell
        :x="piece.x"
        :y="piece.y"
        :color="getColorXY(piece.x, piece.y)"
        :colorHover="player.color"
        :key="piece"
        @onClick="onClick"
        v-for="piece in row.items"
      ></HexCell>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted } from "vue";
import { Options, Vue } from "vue-class-component";
import PlayerTitle from "@/components/PlayerTitle.vue";
import HexCell from "@/components/HexCell.vue";

@Options({
  components: {
    PlayerTitle,
    HexCell,
  },
  props: {
    players: Array,
  },
})
export default class HexBoard extends Vue {
  public players!: Array<any>;

  public rows: any[] = [];

  public game: any = {};

  get player() {
    return this.players.find((player) => player.isActive);
  }

  getColorXY(x: number, y: number): string {
    if (this.game[x + ":" + y]) {
      return this.game[x + ":" + y].color;
    }
    return "#000000";
  }

  mounted() {
    this.rows = [];

    for (let k = 11; k < 21; k++) {
      this.rows.push({
        index: k - 11,
        items: Array.from(Array(k), (j, i) => i).map((item) => ({
          x: item,
          y: k - 11,
        })),
      });
    }

    for (let k = 0; k < 11; k++) {
      this.rows.push({
        index: k + 10,
        items: Array.from(Array(21 - k), (x, i) => i).map((item) => ({
          x: item,
          y: k + 10,
        })),
      });
    }
  }

  onClick(payload: any) {
    const player = JSON.parse(JSON.stringify({ ...this.player }));
    const tile = payload.x + ":" + payload.y;
    const move = {
      ...{
        player: {
          color: player.color,
          index: player.index,
          title: player.title,
        },
        x: payload.x,
        y: payload.y,
        color: this.player.color,
      },
    };

    const moveExist = this.game[tile] && this.game[tile].player;
    if (!moveExist) {
      this.game[tile] = move;
    }
    console.log(" this.game", move);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
svg {
  cursor: pointer;
}
</style>
