<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script>
import { Loading } from "quasar";
export default {
  name: "App",
  async preFetch({ store }) {
    var expires_in = store.state.api.auth?.token?.expires_in;
    if (!(expires_in > Date.now())) {
      Loading.show();
      await store.dispatch("api/SET_AUTH");
      Loading.hide();
    }
    return;
  },
  watch: {
    sessionExpired() {
      if (this.sessionExpired) {
        this.$store.dispatch("api/SET_AUTH");
      }
    }
  },
  computed: {
    sessionExpired() {
      return !(this.expires_in > Date.now());
    },
    expires_in() {
      return this.$store.state?.api?.auth?.token?.expires_in
        ? this.$store.state?.api?.auth?.token?.expires_in
        : 0;
    }
  },
  meta: {
    // sets document title
    // title: "Home",
    // optional; sets final title as "Index Page - My Website", useful for multiple level meta
    titleTemplate: title => `${title} - Crunchyroll Quasar`,

    // meta tags
    meta: {
      description: {
        name: "description",
        content: "A interface copy of crunchyroll app made in VueJs."
      },
      keywords: { name: "keywords", content: "Quasar, VueJs, Crunchyroll" },
      author: {
        name: "author",
        content: "João Lucas (jlucaso)"
      }
    }
  }
};
</script>
