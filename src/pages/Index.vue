<template>
  <q-page v-if="home_feed">
    <q-infinite-scroll @load="onLoad" :offset="250">
      <AnimesCollection
        v-for="index in visible_feeds"
        :key="index"
        :feed_item="home_feed[index - 1]"
      />
      <template
        v-slot:loading
        v-if="this.home_feed.length > this.visible_feeds"
      >
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </template>
    </q-infinite-scroll>
  </q-page>
</template>

<script>
import AnimesCollection from "components/AnimesCollection";
import { Loading } from "quasar";
export default {
  name: "PageIndex",
  components: {
    AnimesCollection
  },
  data() {
    return {
      visible_feeds: 3
    };
  },
  async preFetch({ store }) {
    if (!store.state.api.home_feed) {
      Loading.show();
      await store.dispatch("api/SET_HOME_FEED");
      Loading.hide();
    }
  },
  computed: {
    home_feed() {
      return this.$store.state.api.home_feed;
    }
  },
  methods: {
    onLoad(index, done) {
      if (this.home_feed.length > this.visible_feeds) {
        setTimeout(() => {
          this.visible_feeds += 3;
          done();
        }, 500);
      }
    }
  }
};
</script>
