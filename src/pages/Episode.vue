<template>
  <q-page v-if="$store.state.api.episode">
    <player-vue />
  </q-page>
</template>

<script>
import { Loading, AppFullscreen } from "quasar";
import PlayerVue from "src/components/Player.vue";

export default {
  // name: 'PageName',
  components: { PlayerVue },
  async preFetch({ store, currentRoute }) {
    if (
      !(
        store.state.api.episode &&
        store.state.api.episode.id == currentRoute.params.id
      )
    ) {
      Loading.show();
      await store.commit("api/SET_EPISODE", null);
      await store.dispatch("api/SET_EPISODE", currentRoute.params.id);
      Loading.hide();
      return;
    }
  }
};
</script>
