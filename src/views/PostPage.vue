<template>
  <div>
    <v-layout my-4 mx-3>
      <Calendar></Calendar>
    </v-layout>
      <!-- Post -->
      <v-container>
      <v-layout>
        <v-flex xs12>
          <PostList :limits="lim"></PostList>
        </v-flex>
      </v-layout>
    </v-container>
    <div v-if="user&&writeAuthority">
      <buttonWrite/>
    </div>
  </div>
</template>

<script>
import ImgBanner from '../components/ImgBanner'
import PostList from '../components/PostList'
import Calendar from '../components/Calendar'
import buttonWrite from '../components/ButtonWrite.vue'
import FirebaseService from "../services/FirebaseService";
import firebase from "firebase/app";


export default {
	name: 'PostPage',
	components: {
    ImgBanner,
    PostList,
    Calendar,
    buttonWrite,
	},

  data(){
    return{
      lim: 3,
      currentUser:'',
      writeAuthority: false,
      user:'',
    }
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      this.user = user;
    });
  },
  mounted() {
    this.getUser();
  },
  methods: {
    handleScroll () {
      var limit = document.body.offsetHeight - window.innerHeight;
      if(window.scrollY >= limit - 300){
        this.lim+=3;
      }
    },
    async getUser() {
      this.currentUser = await FirebaseService.getUserData();
      console.log(this.currentUser);
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
