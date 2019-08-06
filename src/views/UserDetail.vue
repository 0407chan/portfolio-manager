<template>
<v-container>
  <v-layout wrap align-center justify-center>
      <v-flex xs4>
        <v-progress-circular v-if="loading" indeterminate color="four"></v-progress-circular>
        <v-img :src="imageUrl" max-width="300" max-height="300" v-if="imageUrl" />

        <v-text-field label="Select Image" @click="pickFile" v-model="imageUrl" prepend-icon="attach_file" color="four" v-if="user.email==pageuser.email"></v-text-field>

        <input type="file" style="display: none" ref="image" accept="image/*" @change="onFilePicked" />
      </v-flex>
    <v-flex xs2></v-flex>
    <v-flex xs4>
      <v-layout align-center>

        <v-flex text-xs-12>
          <v-text-field label="Name" v-model="pageuser.name" v-if="user&&user.email==pageuser.email">
          </v-text-field>
          <v-text-field label="Name" v-model="pageuser.name" readonly v-else-if="user&&user.email!==pageuser.email">
          </v-text-field>
        </v-flex>
      </v-layout>
      <v-layout align-center>
        <v-flex text-xs-12>
          <v-text-field label="Email" v-model="pageuser.email" readonly @click="cannotModify" v-if="user&&user.email==pageuser.email">
          </v-text-field>
          <v-text-field label="Email" v-model="pageuser.email" readonly v-else-if="user&&user.email!==pageuser.email">
          </v-text-field>
        </v-flex>
      </v-layout>
      <v-layout align-center>

        <v-flex text-xs-12>
          <v-text-field label="Classify" v-model="pageuser.classify" readonly @click="cannotModify" v-if="user&&user.email==pageuser.email">
          </v-text-field>
          <v-text-field label="Classify" v-model="pageuser.classify" readonly v-else-if="user&&user.email!==pageuser.email">
          </v-text-field>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
  <v-flex text-xs-center my5>
    <v-btn color="two" v-if="user&&user.email===pageuser.email" round dark v-on:click="modifyUser">
      <v-icon size="17" class="mr-2">create</v-icon>Modify
    </v-btn>
    <router-link :to="{name:'admin'}">
      <v-btn color="three" v-if="user&&user.classify==='관리자'&&user.email===pageuser.email" dark round>
        <v-icon size="17" class="mr-2">people</v-icon>Admin
      </v-btn>
    </router-link>
    <v-btn color="three" v-if="user&&user.classify!=='관리자'&&user.email===pageuser.email" dark round v-on:click="deleteUser">
      <v-icon size="17" class="mr-2">cancel</v-icon>탈퇴하기
    </v-btn>

  </v-flex>
</v-container>
</template>

<script>
import FirebaseService from "@/services/FirebaseService";
import {
  userInfo
} from 'os';
import firebase from "firebase/app";
import axios from "axios";



export default {
  data() {
    return {
      user: "",
      result: '',
      pageuser: '',
      imageName: "",
      imageUrl: "",
      imageFile: "",
      loading: false,
      path: "https://api.imgur.com/3/image",
      clientid: "aac995cb6f223ce",
      callback: "feedback",
      id: "",
    }
  },

  created() {
    this.id = this.$route.params.id;
    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        this.user = await FirebaseService.getUserData();
        this.pageuser = await FirebaseService.getUser(this.id);
        this.imageUrl = this.pageuser.userImageUrl;
      }
    })
  },

  methods: {
    async modifyUser() {
      if (this.imageUrl === '') {
        this.imageUrl = this.pageuser.userImageUrl
      }
      this.pageuser.userImageUrl = this.imageUrl;
      //console.log(this.pageuser);


      // TODO 내가 이름이 수정되면, 내가 작성한 모든 post, 포폴, 댓글에 들어간 name 수정하기



      await FirebaseService.modifyUser(this.pageuser)
      this.$store.state.user = this.pageuser
      swal("개인정보 수정이 완료되었습니다.")
      this.$router.push({
        name: "home"
      });
    },
    pickFile() {
      this.$refs.image.click();
    },
    setImageUrl(url) {
      this.imageUrl = url;
    },
    onFilePicked(e) {
      this.imageUrl = '';
      const files = e.target.files;
      this.loading = true;
      if (files[0] !== undefined) {
        this.imageName = files[0].name;
        if (this.imageName.lastIndexOf(".") <= 0) {
          return;
        }

        let formData = new FormData();
        formData.append('image', files[0]); //required

        axios({
          method: 'POST',
          url: 'https://api.imgur.com/3/image',
          data: formData,
          headers: {
            Authorization: "Client-ID aac995cb6f223ce"
          },
          mimeType: 'multipart/form-data'
        }).then(res => {
          this.imageUrl = res.data.data.link;
          this.loading = false;
        }).catch(e => {
          console.log(e)
        });

      } else {
        this.imageName = "";
        this.imageFile = "";
        this.imageUrl = "";
      }
    },
    cannotModify() {
      swal('수정이 불가한 항목입니다.')
    },


    async deleteUser(){
      const res = await FirebaseService.getUserData();
      if(res.postcomments){
        for(var i =0; i<res.postcomments.length; i++)
        FirebaseService.deleteComment(res.postcomments[i]);
      }
      if(res.posts){
        for(var i =0; i<res.posts.length; i++)
        FirebaseService.deletePost(res.posts[i]);
      }
      if(res.portfolios){
        for(var i =0; i<res.portfolios.length; i++)
        FirebaseService.deletePortfolio(res.portfolios[i]);
      }
      if(res.portfoliocomments){
        for(var i =0; i<res.portfoliocomments.length; i++)
        FirebaseService.deletePortfolioComment(res.portfoliocomments[i]);
      }
      const result = await FirebaseService.selfDeleteUser();

      FirebaseService.logout();
      firebase.auth().signOut().then(function() {

      });
      swal("정상적으로 탈퇴되었습니다.")
      this.$router.push({
        name: "home"
      });


    }
  },
}
</script>

<style>

</style>
