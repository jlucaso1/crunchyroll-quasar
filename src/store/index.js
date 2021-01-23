import Vue from "vue";
import Vuex from "vuex";
import api from "./api";
import VuexPersistence from "vuex-persist";
import localforage from "localforage";

Vue.use(Vuex);
/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */
let store;
export default function(/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      api
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV,
    plugins: [
      new VuexPersistence({
        storage: localforage,
        asyncStorage: true
        // strictMode: process.env.DEV
      }).plugin
    ]
  });
  process.env.DEV && (window.localforage = localforage);
  store = Store;
  return Store;
}
export { store };
