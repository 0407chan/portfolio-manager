
<template>
  <v-container mt-2>
    <v-flex xs12 text-xs-center>
      <v-text-field label="Search" v-model="search"></v-text-field>
    </v-flex>

    <v-card>
      <v-tabs
        v-model="tab"
        centered
        icons-and-text
        transition="fade"
      >
        <v-tabs-slider></v-tabs-slider>

        <v-tab href="#tab-1">
          <!-- Users ({{users.length}}) -->
          Information
          <v-icon size=17>account_box</v-icon>
        </v-tab>

        <template v-if="pageuser.isPortfolioOpen">
          <v-tab href="#tab-2">
            Portfolios ({{portfolioSearchList.length}})
            <v-icon size=17>fa-pencil</v-icon>
          </v-tab>
        </template>
        <template v-else>
          <v-tab href="#tab-9">
            <v-icon size=17>lock</v-icon>
          </v-tab>
        </template>

        <template v-if="pageuser.isPostOpen">
        <v-tab href="#tab-3">
          <!-- Posts ({{posts.length}}) -->
          Posts ({{postSearchList.length}})
          <v-icon size=17>fa-clipboard</v-icon>
        </v-tab>
        </template>
        <template v-else>
          <v-tab href="#tab-9">
            <v-icon size=17>lock</v-icon>
          </v-tab>
        </template>

        <template v-if="pageuser.isCommentOpen">
        <v-tab href="#tab-4">
          <!-- Posts ({{posts.length}}) -->
          Comments ({{commentSearchList.length}})
          <v-icon size=17>fa-clipboard</v-icon>
        </v-tab>
        </template>
        <template v-else>
          <v-tab href="#tab-9">
            <v-icon size=17>lock</v-icon>
          </v-tab>
        </template>

      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item :value="'tab-'+1" transition="fade-transition" reverse-transition="fade-transition">
          <v-card flat>
            <v-layout wrap align-center justify-center>
                <v-flex xs4>
                  <v-progress-circular v-if="loading" indeterminate color="four"></v-progress-circular>
                  <v-img :src="imageUrl" width="300" height="300" v-if="imageUrl" />
                  <v-text-field label="Select Image" @click="pickFile" v-model="imageUrl" prepend-icon="attach_file" color="four" v-if="isOwner"></v-text-field>
                  <input type="file" style="display: none" ref="image" accept="image/*" @change="onFilePicked" />

                </v-flex>
              <v-flex xs2></v-flex>
              <v-flex xs4>
                <v-layout align-center>

                  <v-flex text-xs-12>
                    <v-text-field label="Name" v-model="pageuser.name" v-if="isOwner">
                    </v-text-field>
                    <v-text-field label="Name" v-model="pageuser.name" readonly v-else-if="!isOwner">
                    </v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout align-center>
                  <v-flex text-xs-12>
                    <v-text-field label="Email" v-model="pageuser.email" readonly>
                    </v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout align-center>
                  <v-flex text-xs-12>
                    <v-text-field label="Classify" v-model="pageuser.classify" readonly>
                    </v-text-field>
                  </v-flex>
                </v-layout>

                <v-layout align-center v-if="isOwner">
                  <v-flex text-xs-12 text-xs-center>
                    <h3>프로필 공개 설정</h3>
                    <v-switch v-model="pageuser.isPortfolioOpen" label="Portfolio"></v-switch>
                    <v-switch v-model="pageuser.isPostOpen" label='Post'></v-switch>
                    <v-switch v-model="pageuser.isCommentOpen" label="Comment"></v-switch>
                    <!-- <v-btn v-on:click ="test"></v-btn> -->
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
            <v-flex text-xs-center my5 v-if="isOwner">
              <v-btn color="two" round dark v-on:click="modifyUser">
                <v-icon size="17" class="mr-2">create</v-icon>Modify
              </v-btn>
              <v-btn color="three" dark round v-on:click="deleteUser">
                <v-icon size="17" class="mr-2">cancel</v-icon>탈퇴하기
              </v-btn>
            </v-flex>

          </v-card>
        </v-tab-item>

        <v-tab-item :value="'tab-'+2" transition="fade-transition" reverse-transition="fade-transition">
          <v-card flat>
            <v-flex xs12 text-xs-center>
              <v-data-table :headers="portfolioHeaders" :items="portfolioSearchList" class="elevation-1" >
                <template v-slot:items="props">
                  <!-- <td><p class="testbody"> {{ props.item.title }} </p></td> -->
                  <td>
                    <template v-if="props.item.subTitle">
                      <router-link :to="{ name: 'portfolioview', params: {id:props.item.id}}">{{ props.item.subTitle }} </router-link>
                    </template>
                    <template v-else>
                      <router-link :to="{ name: 'portfolioview', params: {id:props.item.id}}"> {{ props.item.title }} </router-link>
                    </template>
                    <template v-if="props.item.comments"> ({{props.item.comments.length}})</template>
                  </td>
                  <td>{{ props.item.created_at.getFullYear()}}.{{ props.item.created_at.getMonth()+1}}.{{ props.item.created_at.getDate()}}</td>
                  <td>
                    <template v-if="isOwner">
                      <v-btn fab flat small color="three" v-on:click="modifyPortfolio(props.item)"><v-icon size="17">create</v-icon></v-btn>
                      <v-btn fab flat small color ="two" v-on:click="deletePortfolio(props.item)"><v-icon size="17">delete</v-icon></v-btn>
                    </template>
                  </td>
                  <!-- </template> -->
                </template>

              </v-data-table>
            </v-flex>
          </v-card>
        </v-tab-item>



        <v-tab-item :value="'tab-'+3"  transition="fade-transition" reverse-transition="fade-transition">
          <v-card flat>
            <v-flex xs12 text-xs-center>
              <v-data-table :headers="postHeaders" :items="postSearchList" class="elevation-1">
                <template v-slot:items="props">
                  <td>
                    <template v-if="props.item.subTitle">{{ props.item.subTitle }}</template>
                    <template v-else>{{ props.item.title }}</template>
                    <template v-if="props.item.comments"> ({{props.item.comments.length}})</template>
                  </td>
                  <td>{{ props.item.created_at.getFullYear()}}.{{ props.item.created_at.getMonth()+1}}.{{ props.item.created_at.getDate()}}</td>
                  <td>
                    <template v-if="isOwner">
                      <v-btn fab flat small color="three" v-on:click="modifyPost(props.item)"><v-icon size="17">create</v-icon></v-btn>
                      <v-btn fab flat small color ="two" v-on:click="deletePost(props.item)"><v-icon size="17">delete</v-icon></v-btn>
                    </template>
                  </td>
                  <!-- </template> -->
                </template>

              </v-data-table>
            </v-flex>
          </v-card>
        </v-tab-item>

        <v-tab-item :value="'tab-'+4"  transition="fade-transition" reverse-transition="fade-transition">
          <v-card flat>
            <v-flex xs12 text-xs-center>
              <v-data-table :headers="commnetHeaders" :items="commentSearchList" class="elevation-1">
                <template v-slot:items="props">
                  <td>
                    <v-flex v-if="!props.item.isModify" >
                      {{props.item.body}}
                    </v-flex>
                    <v-flex v-if="props.item.isModify">
                      <template v-if="props.item.classify=='post'">
                        <v-text-field v-model="newComment" :value='props.item.body' @keyup.enter="modifyComment(props.item)"></v-text-field>
                      </template>
                      <template v-if="props.item.classify=='portfolio'">
                        <v-text-field v-model="newComment" :value='props.item.body' @keyup.enter="modifyPortfolioComment(props.item)"></v-text-field>
                      </template>
                    </v-flex>
                    <v-flex text-xs-right v-if="props.item.isModify">

                    </v-flex>
                  </td>
                  <td>{{ props.item.classify}}</td>
                  <td>{{ props.item.created_at.getFullYear()}}.{{ props.item.created_at.getMonth()+1}}.{{ props.item.created_at.getDate()}}</td>
                  <td>
                    <template v-if="isOwner">
                      <template v-if="props.item.isModify">
                        <template v-if="props.item.classify=='post'">
                          <v-btn fab dark small color="four" @click="modifyComment(props.item)" hover > <v-icon size="17"> fa-pencil</v-icon></v-btn>
                        </template>
                        <template v-if="props.item.classify=='portfolio'">
                          <v-btn fab dark small color="four" @click="modifyPortfolioComment(props.item)" hover > <v-icon size="17"> fa-pencil</v-icon></v-btn>
                        </template>
                        <v-btn fab dark small color="red"  @click="modifyCommentForm(props.item)" hover > <v-icon size="17"> cancel</v-icon></v-btn>
                      </template>
                      <template v-else>
                        <v-btn fab flat small color="three" v-on:click="modifyCommentForm(props.item)"><v-icon size="17">create</v-icon></v-btn>
                        <template v-if="props.item.classify=='post'">
                          <v-btn fab flat small color="two"   v-on:click="deleteComment(props.item)"><v-icon size="17">delete</v-icon></v-btn>
                        </template>
                        <template v-if="props.item.classify=='portfolio'">
                          <v-btn fab flat small color="two"   v-on:click="deletePortfolioComment(props.item)"><v-icon size="17">delete</v-icon></v-btn>
                        </template>
                      </template>
                    </template>
                  </td>
                </template>

              </v-data-table>
            </v-flex>
          </v-card>
        </v-tab-item>



        <!-- Lock Page -->
        <v-tab-item :value="'tab-'+9"  transition="fade-transition" reverse-transition="fade-transition">
          <v-card flat>
            <v-flex xs12 text-xs-center>
              <v-icon size=17>lock</v-icon>
              <div>Sorry, This Page is Locked</div>
              <v-alert >으아아아아아앙</v-alert>
            </v-flex>
          </v-card>
        </v-tab-item>

      </v-tabs-items>
    </v-card>
  </v-container>
