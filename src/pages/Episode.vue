<template>
  <q-page>
    <div id="dplayer"></div>
  </q-page>
</template>

<script>
import DPlayer from "dplayer";
import Hls from "hls.js";

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
      const url = this.data.streams[0].url;
      if (url && url.includes("pl.crunchyroll.com")) {
        return this.data.streams[0].url.replace(
          "https://pl.crunchyroll.com",
          "/pl-proxy"
        );
      } else {
        return this.data.streams[0].url;
      }
    }
  },
  watch: {
    episode() {
      if (this.episode) {
        this.player = new DPlayer({
          container: document.getElementById("dplayer"),
          preload: "auto",
          autoplay: true,
          video: {
            url: this.episode.streams.streams.adaptive_hls["pt-BR"].url,
            pic: this.episode.images.thumbnail[0][4].source,
            type: "customHls",
            customType: {
              customHls: function(video, player) {
                const hls = new Hls();
                hls.loadSource(video.src);
                hls.attachMedia(video);
              }
            }
          },
          highlight: this.episode.ad_breaks.map(ad => {
            console.log(ad);
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
