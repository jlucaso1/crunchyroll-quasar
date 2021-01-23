<template>
  <Player ref="player" @vmControlsChange="controlActive = $event">
    <Dash
      :src="episode.streams.streams.vo_adaptive_dash['pt-BR'].url"
      :poster="episode.images.thumbnail[0][4].source"
      :mediaTitle="episode.title_formatted"
    />

    <DefaultUi>
      <Controls pin="topLeft" :hidden="!controlActive" :fullWidth="true">
        <Control @click="$parent.$parent.nextEpisode">
          <Icon name="fast-forward" library="material" />
          <Tooltip>Next</Tooltip>
        </Control>
      </Controls>
    </DefaultUi>
  </Player>
</template>

<script>
import {
  Player,
  Dash,
  DefaultUi,
  Icon,
  Control,
  Controls,
  Tooltip
} from "@vime/vue";

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
    Controls,
    Tooltip
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
