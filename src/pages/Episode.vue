<template>
  <q-page v-if="$store.state.api.episode">
    <!-- <q-header ref="header">
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
    </q-header> -->
    <Player ref="player" v-if="!$store.state.api.episode.is_premium_only" />
    <div v-else class="text-white absolute-center text-h5 text-center">
      Esse conteúdo é somente para premium
    </div>
  </q-page>
</template>

<script>
import { Loading } from "quasar";
import Player from "components/Player.vue";
export default {
  components: { Player },
  data() {
    return {
      alert: false
    };
  },
  async created() {
    Loading.show();
    await this.$store.commit("api/SET_EPISODE", null);
    await this.$store.dispatch("api/SET_EPISODE", this.$route.params.id);
    Loading.hide();
    return
  }
};
</script>
