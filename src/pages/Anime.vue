<template>
  <q-page v-if="anime">
    <q-header ref="header">
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
      >
        <q-menu auto-close content-class="bg-secondary" anchor="bottom left">
          <q-list>
            <q-item clickable @click="share_serie">
              <q-item-section>Compartilhar Série</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </q-header>
    <q-img
      :ratio="10 / 9"
      :src="anime.images.poster_tall[0][8].source"
      class="poster"
    >
      <section class="absolute-bottom q-mx-sm" style="z-index: 1">
        <p class="text-h6 q-ma-none">
          {{ anime.title }}
        </p>
        <p class="text-primary text-subtitle2 q-ma-none">{{ $t("series") }}</p>
      </section>
    </q-img>
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
            <div class="text-subtitle2">{{ $t("total_episodes") }}</div>
            <q-space />
            <div>{{ anime.media_count }}</div>
          </div>
          <q-separator dark />
          <div class="row q-my-sm">
            <div class="text-subtitle2">{{ $t("age_rating") }}</div>
            <q-space />
            <div>{{ anime.maturity_ratings[0] }}</div>
          </div>
          <q-separator dark />
          <div class="row q-my-sm">
            <div class="text-subtitle2">{{ $t("distributor") }}</div>
            <q-space />
            <div>{{ anime.content_provider }}</div>
          </div>
          <q-separator dark />
        </q-card-section>
      </q-card>
    </q-dialog>
    <div class="justify-center full-width flex">
      <q-btn @click="anime_infos = true" dense>
        <p class="text-warning q-my-sm">{{ $t("series_details") }} ></p>
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
        <q-btn
          dense
          icon="o_sort"
          color="white"
          outline
          flat
          @click="reverse_season"
        />
        <EpisodeCard
          v-for="episode in season.value.episodes"
          :key="episode.id"
          :episode="episode"
        />
      </q-tab-panel>

      <q-tab-panel name="similars" class="bg-dark">
        <div class="similars">
          <AnimeCard v-for="anime in similar" :anime="anime" :key="anime.id" />
        </div>
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
import { Loading, copyToClipboard } from "quasar";
export default {
  components: {
    EpisodeCard: () => import("components/EpisodeCard.vue"),
    AnimeCard: () => import("components/AnimeCard.vue")
  },
  data() {
    return {
      tab: "episodes",
      anime_infos: false,
      season: {},
      seasons: []
    };
  },
  async preFetch({ store, currentRoute }) {
    Loading.show();
    if (currentRoute.params.id != store.state.api.anime?.id) {
      await Promise.all([
        store.dispatch("api/SET_ANIME", currentRoute.params.id),
        store.dispatch("api/SET_SIMILAR", currentRoute.params.id)
      ]);
    } else {
      Promise.all([
        store.dispatch("api/SET_ANIME", currentRoute.params.id),
        store.dispatch("api/SET_SIMILAR", currentRoute.params.id)
      ]);
    }
    return Loading.hide();
  },
  created() {
    this.update_seasons();
  },
  meta() {
    return {
      title: this.$store.state.api.anime.title
    };
  },
  computed: {
    anime() {
      return this.$store.state.api.anime;
    },
    similar() {
      return this.$store.state.api.similar;
    }
  },
  watch: {
    anime() {
      this.update_seasons();
    }
  },
  methods: {
    reverse_season() {
      this.season.value.episodes = this.season.value.episodes.reverse();
    },
    update_seasons() {
      this.seasons = this.$store.state.api.anime.seasons.map(season => {
        return { value: season, label: season.title };
      });
      this.season = this.seasons[0];
    },
    share_serie() {
      copyToClipboard(window.location.origin + "/series/" + this.anime.id);
    }
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
