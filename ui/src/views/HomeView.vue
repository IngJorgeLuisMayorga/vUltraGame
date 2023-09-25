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
              <div
                class="p-b-10 flex flex-column align-content-start align-items-start gap-2"
              >
                <label for="username">Nombre de Usuario</label>
                <InputText
                  id="username"
                  name="username"
                  style="width: 100%"
                  v-model="Username"
                  aria-describedby="room-help"
                />
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
              <div
                class="p-b-10 flex flex-column align-content-start align-items-start gap-2"
              >
                <label for="username">Nombre de Usuario</label>
                <InputText
                  id="username"
                  name="username"
                  style="width: 100%"
                  v-model="Username"
                  aria-describedby="room-help"
                />
              </div>
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
import { IRoom, IRoomResponse } from "../store/IRoomResponse";
import { useStore } from "vuex";
import { useToast } from "primevue/usetoast";

@Options({
  components: {},
})
export default class HomeView extends Vue {
  public UserName = "";
  public RoomURL = "";
  public RoomName = "";

  public toast = useToast();

  mounted(): void {
    const store = useStore();
  }

  onSubmit() {
    console.log("Submit");
  }
  onSubmitNewRoom() {
    this.$store
      .dispatch("newRoom", {
        username: this.UserName,
        roomname: this.RoomName,
      })
      .then((response: IRoom) => {
        // Redirecto to
        console.log(response.url);
        this.toast.add({
          severity: "success",
          summary: "Room Created Succesfully",
          detail: "Redirecting to " + response.url,
          life: 3000,
        });
      })
      .catch((error: string) => {
        // Show Error
        console.error(error);
        this.toast.add({
          severity: "error",
          summary: "Error Creating New Room",
          detail: error,
          life: 3000,
        });
        console.error(error);
      });
  }
  onSubmitJoinRoom() {
    const match = /(?<=room\/)\w*/.exec(this.RoomURL);
    const roomid = match ? match[0] : null;
    this.$store
      .dispatch("joinRoom", {
        username: this.UserName,
        roomurl: this.RoomURL,
        roomid: roomid,
      })
      .then((response: IRoom) => {
        // Redirecto to
        this.$router.push("/game/room/" + response.id);
        this.toast.add({
          severity: "success",
          summary: "Success Joining to Room",
          detail: "Redirecting to " + response.url,
          life: 3000,
        });
      })
      .catch((error: string) => {
        // Show Error
        console.error(error);
        this.toast.add({
          severity: "error",
          summary: "Error Joining Room",
          detail: error,
          life: 3000,
        });
      });
    console.log("onSubmitNewRoom");
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
