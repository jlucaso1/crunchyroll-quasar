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
    <!-- <q-dialog v-model="alert" @hide="$router.back()" persistent>
      <q-card class="bg-secondary">
        <q-card-section>
          <div class="text-h6">{{ $t("error") }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          {{ $t("without_subtitle") }}
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat :label="$t('back')" color="warning" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog> -->
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
  }
};
</script>
