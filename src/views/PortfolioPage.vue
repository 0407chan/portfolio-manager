<template>
  <div>
    <v-container>
      <!-- Portfolio -->
      <v-layout>
        <v-flex xs12>
          <PortfolioList :limit="lim"></PortfolioList>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import PortfolioList from '../components/PortfolioList'
export default {
	name: 'PortfolioPage',
  data(){
    return{
      lim: 3,
    }
  },

	components: {
		PortfolioList,
	},

  methods: {
    handleScroll () {
      var limit = document.body.offsetHeight - window.innerHeight;
      if(window.scrollY >= limit - 200){
        this.lim+=3;
      }
    },
    loadMorePortfolios(){
      this.lim+= 3;
    }
  },

  beforeMount () {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.handleScroll);
  },

}
</script>
