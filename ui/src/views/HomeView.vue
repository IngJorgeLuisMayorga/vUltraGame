<template>
  <div class="view view__home">
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/game/room/554">Game Board</router-link>
    </nav>

    <div class="forms forms__rooms">
      <div class="container">
        <TabView>
          <TabPanel header="Unirse a Sala">
            <form>
              <div class="flex flex-column gap-2">
                <label for="username">URL de la Sala</label>
                <InputText
                  id="username"
                  v-model="URL"
                  aria-describedby="username-help"
                />
                <small id="username-help"
                  >Ingresa el URL que te compartieron tus amigos para entrar a
                  jugar a la partida.</small
                >
              </div>
              <Button label="Unirme" />
            </form>
          </TabPanel>
          <TabPanel header="Crear Sala">
            <form>
              <label for="">Crear Sala</label>
              <input
                name=""
                type="text"
                value=""
                placeholder="Nombre de la Sala"
              />
              <button>Crear</button>
            </form>
          </TabPanel>
        </TabView>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  components: {},
})
export default class HomeView extends Vue {
  public URL = "";
}
</script>
<style scoped lang="scss">
.forms.forms__rooms {
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;

  padding-top: 20vh;

  .container {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
  }
}
</style>
