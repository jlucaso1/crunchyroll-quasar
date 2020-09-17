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
  }
};
</script>
