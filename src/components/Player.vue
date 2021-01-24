<template>
  <Player
    ref="player"
    @vmControlsChange="controlActive = $event"
    :autoplay="true"
  >
    <Dash
      :src="episode.streams.streams.vo_adaptive_dash['pt-BR'].url"
      :poster="episode.images.thumbnail[0][4].source"
      :mediaTitle="episode.title_formatted"
    />

    <DefaultUi> </DefaultUi>
    <Controls pin="topLeft">
      <Control
        @click="$parent.$parent.nextEpisode"
        :hidden="!controlActive"
        class="absolute-top-left q-ma-sm"
      >
        <Icon name="fast-forward" library="material" />
      </Control>
    </Controls>
  </Player>
</template>

<script>
import { Player, Dash, DefaultUi, Icon, Control, Controls } from "@vime/vue";

export default {
  data() {
    return {
      controlActive: true
    };
  },
  components: {
    Player,
    Dash,
    DefaultUi,
    Icon,
    Control,
    Controls
  },
  computed: {
    episode() {
      return this.$store.state.api.episode;
    },
    player() {
      return this.$refs.player;
    }
  }
};
</script>

<style scoped></style>
