<template>
<v-layout wrap>
  <v-flex xs12 class="comment_title_margin_top">
    <span class="comment_title">Comment</span>
    <v-divider></v-divider>
  </v-flex>
  <v-flex xs12 v-for="(comment, index) in portfolioComments" :key="comment.id">
    <v-timeline v-if="index < limit_Comment" dense clipped style="margin-left: 5px; padding-top:5px">
      <v-timeline-item :color="colors[index%4]" small style="padding-bottom:5px">
        <template v-slot:icon>
          <v-avatar>
            <img :src="comment.userImageUrl">
          </v-avatar>
        </template>
        <template>
          <router-link :to="{ name: 'userinfo', params: {id:comment.userId}}"> {{comment.name}} </router-link>
        </template>
        <v-layout justify-space-between wrap align-center>
          <v-flex xs8 sm9 v-if="!comment.isModify" style="background-color: #EDEDED; border-radius: 10px">
            {{comment.body}}
          </v-flex>
          <v-flex xs7 sm8 v-if="comment.isModify">
            <v-text-field v-model="newComment" :value='comment.body' @keyup.enter="modifyPortfolioComment(comment)"></v-text-field>
          </v-flex>
          <v-flex xs1 sm1 text-xs-right v-if="comment.isModify">
            <v-btn fab dark v-if="useremail === comment.email"  @click="modifyPortfolioComment(comment)" class="mr-2 modifyComment_btn" hover color="four">
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
            <v-icon v-if="useremail === comment.email"  @click="modifyPortfolioCommentForm(comment)" size="17" class="mr-2 comment_btn" hover color="three">create</v-icon>
            <v-icon v-if="useremail === comment.email" @click="deletePortfolioComment(comment.id)" size="17" class="mr-2 comment_btn" hover color="two">delete</v-icon>
          </v-flex>
        </v-layout>
      </v-timeline-item>
    </v-timeline>
    <v-flex xs12 v-if="index === limit_Comment" text-xs-center>
      <v-btn fab dark icon flat @click="morePortfolioComments(limit_Comment)" class="two" style="height:30px; width:30px">
        <v-icon size="20">keyboard_arrow_down</v-icon>
      </v-btn>
    </v-flex>
  </v-flex>
  <!-- portfolio comment, need authority -->
  <v-flex xs9>
    <v-text-field v-if="username" v-model="comment_input" autofocus label="Comment" @keyup.enter="postPortfolioComment"></v-text-field>
  </v-flex>
  <v-flex xs3 text-xs-right>
    <v-btn v-if="username" round color="four" dark @click="postPortfolioComment" class="portfolio_btn">
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

export default {
  name: 'PortfolioComment',
  props: {
    id:{
      type: String
    },
    comment: {
      type: String
    },
    limit_Comment: {
      type: Number,
      default: 4,
    },
  },
  data() {
    return {
      username: '',
      useremail: '',
      portfolioId: '',
      user: '',
      portfolioComments: [],
      users: [],
      colors: ['two', 'three', 'four', 'five'],
      newComment: '',
      comment_input: '',
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
    var portfolioId = this.$route.params.id;
    this.getPortfolioComments(portfolioId);
  },
  methods: {
    async deletePortfolioComment(commentId){
      await FirebaseService.deletePortfolioComment(commentId);
      this.getPortfolioComments(this.id);
    },
    async modifyPortfolioComment(comment){
      await FirebaseService.modifyPortfolioComment(comment, this.newComment);
      this.getPortfolioComments(this.id);
    },
    async modifyPortfolioCommentForm(comment) {
      if(comment.isModify){
        comment.isModify = false;
      }else{
        comment.isModify = true;
      }
      this.newComment = comment.body;
      await FirebaseService.canPortfolioModify(comment);
    },
    async postPortfolioComment() {
      let result = await FirebaseService.getUserData();
      let res = await FirebaseService.postPortfolioComment(this.id, this.comment_input, result.name, result.userImageUrl);
      await FirebaseService.addToPortfoliocommentList(res);

      this.comment_input = '';
      this.getPortfolioComments(this.id);
    },
    async getPortfolioComments(portfolioId) {
      this.portfolioComments = await FirebaseService.getPortfolioComments(portfolioId);
      this.users = await FirebaseService.getUsers();
      for(var i in this.portfolioComments){
        for(var j in this.users){
            if(this.portfolioComments[i].email === this.users[j].email){
              this.portfolioComments[i].userImageUrl = this.users[j].userImageUrl;
              this.portfolioComments[i].name = this.users[j].name;
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
    morePortfolioComments(data) {
      this.limit_Comment = data + 2;
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
