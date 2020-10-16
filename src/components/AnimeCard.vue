<template>
  <div>
    <q-card class="bg-secondary" square>
      <router-link :to="'/series/' + anime.id" class="cursor-pointer">
        <q-img :src="anime.images.poster_tall[0][3].source" :ratio="2 / 3" />
        <div class="q-ma-sm">
          <p class="text-white ellipsis-2-lines" style="height: 40px;">
            {{ anime.title }}
          </p>
          <p class="text-positive text-caption q-my-sm">SÉRIE</p>
        </div>
      </router-link>
      <q-btn
        size="md"
        dense
        flat
        icon="more_vert"
        class="absolute-bottom-right q-pa-none"
      />
    </q-card>
  </div>
</template>

<script>
export default {
  // name: 'ComponentName',
  data() {
    return {};
  },
  props: {
    anime: Object
  }
};
</script>

<style lang="stylus" scoped>
a
  text-decoration: none;
</style>
