<template>
  <div>
    <video ref="videoPlayer" class="video-js"></video>
  </div>
</template>

<script>
import videojs from "video.js";

import "../lib/player/videojs-mobile-ui.es";
import "../lib/player/videojs-contextmenu-ui.es";
import "../lib/player/videojs-markers";
import "../lib/player/videojs-overlay.es";
import "../lib/player/videojs-landscape-fullscreen.min";
export default {
  name: "VideoPlayer",
  props: {
    options: {
      type: String,
      default() {
        return "";
      }
    }
  },
  data() {
    return {
      player: null
    };
  },
  mounted() {
    this.createPlayer();
  },
  beforeDestroy() {
    this.destroyPlayer();
  },
  methods: {
    updatePlayer() {
      if (this.player) {
        this.player.markers.removeAll();
        this.player.markers.add(
          this.$store.state.api.episode.ad_breaks.map(ad => {
            return { time: ad.offset_ms / 1000, text: "Skip" };
          })
        );
        this.player.src({
          src: this.options,
          type: "application/x-mpegURL"
        });
      }
    },
    destroyPlayer() {
      if (this.player) {
        this.player.dispose();
      }
    },
    createPlayer() {
      this.player = videojs(this.$refs.videoPlayer, {
        controls: true,
        autoplay: true,
        preload: "auto",
        sources: [
          {
            src: this.options,
            type: "application/x-mpegURL"
          }
        ],
        fluid: true
      });
      this.player.addClass("vjs-crunchyroll");
      this.player.markers({
        markers: this.$store.state.api.episode.ad_breaks.map(ad => {
          return { time: ad.offset_ms / 1000, text: "Skip" };
        }),
        markerTip: {
          display: false
        },
        markerStyle: {
          width: "2px",
          "background-color": "white"
        }
      });
      this.player.contextmenuUI({
        content: [
          {
            label: "Próximo episódio",
            listener: () => {
              this.nextEpisode();
            }
          }
        ]
      });
      if (this.$store.state.api.episode.next_episode_id) {
        var skip_button = this.player.controlBar.addChild("button", {
          text: "Next episode"
        });
        skip_button.on("click", () => {
          this.nextEpisode();
        });
        skip_button.addClass("vjs-icon-next-item");
        skip_button.addClass("cursor-pointer");
      }
      this.player.on("dblclick", () => {
        if (this.player.isFullscreen()) {
          this.player.exitFullscreen();
        } else {
          this.player.requestFullscreen();
        }
      });
      this.player.landscapeFullscreen({
        fullscreen: {
          enterOnRotate: true,
          alwaysInLandscapeMode: true,
          iOS: true
        }
      });
    },
    async nextEpisode() {
      if (this.$store.state.api.episode.next_episode_id) {
        await this.$store.dispatch(
          "api/SET_EPISODE",
          this.$store.state.api.episode.next_episode_id
        );
        this.$router.replace({
          params: { id: this.$store.state.api.episode.next_episode_id }
        });
        this.updatePlayer();
      }
    }
  }
};
</script>

<style>
.vjs-crunchyroll .vjs-play-progress,
.vjs-crunchyroll .vjs-volume-level {
  background: rgba(252, 121, 30, 0.4);
}

.vjs-crunchyroll .vjs-slider-bar::before,
.vjs-crunchyroll .vjs-volume-level::before {
  color: #fc791e;
}
.text-shadow {
  text-shadow: 1px 1px black;
}
</style>
