<template>
  <div>
    <q-card class="bg-secondary" square>
      <router-link :to="'/series/' + anime.id" class="cursor-pointer">
        <q-img :src="anime.images.poster_tall[0][2].source" :ratio="2 / 3" />
        <div class="q-ma-sm">
          <p class="text-white ellipsis-2-lines" style="height: 40px;">
            {{ anime.title }}
          </p>
          <p class="text-positive text-caption q-my-sm">{{ $t("series") }}</p>
        </div>
      </router-link>
      <q-btn
        round
        flat
        dense
        icon="more_vert"
        class="absolute-bottom-right q-pa-none"
        ><q-menu auto-close content-class="bg-secondary" anchor="bottom left">
          <q-list>
            <q-item clickable :to="'/series/' + anime.id">
              <q-item-section>{{ $t("watch_now") }}</q-item-section>
            </q-item>
            <q-item clickable @click="share()">
              <q-item-section>{{ $t("share") }}</q-item-section>
            </q-item>
          </q-list>
        </q-menu></q-btn
      >
    </q-card>
  </div>
</template>

<script>
import { copyToClipboard } from "quasar";
export default {
  data() {
    return {};
  },
  props: {
    anime: Object
  },
  methods: {
    share() {
      copyToClipboard(window.location.origin + "/series/" + this.anime.id);
    }
  }
};
</script>

<style lang="stylus" scoped>
a
  text-decoration: none;
</style>
