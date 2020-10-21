<template>
  <q-page padding>
    <q-select
      v-model="lang"
      :options="langOptions"
      :label="$t('language')"
      dense
      borderless
      emit-value
      map-options
      options-dense
    />
  </q-page>
</template>

<script>
export default {
  // name: 'PageName',
  data() {
    return {
      lang: this.$i18n.locale,
      langOptions: [
        { value: "pt-br", label: "Português" },
        { value: "en-us", label: "English" }
      ]
    };
  },
  watch: {
    lang(lang) {
      this.$i18n.locale = lang;
      this.$q.localStorage.set("locale", this.$i18n.locale);
      this.$store.dispatch("api/SET_HOME_FEED");
    }
  }
};
</script>
