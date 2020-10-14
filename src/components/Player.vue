<template>
  <div>
    <video ref="videoPlayer" class="video-js vjs-16-9"></video>
  </div>
</template>

<script>
import videojs from "video.js";
import "@videojs/http-streaming";
import "videojs-markers";
import "videojs-titleoverlay";
import "videojs-landscape-fullscreen";

export default {
  name: "VideoPlayer",
  data() {
    return {
      player: null
    };
  },
  mounted() {
    this.player = videojs(this.$refs.videoPlayer, {
      autoplay: true,
      preload: "auto",
      controls: true,
      fluid: true,
      sources: [
        {
          src: this.$store.state.api.episode.streams.streams.vo_adaptive_hls[
            "pt-BR"
          ].url,
          type: "application/x-mpegURL"
        }
      ]
    });
    this.player.markers({
      markers: this.ad_breaks_filtered
    });
    var options = {
      title:
        "S" +
        this.$store.state.api.episode.season_number +
        "-E" +
        this.$store.state.api.episode.episode_number +
        ": " +
        this.$store.state.api.episode.title,
      floatPosition: "left",
      margin: "10px",
      fontSize: "2em"
    };
    this.player.titleoverlay(options);
    this.player.landscapeFullscreen();
  },
  computed: {
    ad_breaks_filtered() {
      let ad_breaks = [...this.$store.state.api.episode.ad_breaks];
      let chooseds =
        this.$store.state.api.episode.ad_breaks.length == 4 ? [1, 3] : [];
      ad_breaks = ad_breaks
        .sort((a, b) => (a.offset_ms > b.offset_ms ? 1 : -1))
        .filter((key, index) => {
          if (chooseds.includes(index)) {
            return key;
          }
        })
        .map(ad => {
          return { time: ad.offset_ms / 1000 };
        });
      return ad_breaks;
    }
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  }
};
</script>
