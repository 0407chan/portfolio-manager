<template>
<v-layout wrap>
  <v-flex xs12 class="comment_title_margin_top">
    <span class="comment_title">Comment</span>
    <v-divider></v-divider>
  </v-flex>
  <v-flex xs12 v-for="i in comments.length">
    <v-timeline align-top v-if="i-1 < limit_Comment" dense clipped style="margin-left: 5px; padding-top:5px">
      <v-timeline-item small fill-dot style="padding-bottom:20px;" color="rgba(250, 250, 250, 1)">
        <template v-slot:icon>
          <v-avatar>
            <img :src="comments[comments.length-i].userImageUrl" @click="imageview(comments[comments.length-i].userImageUrl)" style="cursor: pointer; margin-top: 30px;">
          </v-avatar>
        </template>

        <v-layout justify-space-between wrap align-center>
            <v-flex xs10>
              <router-link :to="{ name: 'userinfo', params: {id:comments[comments.length-i].userId}}"> {{comments[comments.length-i].name}} </router-link>
              <span :title="realtime(comments[comments.length-i].created_at)">
                {{displayTime(comments[comments.length-i].created_at)}}
              </span>
              <template v-if="currUser">
                <v-btn fab flat small color="two"  @click="ReCommentForm(comments[comments.length-i])">
                  <v-icon size="17">fa-reply</v-icon>
                </v-btn>
              </template>
              <template v-if="!comments[comments.length-i].isModify">
                <div style="background-color: #EDEDED; border-radius: 10px">{{comments[comments.length-i].body}}</div>
              </template>
              <template v-else>
                <v-text-field v-model="newComment" :value='comments[comments.length-i].body' @keyup.enter="modifyComment(comments[comments.length-i])"></v-text-field>
              </template>
            </v-flex>

            <template v-if="!comments[comments.length-i].isModify">
              <v-flex xs2 text-xs-center>
                <v-btn fab flat small color="three" v-if="currUser.id === comments[comments.length-i].userId" @click="modifyCommentForm(comments[comments.length-i])">
                  <v-icon size="17">create</v-icon>
                </v-btn>
                <v-btn fab flat small color="two" v-if="currUser.id === comments[comments.length-i].userId" @click="deleteComment(comments[comments.length-i].id)">
                  <v-icon size="17">delete</v-icon>
                </v-btn>
              </v-flex>
            </template>
            <template v-else>
              <v-flex xs2 text-xs-center>
                <template v-if="isCommentModify">
                  <v-btn fab dark small color="four" @click="modifyComment(comments[comments.length-i])" >
                    <v-icon size="17"> create</v-icon>
                  </v-btn>
                </template>
                <template v-else>
                  <v-btn fab small disabled>
                    <v-icon size="17">create</v-icon>
                  </v-btn>
                </template>

                <v-btn fab dark small color="red"  @click="modifyCommentForm(comments[comments.length-i])" > <v-icon size="17"> cancel</v-icon></v-btn>
              </v-flex>
            </template>

            <template v-if="comments[comments.length-i].reply">
              <v-flex xs10>
                <v-text-field v-model="reComment_input" :value='comments[comments.length-i].body' @keyup.enter="postReComment(comments[comments.length-i])"></v-text-field>
              </v-flex>
              <v-flex xs2 text-xs-center>
                <template v-if="isReCommentModify">
                  <v-btn fab dark small hover color="four" @click="postReComment(comments[comments.length-i])"><v-icon size="17">create</v-icon></v-btn>
                </template>
                <template v-else>
                  <v-btn fab small disabled><v-icon size="17">create</v-icon></v-btn>
                </template>
                <v-btn fab dark small hover color="red"  @click="ReCommentForm(comments[comments.length-i])"><v-icon size="17">cancel</v-icon></v-btn>
              </v-flex>
            </template>

            <template>
              <ReComment :id='comments[comments.length-i].id' ref="child"></ReComment>
            </template>

          </v-layout>
      </v-timeline-item>
    </v-timeline>
    <v-flex xs12 v-if="i-1 === limit_Comment" text-xs-center>
      <v-btn fab dark icon flat @click="moreComments(limit_Comment)" class="two large_comment_btn">
        <v-icon size="20">keyboard_arrow_down</v-icon>
      </v-btn>
    </v-flex>
  </v-flex>
  <!-- portfolio comment, need authority -->
  <template v-if="currUser">
    <v-layout justify-space-between wrap align-center>
      <v-flex xs10 text-xs-center>
        <v-text-field v-model="comment_input" autofocus label="Comment" @keyup.enter="postComment"></v-text-field>
      </v-flex>
      <v-flex xs2 text-xs-center>
        <template v-if="isComment">
          <v-btn round color="four" dark @click="postComment">
            <v-icon size="17" class="mr-2">create</v-icon>Write
          </v-btn>
        </template>
        <template v-else>
          <v-btn round disabled>
            <v-icon size="17" class="mr-2">create</v-icon>Write
          </v-btn>
        </template>
      </v-flex>
    </v-layout>
  </template>
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
    limit_Comment: {
      type: Number,
      default: 3,
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
      portfolioId: '',
      currUser: '',
      comments: [],
      users: [],
      newComment: '',
      comment_input: '',
      reComment_input: '',
      isComment:false,
      isCommentModify:false,
      isReCommentModify:false,
      childIndex: '',
      rules: {
        required: value => !!value || "Required.",
      },
      btnCheck: false,
    }
  },

  created() {
    firebaseApp.auth().onAuthStateChanged(async user => {
      if (user) this.currUser = await FirebaseService.getUserData();
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
      if(this.isCommentModify){
        await FirebaseService.modifyComment(comment, this.newComment);
        this.getComments(this.id);
      }
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
      if(!this.btnCheck && this.isComment){
        this.btnCheck = true;
        let result = await FirebaseService.getUserData();
        let res = await FirebaseService.postComment(this.id, this.classify, this.comment_input, result.name, result.userImageUrl);
        await FirebaseService.addToUserCommentList(res);
        await FirebaseService.addToCommentList(this.id, this.classify, res);
        this.comment_input = '';
        await this.getComments(this.id);
        this.btnCheck = false;
      }
      for(var i in this.$refs.child){
        if(i < this.limit_Comment){
          var commentId = this.comments[this.comments.length-i-1].id;
          this.$refs.child[i].getComments(commentId);
        }
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
    async postReComment(comment){
      let result = await FirebaseService.getUserData();
      let res = await FirebaseService.postComment(comment.id, this.classify, this.reComment_input, result.name, result.userImageUrl);
      await FirebaseService.addToUserCommentList(res);
      await FirebaseService.addToReCommentList(comment.id, res);
      this.reComment_input = '';
      await this.getComments(this.id);
      for(var i in this.$refs.child){
        if(i < this.limit_Comment){
          var commentId = this.comments[this.comments.length-i-1].id;
          this.$refs.child[i].getComments(commentId);
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
    displayTime(bDate){
      var cDate = new Date();
      var result = cDate.getTime()-bDate.getTime()+7000;
      result = result/1000;
      if(result < 60){
        return Math.floor(result) + '초';
      }else if((result/60) < 60){
        return Math.floor(result/60) + '분';
      }else if((result/3600) < 24){
        return Math.floor(result/3600) + '시간';
      }else{
        return Math.floor(result/86400) + '일';
      }
    },
    realtime(date){
      return date.getFullYear()+'년 '+(date.getMonth()+1)+'월 '+date.getDate()+'일 '+ this.addZeros(date.getHours())+'시 '+ this.addZeros(date.getMinutes()) +'분';
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
  },


  watch:{
    comment_input(){
      if(this.comment_input.length == 0){
        this.isComment = false;
      }else {
        this.isComment = true;
      }
    },
    newComment(){
      if(this.newComment.length ==0){
        this.isCommentModify = false;
      }else {
        this.isCommentModify = true;
      }
    },
    reComment_input(){
      if(this.reComment_input.length ==0){
        this.isReCommentModify = false;
      }else {
        this.isReCommentModify = true;
      }
    }
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