</template>


<script>
import FirebaseService from "@/services/FirebaseService";
import BlockAccess from '../components/BlockAccess';
import firebase from "firebase/app";
import axios from "axios";

export default {
  data() {
    return {
      // admin login
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
      search:'',
      isOwner:false,
      // i don't know Data
      edit: false,

      // Tab Data
      tab : null,


      // Portfolio Data
      portfolios:[],
      portfolioHeaders:[
        { text: 'Title', value: 'title', sortable: false, align: 'center' },
        { text: 'Created_at', value: 'created_at', sortable: false, align: 'center' },
        { text: 'Actions', value: 'btns', sortable: false, align: 'center' },
      ],

      // Post Data
      posts:[],
      postHeaders:[
        { text: 'Title', value: 'title', sortable: false, align: 'center' },
        { text: 'Created_at', value: 'created_at', sortable: false, align: 'center' },
        { text: 'Actions', value: 'btns', sortable: false, align: 'center' },
      ],

      //Comment data
      portfolioComments:[],
      postComments:[],
      commnetHeaders:[
        { text: 'Title', value: 'title', sortable: false, align: 'center' },
        { text: 'Classify', value: 'classify', sortable: false, align: 'center' },
        { text: 'Created_at', value: 'created_at', sortable: false, align: 'center' },
        { text: 'Actions', value: 'btns', sortable: false, align: 'center' },
      ],

      // Search Data
      search: '',
      portfolioSearchList: [],
      postSearchList: [],
      commentSearchList:[],
    }
  },
  mounted() {
    this.getPortfolios();
    this.getPosts();
    this.getComments();
  },
  created() {
    this.id= this.$route.params.id;
    firebase.auth().onAuthStateChanged(async user => {
      this.pageuser = await FirebaseService.getUser(this.id);
      console.log(this.pageuser)
      if (user) {
        var currentUser = firebase.auth().currentUser;
        this.user = currentUser;
        this.imageUrl = this.pageuser.userImageUrl;
        if(this.user.uid == this.pageuser.id){
          this.isOwner = true;
        }else {
          this.isOwner = false;
        }
      } else {
        console.log(this.pageuser)
        this.isOwner = false
      }
    })
    if(this.id===''){
      this.id=this.user.uid;
    }
    // this.id = '3uB1Si78L8ZZy4UJuzbcjv06BVs2'
  },

  methods: {
    test(){
      console.log("user.id",this.user.uid);
      console.log("pageuser.id",this.pageuser.id);
      console.log("isOwner",this.isOwner);
    },
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
      if(res.posts){
        for(var i =0; i<res.posts.length; i++)
        FirebaseService.deletePost(res.posts[i]);
      }
      if(res.portfolios){
        for(var i =0; i<res.portfolios.length; i++)
        FirebaseService.deletePortfolio(res.portfolios[i]);
      }
      if(res.comments){
        for(var i =0; i<res.comments.length; i++)
        FirebaseService.deleteComment(res.comments[i].parentId, res.comments[i].classify, res.comments[i].id);
      }
      const result = await FirebaseService.selfDeleteUser();

      FirebaseService.logout();
      firebase.auth().signOut().then(function() {

      });
      swal("정상적으로 탈퇴되었습니다.")
      this.$router.push({
        name: "home"
      });
    },


    async getPortfolios() {
      this.portfolios = await FirebaseService.getPortfoliosById(this.id);
      this.portfolioSearchList = [];
      for (var i = 0; i < this.portfolios.length; i++) {
        if(this.portfolios[i].title.length >= 15){
          this.portfolios[i].subTitle = this.portfolios[i].title.substring(0, 15)+"⋯"
        }
        this.portfolioSearchList.push(this.portfolios[i]);
      }
    },

    async getPosts() {
      this.posts = await FirebaseService.getPostsById(this.id);
      this.postSearchList = [];
      for (var i = 0; i < this.posts.length; i++) {
        if(this.posts[i].title.length >= 15){
          this.posts[i].subTitle = this.posts[i].title.substring(0, 15)+"⋯"
        }
        this.postSearchList.push(this.posts[i]);
      }
    },

    //////////////////////////////////////////////////////////////////////////////////////////////////////
    //                                      현재 작업 중                                                 //
    //////////////////////////////////////////////////////////////////////////////////////////////////////

    async getComments(){
      this.portfolioComments = await FirebaseService.getPortfolioCommentsById(this.id);
      this.postComments = await FirebaseService.getPostCommentsById(this.id);
      this.commentSearchList = [];
      for(var i =0; i<this.portfolioComments.length; i++){
        this.portfolioComments[i].classify = "portfolio";
        if(this.portfolioComments[i].body.length >= 15){
          this.portfolioComments[i].subTitle = this.portfolioComments[i].body.substring(0, 15)+"⋯"
        }
        this.commentSearchList.push(this.portfolioComments[i]);
      }
      for(var i =0; i<this.postComments.length; i++){
        this.postComments[i].classify = "post";
        if(this.postComments[i].body.length >= 15){
          this.postComments[i].subTitle = this.postComments[i].body.substring(0, 15)+"⋯"
        }
        this.commentSearchList.push(this.postComments[i]);
      }
    },

    async modifyPortfolioComment(comment){
      var temp = this.newComment;
      await FirebaseService.modifyPortfolioComment(comment, this.newComment);
      this.modifyCommentForm(comment);
      comment.body = temp;
    },
    async modifyComment(comment){
      var temp = this.newComment;
      await FirebaseService.modifyComment(comment, this.newComment);
      this.modifyCommentForm(comment);
      comment.body =temp;
    },

    modifyCommentForm(comment) {
      if(comment.isModify){
        comment.isModify = false;
      }else{
        comment.isModify = true;
      }
      this.newComment = comment.body;
      //await FirebaseService.canModify(comment);
    },
    async deleteComment(comment){
      await FirebaseService.deleteComment(comment.parentId, comment.classify,comment.id);
      this.commentSearchList = this.arrayRemove(this.commentSearchList,comment);
      this.postComments = this.arrayRemove(this.postComments,comment);
    },


    arrayRemove(arr, value) {
       return arr.filter(function(ele){
           return ele != value;
       });
    },


    async deleteUser(user) {
      await FirebaseService.deleteUserbyId(user.id);
      this.getUsers();
    },

    modifyPortfolio(portfolio){
      this.$router.push({
        path: "/modifyportfolio/"+portfolio.id
      });
    },
    async deletePortfolio(portfolio) {
      await FirebaseService.deletePortfolio(portfolio.id);
      this.getPortfolios();
    },

    modifyPost(post){
      this.$router.push({
        path: "/modifypost/"+post.id
      });
    },
    async deletePost(post){
      // let comments = await FirebaseService.getPostComments(post.id)
      // console.log(comments);
      // for(var i = 0; i<comments.length; i++){
      //   FirebaseService.deleteComment(comments[i].id);
      // }
      await FirebaseService.deletePost(post.id);
      this.getPosts();
    },

    checkAdmin() {
      if (this.adminAccount === 'admin' && this.password === 'admin') {
        this.isAdmin = true;
        swal("Admin님 환영합니다.", "", "success")
      } else {
        swal("Oops", "다시 한 번 확인해주세요", "error")
      }
    },

    highlight(text) {
      var inputText = document.getElementById("inputText");
      var innerHTML = inputText.innerHTML;
      var index = innerHTML.indexOf(text);
      if (index >= 0) {
        innerHTML = innerHTML.substring(0, index) + "<span class='highlight'>" + innerHTML.substring(index, index + text.length) + "</span>" + innerHTML.substring(index + text.length);
        inputText.innerHTML = innerHTML;
      }
    }
  },
  watch: {
    search() {
      if (this.search.length == 0) {
        this.portfolioSearchList= [];
        this.postSearchList= [];
        this.commentSearchList=[];

        for (var i = 0; i < this.portfolios.length; i++) {
          if(this.portfolios[i].title.length >= 15){
            this.portfolios[i].subTitle = this.portfolios[i].title.substring(0, 15)+"⋯"
          }
          this.portfolioSearchList.push(this.portfolios[i]);
        }
        for (var i = 0; i < this.posts.length; i++) {
          if(this.posts[i].title.length >= 15){
            this.posts[i].subTitle = this.posts[i].title.substring(0, 15)+"⋯"
          }
          this.postSearchList.push(this.posts[i]);
        }
        for(var i =0; i<this.portfolioComments.length; i++){
          if(this.portfolioComments[i].body.length >= 15){
            this.portfolioComments[i].subTitle = this.portfolioComments[i].body.substring(0, 15)+"⋯"
          }
          this.commentSearchList.push(this.portfolioComments[i]);
        }
        for(var i =0; i<this.postComments.length; i++){
          if(this.postComments[i].body.length >= 15){
            this.postComments[i].subTitle = this.postComments[i].body.substring(0, 15)+"⋯"
          }
          this.commentSearchList.push(this.postComments[i]);
        }

      } else {
        this.portfolioSearchList= [];
        this.postSearchList= [];
        this.commentSearchList=[];

        var search = this.search;
        search = search.toLowerCase();

        for (var i = 0; i < this.portfolios.length; i++) {
          var portfolioA = this.portfolios[i].title.toLowerCase()
          if (portfolioA.includes(search) ) {
            this.portfolioSearchList.push(this.portfolios[i]);
          }
        }

        for (var i = 0; i < this.posts.length; i++) {
          var postA = this.posts[i].title.toLowerCase()
          if (postA.includes(search) ) {
            this.postSearchList.push(this.posts[i]);
          }
        }

        for(var i =0; i<this.portfolioComments.length; i++){
          var body = this.portfolioComments[i].body.toLowerCase()
          if (body.includes(search) ) {
            this.commentSearchList.push(this.portfolioComments[i]);
          }
        }
        for(var i =0; i<this.postComments.length; i++){
          var body = this.postComments[i].body.toLowerCase()
          if (body.includes(search) ) {
            this.commentSearchList.push(this.postComments[i]);
          }
        }

      }
    },


  },

}
</script>
