<style>
#title1 {
   overflow: hidden;
   text-overflow: ellipsis;
   display: -webkit-box;
   max-height: 32px;
   -webkit-line-clamp: 1;
   -webkit-box-orient: vertical;
   color: #181818;
   font-size: 18px;
   margin: auto;
   text-align: center;
}

#body1 {
   overflow: hidden;
   text-overflow: ellipsis;
   display: -webkit-box;
   max-height: 48px;
   -webkit-line-clamp: 4;
   -webkit-box-orient: vertical;
}

a {  text-decoration: none;}

</style>

<template>
  <v-card hover>
    <v-img :src="imgSrc" height="250px">
    </v-img>
    <v-card-title primary-title>
      <v-flex>
        <div id="title1">{{title}}</div>
      </v-flex>
    </v-card-title>
  </v-card>
</template>

<script>
export default {
	name: 'Portfolio',
	props: {
		date: {type: String},
		title: {type: String},
		body: {type: String},
		imgSrc: {type: String},
    id:{type: String}
	},
	data() {
		return {
			//
		}
	}
}
</script>
