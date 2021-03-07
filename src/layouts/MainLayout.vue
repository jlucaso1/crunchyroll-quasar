<template>
  <q-layout class="bg-dark" view="hHh lpR fFf">
    <q-header class="bg-dark">
      <q-toolbar class="items-center justify-between q-px-sm">
        <q-btn dense>
          <q-img
            basic
            no-default-spinner
            src="https://i.imgur.com/1nwvfU0.png"
            width="10rem"
          />
        </q-btn>
        <q-btn icon="search" @click="show_search = true" />
        <q-dialog
          maximized
          persistent
          v-model="show_search"
          transition-hide="slide-down"
          transition-show="slide-up"
          @blur="$store.commit('api/SET_SEARCH', null)"
        >
          <div class="bg-dark">
            <q-toolbar style="background-color: #24252A;" class="q-pa-none"
              ><q-btn
                icon="arrow_back"
                @click="show_search = false"
                class="q-mx-sm"
                dense
                flat
              />
              <q-input
                autofocus
                color="red"
                borderless
                dense
                clearable
                class="col q-mx-sm"
                v-model="search_text"
                debounce="500"
                type="search"
                square
                :label="$t('search')"
                label-color="white"
                input-style="font-size: large"
              ></q-input>
            </q-toolbar>
            <div class="similars q-ma-sm" v-if="search_result">
              <AnimeCard
                v-for="(anime, i) in search_result"
                :key="i"
                :anime="anime"
              />
            </div>
          </div>
        </q-dialog>
      </q-toolbar>
    </q-header>
    <q-page-container class="q-px-md">
      <router-view />
    </q-page-container>
    <q-footer class="bg-secondary">
      <q-tabs
        indicator-color="transparent"
        active-color="warning"
        no-caps
        dense
        :align="$q.platform.is.mobile ? 'justify' : 'center'"
      >
        <q-route-tab
          icon="o_home"
          to="/"
          :label="$t('home')"
          exact
          replace
          :class="$q.platform.is.mobile ? 'q-px-xs' : ''"
        />
        <q-route-tab
          icon="o_turned_in_not"
          to="/list"
          :label="$t('list')"
          exact
          replace
          :class="$q.platform.is.mobile ? 'q-px-xs' : ''"
        />
        <q-route-tab
          icon="o_scatter_plot"
          to="/catalog"
          :label="$t('catalog')"
          exact
          replace
          :class="$q.platform.is.mobile ? 'q-px-xs' : ''"
        />
        <q-route-tab
          icon="o_star_rate"
          to="/simulcasts"
          label="Simulcasts"
          exact
          replace
          :class="$q.platform.is.mobile ? 'q-px-xs' : ''"
        />
        <q-route-tab
          icon="o_perm_identity"
          to="/settings"
          :label="$t('settings')"
          exact
          replace
          :class="$q.platform.is.mobile ? 'q-px-xs' : ''"
        />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script>
import AnimeCard from "components/AnimeCard";
export default {
  name: "MainLayout",
  components: { AnimeCard },
  data() {
    return {
      show_search: false,
      search_text: "",
      search_result: null
    };
  },
  watch: {
    async search_text() {
      if (this.search_text.length > 1) {
        await this.$store.dispatch("api/SET_SEARCH", this.search_text);
        this.search_result = this.$store.state.api.search_result;
      } else {
        this.search_result = null;
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.similars
  grid-template-columns repeat(auto-fit, minmax(120px, 1fr))
  grid-gap 10px
  display grid
a
  text-decoration: none;
</style>
