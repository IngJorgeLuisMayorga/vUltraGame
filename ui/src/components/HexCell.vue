<template>
  <svg
    @mouseover="onHover"
    @mouseleave="offHover"
    @click="onClick"
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    width="31"
    height="36"
    xmlns:xlink="http://www.w3.org/1999/xlink"
  >
    <polygon
      :style="{ fill: pcolor, 'stroke-width': '2', stroke: 'white' }"
      :points="`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y} ${p4.x},${p4.y} ${p5.x},${p5.y} ${p6.x},${p6.y}`"
    />
    <text
      x="50%"
      y="50%"
      dominant-baseline="middle"
      text-anchor="middle"
      fill="white"
      font-size="7"
    >
      {{ x }} - {{ y }}
    </text>
  </svg>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

//const d = 121.32;
const d = 10;
const x0 = 0;
const y0 = 0;

@Options({
  props: {
    x: Number,
    y: Number,
    color: String,
    colorHover: String,
  },
})
export default class HexCell extends Vue {
  x!: number;
  y!: number;
  color!: string;
  colorHover!: string;

  public pcolor = "black";

  p1 = { x: 0 - x0, y: d - y0 };
  p2 = { x: 1.5179030662710187 * d - x0, y: 0.12812396966699638 * d - y0 };
  p3 = { x: 3.03587207385427 * d - x0, y: d - y0 };
  p4 = { x: 3.03587207385427 * d - x0, y: 2.743686119353775 * d - y0 };
  p5 = { x: 1.5179030662710187 * d - x0, y: 3.6155621496867787 * d - y0 };
  p6 = { x: 0 - x0, y: 2.743686119353775 * d - y0 };

  onHover() {
    this.pcolor = this.colorHover;
  }
  offHover() {
    this.pcolor = this.color;
  }
  onClick() {
    this.$emit("onClick", { x: this.x, y: this.y });
  }

  mounted() {
    this.pcolor = this.color;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
svg {
  cursor: pointer;
}
</style>
