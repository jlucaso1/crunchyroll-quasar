<template>
  <q-page>
    <AnimesCollection title="MAIS POPULARES" />
    <AnimesCollection title="RECÉM ATUALIZADOS" />
    <AnimesCollection title="SIMULCASTS" />
  </q-page>
</template>

<script>
import AnimesCollection from "components/AnimesCollection";
export default {
  name: "PageIndex",
  components: {
    AnimesCollection
  },
  async created() {
    await this.$store.dispatch(
      "api/SET_HOME_FEED",
      "Bearer " + this.$store.state.api.token.access_token
    );
  }
};
</script>
