<template>
  <div>
    <h1>欢迎使用HIS系统</h1>
    <div class="carousel-box">
      <Carousel autoplay v-model="value2" loop>
        <CarouselItem>
          <div class="carousel">欢</div>
        </CarouselItem>
        <CarouselItem>
          <div class="carousel">迎</div>
        </CarouselItem>
        <CarouselItem>
          <div class="carousel">光</div>
        </CarouselItem>
        <CarouselItem>
          <div class="carousel">临</div>
        </CarouselItem>
      </Carousel>
    </div>
    <h1>不知道放些什么东西了啦</h1>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        value2: 0
      }
    },

    components: {},

    computed: {},

    methods: {}
  }

</script>
<style scoped>
  .carousel {
    margin: auto;
    text-align: center;
    width: 100%;
    height: 500px;
  }

</style>
