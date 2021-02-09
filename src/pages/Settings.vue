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
        { value: "pt-BR", label: "Português" },
        { value: "en-US", label: "English" }
      ]
    };
  },
  watch: {
    async lang(lang) {
      this.$i18n.locale = lang;
      await this.$q.localStorage.set("locale", lang);
      await this.$store.dispatch("api/CLEAR_ALL");
    }
  },
  meta() {
    return {
      title: this.$t("settings")
    };
  }
};
</script>
