<template>
  <q-page v-if="anime">
    <q-img :src="anime.images.poster_tall[0][4].source" :ratio="16/17">
      <div class="absolute-bottom text-body1">
        {{ anime.title }}
      </div></q-img
    >
    <div class="ellipsis-2-lines text-grey q-mx-sm">
      {{ anime.description }}
    </div>
    <q-dialog v-model="anime_infos" maximized>
      <q-card dark>
        <q-card-section class="row items-center q-pa-xs no-wrap">
          <q-btn icon="close" flat round dense v-close-popup class="q-pr-lg" />
          <q-space />
          <div class="text-h6 ellipsis">
            {{ anime.title
            }}<q-tooltip>
              {{ anime.title }}
            </q-tooltip>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="q-mb-lg">
            {{ anime.description }}
          </div>
          <div class="row q-my-sm">
            <div class="text-subtitle2">Total de Episódios</div>
            <q-space />
            <div>{{ anime.media_count }}</div>
          </div>
          <q-separator dark />
          <div class="row q-my-sm">
            <div class="text-subtitle2">Classificação Etária</div>
            <q-space />
            <div>{{ anime.maturity_ratings[0] }}</div>
          </div>
          <q-separator dark />
          <div class="row q-my-sm">
            <div class="text-subtitle2">Distribuidora</div>
            <q-space />
            <div>{{ anime.content_provider }}</div>
          </div>
          <q-separator dark />
        </q-card-section>
      </q-card>
    </q-dialog>
    <div class="justify-center full-width flex">
      <q-btn @click="anime_infos = true">
        <p class="text-warning ">DETALHES DA SÉRIE ></p>
      </q-btn>
    </div>
    <q-tabs
      v-model="tab"
      dense
      class="text-grey bg-info"
      active-color="white"
      indicator-color="warning"
    >
      <q-tab name="episodes" label="EPISÓDIOS" class="col" />
      <q-tab name="similars" label="SÉRIES SIMILARES" class="col" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="episodes" class="bg-dark">
        <div class="text-h6 text-cyan">S1 temporada 1</div>
      </q-tab-panel>

      <q-tab-panel name="similars" class="bg-dark similars">
        <AnimeCard
          v-for="index in 5"
          :anime="$store.state.api.home_feed[0].animes[index]"
          :key="index"
        />
      </q-tab-panel>
    </q-tab-panels>
    <q-footer class="bg-dark flex justify-center q-mx-sm">
      <q-btn class="bg-warning text-black q-ma-sm col-grow">
        <q-icon name="o_play_arrow" size="30px" />
        <p class="text-subtitle2 q-ma-none">COMEÇAR A ASSISTIR</p></q-btn
      >
      <q-btn icon="o_turned_in_not" color="warning" outline class="q-ma-sm" />
    </q-footer>
  </q-page>
</template>

<script>
import AnimeCard from "components/AnimeCard.vue";
export default {
  components: { AnimeCard },
  data() {
    return {
      tab: "episodes",
      anime_infos: false
    };
  },
  preFetch({ store, currentRoute }) {
    if (!(store.state.api.anime.id == currentRoute.params.id)) {
      store.dispatch("api/SET_ANIME", currentRoute.params.id);
    }
  },
  computed: {
    anime() {
      return this.$store.state.api.anime;
    }
  }
};
</script>

<style lang="stylus" scoped>
.similars
  grid-template-columns repeat(auto-fit, minmax(120px, 1fr))
  grid-gap 10px
  display grid
</style>
