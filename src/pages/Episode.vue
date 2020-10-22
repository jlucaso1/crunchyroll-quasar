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
        class="fixed-top-right"
        flat
        dense
        outline
        @click="nextEpisode()"
      ></q-btn>
      <div
        class="fixed-top text-center q-my-xs q-mx-xl ellipsis text-subtitle1"
      >
        {{ this.title }}
      </div>
    </q-header>
    <div
      ref="videoPlayer"
      @dblclick="full()"
      v-if="!$store.state.api.episode.is_premium_only"
    ></div>
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
import Hls from "hls.js";
import DPlayer from "dplayer";
export default {
  data() {
    return {
      player: {},
      alert: false
    };
  },
  async mounted() {
    Loading.show();
    await this.$store.commit("api/SET_EPISODE", null);
    await this.$store.dispatch("api/SET_EPISODE", this.$route.params.id);
    await this.createPlayer();
    if (this.$q.platform.is.mobile) {
      document.addEventListener("fullscreenchange", function() {
        if (document.fullscreen) {
          screen.orientation.lock("landscape");
        } else {
          screen.orientation.lock("portrait");
        }
      });
    }
    Loading.hide();
    return;
  },
  meta() {
    return {
      title: this.title
    };
  },
  computed: {
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
  },
  methods: {
    full() {
      if (document.fullscreen) {
        this.player.fullScreen.cancel("browser");
      } else {
        this.player.fullScreen.request("browser");
      }
    },
    async nextEpisode() {
      Loading.show();
      this.$router.replace({
        params: { id: this.$store.state.api.episode.next_episode_id }
      });
      await this.$store.dispatch(
        "api/SET_EPISODE",
        this.$store.state.api.episode.next_episode_id
      );
      await this.createPlayer();
      Loading.hide();
    },
    createPlayer() {
      this.player = new DPlayer({
        container: this.$refs.videoPlayer,
        autoplay: true,
        theme: "#FC791E",
        video: {
          pic: this.$store.state.api.episode.images.thumbnail[0][4].source,
          url: this.$store.state.api.episode.streams.streams.vo_adaptive_hls[
            this.locale
          ]
            ? this.$store.state.api.episode.streams.streams.vo_adaptive_hls[
                this.locale
              ].url
            : (this.alert = true),
          type: "customHls",
          customType: {
            customHls: function(video, player) {
              const hls = new Hls();
              hls.loadSource(video.src);
              hls.attachMedia(video);
            }
          }
        },
        highlight: this.$store.state.api.episode.ad_breaks.map(ad => {
          return { time: ad.offset_ms / 1000, text: "Skip" };
        }),
        contextmenu: this.$store.state.api.episode.next_episode_id
          ? [
              {
                text: "Próximo Episódio",
                click: () => {
                  this.nextEpisode();
                }
              }
            ]
          : [{ text: "Fim dos episódios", click: () => {} }]
      });
    }
  }
};
</script>
