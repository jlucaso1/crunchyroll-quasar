<template>
  <q-layout view="lHh Lpr lFf" class="bg-dark">
    <q-header elevated style="background-color: black">
      <q-toolbar class="items-center justify-between">
        <q-img src="/icons/crunchyroll-logo.png" width="11rem" />
        <q-btn icon="search" />
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer class="bg-secondary">
      <q-tabs
        indicator-color="transparent"
        active-color="warning"
        no-caps
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
    return {};
  }
};
</script>
