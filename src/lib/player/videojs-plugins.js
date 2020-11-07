import videojs from "video.js";

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
  title;
  constructor(player, options) {
    // the parent class will add player under this.player
    super(player);

    this.options = videojs.mergeOptions(defaults, options);
    this.player.ready(() => {
      this.player.addClass("vjs-plugins");
      var divPrincipal = document.createElement("div");
      divPrincipal.className = "vjs-div-principal";
      this.title = document.createElement("div");
      this.title.className = "vjs-text";
      divPrincipal.appendChild(this.title);

      this.button = document.createElement("BUTTON");
      this.button.className = "vjs-icon-next-item";
      this.button.onclick = () => {
        options.onclick();
      };
      divPrincipal.appendChild(this.button);
      player.el().appendChild(divPrincipal);
    });
  }
  updateState(options) {
    this.title.innerHTML = options.title;
  }
}

// Register the plugin with video.js.
videojs.registerPlugin("plugins", Plugins);

export default Plugins;
