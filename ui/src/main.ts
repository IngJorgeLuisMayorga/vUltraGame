import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import filters from "./helpers/filters";

const app = createApp(App);
app.config.globalProperties.$filters = filters;

app.use(store).use(router).mount("#app");
