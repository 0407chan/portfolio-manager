<template>
  <div>
<!--    스크롤시 이미지가 따라옴-->
    <v-parallax
      dark
      :src="imgSrc"
      height="850"
    >
    <!-- <v-img :src="imgSrc"  aspect-ratio="1.7"> -->
      <v-layout align-center justify-center row fill-height>
        <v-flex text-xs-center>
          <span class="text-shadow display-3 font-weight-light">
            <slot name="text"/>
          </span>
        </v-flex>
      </v-layout>
    <!-- </v-img> -->
  </v-parallax>
  </div>
</template>



<script>

export default {
	name: 'ImgBanner',
	props: {
		imgSrc: {type: String},
		text: {type: String}
	},
	methods: {
	},
}
</script>
<style>
  .text-shadow {
    text-shadow: 0 0 15px rgb(255,255,255);
  }
</style>
