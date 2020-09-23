<template>
  <q-page>
    <q-header class="transparent">
      <q-btn icon="o_arrow_back" dense v-go-back.single />
    </q-header>
    <q-img
      src="https://img1.ak.crunchyroll.com/i/spire4/7b0b1d0858c0aeaad7fbb264b91f634e1593645590_full.jpg"
      :ratio="16 / 9"
    />
    <q-footer class="bg-dark flex justify-center">
      <q-btn class="bg-warning text-black q-ma-sm">
        <q-icon name="o_play_arrow" size="30px" />
        <p class="text-subtitle2 q-ma-none">COMEÇAR A ASSISTIR</p></q-btn
      >
      <q-btn
        icon="o_turned_in_not"
        color="warning"
        outline
        class="q-ma-sm col-4"
      />
    </q-footer>
  </q-page>
</template>

<script>
export default {
  created(){
    this.$store.dispatch("api/SET_ANIME")
  },
  computed: {

  }
};
</script>
