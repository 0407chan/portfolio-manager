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
    <div v-if="writeAuthority&&user">
    <buttonWrite/>
    </div>
  </div>
</template>

<script>
import PortfolioList from '../components/PortfolioList'
import buttonWrite from '../components/ButtonWrite.vue'
import FirebaseService from "../services/FirebaseService";
import firebase from "firebase/app";


export default {
	name: 'PortfolioPage',
  data(){
    return{
      lim: 3,
      currentUser:'',
      writeAuthority: false,
      user:'',
    }
  },

	components: {
		PortfolioList,
        buttonWrite,
	},
  mounted() {
	this.getUser();
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      this.user = user;
    });
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
    },
    async getUser() {
      this.currentUser = await FirebaseService.getUserData();
      console.log(this.writeAuthority);

      console.log(this.currentUser);
      console.log(this.currentUser.classify);
      console.log(this.writeAuthority);
      if (this.currentUser.classify !== '방문자') {
        this.writeAuthority = true
      } else {
        this.writeAuthority = false
      }
    },
  },

  beforeMount () {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.handleScroll);
  },

}
</script>
