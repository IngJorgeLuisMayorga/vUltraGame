<template>
  <div class="view view__home">
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/game/room/554">Game Board</router-link>
    </nav>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  components: {},
})
export default class HomeView extends Vue {}
</script>
