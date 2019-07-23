<template>
 <div>
   <v-container>
     <v-layout my-5>
       <v-flex xs12 text-xs-center>
         <h2>{{post.title}} </h2>
         <br>
         <hr>
         <br>
         <p>{{post.body}}</p>
       </v-flex>
     </v-layout>
     <v-flex xs12 text-xs-center round my-5>

       <v-btn v-if="username" color="success" dark :to="{ name: 'modifypost', params: {id: post.id} }">
         <v-icon size="17" class="mr-2">fa-pencil</v-icon>Modify
       </v-btn>
       <v-btn v-if="username" color="error" dark v-on:click="deletePost">
         <v-icon size="17" class="mr-2">delete</v-icon>Delete
       </v-btn>
     </v-flex>
     <v-flex xs12 text-xs-center>
       <v-btn color="info" dark :to="{name:'post'}">Back To PostList</v-btn>
     </v-flex>
   </v-container>
 </div>
</template>
<script>
import ImgBanner from '../components/ImgBanner'
import FirebaseService from '@/services/FirebaseService'
import PostList from '../components/PostList'
import Post from '@/components/Post'
import firebase from "firebase/app";
import firebaseApp from 'firebase/app'


export default {
	name: 'PostViewPage',
  data () {
      return {
          heightt : 0,
          title : '',
          body : '',
          img : '',
          index: 0,
          posts: [],
          post:'',
          id:'',
          username:''
      }

  },
  created() {
      this.id = this.$route.params.id;
      firebase.auth().onAuthStateChanged(user => {
          this.user = user;
          if (!this.user) {
            this.username = ""
      } else {
        this.username = 'NONE'
      }

    });
  },

	components: {
		ImgBanner,
    PostList
	},

  mounted() {
		this.getPost(this.id);

	},
	methods: {
    async deletePost(){
      await FirebaseService.deletePost(this.id);

    },
    async getPost(id) {
      this.post = await FirebaseService.getPost(id);
    },
  }
}
</script>
<style>
  .mw-700 {
    max-width: 700px;
    margin: auto;
  }
</style>
