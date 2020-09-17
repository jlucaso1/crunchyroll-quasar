<template>
  <q-layout class="bg-dark" view="hHh lpR fFf" v-if="!loading">
    <q-header class="bg-dark">
      <q-toolbar class="items-center justify-between q-px-sm">
        <q-btn dense>
          <q-img basic src="/icons/crunchyroll-logo.png" width="10rem" />
        </q-btn>
        <q-btn icon="search" />
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
          label="Início"
          exact
          :class="$q.platform.is.mobile ? 'q-px-xs' : ''"
        />
        <q-route-tab
          icon="o_turned_in_not"
          to="/list"
          label="Listas"
          exact
          :class="$q.platform.is.mobile ? 'q-px-xs' : ''"
        />
        <q-route-tab
          icon="o_scatter_plot"
          to="/catalog"
          label="Catálogo"
          exact
          :class="$q.platform.is.mobile ? 'q-px-xs' : ''"
        />
        <q-route-tab
          icon="o_star_rate"
          to="/simulcasts"
          label="Simulcasts"
          exact
          :class="$q.platform.is.mobile ? 'q-px-xs' : ''"
        />
        <q-route-tab
          icon="o_perm_identity"
          to="/settings"
          label="Ajustes"
          exact
          :class="$q.platform.is.mobile ? 'q-px-xs' : ''"
        />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script>
export default {
  name: "MainLayout",
  data() {
    return {
      loading: true
    };
  },
  created() {
  },
  mounted() {
    this.loading = false;
  }
};
</script>
