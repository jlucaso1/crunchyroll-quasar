<template>
  <div>
    <h6 class="text-white q-my-md text-weight-regular">{{ title }}</h6>
    <swiper class="swiper q-my-lg" :options="swiperOption">
      <swiper-slide v-for="i in 15" :key="i"><AnimeCard/></swiper-slide>
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
    title: String
  },
  components: {
    Swiper,
    SwiperSlide,
    AnimeCard
  }
};
</script>
