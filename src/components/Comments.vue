<template>
<v-layout wrap>
  <v-flex xs12 class="comment_title_margin_top">
    <span class="comment_title">Comment</span>
    <v-divider></v-divider>
  </v-flex>
  <v-flex xs12 v-for="(comment, index) in comments" :key="comment.id">
    <v-timeline align-top v-if="index < limit_Comment" dense clipped style="margin-left: 5px; padding-top:5px">
      <v-timeline-item small style="padding-bottom:5px">
        <template v-slot:icon>
          <v-avatar>
            <img :src="comment.userImageUrl" @click="imageview(comment.userImageUrl)" style="cursor: pointer">
          </v-avatar>
        </template>
        <template>
          <router-link :to="{ name: 'userinfo', params: {id:comment.userId}}"> {{comment.name}} </router-link>
        </template>
        <v-layout justify-space-between wrap align-center>
          <v-flex xs7 sm8 v-if="!comment.isModify" style="background-color: #EDEDED; border-radius: 10px">
            {{comment.body}}
          </v-flex>
          <v-flex xs1 sm1 v-if="!comment.isModify">
            <v-btn @click="ReCommentForm(comment)" fab dark class="mr-2 large_comment_btn" hover color="four">
              <v-icon size="15">fa-reply</v-icon>
            </v-btn>
          </v-flex>
          <v-flex xs7 sm8 v-if="comment.isModify">
            <v-text-field v-model="newComment" :value='comment.body' @keyup.enter="modifyComment(comment)"></v-text-field>
          </v-flex>
          <v-flex xs1 sm1 text-xs-right v-if="comment.isModify">
            <v-btn fab dark v-if="useremail === comment.email" @click="modifyComment(comment)" class="mr-2 modifyComment_btn" hover color="four">
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
            <v-icon v-if="useremail === comment.email" @click="modifyCommentForm(comment)" size="17" class="mr-2 small_comment_btn" hover color="three">create</v-icon>
            <v-icon v-if="useremail === comment.email" @click="deleteComment(comment.id)" size="17" class="mr-2 small_comment_btn" hover color="two">delete</v-icon>
          </v-flex>

          <v-flex xs7 sm8 v-if="comment.reply">
            <v-text-field v-model="reComment" :value='comment.body' @keyup.enter="postReComment(comment)"></v-text-field>
          </v-flex>
          <v-flex xs1 sm1 text-xs-right v-if="comment.reply">
            <v-btn fab dark @click="postReComment(comment)" class="mr-2 large_comment_btn" hover color="four">
              <v-icon size="15">
                fa-pencil
              </v-icon>
            </v-btn>
          </v-flex>
          <v-flex xs4 sm3 v-if="comment.reply">
          </v-flex>

          <!-- <v-flex xs12>
            <ReComment></ReComment>
          </v-flex> -->

        </v-layout>
      </v-timeline-item>
    </v-timeline>
    <v-flex xs12 v-if="index === limit_Comment" text-xs-center>
      <v-btn fab dark icon flat @click="morePortfolioComments(limit_Comment)" class="two large_comment_btn">
        <v-icon size="20">keyboard_arrow_down</v-icon>
      </v-btn>
    </v-flex>
  </v-flex>
  <!-- portfolio comment, need authority -->
  <v-flex xs9>
    <v-text-field v-if="username" v-model="comment_input"  autofocus label="Comment" @keyup.enter="postComment"></v-text-field>
  </v-flex>
  <v-flex xs3 text-xs-right>
    <v-btn v-if="username" round color="four" dark @click="postComment" class="portfolio_btn">
      <v-icon size="17" class="mr-2">fa-pencil</v-icon>Write
    </v-btn>
  </v-flex>
</v-layout>
</template>

<script>
import FirebaseService from '@/services/FirebaseService'
import firebase from "firebase/app";
import firebaseApp from 'firebase/app'
import store from '../store'
import ReComment from '@/components/ReComment'

export default {
  name: 'Comments',
  props: {
    id: {
      type: String
    },
    comment: {
      type: String
    },
    reComment: {
      type: String
    },
    limit_Comment: {
      type: Number,
      default: 4,
    },
    classify: {
      type: String
    },
  },
  components: {
    ReComment
  },
  data() {
    return {
      username: '',
      useremail: '',
      portfolioId: '',
      user: '',
      comments: [],
      users: [],
      newComment: '',
      comment_input: '',
      rules: {
        required: value => !!value || "Required.",
      },
      btnCheck: false,
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
      }
    });
    if(this.classify == "post"){
      this.getComments(this.id);
    }else{
      var parentId = this.$route.params.id;
      this.getComments(parentId);
    }
  },
  methods: {
    async deleteComment(commentId){
      await FirebaseService.deleteComment(this.id, this.classify, commentId);
      this.getComments(this.id);
    },
    async modifyComment(comment) {
      await FirebaseService.modifyComment(comment, this.newComment);
      this.getComments(this.id);
    },
    async modifyCommentForm(comment) {
      if (comment.isModify) {
        comment.isModify = false;
      } else {
        comment.isModify = true;
      }
      this.newComment = comment.body;
    },
    async postComment() {
      if(this.comment_input.length != 0 && !this.btnCheck){
        this.btnCheck = true;
        let result = await FirebaseService.getUserData();
        let res = await FirebaseService.postComment(this.id, this.classify, this.comment_input, result.name, result.userImageUrl);
        await FirebaseService.addToUserCommentList(res);
        await FirebaseService.addToCommentList(this.id, this.classify, res);
        this.comment_input = '';
        await this.getComments(this.id);
        this.btnCheck = false;
      }
    },
    async getComments(parentId) {
      this.comments = await FirebaseService.getComments(parentId);
      this.users = await FirebaseService.getUsers();
      for (var i in this.comments) {
        for (var j in this.users) {
          if (this.comments[i].email === this.users[j].email) {
            this.comments[i].userImageUrl = this.users[j].userImageUrl;
            this.comments[i].name = this.users[j].name;
          }
        }
      }
    },
    ReCommentForm(comment){
      if (comment.reply) {
        comment.reply = false;
      } else {
        comment.reply = true;
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
    moreComments(data) {
      this.limit_Comment = data + 2;
    },
    imageview(url) {
      var img = new Image();
      img.onload = function() {
        var imgW = this.width / 2;
        var imgH = this.height / 2;
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

.portfolio_btn {
  width: 110px;
}

.large_comment_btn {
  width: 35px;
  height: 35px;
}

.small_comment_btn {
  width: 20px;
  height: 20px;
}

.comment_title {
  font-size: 12pt;
  font-weight: bold;
}

.comment_title_margin_top {
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
