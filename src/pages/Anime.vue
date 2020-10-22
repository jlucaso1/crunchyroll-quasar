<template>
  <q-page v-if="$store.state.api.anime">
    <q-header>
      <q-btn
        icon="o_arrow_back"
        flat
        outline
        color="white"
        class="absolute-top-left"
        dense
        to="/"
      />
      <q-btn
        icon="o_reply"
        flat
        outline
        color="white"
        dense
        class="flip-horizontal fixed-top-right z-top"
      />
    </q-header>
    <q-img
      :ratio="10 / 9"
      :src="$store.state.api.anime.images.poster_tall[0][8].source"
      class="poster"
    >
      <section class="absolute-bottom q-mx-sm" style="z-index: 1">
        <p class="text-h6 q-ma-none">
          {{ $store.state.api.anime.title }}
        </p>
        <p class="text-primary text-subtitle2 q-ma-none">{{ $t("series") }}</p>
      </section>
    </q-img>
    <div class="ellipsis-2-lines text-grey q-mx-sm">
      {{ $store.state.api.anime.description }}
    </div>
    <q-dialog v-model="anime_infos" maximized>
      <q-card dark>
        <q-card-section class="row items-center q-pa-xs no-wrap">
          <q-btn icon="close" flat round dense v-close-popup class="q-pr-lg" />
          <q-space />
          <div class="text-h6 ellipsis">
            {{ $store.state.api.anime.title
            }}<q-tooltip>
              {{ $store.state.api.anime.title }}
            </q-tooltip>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="q-mb-lg">
            {{ $store.state.api.anime.description }}
          </div>
          <div class="row q-my-sm">
            <div class="text-subtitle2">{{ $t("total_episodes") }}</div>
            <q-space />
            <div>{{ $store.state.api.anime.media_count }}</div>
          </div>
          <q-separator dark />
          <div class="row q-my-sm">
            <div class="text-subtitle2">{{ $t("age_rating") }}</div>
            <q-space />
            <div>{{ $store.state.api.anime.maturity_ratings[0] }}</div>
          </div>
          <q-separator dark />
          <div class="row q-my-sm">
            <div class="text-subtitle2">{{ $t("distributor") }}</div>
            <q-space />
            <div>{{ $store.state.api.anime.content_provider }}</div>
          </div>
          <q-separator dark />
        </q-card-section>
      </q-card>
    </q-dialog>
    <div class="justify-center full-width flex">
      <q-btn @click="anime_infos = true">
        <p class="text-warning ">{{ $t("series_details") }} ></p>
      </q-btn>
    </div>
    <q-tabs
      v-model="tab"
      dense
      class="text-grey bg-info"
      active-color="white"
      indicator-color="warning"
    >
      <q-tab name="episodes" :label="$t('episodes')" class="col-6" />
      <q-tab name="similars" :label="$t('similar_series')" class="col-6" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="episodes" class="bg-dark">
        <q-select borderless dark v-model="season" :options="seasons" dense />
        <q-separator dark />
        <q-btn dense icon="o_sort" color="white" outline flat> </q-btn>
        <router-link
          :to="'/watch/' + episode.id"
          v-for="episode in season.value.episodes"
          :key="episode.id"
          class="cursor-pointer"
        >
          <q-card class="bg-secondary q-my-sm" square>
            <q-icon
              name="o_lock"
              size="xl"
              class="absolute-center"
              v-if="episode.is_premium_only"
            />
            <q-card-section horizontal>
              <q-img
                :src="episode.images.thumbnail[0][2].source"
                class="col-5"
                native-context-menu
              >
                <div
                  class="absolute-bottom-right text-subtitle2 q-ma-xs"
                  style="padding: 1px; font-size: 10px;"
                >
                  {{ parseInt(episode.duration_ms / 60000) + "m" }}
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
                  size="8px"
                  icon="get_app"
                  outline
                  color="white"
                  class="absolute-bottom-right q-ma-xs"
                ></q-btn>
              </q-card-section>
            </q-card-section>
          </q-card>
        </router-link>
      </q-tab-panel>

      <q-tab-panel name="similars" class="bg-dark similars">
        <div></div>
        <!-- <AnimeCard
          v-for="index in 5"
          :anime="$store.state.api.home_feed[0].animes[index]"
          :key="index"
        /> -->
      </q-tab-panel>
    </q-tab-panels>
    <q-footer class="bg-dark flex justify-center q-mx-sm">
      <q-btn
        class="bg-warning text-black q-ma-sm col-grow"
        :to="'/watch/' + season.value.episodes[0].id"
      >
        <q-icon name="o_play_arrow" size="30px" />
        <p class="text-subtitle2 q-ma-none">
          {{ $t("start_watching") }}
        </p></q-btn
      >
      <q-btn icon="o_turned_in_not" color="warning" outline class="q-ma-sm" />
    </q-footer>
  </q-page>
</template>

<script>
import AnimeCard from "components/AnimeCard.vue";
import { Loading } from "quasar";
export default {
  // components: { AnimeCard },
  data() {
    return {
      tab: "episodes",
      anime_infos: false,
      season: {},
      seasons: []
    };
  },
  async preFetch({ store, currentRoute }) {
    if (
      !(
        store.state.api.anime &&
        store.state.api.anime.id == currentRoute.params.id
      )
    ) {
      Loading.show();
      await store.dispatch("api/SET_ANIME", currentRoute.params.id);
      Loading.hide();
    }
  },
  created() {
    this.seasons = this.$store.state.api.anime.seasons.map(season => {
      return { value: season, label: season.title };
    });
    this.season = this.seasons[0];
  },
  meta() {
    return {
      title: this.$store.state.api.anime.title
    };
  }
};
</script>

<style lang="scss" scoped>
.similars {
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  grid-gap: 10px;
  display: grid;
}
a {
  text-decoration: none;
}
.poster::before {
  content: "";
  z-index: 1;
  position: absolute;
  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(
    0deg,
    rgba(0, 0, 0, 1) 0%,
    rgba(9, 9, 121, 0) 100%
  );
}
</style>
