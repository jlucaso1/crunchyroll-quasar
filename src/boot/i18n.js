import Vue from "vue";
import VueI18n from "vue-i18n";
import { Quasar, LocalStorage } from "quasar";
import messages from "src/i18n";

function convertLocale(locale) {
  let lang = locale;
  lang = lang.split("-");
  lang[1] = lang[1].toUpperCase();
  lang = lang.join("-");
  return lang;
}

Vue.use(VueI18n);
const i18n = new VueI18n({
  locale:
    LocalStorage.getItem("locale") || convertLocale(Quasar.lang.getLocale()),
  fallbackLocale: "pt-BR",
  messages
});
LocalStorage.set("locale", i18n.locale);

export default ({ app }) => {
  // Set i18n instance on app
  app.i18n = i18n;
};

export { i18n };
