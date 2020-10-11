<template>
  <q-layout view="hHh Lpr fFf" class="bg-dark">
    <q-page-container>
      <div>
        <q-header>
          <q-btn
            icon="o_arrow_back"
            flat
            outline
            color="white"
            class="absolute-top-left"
            dense
            v-go-back.single
          />
        </q-header>
        <router-view />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  // name: 'LayoutName',
};
</script>
