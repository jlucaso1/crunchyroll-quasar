<template>
  <q-page>
    <router-link
      :to="'/watch/' + item.episode.id"
      v-for="item in watch_later"
      :key="item.episode.id"
      class="cursor-pointer"
    >
      <q-card class="bg-secondary q-my-sm" square>
        <q-card-section horizontal>
          <q-img
            :src="item.episode.images.thumbnail[0][2].source"
            class="col-5"
            native-context-menu
          >
            <p class="full-width text-center q-pa-xs">
              {{ item.episode.series_title }}
            </p>
            <div
              class="absolute-bottom-right text-subtitle2 q-ma-xs"
              style="padding: 1px; font-size: 10px;"
            >
              {{ parseInt(item.episode.duration_ms / 60000) + "m" }}
            </div>
          </q-img>
          <q-linear-progress
            :value="(item.timestamp * 1000) / item.episode.duration_ms"
            class="q-mt-md absolute-bottom"
            size="sm"
            rounded
            color="warning"
          />
          <q-card-section class="q-pa-sm col">
            <div class="text-white ellipsis">
              {{
                "S" +
                  item.episode.season_number +
                  " E" +
                  item.episode.episode_number +
                  " " +
                  item.episode.title
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
  </q-page>
</template>

<script>
import { LocalStorage } from "quasar";
export default {
  computed: {
    watch_later() {
      return LocalStorage.getItem("watch_later") || {};
    }
  }
};
</script>
