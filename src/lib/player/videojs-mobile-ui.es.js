import videojs from 'video.js';
import window from 'global/window';

var version = "0.4.1";

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};











var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

/**
 * @file touchOverlay.js
 * Touch UI component
 */

var Component = videojs.getComponent('Component');
var dom = videojs.dom || videojs;

/**
 * The `TouchOverlay` is an overlay to capture tap events.
 *
 * @extends Component
 */

var TouchOverlay = function (_Component) {
  inherits(TouchOverlay, _Component);

  /**
  * Creates an instance of the this class.
  *
  * @param  {Player} player
  *         The `Player` that this class should be attached to.
  *
  * @param  {Object} [options]
  *         The key/value store of player options.
  */
  function TouchOverlay(player, options) {
    classCallCheck(this, TouchOverlay);

    var _this = possibleConstructorReturn(this, _Component.call(this, player, options));

    _this.seekSeconds = options.seekSeconds;
    _this.tapTimeout = options.tapTimeout;

    // Add play toggle overlay
    _this.addChild('playToggle', {});

    // Clear overlay when playback starts or with control fade
    player.on(['playing', 'userinactive'], function (e) {
      _this.removeClass('show-play-toggle');
    });

    // A 0 inactivity timeout won't work here
    if (_this.player_.options_.inactivityTimeout === 0) {
      _this.player_.options_.inactivityTimeout = 5000;
    }

    _this.enable();
    return _this;
  }

  /**
   * Builds the DOM element.
   *
   * @return {Element}
   *         The DOM element.
   */


  TouchOverlay.prototype.createEl = function createEl() {
    var el = dom.createEl('div', {
      className: 'vjs-touch-overlay',
      // Touch overlay is not tabbable.
      tabIndex: -1
    });

    return el;
  };

  /**
  * Debounces to either handle a delayed single tap, or a double tap
   *
   * @param {Event} event
   *        The touch event
   *
   */


  TouchOverlay.prototype.handleTap = function handleTap(event) {
    var _this2 = this;

    // Don't handle taps on the play button
    if (event.target !== this.el_) {
      return;
    }

    event.preventDefault();

    if (this.firstTapCaptured) {
      this.firstTapCaptured = false;
      if (this.timeout) {
        window.clearTimeout(this.timeout);
      }
      this.handleDoubleTap(event);
    } else {
      this.firstTapCaptured = true;
      this.timeout = window.setTimeout(function () {
        _this2.firstTapCaptured = false;
        _this2.handleSingleTap(event);
      }, this.tapTimeout);
    }
  };

  /**
   * Toggles display of play toggle
   *
   * @param {Event} event
   *        The touch event
   *
   */


  TouchOverlay.prototype.handleSingleTap = function handleSingleTap(event) {
    this.removeClass('skip');
    this.toggleClass('show-play-toggle');
  };

  /**
   * Seeks by configured number of seconds if left or right part of video double tapped
   *
   * @param {Event} event
   *        The touch event
   *
   */


  TouchOverlay.prototype.handleDoubleTap = function handleDoubleTap(event) {
    var _this3 = this;

    var rect = this.el_.getBoundingClientRect();
    var x = event.changedTouches[0].clientX - rect.left;

    // Check if double tap is in left or right area
    if (x < rect.width * 0.4) {
      this.player_.currentTime(Math.max(0, this.player_.currentTime() - this.seekSeconds));
      this.addClass('reverse');
    } else if (x > rect.width - rect.width * 0.4) {
      this.player_.currentTime(Math.min(this.player_.duration(), this.player_.currentTime() + this.seekSeconds));
      this.removeClass('reverse');
    } else {
      return;
    }

    // Remove play toggle if showing
    this.removeClass('show-play-toggle');

    // Remove and readd class to trigger animation
    this.removeClass('skip');
    window.requestAnimationFrame(function () {
      _this3.addClass('skip');
    });
  };

  /**
   * Enables touch handler
   */


  TouchOverlay.prototype.enable = function enable() {
    this.firstTapCaptured = false;
    this.on('touchend', this.handleTap);
  };

  /**
   * Disables touch handler
   */


  TouchOverlay.prototype.disable = function disable() {
    this.off('touchend', this.handleTap);
  };

  return TouchOverlay;
}(Component);

Component.registerComponent('TouchOverlay', TouchOverlay);

