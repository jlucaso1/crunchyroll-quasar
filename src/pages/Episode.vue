<template>
  <q-page v-if="$store.state.api.episode">
    <q-header ref="header">
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
        class="fixed-top-right"
        flat
        dense
        outline
        @click="$refs.player.nextEpisode()"
      ></q-btn>
      <div
        class="fixed-top text-center q-my-xs q-mx-xl ellipsis text-subtitle1"
      >
        {{ this.title }}
      </div>
    </q-header>
    <Player
      ref="player"
      v-if="!$store.state.api.episode.is_premium_only"
      :options="source"
    />
    <div v-else class="text-white absolute-center text-h5 text-center">
      Esse conteúdo é somente para premium
    </div>
    <q-dialog v-model="alert" @hide="$router.back()" persistent>
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
    </q-dialog>
  </q-page>
</template>

<script>
import { Loading, AppFullscreen } from "quasar";
import Player from "components/Player.vue";
export default {
  components: { Player },
  data() {
    return {
      player: {},
      alert: false,
      options: {}
    };
  },
  async created() {
    await this.$store.commit("api/SET_EPISODE", null);
    await this.$store.dispatch("api/SET_EPISODE", this.$route.params.id);
  },
  meta() {
    return {
      title: this.title
    };
  },
  computed: {
    source() {
      return (
        this.$store.state.api.episode.streams.streams.vo_adaptive_hls[
          this.locale
        ].url || ""
      );
    },
    locale() {
      let lang = this.$q.localStorage.getItem("locale");
      lang = lang.split("-");
      lang[1] = lang[1].toUpperCase();
      lang = lang.join("-");
      return lang;
    },
    title() {
      try {
        return (
          "S" +
          this.$store.state.api.episode.season_number +
          "-E" +
          this.$store.state.api.episode.episode_number +
          ": " +
          this.$store.state.api.episode.title
        );
      } catch (error) {
        return "Carregando...";
      }
    }
  }
};
</script>
