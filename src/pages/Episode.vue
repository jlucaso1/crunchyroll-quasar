<template>
  <q-page>
    <div id="dplayer">
      <q-btn icon="home" />
    </div>
  </q-page>
</template>

<script>
import DPlayer from "dplayer";
import dashjs from "dashjs";
import { Loading, AppFullscreen } from "quasar";

export default {
  // name: 'PageName',
  data() {
    return {
      player: null
    };
  },
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
      Loading.hide();
    }
  },
  mounted() {
    this.updatePlayer();
  },
  methods: {
    updatePlayer() {
      this.player = new DPlayer({
        container: document.getElementById("dplayer"),
        video: {
          autoplay: true,
          preload: "auto",
          url: `https://crunchyroll-quasar.herokuapp.com/${this.$store.state.api.episode.streams.streams.adaptive_dash["pt-BR"].url}`,
          pic: this.$store.state.api.episode.images.thumbnail[0][4].source,
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
        highlight: this.$store.state.api.episode.ad_breaks.map(ad => {
          return {
            text: "Skipper",
            time: ad.offset_ms / 1000
          };
        }),
        contextmenu: [
          {
            text: "Próximo episódio",
            click: async player => {
              let params = {
                ...this.$route.params,
                episode_id: this.$store.state.api.episode.next_episode_id
              };
              console.log(params);
              this.$router.push({ params });
              await this.$store.dispatch(
                "api/SET_EPISODE",
                this.$route.params.episode_id
              );
              this.updatePlayer();
            }
          }
        ]
      });
      this.player.fullScreen.request("web");
      this.player.on("canplay", () => {
        // this.player.play();
      });
    }
  }
};
</script>
