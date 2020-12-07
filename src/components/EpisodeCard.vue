<template>
  <router-link :to="'/watch/' + episode.id" class="cursor-pointer">
    <q-card class="bg-secondary q-my-sm" square>
      <q-icon
        name="o_lock"
        size="xl"
        class="absolute-center"
        v-if="episode.is_premium_only"
      />
      <q-card-section horizontal>
        <q-img :src="getEpisodeImage(episode)" class="col-5">
          <div
            class="absolute-bottom-right q-ma-xs"
            style="padding: 0.1em 0.5em; font-size: 0.7em;"
          >
            {{ Math.round(episode.duration_ms / 60000) + "m" }}
          </div>
        </q-img>
        <q-card-section class="q-pa-sm col">
          <div class="text-white ellipsis">
            {{
              "S" +
                episode.season_number +
                " E" +
                episode.episode_number +
                " " +
                episode.title
            }}
          </div>
          <q-btn
            round
            dense
            flat
            icon="o_play_circle_outline"
            outline
            color="white"
            class="absolute-bottom-right q-ma-xs"
          ></q-btn>
        </q-card-section>
      </q-card-section>
    </q-card>
  </router-link>
</template>

<script>
export default {
  name: "EpisodeCard",
  props: {
    episode: Object
  },
  methods: {
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

<style lang="scss" scoped>
a {
  text-decoration: none;
}
</style>
