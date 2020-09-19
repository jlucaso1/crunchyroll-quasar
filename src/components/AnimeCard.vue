<template>
  <div>
    <router-link to="/anime/id" class="cursor-pointer">
      <q-card class="bg-secondary" square>
        <q-img
          src="https://img1.ak.crunchyroll.com/i/spire4/7b0b1d0858c0aeaad7fbb264b91f634e1593645590_full.jpg"
          :ratio="2 / 3"
        />
        <div class="q-ma-sm">
          <p class="text-white">Tower of God</p>
          <p class="text-positive text-caption">SÉRIE</p>
        </div>
      </q-card>
    </router-link>
  </div>
</template>

<script>
export default {
  // name: 'ComponentName',
  data() {
    return {};
  }
};
</script>

<style lang="stylus" scoped>
a
  text-decoration: none;
</style>
