<template>
  <v-layout mt-5 wrap>
    <v-flex xs12 sm6 offset-sm3 text-xs-center mt-5>
      <h1 class="title">Hover over the cards</h1>

      <Card data-image="https://i.imgur.com/of2FpUz.png">
        <h1 slot="header">Canyons</h1>
        <p slot="content">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
      </Card>
      <Card data-image="https://i.imgur.com/YdNJx7s.gif">
        <h1 slot="header">Canyons</h1>
        <p slot="content">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
      </Card>
      <Card data-image="https://i.imgur.com/of2FpUz.png">
        <h1 slot="header">Canyons</h1>
        <p slot="content">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
      </Card>
      <Card data-image="https://i.imgur.com/of2FpUz.png">
        <h1 slot="header">Canyons</h1>
        <p slot="content">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
      </Card>
    </v-flex>
  </v-layout>
</template>

<script>
import Vue from 'vue'
import Card from '../components/Card'

export default {
	name: 'portfolioTestPage',
	components: {
		Card,
  },
}

</script>
