<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script>
import { Loading } from "quasar";
export default {
  name: "App",
  async preFetch({ store }) {
    await store.dispatch("api/SET_TOKEN");
    await store.dispatch(
      "api/SET_PSK",
      "Bearer " + store.state.api.token.access_token
    );
  },
  async mounted() {
    this.$q.loading.show()
    await this.$store.dispatch(
      "api/SET_HOME_FEED",
      "Bearer " + this.$store.state.api.token.access_token
    );
    let auth = {
      token: this.$store.state.api.token,
      psk: this.$store.state.api.psk
    };
    this.$q.localStorage.set("auth", auth);
    this.$q.loading.hide()
  },
  watch: {
    error() {
      if (this.error.length > 0) {
        this.$q.notify({
          message: "Erro ao conectar-se com os servidores.",
          type: "negative",
          progress: true,
          actions: [
            {
              label: "Reiniciar",
              handler: () => {
                window.location.reload();
              },
              color: "white"
            }
          ]
        });
      }
    }
  },
  computed: {
    error() {
      return this.$store.state.api.error;
    }
  }
};
</script>
