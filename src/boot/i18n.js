import Vue from "vue";
import VueI18n from "vue-i18n";
import { Quasar, LocalStorage } from "quasar";
import messages from "src/i18n";

Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: LocalStorage.getItem("locale") || Quasar.lang.getLocale(),
  fallbackLocale: "pt-br",
  messages
});
LocalStorage.set("locale", i18n.locale);

export default ({ app }) => {
  // Set i18n instance on app
  app.i18n = i18n;
};

export { i18n };
