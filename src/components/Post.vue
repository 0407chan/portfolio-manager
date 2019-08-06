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
  <v-flex xs12 text-xs-right round class="comment_title_margin_top">
    <v-btn class="post_btn" v-if="useremail === this.email" round color="two" dark :to="{ name: 'modifypost', params: {id: this.id} }">
      <v-icon size="17" class="mr-2">fa-pencil</v-icon>Modify
    </v-btn>
    <v-btn class="post_btn" v-if="useremail === this.email" round color="three" dark v-on:click="deletePost">
      <v-icon size="17" class="mr-2">delete</v-icon>Delete
    </v-btn>
  </v-flex>
  <v-flex xs12 class="comment_title_margin_top">
    <span class="comment_title">Comment</span>
    <v-divider></v-divider>
  </v-flex>

  <v-flex xs12 v-for="(comment, index) in postComments" :key="comment.id">
    <v-timeline v-if="index < limit_postComment" dense clipped style="margin-left: 5px; padding-top:5px">
      <v-timeline-item :color="colors[index%4]" small style="padding-bottom:5px">
        <template v-slot:icon>
          <v-avatar>
            <img :src="comment.userImageUrl" @click="imageview(comment.userImageUrl)" style="cursor: pointer">
          </v-avatar>
        </template>
        <template>
          <router-link :to="{ name: 'userinfo', params: {id: comment.userId}}">{{comment.name}}</router-link>
        </template>
        <v-layout justify-space-between wrap align-center>
          <v-flex xs8 sm9 v-if="!comment.isModify" style="background-color: #f8f8f8; border-radius: 10px">
            {{comment.body}}
          </v-flex>
          <v-flex xs7 sm8 v-if="comment.isModify">
            <v-text-field v-model="newComment" :value='comment.body' @keyup.enter="modifyComment(comment)"></v-text-field>
          </v-flex>
          <v-flex xs1 sm1 text-xs-right v-if="comment.isModify">
            <v-btn fab dark v-if="useremail === comment.email"  @click="modifyComment(comment)" class="mr-2 modifyComment_btn" hover color="four">
              <v-icon size="15">
                  fa-pencil
              </v-icon>
            </v-btn>
          </v-flex>
          <v-flex xs2 sm2 text-xs-center fill-height>
            {{comment.created_at.getMonth()+1}}.
            {{comment.created_at.getDate()}}
            {{addZeros(comment.created_at.getHours())}}:
            {{addZeros(comment.created_at.getMinutes())}}
          </v-flex>
          <v-flex xs2 sm1 text-xs-right>
            <v-icon v-if="useremail === comment.email"  @click="modifyCommentForm(comment)" size="17" class="mr-2 comment_btn" hover color="three">create</v-icon>
            <v-icon v-if="useremail === comment.email" @click="deleteComment(comment.id)" size="17" class="mr-2 comment_btn" hover color="two">delete</v-icon>
          </v-flex>
        </v-layout>
      </v-timeline-item>
    </v-timeline>
    <v-flex xs12 v-if="index === limit_postComment" text-xs-center>
      <v-btn fab dark icon flat @click="morePost(limit_postComment)" class="two" style="height:30px; width:30px">
        <v-icon size="20">keyboard_arrow_down</v-icon>
      </v-btn>
    </v-flex>
  </v-flex>
  <!-- post comment, need authority -->
  <v-flex xs9>
    <v-text-field v-if="username" v-model="comment_input" autofocus label="Comment" @keyup.enter="postComment"></v-text-field>
  </v-flex>
  <v-flex xs3 text-xs-right>
    <v-btn v-if="username" round color="four" dark @click="postComment" class="post_btn">
      <v-icon size="17" class="mr-2">fa-pencil</v-icon>Write
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
    date: {
      type: Date
    },
    title: {
      type: String
    },
    body: {
      type: String
    },
    id: {
      type: String
    },
    email: {
      type: String
    },
    comment: {
      type: String
    },
    limit_postComment: {
      type: Number,
      default: 4,
    },
  },
  data() {
    return {
      comment_input: '',
      heightt: 0,
      img: '',
      index: 0,
      posts: [],
      post: '',
      username: '',
      useremail: '',
      user: '',
      postComments: [],
      users: [],
      colors: ['two', 'three', 'four', 'five'],
      newComment: '',
    }
  },
  computed: {
    formatedDate() {
      return `${this.date.getFullYear()}년 ${this.date.getMonth()+1}월 ${this.date.getDate()}일`
    }
  },
  mounted() {
    if (this.id != null) {
      this.getPost(this.id);
    }
    if (this.id != null) {
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
    });
  },
  methods: {
    async deleteComment(commentId){
      await FirebaseService.deleteComment(commentId);
      this.getPostComments(this.id);
    },
    async modifyComment(comment){
      await FirebaseService.modifyComment(comment, this.newComment);
      this.getPostComments(this.id);
    },
    async modifyCommentForm(comment) {
      if(comment.isModify){
        comment.isModify = false;
      }else{
        comment.isModify = true;
      }
      this.newComment = comment.body;
      await FirebaseService.canModify(comment);
    },
    async postComment() {
      let result = await FirebaseService.getUserData();
      let res = await FirebaseService.postPostComment(this.id, this.comment_input, result.name, result.userImageUrl);
      await FirebaseService.addToPostcommentList(res);
      this.comment_input = '';
      this.getPostComments(this.id)
    },
    async deletePost() {
      swal('삭제되었습니다.');
      await FirebaseService.deletePost(this.id);
      location.reload();
    },
    async getPost(id) {
      this.post = await FirebaseService.getPost(id);
    },
    async getPostComments(postId) {
      this.postComments = await FirebaseService.getPostComments(postId);

      // 후후
      this.users = await FirebaseService.getUsers();
      for(var i in this.postComments){
        for(var j in this.users){
            if(this.postComments[i].email === this.users[j].email){
              this.postComments[i].userImageUrl = this.users[j].userImageUrl;
              this.postComments[i].name = this.users[j].name;
              this.postComments[i].userId = this.users[j].id;
            }
        }
      }
    },
    addZeros(num) {
      var zero = '';
      num = num.toString();
      if (num.length < 2) {
        for (var i = 0; i < 2 - num.length; i++) {
          zero += '0';
        }
      }
      return zero + num;
    },
    morePost(data) {
      this.limit_postComment = data + 2;
    },
    imageview(url) {
      var img = new Image();
      img.onload = function() {
        var imgW = this.width/2;
        var imgH = this.height/2;
        if ((imgW != 0) && (imgH != 0)) {
          window.open(url, 'guide', 'width=' + imgW + ', height=' + imgH + ', scrollbars=no');
        }
      }
      img.src = url;
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

.post_btn {
  width: 110px;
}

.modifyComment_btn{
  width: 35px;
  height: 35px;
}

.comment_btn {
  width: 20px;
  height: 20px;
}

.comment_title {
  font-size: 12pt;
  font-weight: bold;
}

.comment_title_margin_top{
  margin-top: 50px;
}

.onModify {
  display: inline-block;
  padding-top: 0px;
  margin-top: 0px;
}

.hideModify {
  display: none;
  padding-top: 0px;
  margin-top: 0px;
}
</style>
