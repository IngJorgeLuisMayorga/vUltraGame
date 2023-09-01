<template>
  <div class="player player__title" :class="{ active: isActive }">
    <svg width="210" height="58">
      <polygon
        points="5,5 205,5 205,55 5,55"
        :style="{ stroke: color }"
      ></polygon>
      <text x="50%" y="50%" text-anchor="middle" :fill="color" font-size="15">
        {{ title }} ({{ index }})
      </text>
      <text
        x="50%"
        y="75%"
        text-anchor="middle"
        fill="white"
        font-size="12"
        class="text__timer"
      >
        {{ timer }} seg
      </text>
    </svg>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  props: {
    index: Number,
    title: String,
    color: String,
    timer: Number,
    isActive: Boolean,
  },
})
export default class PlayerTitle extends Vue {
  index!: number;
  title!: string;
  color!: string;
  timer!: number;
  isActive!: boolean;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.player__title {
  display: block;
  position: absolute;
}
.player__title {
}

svg polygon {
  stroke: rgb(255, 255, 255);
  stroke-width: 3;
  //stroke-dasharray: 50, 450;
  stroke-dasharray: 500, 0;
  stroke-dashoffset: 0;
  fill: none;
  animation: border 5s linear infinite;
}
.player__title.active svg {
  cursor: pointer;
}
.player__title.active svg polygon {
  stroke-dasharray: 50, 450;
}

.text__timer {
  visibility: hidden;
}
.active .text__timer {
  visibility: visible;
}
@keyframes border {
  to {
    stroke-dashoffset: -800;
  }
}
</style>
