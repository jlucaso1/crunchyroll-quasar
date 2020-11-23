<template>
  <div>
    <video
      ref="videoPlayer"
      class="video-js vjs-big-play-centered vjs-show-big-play-button-on-pause"
    ></video>
  </div>
</template>

<script>
import { LocalStorage } from "quasar";

import videojs from "video.js";
import "../lib/player/videojs-contrib-quality-levels";
import "../lib/player/videojs-hls-quality-selector";
import "../lib/player/videojs-markers";
import "../lib/player/videojs-landscape-fullscreen";
import "../lib/player/videojs-plugins";

export default {
  name: "VideoPlayer",
  data() {
    return {
      player: null
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
        this.player.off("timeupdate");
        this.player.src({
          src: this.source,
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
            src: this.source,
            type: "application/x-mpegURL"
          }
        ],
        aspectRatio: "16:9",
        fill: true,
        plugins: {
          markers: {
            markers: this.$store.state.api.episode.ad_breaks.map(ad => {
              return { time: ad.offset_ms / 1000 };
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
            onclick: () => {
              this.nextEpisode();
            }
          },
          hlsQualitySelector: {
            displayCurrentQuality: true
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
          title: this.title
        });
        this.player.markers.reset(
          this.$store.state.api.episode.ad_breaks.map(ad => {
            return { time: ad.offset_ms / 1000 };
          })
        );

        // SAVE EPISODE ON LOCAL STORAGE
        if (
          LocalStorage.getItem("watch_later") &&
          LocalStorage.getItem("watch_later")[
            this.$store.state.api.episode.series_id
          ] &&
          LocalStorage.getItem("watch_later")[
            this.$store.state.api.episode.series_id
          ].episode.id == this.$store.state.api.episode.id
        ) {
          this.player.autoplay(false);
          this.player.pause();
          this.$q
            .dialog({
              message: "Deseja continuar o episódio?",
              persistent: true,
              ok: { label: "Sim" },
              cancel: { label: "Não" }
            })
            .onOk(() => {
              this.player.currentTime(
                LocalStorage.getItem("watch_later")[
                  this.$store.state.api.episode.series_id
                ].timestamp
              );
              this.player.play();
            })
            .onCancel(() => {
              this.player.play();
            });
        }
        this.player.on("timeupdate", () => {
          let updated = { ...LocalStorage.getItem("watch_later") };
          updated[this.$store.state.api.episode.series_id] = {
            timestamp: this.player.currentTime(),
            episode: this.$store.state.api.episode
          };
          LocalStorage.set("watch_later", updated);
        });
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
          if (this.player.isFullscreen()) {
            this.player.exitFullscreen();
          }
          this.$q.dialog({
            title: "Alerta",
            message: "O próximo episódio só está disponível para premium"
          });
        }
      }
    }
  },
  meta() {
    return {
      title: this.title
    };
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
