import Vue from "vue";
import VueRouter from "vue-router";

import routes from "./routes";

Vue.use(VueRouter);

export default function({ store }) {
  const Router = new VueRouter({
    routes,
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) {
        // Keep scroll position when using browser buttons
        return savedPosition;
      } else {
        return { x: 0, y: 0 };
      }
    },

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  });
  Router.beforeEach(async (to, from, next) => {
    await store.restored;
    next();
  });
  return Router;
}
