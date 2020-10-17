<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script>
import { LocalStorage, Dark, Loading } from "quasar";
export default {
  name: "App",
  async preFetch({ store }) {
    Dark.set(true);
    if (
      LocalStorage.getItem("auth") &&
      LocalStorage.getItem("auth").token.expires_in > Date.now()
    ) {
      store.commit("api/SET_AUTH", LocalStorage.getItem("auth"));
    } else {
      Loading.show();
      await store.dispatch("api/SET_AUTH");
      Loading.hide();
    }
    return;
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
