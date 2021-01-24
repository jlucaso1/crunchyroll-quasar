<template>
  <div>
    <video
      ref="videoPlayer"
      class="video-js vjs-crunchyroll vjs-big-play-centered vjs-show-big-play-button-on-pause"
    ></video>
  </div>
</template>

<script>
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
    }
  },
  data() {
    return {
      player: null
    };
  },
  mounted() {
    this.player = videojs(this.$refs.videoPlayer, {
      sources: [{ src: this.src, type: "application/dash+xml" }],
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
    src() {
      let player = this.player;
      player.src({
        type: "application/dash+xml",
        src: this.src
      });
      player.header().updateState({
        title: this.title
      });
      player.ready(() => {
        player.markers.reset(this.markers);
        player.load();
        player.play();
      });
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
