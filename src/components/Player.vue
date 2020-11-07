<template>
  <div>
    <video
      ref="videoPlayer"
      class="video-js vjs-big-play-centered vjs-show-big-play-button-on-pause"
    ></video>
  </div>
</template>

<script>
import videojs from "video.js";

import "../lib/player/videojs-markers";
import "../lib/player/videojs-landscape-fullscreen.min";
import "../lib/player/videojs-plugins";
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
        // this.player.reset();
        this.player.src({
          src: this.options,
          type: "application/dash+xml"
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
        autoplay: false,
        preload: "auto",
        sources: [
          {
            src: this.options,
            type: "application/dash+xml"
          }
        ],
        aspectRatio: "16:9",
        fill: true,
        plugins: {
          markers: {
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
          },
          landscapeFullscreen: {
            fullscreen: {
              enterOnRotate: true,
              alwaysInLandscapeMode: true,
              iOS: true
            }
          },
          plugins: {
            onclick: this.nextEpisode
          }
        }
      });
      this.player.addClass("vjs-crunchyroll");
      this.player.on("dblclick", () => {
        if (this.player.isFullscreen()) {
          this.player.exitFullscreen();
        } else {
          this.player.requestFullscreen();
        }
      });
      this.player.on("loadstart", () => {
        this.player.plugins().updateState({
          title:
            "S" +
            this.$store.state.api.episode.season_number +
            "-E" +
            this.$store.state.api.episode.episode_number +
            ": " +
            this.$store.state.api.episode.title,
          onclick: this.nextEpisode
        });
        this.player.markers.reset(
          this.$store.state.api.episode.ad_breaks.map(ad => {
            return { time: ad.offset_ms / 1000, text: "Skip" };
          })
        );
      });
    },
    async nextEpisode() {
      if (this.$store.state.api.episode.next_episode_id) {
        let error = await this.$store.dispatch(
          "api/SET_EPISODE",
          this.$store.state.api.episode.next_episode_id
        );
        if (error != false) {
          this.$router.replace({
            params: { id: this.$store.state.api.episode.next_episode_id }
          });
          this.updatePlayer();
          return true;
        } else {
          this.$q.dialog({
            title: "Alerta",
            message: "O próximo episódio só está disponível para premium"
          });
        }
      }
      return false;
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
/* .video-js .vjs-big-play-button {
  background-color: transparent;
  border-radius: 0.6em;
}
.video-js .vjs-big-play-button .vjs-icon-placeholder:before {
  color: #fc791e;
} */
</style>
