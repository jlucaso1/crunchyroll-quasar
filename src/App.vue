<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script>
import { Loading, LocalStorage } from "quasar";
export default {
  name: "App",
  async preFetch({ store }) {
    Loading.show();
    if (
      LocalStorage.getItem("auth") &&
      LocalStorage.getItem("auth").token.expires_in > Date.now()
    ) {
      await store.commit("api/SET_AUTH", LocalStorage.getItem("auth"));
    } else {
      await store.dispatch("api/SET_AUTH");
    }
    await store.dispatch("api/SET_HOME_FEED");
    Loading.hide();
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
