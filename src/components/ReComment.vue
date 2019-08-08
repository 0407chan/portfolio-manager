<template>
  <v-layout wrap>
    <v-flex xs12 v-for="(recomment, reIndex) in recomments" :key="recomment.id">
      <v-timeline align-middle v-if="reIndex < limit_recomment" dense clipped style="margin-left: 5px; padding-top:5px">
        <v-timeline-item small fill-dot style="padding-bottom:5px" color="rgba(250, 250, 250, 1)">
          <template v-slot:icon>
            <v-avatar>
              <img :src="recomment.userImageUrl" @click="imageview(recomment.userImageUrl)" style="cursor: pointer; margin-top: 30px;">
            </v-avatar>
          </template>

          <v-layout justify-space-between wrap align-center>
              <v-flex xs10>
                <router-link :to="{ name: 'userinfo', params: {id:recomment.userId}}"> {{recomment.name}} </router-link>
                {{recomment.created_at.getFullYear()}}.
                {{recomment.created_at.getMonth()+1}}.
                {{recomment.created_at.getDate()}}
                {{addZeros(recomment.created_at.getHours())}}:
                {{addZeros(recomment.created_at.getMinutes())}}

                <template v-if="!recomment.isModify">
                  <div style="background-color: #EDEDED; border-radius: 10px">{{recomment.body}}</div>
                </template>
                <template v-else>
                  <v-text-field v-model="newReComment" :value='recomment.body' @keyup.enter="modifyComment(recomment)"></v-text-field>
                </template>
              </v-flex>

              <template v-if="!recomment.isModify">
                <v-flex xs2 text-xs-center>
                  <v-btn fab flat small color="three" v-if="useremail === recomment.email" @click="modifyCommentForm(recomment)">
                    <v-icon size="17">create</v-icon>
                  </v-btn>
                  <v-btn fab flat small color="two" v-if="useremail === recomment.email" @click="deleteComment(recomment.id)">
                    <v-icon size="17">delete</v-icon>
                  </v-btn>
                </v-flex>
              </template>
              <template v-else>
                <v-flex xs2 text-xs-center>
                  <template v-if="isCommentModify">
                    <v-btn fab dark small color="four" @click="modifyComment(recomment)" >
                      <v-icon size="17"> create</v-icon>
                    </v-btn>
                  </template>
                  <template v-else>
                    <v-btn fab small disabled>
                      <v-icon size="17">create</v-icon>
                    </v-btn>
                  </template>
                  <v-btn fab dark small color="red"  @click="modifyCommentForm(recomment)" > <v-icon size="17"> cancel</v-icon></v-btn>
                </v-flex>
              </template>
            </v-layout>

        </v-timeline-item>
      </v-timeline>
      <v-flex xs12 v-if="reIndex === limit_recomment" text-xs-center>
        <v-btn fab dark icon flat @click="moreComments(limit_recomment)" class="two large_comment_btn">
          <v-icon size="20">keyboard_arrow_down</v-icon>
        </v-btn>
      </v-flex>
    </v-flex>
  </v-layout>
</template>

<script>
import FirebaseService from '@/services/FirebaseService'
import firebase from "firebase/app";
import firebaseApp from 'firebase/app'
import store from '../store'

export default {
	name: 'ReComment',
  props: {
    id: {
      type: String
    },
    limit_recomment: {
      type: Number,
      default: 2,
    },
  },
  data() {
    return {
      username: '',
      useremail: '',
      parentId: '',
      user: '',
      users: [],
      recomments: [],
      arrays: [],
      newReComment: '',
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
    // TODO 포트폴리오 대댓글 읽어오기
    this.getComments(this.id);
  },
  methods: {
    async getComments(parentId) {
      this.recomments = await FirebaseService.getComments(parentId);
      this.users = await FirebaseService.getUsers();
      for (var i in this.recomments) {
        for (var j in this.users) {
          if (this.recomments[i].email === this.users[j].email) {
            this.recomments[i].userImageUrl = this.users[j].userImageUrl;
            this.recomments[i].name = this.users[j].name;
          }
        }
      }
    },
    async deleteComment(commentId){
      await FirebaseService.deleteComment(this.id, 'recomment', commentId);
      this.getComments(this.id);
    },
    async modifyComment(comment) {
      if(this.isCommentModify){
        await FirebaseService.modifyComment(comment, this.newReComment);
        this.getComments(this.id);
      }
    },
    modifyCommentForm(comment) {
      if (comment.isModify) {
        comment.isModify = false;
      } else {
        comment.isModify = true;
      }
      this.newReComment = comment.body;
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
      this.limit_recomment = data + 2;
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
  watch: {
    newReComment(){
      if(this.newReComment.length ==0){
        this.isCommentModify = false;
      }else {
        this.isCommentModify = true;
      }
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
