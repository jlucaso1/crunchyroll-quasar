<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script>
import { Loading, LocalStorage } from "quasar";
export default {
  name: "App",
  async created() {
    Loading.show();
    if (this.valid_session) {
      await this.$store.commit("api/SET_AUTH", LocalStorage.getItem("auth"));
    } else {
      await this.$store.dispatch("api/SET_AUTH");
    }
    await this.$store.dispatch("api/SET_HOME_FEED");
    Loading.hide()

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
    },
    valid_session() {
      try {
        if (LocalStorage.getItem("auth").token.expires_in > Date.now()) {
          return true;
        }
        return false;
      } catch (error) {
        return false;
      }
    }
  }
};
</script>
