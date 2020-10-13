<template>
  <q-page v-if="$store.state.api.episode">
    <q-btn
      v-if="$store.state.api.episode.next_episode_id"
      icon="skip_next"
      class="absolute-top-right z-top"
      flat
      dense
      outline
      replace
      :to="{ params: { episode_id: $store.state.api.episode.next_episode_id } }"
    ></q-btn>
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
        store.state.api.episode.id == currentRoute.params.episode_id
      )
    ) {
      Loading.show();
      await store.commit("api/SET_EPISODE", null);
      await store.dispatch("api/SET_EPISODE", currentRoute.params.episode_id);
      return Loading.hide();
    }
  }
};
</script>
