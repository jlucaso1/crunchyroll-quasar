<template>
  <q-page v-if="$store.state.api.episode">
    <q-header>
      <q-btn
        icon="o_arrow_back"
        flat
        outline
        color="white"
        class="absolute-top-left"
        dense
        :to="'/series/' + $store.state.api.episode.series_id"
        replace
      />
      <q-btn
        v-if="$store.state.api.episode.next_episode_id"
        icon="skip_next"
        class="fixed-top-right z-top"
        flat
        dense
        outline
        replace
        :to="{ params: { id: $store.state.api.episode.next_episode_id } }"
      ></q-btn>
    </q-header>
    <player-vue v-if="!$store.state.api.episode.is_premium_only" ref="player" />
    <div v-else class="text-white absolute-center text-h5 text-center">
      Esse conteúdo é somente para premium
    </div>
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
      return Loading.hide();
    }
  }
};
</script>
