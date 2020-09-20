<template>
  <div>
    <router-link :to="'/anime/' + anime.id" class="cursor-pointer">
      <q-card class="bg-secondary" square>
        <q-img
          :src="anime.images.poster_tall[0][3].source"
          :ratio="2 / 3"
        />
        <div class="q-ma-sm">
          <p class="text-white ellipsis">{{anime.title}}</p>
          <p class="text-positive text-caption">SÉRIE</p>
        </div>
      </q-card>
    </router-link>
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
