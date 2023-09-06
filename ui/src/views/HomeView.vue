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
            <form @submit.prevent="onSubmitJoinRoom">
              <div
                class="p-b-10 flex flex-column align-content-start align-items-start gap-2"
              >
                <label for="joinRoomURL">URL de la Sala</label>
                <InputText
                  id="joinRoomURL"
                  name="joinRoomURL"
                  style="width: 100%"
                  v-model="RoomURL"
                  aria-describedby="room-help"
                />
                <small id="joinRoomURL-help"
                  >Ingresa el URL que te compartieron tus amigos para entrar a
                  jugar a la partida.</small
                >
              </div>
              <br />
              <Button label="Unirme" @click="onSubmitJoinRoom" />
            </form>
          </TabPanel>
          <TabPanel header="Crear Sala">
            <form>
              <div
                class="p-b-10 flex flex-column align-content-start align-items-start gap-2"
              >
                <label for="newRoomName">Nombre de la Sala</label>
                <InputText
                  id="newRoomName"
                  name="newRoomName"
                  style="width: 100%"
                  v-model="RoomName"
                  aria-describedby="room-help"
                />
                <small id="newRoomURL-help"
                  >Crear una nueva sala de juego</small
                >
              </div>
              <br />
              <Button label="Crear Sala" @click="onSubmitNewRoom" />
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
  public RoomURL = "";
  public RoomName = "";
  onSubmit() {
    console.log("Submit");
  }
  onSubmitJoinRoom() {
    var RoomURL = this.RoomURL;
    const connection = new WebSocket("ws://localhost:7071");
    connection.onmessage = function (event: MessageEvent): void {
      const message = JSON.parse(event.data);
      console.log("onmessage::");
      console.log(message);
    };
    connection.onopen = function (event: Event): void {
      const packet = JSON.stringify({ command: "RoomJoin", value: RoomURL });
      connection.send(packet);
    };
  }
  onSubmitNewRoom() {
    var RoomName = this.RoomName;
    console.log("onSubmitNewRoom");
    const connection = new WebSocket("ws://localhost:7071");
    connection.onmessage = function (event: MessageEvent): void {
      const message = JSON.parse(event.data);
      if (
        message &&
        message.command === "ERROR" &&
        message.payload === "RoomNameAlreadyExists"
      ) {
        console.log(" NOMBRE REPETIDO");
        connection.close();
      }
      console.log("onmessage::");
      console.log(message);
    };
    connection.onopen = function (event: Event): void {
      const packet = JSON.stringify({ command: "RoomCreate", value: RoomName });
      connection.send(packet);
    };
  }
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

.p-b-10 {
  padding-bottom: 30px;
}
</style>
