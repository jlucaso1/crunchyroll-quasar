<template>
  <div v-if="feed_item">
    <h6 class="text-white q-my-md text-weight-regular">
      {{ feed_item.title }}
    </h6>
    <swiper class="swiper q-my-lg" :options="swiperOption">
      <swiper-slide v-for="(anime, i) in feed_item.animes" :key="i">
        <AnimeCard :anime="anime" />
      </swiper-slide>
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
        keyboard: {
          enabled: true
        },
        // autoHeight: true, //enable auto height
        spaceBetween: 8,
        pagination: {
          el: ".swiper-pagination",
          clickable: true
        }

        // navigation: {
        //   nextEl: ".swiper-button-next",
        //   prevEl: ".swiper-button-prev"
        // }
      }
    };
  },
  props: {
    feed_item: Object
  },
  components: {
    Swiper,
    SwiperSlide,
    AnimeCard
  }
};
</script>
