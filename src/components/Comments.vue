<template>
<v-layout wrap>
  <v-flex xs12 class="comment_title_margin_top">
    <span class="comment_title">Comment</span>
    <v-divider></v-divider>
  </v-flex>
  <v-flex xs12 v-for="(comment, index) in comments" :key="comment.id">
    <v-timeline align-top v-if="index < limit_Comment" dense clipped style="margin-left: 5px; padding-top:5px">
      <v-timeline-item small fill-dot style="padding-bottom:5px;" color="rgba(250, 250, 250, 1)">
        <template v-slot:icon>
          <v-avatar>
            <img :src="comment.userImageUrl" @click="imageview(comment.userImageUrl)" style="cursor: pointer; margin-top: 30px;">
          </v-avatar>
        </template>

        <v-layout justify-space-between wrap align-center>
            <v-flex xs10>
              <router-link :to="{ name: 'userinfo', params: {id:comment.userId}}"> {{comment.name}} </router-link>
              {{comment.created_at.getFullYear()}}.
              {{comment.created_at.getMonth()+1}}.
              {{comment.created_at.getDate()}}
              {{addZeros(comment.created_at.getHours())}}:
              {{addZeros(comment.created_at.getMinutes())}}
              <v-btn @click="ReCommentForm(comment)" fab dark class="mr-2 large_comment_btn" hover color="four">
                <v-icon size="15">fa-reply</v-icon>
              </v-btn>

              <template v-if="!comment.isModify">
                <div style="background-color: #EDEDED; border-radius: 10px">{{comment.body}}</div>
              </template>
              <template v-else>
                <v-text-field v-model="newComment" :value='comment.body' @keyup.enter="modifyComment(comment)"></v-text-field>
              </template>
            </v-flex>

            <template v-if="!comment.isModify">
              <v-flex xs2 text-xs-center>
                <v-btn fab flat small color="three" v-if="useremail === comment.email" @click="modifyCommentForm(comment)">
                  <v-icon size="17">create</v-icon>
                </v-btn>
                <v-btn fab flat small color="two" v-if="useremail === comment.email" @click="deleteComment(comment.id)">
                  <v-icon size="17">delete</v-icon>
                </v-btn>
              </v-flex>
            </template>
            <template v-else>
              <v-flex xs2 text-xs-center>
                <template v-if="isCommentModify">
                  <v-btn fab dark small color="four" @click="modifyComment(comment)" >
                    <v-icon size="17"> create</v-icon>
                  </v-btn>
                </template>
                <template v-else>
                  <v-btn fab small disabled>
                    <v-icon size="17">create</v-icon>
                  </v-btn>
                </template>

                <v-btn fab dark small color="red"  @click="modifyCommentForm(comment)" > <v-icon size="17"> cancel</v-icon></v-btn>
              </v-flex>
            </template>

            <template v-if="comment.reply">
              <v-flex xs10>
                <v-text-field v-model="reComment_input" :value='comment.body' @keyup.enter="postReComment(comment)"></v-text-field>
              </v-flex>
              <v-flex xs2 text-xs-center>
                <template v-if="isReCommentModify">
                  <v-btn fab dark small hover color="four" @click="postReComment(comment)"><v-icon size="17">create</v-icon></v-btn>
                </template>
                <template v-else>
                  <v-btn fab small disabled><v-icon size="17">create</v-icon></v-btn>
                </template>
                <v-btn fab dark small hover color="red"  @click="ReCommentForm(comment)"><v-icon size="17">cancel</v-icon></v-btn>
              </v-flex>
            </template>

            <template>
              <ReComment :id='comment.id' ref="child"></ReComment>
            </template>

          </v-layout>
      </v-timeline-item>
    </v-timeline>
    <v-flex xs12 v-if="index === limit_Comment" text-xs-center>
      <v-btn fab dark icon flat @click="moreComments(limit_Comment)" class="two large_comment_btn">
        <v-icon size="20">keyboard_arrow_down</v-icon>
      </v-btn>
    </v-flex>
  </v-flex>
  <!-- portfolio comment, need authority -->
  <template v-if="username">
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
      username: '',
      useremail: '',
      portfolioId: '',
      user: '',
      comments: [],
      users: [],
      newComment: '',
      comment_input: '',
      reComment_input: '',
      isComment:false,
      isCommentModify:false,
      isReCommentModify:false,
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
      this.$refs.child[0].getComments(comment.id);
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
