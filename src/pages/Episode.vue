<template>
  <q-page v-if="$store.state.api.episode">
    <Player ref="player" v-if="!$store.state.api.episode.is_premium_only" />
    <div v-else class="text-white absolute-center text-h5 text-center">
      Esse conteúdo é somente para premium
    </div>
    <div class="q-ma-sm">
      <q-btn
        class="text-caption text-warning ellipsis"
        dense
        no-caps
        :to="`/series/${episode.series_id}`"
      >
        {{ episode.series_title }}
      </q-btn>
      <div class="flex items-center justify-between">
        <div class="ellipsis">
          {{ title }}
        </div>
        <q-btn icon="more_vert" dense round>
          <q-menu auto-close content-class="bg-secondary" anchor="bottom left">
            <q-list>
              <q-item clickable :to="'/series/' + episode.series_id">
                <q-item-section>Ver série</q-item-section>
              </q-item>
              <q-item clickable @click="share()">
                <q-item-section>Compartilhar episódio</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
      <div class="q-mt-md">
        <div class="text-caption">Próximo Episódio</div>
        <episode-card :episode="episode" />
      </div>
    </div>
  </q-page>
</template>

<script>
import { Loading, copyToClipboard } from "quasar";
import Player from "components/Player.vue";
import EpisodeCard from "components/EpisodeCard.vue";
export default {
  components: { Player, EpisodeCard },
  async created() {
    Loading.show();
    await this.$store.commit("api/SET_EPISODE", null);
    await this.$store.dispatch("api/SET_EPISODE", this.$route.params.id);
    return Loading.hide();
  },
  computed: {
    episode() {
      return this.$store.state.api.episode;
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
  methods: {
    share() {
      copyToClipboard(window.location.origin + "/watch/" + this.episode.id);
    }
  }
};
</script>
