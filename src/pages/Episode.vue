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
        <q-card
          class="bg-secondary q-my-sm cursor-pointer"
          square
          @click="nextEpisode"
        >
          <q-icon
            name="o_lock"
            size="xl"
            class="absolute-center"
            v-if="next_episode.is_premium_only"
          />
          <q-card-section horizontal>
            <q-img :src="getEpisodeImage(next_episode)" class="col-5">
              <div
                class="absolute-bottom-right q-ma-xs"
                style="padding: 0.1em 0.5em; font-size: 0.7em;"
              >
                {{ Math.round(next_episode.duration_ms / 60000) + "m" }}
              </div>
            </q-img>
            <q-card-section class="q-pa-sm col">
              <div class="text-white ellipsis">
                {{
                  "S" +
                    next_episode.season_number +
                    "-E" +
                    next_episode.episode_number +
                    " " +
                    next_episode.title
                }}
              </div>
            </q-card-section>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { Loading, copyToClipboard } from "quasar";
export default {
  components: {
    Player: () => import("components/Player.vue"),
  },
  // async preFetch({ store, currentRoute }) {
  //   console.log("OI")
  //   await store.commit("api/SET_EPISODE", null);
  //   await store.dispatch("api/SET_EPISODE", currentRoute.params.id);
  // },
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
    next_episode() {
      return this.$store.state.api.next_episode;
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
    },
    nextEpisode() {
      this.$refs.player.nextEpisode();
    },
    getEpisodeImage(episode) {
      try {
        return episode.images.thumbnail[0][2].source;
      } catch (error) {
        return "https://www.hostinger.com.br/tutoriais/wp-content/uploads/sites/12/2018/03/o-que-e-http-http-error-e-quais-os-principais-codigos.jpg";
      }
    }
  }
};
</script>
