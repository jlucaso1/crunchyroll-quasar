<template>
  <div>
    <h6 class="text-white q-my-md text-weight-regular">{{ title }}</h6>
    <swiper class="swiper q-my-lg" :options="swiperOption">
      <swiper-slide v-for="anime in animes" :key="anime.id"><AnimeCard :anime="anime"/></swiper-slide>
    </swiper>
  </div>
</template>

<script>
import AnimeCard from "components/AnimeCard.vue";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
export default {
  // name: 'ComponentName',
  data() {
    return {
      swiperOption: {
        slidesPerView: this.$q.screen.lt.sm
          ? 2.4
          : this.$q.screen.lt.md
          ? 4
          : 6,
        autoHeight: true, //enable auto height
        spaceBetween: 8,
        lazy: true,
        pagination: {
          el: ".swiper-pagination",
          clickable: true
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        }
      }
    };
  },
  props: {
    title: String,
    animes: Array
  },
  components: {
    Swiper,
    SwiperSlide,
    AnimeCard
  }
};
</script>
