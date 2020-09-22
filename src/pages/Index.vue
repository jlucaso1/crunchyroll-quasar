<template>
  <q-page>
    <AnimesCollection
      v-for="(feed, index) in home_feed"
      :key="index"
      :title="feed.title"
      :animes="feed.animes"
    />
  </q-page>
</template>

<script>
import AnimesCollection from "components/AnimesCollection";
export default {
  name: "PageIndex",
  components: {
    AnimesCollection
  },
  computed: {
    home_feed() {
      return this.$store.state.api.home_feed;
    }
  }
};
</script>
