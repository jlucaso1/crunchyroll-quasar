<template>
  <q-page>
    <div id="dplayer"></div>
  </q-page>
</template>

<script>
import DPlayer from "dplayer";
import dashjs from "dashjs";
// import Hls from "hls.js";

export default {
  // name: 'PageName',
  data() {
    return {
      player: null
    };
  },
  created() {
    this.$store.dispatch("api/SET_EPISODE", this.$route.params.episode_id);
  },
  mounted() {},
  computed: {
    episode() {
      return this.$store.state.api.episode;
    },
    streamUrl() {
      let url = this.episode.streams.streams.adaptive_dash["pt-BR"].url;
      return `https://crunchyroll-quasar.herokuapp.com/${url}`;
    }
  },
  watch: {
    episode() {
      if (this.episode) {
        this.player = new DPlayer({
          container: document.getElementById("dplayer"),
          video: {
            autoplay: true,
            preload: "auto",
            url: this.streamUrl,
            pic: this.episode.images.thumbnail[0][4].source,
            type: "customDash",
            customType: {
              customDash: function(video, player) {
                dashjs
                  .MediaPlayer()
                  .create()
                  .initialize(video, video.src, false);
              }
            }
          },
          highlight: this.episode.ad_breaks.map(ad => {
            return {
              text: "Skipper",
              time: ad.offset_ms / 1000
            };
          })
        });
        this.player.fullScreen.request("web");
      }
    }
  }
};
</script>
