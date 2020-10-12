<template>
  <q-page>
    <player-vue :options="videoOptions" />
  </q-page>
</template>

<script>
import { Loading, AppFullscreen } from "quasar";
import PlayerVue from "src/components/Player.vue";

export default {
  // name: 'PageName',
  data() {
    return {
      videoOptions: {
        autoplay: true,
        preload: "auto",
        controls: true,
        fluid: true,
        sources: [
          {
            src: this.$store.state.api.episode.streams.streams.vo_adaptive_hls[
              "pt-BR"
            ].url,
            type: "application/x-mpegURL"
          }
        ]
      }
    };
  },
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
  },
  methods: {}
};
</script>
