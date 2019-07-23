<style>
#title {
   overflow: hidden;
   text-overflow: ellipsis;
   display: -webkit-box;
   line-height: 16px;
   max-height: 32px;
   -webkit-line-clamp: 1;
   -webkit-box-orient: vertical;
}

#body {
   overflow: scroll;
   /* text-overflow: ellipsis;
   display: -webkit-box;
   line-height: 16px;
   max-height: 48px;
   -webkit-line-clamp: 3;
   -webkit-box-orient: vertical; */
}
</style>


<template>
  <v-layout pt-3 h-50 wrap id="body">
    <v-flex xs12>
      <v-divider></v-divider>
    </v-flex>
    <v-flex xs12 text-xs-right>
      <p>
        {{date.getFullYear()}}.
        {{date.getMonth()+1}}.
        {{date.getDate()}}.
        {{addZeros(date.getHours())}}:
        {{addZeros(date.getMinutes())}}
      </p>
    </v-flex>
    <v-flex xs12 row>
      <vue-markdown>{{body}}</vue-markdown>
    </v-flex>
    <!-- post comment, need authority -->
    <v-flex xs10>
      <v-text-field v-if="username" v-model="comment" autofocus label="Commnet"></v-text-field>
    </v-flex>
    <v-flex xs2 text-xs-right>
      <v-btn v-if="username" round color="four" dark @click="" class="post_btn">
        <v-icon size="17" class="mr-2">fa-pencil</v-icon>Write
      </v-btn>
    </v-flex>
    <v-flex xs12 text-xs-right round>
      <v-btn class="post_btn" v-if="username" round color="two" dark :to="{ name: 'modifypost', params: {id: this.id} }">
        <v-icon size="17" class="mr-2">fa-pencil</v-icon>Modify
      </v-btn>
      <v-btn class="post_btn" v-if="username" round color="three" dark v-on:click="deletePost">
        <v-icon size="17" class="mr-2">delete</v-icon>Delete
      </v-btn>
    </v-flex>
  </v-layout>
</template>

<script>
import FirebaseService from '@/services/FirebaseService'
import PostList from '../components/PostList'
import Post from '@/components/Post'
import firebase from "firebase/app";
import firebaseApp from 'firebase/app'
import store from '../store'

export default {
	name: 'Post',
	props: {
		date: {type: Date},
		title: {type: String},
		body: {type: String},
    id: {type: String},
    writer: {type: String},
    writer2: {type: String},
	},
  data(){
    return{
      heightt : 0,
      img : '',
      index: 0,
      posts: [],
      post:'',
      username:'',
      user: '',
      canModifyCancel: false,
    }
  },
  computed: {
		formatedDate() {
			return `${this.date.getFullYear()}년 ${this.date.getMonth()+1}월 ${this.date.getDate()}일`
    }
  },
  mounted(){
    if(this.id != null){
      this.getPost(this.id);
    }
  },
  created() {
      firebase.auth().onAuthStateChanged(user => {
          this.user = user;
          if (!this.user) {
            this.username = ""
      } else {
        this.username = 'NONE'
      }
    });
    if (store.state.user.email === this.writer2) {
      this.canModifyCancel = true
    }
  },
  methods: {
    async deletePost(){
      swal('삭제되었습니다.');
      await FirebaseService.deletePost(this.id);
      location.reload();
    },
    async getPost(id) {
      this.post = await FirebaseService.getPost(id);
    },
    addZeros(num){
      var zero = '';
  	  num = num.toString();
  	  if (num.length < 2) {
  	    for (var i = 0; i < 2 - num.length; i++) {
  	      zero += '0';
  	    }
  	  }
  	  return zero + num;
    },
  }
}
</script>
<style>
  .color-666 {
    color: #666;
  }
  .color-333 {
    color: #333;
  }
  .h-100 {
    height: 100%;
  }
  .post_btn{
    width: 110px;
  }
</style>
