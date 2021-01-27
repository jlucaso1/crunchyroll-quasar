import videojs from "video.js";
import SubtitlesOctopus from "libass-wasm";
const Plugin = videojs.getPlugin("plugin");

// Default options for the plugin.
const defaults = {};

/**
 * An advanced Video.js plugin. For more information on the API
 *
 * See: https://blog.videojs.com/feature-spotlight-advanced-plugins/
 */
class Plugins extends Plugin {
  /**
   * Create a Plugins plugin instance.
   *
   * @param  {Player} player
   *         A Video.js Player instance.
   *
   * @param  {Object} [options]
   *         An optional options object.
   *
   *         While not a core part of the Video.js plugin architecture, a
   *         second argument of options is a convenient way to accept inputs
   *         from your plugin's caller.
   */
  octopus_instance;
  subtitles;
  constructor(player, options) {
    // the parent class will add player under this.player
    super(player, options);
    this.subtitles = options.subtitles;
    this.locale = options.locale;
    this.player.ready(() => {
      var options = {
        video: this.player.children()[0], // HTML5 video element
        subUrl: this.subtitles[0].src, // Link to subtitles
        workerUrl: "/subtitles-octopus-worker.js", // Link to WebAssembly-based file "libassjs-worker.js"
        legacyWorkerUrl: "/subtitles-octopus-worker-legacy.js" // Link to non-WebAssembly worker
      };
      this.octopus_instance = new SubtitlesOctopus(options);
    });
    this.player.on("loadeddata", () => {
      var tracks = this.player.remoteTextTracks();
      var numTracks = tracks.length;
      for (var i = numTracks - 1; i >= 0; i--) {
        this.player.removeRemoteTextTrack(tracks[i]);
      }
      this.subtitles.map(value => {
        this.player.addRemoteTextTrack({
          ...value
          // default: value.srclang == this.locale || false
        });
      });
      numTracks = tracks.length;
      for (var i = numTracks - 1; i >= 0; i--) {
        if (tracks[i].language == this.locale) {
          this.octopus_instance.setTrackByUrl(tracks[i].src);
          tracks[i].mode = "showing";
        }
      }
    });
    this.player.remoteTextTracks().on("change", () => {
      var tracks = this.player.remoteTextTracks();
      for (let i = 0; i < tracks.length; i++) {
        if (tracks[i].mode == "showing") {
          this.locale = tracks[i].language;
          this.octopus_instance.setTrackByUrl(tracks[i].src);
          return;
        }
      }
      this.octopus_instance.freeTrack();
    });
  }
  updateSubtitles(subtitles) {
    this.subtitles = subtitles;
  }
  dispose() {
    this.octopus_instance.dispose();
  }
}

// Register the plugin with video.js.
videojs.registerPlugin("subtitles", Plugins);

export default Plugins;
