<template>
  <div>
    <video ref="videoPlayer" class="video-js vjs-16-9"></video>
  </div>
</template>

<script>
import videojs from "video.js";
import "@videojs/http-streaming";
import "videojs-markers";

export default {
  name: "VideoPlayer",
  props: {
    options: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      player: null
    };
  },
  mounted() {
    this.player = videojs(this.$refs.videoPlayer, this.options);
    this.player.markers({
      markers: this.$store.state.api.episode.ad_breaks.map(ad => {
        return {
          text: "Skipper",
          time: ad.offset_ms / 1000
        };
      })
    });
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  }
};
</script>
