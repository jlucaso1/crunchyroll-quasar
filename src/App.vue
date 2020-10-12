<template>
  <div id="q-app" v-if="$store.state.api.auth">
    <router-view />
  </div>
</template>
<script>
import { LocalStorage } from "quasar";
export default {
  name: "App",
  async preFetch({ store }) {
    if (
      LocalStorage.getItem("auth") &&
      LocalStorage.getItem("auth").token.expires_in > Date.now()
    ) {
      await store.commit("api/SET_AUTH", LocalStorage.getItem("auth"));
    } else {
      await store.dispatch("api/SET_AUTH");
    }
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
