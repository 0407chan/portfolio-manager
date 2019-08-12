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
      lim: 0,
    }
  },

	components: {
		PortfolioList,
	},
  mounted(){
    this.initLim();
  },

  methods: {
    initLim(){
      if(innerWidth >= 1264){
        this.lim=3;
      }
      else{
        this.lim=2;
      }
    },
    handleScroll () {
      var limit = document.body.offsetHeight - window.innerHeight;
      if(window.scrollY >= limit - 200){
        if(innerWidth >= 1264){
          this.lim+=3;
        }
        else if(innerWidth < 1264 && innerWidth >= 600){
          this.lim+=2;
        }
        else{
          this.lim+=1;
        }
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
