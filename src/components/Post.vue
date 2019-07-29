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
    <v-flex xs12>
      <span class="comment_title">Comment</span>
      <v-divider></v-divider>
    </v-flex>

    <v-flex xs12 v-for="i in this.postComments.length" :key="i.id">
    <v-timeline v-if="i < limit_postComment" dense clipped style="margin-left: 5px; padding-top:5px">
      <v-timeline-item :color="colors[i%4]" small class="timeline_comment">
        <template v-slot:icon>
          <!-- 타임라인 댓글 사진 표시 <v-avatar>
            <img src="http://i.pravatar.cc/64">
          </v-avatar> -->
        </template>
        <template>
          <a>{{postComments[postComments.length-i].name}}</a>
        </template>
        <v-layout justify-space-between wrap>
          <v-flex xs9 style="background-color: #f8f8f8; border-radius: 10px">
            {{postComments[postComments.length-i].body}}
          </v-flex>
          <v-flex xs2 text-xs-center>
            {{postComments[postComments.length-i].created_at.getMonth()+1}}.
            {{postComments[postComments.length-i].created_at.getDate()}}
            {{addZeros(postComments[postComments.length-i].created_at.getHours())}}:
            {{addZeros(postComments[postComments.length-i].created_at.getMinutes())}}
          </v-flex>
          <v-flex xs1 text-xs-right>
            <v-icon v-if="useremail === postComments[postComments.length-i].writer" size="17" class="mr-2 comment_btn" hover color="four" @click='modifyComment(postComments[postComments.length-i].id)'>fa-pencil</v-icon>
            <v-icon v-if="useremail === postComments[postComments.length-i].writer" size="17" class="mr-2 comment_btn" hover color="three" @click=''>fa-remove</v-icon>
          </v-flex>
          <v-flex xs12>
            <v-text-field></v-text-field>
          </v-flex>
        </v-layout>
      </v-timeline-item>
          </v-timeline>
          <v-flex xs12 v-if="i === limit_postComment" text-xs-center>
            <v-btn fab dark icon flat @click="morePost(limit_postComment)" class="two" style="height:30px; width:30px">
              <v-icon size="20">keyboard_arrow_down</v-icon>
            </v-btn>
          </v-flex>
        </v-flex>

    <!-- post comment, need authority -->
    <v-flex xs10>
      <v-text-field v-if="username" v-model="comment" autofocus label="Comment"></v-text-field>
    </v-flex>
    <v-flex xs2 text-xs-right>
      <v-btn v-if="username" round color="four" dark @click="postComment" class="post_btn">
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
    comment : {type: String},
    limit_postComment: {
        type: Number,
        default: 4,
      },
	},
  data(){
    return{
      heightt : 0,
      img : '',
      index: 0,
      posts: [],
      post:'',
      username:'',
      useremail: '',
      user: '',
      canModifyCancel: false,
      postComments: [],
      colors: ['two', 'three', 'four','five'],
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
    if(this.id != null){
      this.getPostComments(this.id);
    }
  },
  created() {
    firebaseApp.auth().onAuthStateChanged(async user => {
    var username = '';
    var useremail = '';
    if (user) {
      var result = await FirebaseService.getUserData();
      username = result.name;
      this.username = username;
      useremail = result.email;
      this.useremail = useremail;
      if (username == null) {
        username = user.email.split('@')[0];
        this.username = username;
      }
    }
  })
  },
  methods: {
    modifyComment(id){
      console.log(id);
    },
    async postComment(){
      let result = await FirebaseService.getUserData();
      await FirebaseService.postPostComment(this.id, this.comment, result.name);
      this.comment = '';
      this.getPostComments(this.id)
    },
    async deletePost(){
      swal('삭제되었습니다.');
      await FirebaseService.deletePost(this.id);
      location.reload();
    },
    async getPost(id) {
      this.post = await FirebaseService.getPost(id);
    },
    async getPostComments(postId){
      this.postComments = await FirebaseService.getPostComments(postId);
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
    morePost(data){
      this.limit_postComment = data+2;
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
  .comment_btn{
    width: 20px;
    height: 20px;
    text-shadow: 2px 1px 1px black;
  }
  .comment_title{
    font-size: 12pt;
    font-weight: bold;
  }
  .timeline_comment{
  padding-bottom: 5px;
}

</style>
