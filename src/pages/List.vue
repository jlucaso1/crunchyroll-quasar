<template>
  <q-page>
    <div class="flex items-center">
      <div class="text-h5 q-my-md">Continue Assistindo</div>
      <q-space></q-space>
      <q-btn icon="refresh" dense @click="refresh" />
    </div>
    <div v-if="Object.keys(LS).length > 0">
      <q-card v-for="(item, i) in LS" :key="i">
        <router-link :to="'/watch/' + item.episode.id" class="cursor-pointer">
          <q-card class="bg-secondary q-my-sm" square>
            <q-card-section horizontal>
              <q-img
                :src="item.episode.images.thumbnail[0][2].source"
                class="col-5"
                basic
                no-default-spinner
              >
                <div
                  class="absolute-bottom-right text-subtitle2 q-ma-xs"
                  style="padding: 1px; font-size: .9em;"
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
                <div class="text-white ellipsis text-subtitle1">
                  {{ item.episode.series_title }}
                </div>
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
              </q-card-section>
            </q-card-section>
          </q-card>
        </router-link>
        <q-btn
          icon="delete"
          class="absolute-top-left"
          dense
          @click="deleteEpisode(item)"
        />
      </q-card>
    </div>
    <div class="absolute-center text-center text-h6 text-warning" v-else>
      Lista vazia
    </div>
  </q-page>
</template>

<script>
import { LocalStorage } from "quasar";
export default {
  data() {
    return {
      LS: LocalStorage.getItem("watch_later")
    };
  },
  computed: {},
  methods: {
    deleteEpisode(item) {
      this.$q
        .dialog({
          title: "Atenção",
          message: "Deseja excluir essa recordação?",
          cancel: { label: "Não" },
          ok: { label: "Sim" }
        })
        .onOk(() => {
          this.LS = LocalStorage.getItem("watch_later");
          delete this.LS[item.episode.series_id];
          LocalStorage.set("watch_later", this.LS);
        });
    },
    refresh() {
      this.LS = LocalStorage.getItem("watch_later");
    }
  }
};
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>
