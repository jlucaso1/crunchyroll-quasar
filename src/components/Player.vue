<template>
  <div>
    <div data-vjs-player>
      <video
        ref="videoPlayer"
        class="video-js vjs-crunchyroll vjs-big-play-centered vjs-show-big-play-button-on-pause"
        @ended="ended"
      ></video>
      <div
        v-if="next_episode && isEnded"
        class="absolute-center z-max"
        style="width: 90%"
      >
        <q-card class="bg-secondary" square>
          <q-icon
            name="o_lock"
            size="xl"
            class="absolute-center"
            v-if="next_episode.is_premium_only"
          />
          <q-card-section horizontal>
            <q-img
              :src="$parent.$parent.getEpisodeImage(next_episode)"
              class="col-5"
            >
              <div
                class="absolute-bottom-right q-ma-xs"
                style="padding: 0.1em 0.5em"
              >
                {{ Math.round(next_episode.duration_ms / 60000) + "m" }}
              </div>
            </q-img>
            <q-card-section class="q-pa-sm col">
              <div class="text-white ellipsis text-subtitle2">
                {{
                  "S" +
                    next_episode.season_number +
                    "-E" +
                    next_episode.episode_number +
                    " " +
                    next_episode.title
                }}
              </div>
              <div>
                <q-circular-progress
                  :max="100"
                  :min="0"
                  :value="timer_circular"
                  size="50px"
                  color="warning"
                  class="q-ma-md"
                />
                <p>Próximo episódio em: {{ timer_label }}</p>
              </div>
            </q-card-section>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
import { LocalStorage } from "quasar";
import videojs from "video.js";
import "video.js/dist/video-js.css";
//PLUGINS
import "./Player/videojs-markers.js";
import "./Player/videojs.markers.css";
import "./Player/videojs-landscape-fullscreen.js";
import "./Player/videojs-contrib-quality-levels";
import "./Player/videojs-hls-quality-selector.js";
import "./Player/videojs-hls-quality-selector.css";
import "./Player/videojs-header.js";
import "./Player/videojs-header.css";
import "./Player/videojs-subtitles.js";
import SubtitlesOctopus from "libass-wasm";

export default {
  name: "Player",
  props: {
    src: {
      type: String
    },
    poster: {
      type: String
    },
    markers: {
      type: Array
    },
    title: {
      type: String
    },
    subtitles: {
      type: Array
    }
  },
  data() {
    return {
      player: null,
      isEnded: false,
      octopus: null,
      timer_circular: 0,
      timer_label: 5
    };
  },
  computed: {
    next_episode() {
      return this.$store.state.api.next_episode;
    }
  },
  mounted() {
    this.player = videojs(this.$refs.videoPlayer, {
      sources: [{ src: this.src, type: "application/x-mpegURL" }],
      fluid: true,
      controls: true,
      preload: "auto",
      poster: this.poster,
      plugins: {
        markers: {
          markers: this.markers,
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
        hlsQualitySelector: {
          displayCurrentQuality: true
        },
        header: {
          onclick: () => {
            this.$parent.$parent.nextEpisode();
          },
          title: this.title
        },
        subtitles: {
          subtitles: this.subtitles,
          locale: LocalStorage.getItem("locale")
        }
      }
    });
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  },
  watch: {
    async src() {
      let player = this.player;
      player.src({
        type: "application/x-mpegURL",
        src: this.src
      });
      player.subtitles().updateSubtitles(this.subtitles);
      player.header().updateState({
        title: this.title
      });

      player.markers.reset(this.markers);
      player.ready(() => {
        player.load();
        player.play();
      });
    }
  },
  methods: {
    ended() {
      this.isEnded = true;
      let timer_label = setInterval(() => {
        this.timer_label -= 1;
        if (this.timer_label == 0) {
          clearInterval(timer_label);
          clearInterval(timer_circular);
          this.$parent.$parent.nextEpisode();
          this.isEnded = false;
          this.timer_circular = 0;
          this.timer_label = 5;
        }
      }, 1000);
      let timer_circular = setInterval(() => {
        this.timer_circular += 5;
      }, 200);
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
</style>
