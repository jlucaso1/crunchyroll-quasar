<template>
  <div>
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
        :to="{ params: { id: $store.state.api.episode.next_episode_id } }"
      ></q-btn>
      <div
        class="fixed-top text-center q-my-xs q-mx-xl ellipsis text-subtitle1"
      >
        {{
          "S" +
            $store.state.api.episode.season_number +
            "-E" +
            $store.state.api.episode.episode_number +
            ": " +
            $store.state.api.episode.title
        }}
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
  </div>
</template>

<script>
import Hls from "hls.js";
import DPlayer from "dplayer";

export default {
  name: "VideoPlayer",
  data() {
    return {
      player: {}
    };
  },
  async mounted() {
    this.player = await new DPlayer({
      container: this.$refs.videoPlayer,
      autoplay: true,
      theme: "#FC791E",
      video: {
        pic: this.$store.state.api.episode.images.thumbnail[0][4].source,
        url: this.$store.state.api.episode.streams.streams.vo_adaptive_hls[
          "pt-BR"
        ]
          ? this.$store.state.api.episode.streams.streams.vo_adaptive_hls[
              "pt-BR"
            ].url
          : this.$store.state.api.episode.streams.streams.vo_adaptive_hls[
              Object.keys(
                this.$store.state.api.episode.streams.streams.vo_adaptive_hls
              )[1]
            ].url,
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
                this.$router.replace({
                  params: { id: this.$store.state.api.episode.next_episode_id }
                });
              }
            }
          ]
        : [{ text: "Fim dos episódios", click: () => {} }]
    });
    if (this.$q.platform.is.mobile) {
      document.addEventListener("fullscreenchange", function() {
        if (document.fullscreen) {
          screen.orientation.lock("landscape");
        } else {
          screen.orientation.lock("portrait");
        }
      });
    }
  },
  methods: {
    full() {
      if (document.fullscreen) {
        this.player.fullScreen.cancel("browser");
      } else {
        this.player.fullScreen.request("browser");
      }
    }
  }
};
</script>
