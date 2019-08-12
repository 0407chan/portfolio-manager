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
    <vue-markdown>{{body}}
     </vue-markdown>
  </v-flex>

  <v-flex xs12 text-xs-right round class="comment_title_margin_top">
    <v-btn class="post_btn" v-if="useremail === this.email" round color="two" dark :to="{ name: 'modifypost', params: {id: this.id} }">
      <v-icon size="17" class="mr-2">fa-pencil</v-icon>Modify
    </v-btn>
    <v-btn class="post_btn" v-if="useremail === this.email" round color="three" dark v-on:click="deletePost">
      <v-icon size="17" class="mr-2">delete</v-icon>Delete
    </v-btn>
  </v-flex>


  <v-flex xs12>
    <Comments :id="id" classify="post"></Comments>
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
import Comments from '../components/Comments'

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
    comments: Array,
    limit_postComment: {
      type: Number,
      default: 4,
    },
  },
  components:{
    Comments
  },
  data() {
    return {
      comment_input: '',
      heightt: 0,
      img: '',

      posts: [],
      post: '',
      username: '',
      useremail: '',
      user: '',
      postComments: [],
      users: [],
      colors: ['two', 'three', 'four', 'five'],
      newComment: '',

      rules: {
        required: value => !!value || "Required.",
      },
      btnCheck: false,
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
      this.getComments(this.id);
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
      await FirebaseService.deleteComment(this.id, commentId);
      this.getComments(this.id);
    },
    async modifyComment(comment){
      await FirebaseService.modifyComment(comment, this.newComment);
      this.getComments(this.id);
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
      if(this.comment_input.length != 0 && !this.btnCheck){

        this.btnCheck = true;
        let result = await FirebaseService.getUserData();
        let comId = await FirebaseService.postComment(this.id, "post",this.comment_input, result.name, result.userImageUrl);
        await FirebaseService.addToUserCommentList(comId);
        await FirebaseService.addToCommentList(this.id,"post",comId);

        this.comment_input = '';
        await this.getComments(this.id);
        this.btnCheck = false;
      }
    },
    async deletePost() {
      swal('삭제되었습니다.');
      await this.getPost(this.id);
      if(this.post.comments){
        for(var i =0; i<this.post.comments.length; i++)
        FirebaseService.deleteComment(this.id, 'post',this.post.comments[i]);
      }
      await FirebaseService.deletePost(this.id);
      location.reload();
    },
    async getPost(id) {
      this.post = await FirebaseService.getPost(id);
    },
    async getComments(postId) {
      //TODO 글 추가 삭제 수정 시 오류가 있어서 일단 보류
      // this.postComments = [];
      // for(var i = 0; i<this.comments.length; i++){
      //   let res = await FirebaseService.getPostComment(this.comments[i]);
      //   //console.log(res);
      //   this.postComments.push(res);
      // }
      // console.log(this.postComments);

      this.postComments = await FirebaseService.getComments(postId);
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