// Default options for the plugin.
var defaults = {
  fullscreen: {
    enterOnRotate: true,
    lockOnRotate: true,
    iOS: false
  },
  touchControls: {
    seekSeconds: 10,
    tapTimeout: 300,
    disableOnEnd: false
  }
};

var screen = window.screen;

var angle = function angle() {
  // iOS
  if (typeof window.orientation === 'number') {
    return window.orientation;
  }
  // Android
  if (screen && screen.orientation && screen.orientation.angle) {
    return window.orientation;
  }
  videojs.log('angle unknown');
  return 0;
};

// Cross-compatibility for Video.js 5 and 6.
var registerPlugin = videojs.registerPlugin || videojs.plugin;

/**
 * Add UI and event listeners
 *
 * @function onPlayerReady
 * @param    {Player} player
 *           A Video.js player object.
 *
 * @param    {Object} [options={}]
 *           A plain object containing options for the plugin.
 */
var onPlayerReady = function onPlayerReady(player, options) {
  player.addClass('vjs-mobile-ui');

  if (options.touchControls.disableOnEnd || typeof player.endscreen === 'function') {
    player.addClass('vjs-mobile-ui-disable-end');
  }

  if (options.fullscreen.iOS && videojs.browser.IS_IOS && videojs.browser.IOS_VERSION > 9 && !player.el_.ownerDocument.querySelector('.bc-iframe')) {
    player.tech_.el_.setAttribute('playsinline', 'playsinline');
    player.tech_.supportsFullScreen = function () {
      return false;
    };
  }

  // Insert before the control bar
  var controlBarIdx = player.children_.indexOf(player.getChild('ControlBar')) - 1;

  player.addChild('touchOverlay', options.touchControls, controlBarIdx);

  var locked = false;

  var rotationHandler = function rotationHandler() {
    var currentAngle = angle();

    if (currentAngle === 90 || currentAngle === 270 || currentAngle === -90) {
      if (player.paused() === false) {
        player.requestFullscreen();
        if (options.fullscreen.lockOnRotate && screen.orientation && screen.orientation.lock) {
          screen.orientation.lock('landscape').then(function () {
            locked = true;
          }).catch(function () {
            videojs.log('orientation lock not allowed');
          });
        }
      }
    }
    if (currentAngle === 0 || currentAngle === 180) {
      if (player.isFullscreen()) {
        player.exitFullscreen();
      }
    }
  };

  if (videojs.browser.IS_IOS) {
    window.addEventListener('orientationchange', rotationHandler);
  } else {
    // addEventListener('orientationchange') is not a user interaction on Android
    screen.orientation.onchange = rotationHandler;
  }

  player.on('ended', function (_) {
    if (locked === true) {
      screen.orientation.unlock();
      locked = false;
    }
  });
};

/**
 * A video.js plugin.
 *
 * Adds a monile UI for player control, and fullscreen orientation control
 *
 * @function mobileUi
 * @param    {Object} [options={}]
 *           Plugin options.
 * @param    {Object} [options.fullscreen={}]
 *           Fullscreen options.
 * @param    {boolean} [options.fullscreen.enterOnRotate=true]
 *           Whether to go fullscreen when rotating to landscape
 * @param    {boolean} [options.fullscreen.lockOnRotate=true]
 *           Whether to lock orientation when rotating to landscape
 *           Unlocked when exiting fullscreen or on 'ended'
 * @param    {boolean} [options.fullscreen.iOS=false]
 *           Whether to disable iOS's native fullscreen so controls can work
 * @param    {Object} [options.touchControls={}]
 *           Touch UI options.
 * @param    {int} [options.touchControls.seekSeconds=10]
 *           Number of seconds to seek on double-tap
 * @param    {int} [options.touchControls.tapTimeout=300]
 *           Interval in ms to be considered a doubletap
 * @param    {boolean} [options.touchControls.disableOnEnd=false]
 *           Whether to disable when the video ends (e.g., if there is an endscreen)
 *           Never shows if the endscreen plugin is present
 */
var mobileUi = function mobileUi(options) {
  var _this = this;

  if (videojs.browser.IS_ANDROID || videojs.browser.IS_IOS) {
    this.ready(function () {
      onPlayerReady(_this, videojs.mergeOptions(defaults, options));
    });
  }
};

// Register the plugin with video.js.
registerPlugin('mobileUi', mobileUi);

// Include the version number.
mobileUi.VERSION = version;

export default mobileUi;
