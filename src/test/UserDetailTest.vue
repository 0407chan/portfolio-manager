
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

        <v-tab href="#tab-2">
          <!-- Portfolios ({{portfolios.length}}) -->
          Portfolios ({{portfolioSearchList.length}})
          <v-icon size=17>fa-pencil</v-icon>
        </v-tab>

        <v-tab href="#tab-3">
          <!-- Posts ({{posts.length}}) -->
          Posts ({{postSearchList.length}})
          <v-icon size=17>fa-clipboard</v-icon>
        </v-tab>

      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item :value="'tab-'+1" transition="fade-transition" reverse-transition="fade-transition">
          <v-card flat>
            <v-layout wrap align-center justify-center>
                <v-flex xs4>
                  <v-progress-circular v-if="loading" indeterminate color="four"></v-progress-circular>
                  <v-img :src="imageUrl" width="300" height="300" v-if="imageUrl" />

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
              <v-btn color="two" v-if="user&&user.email==pageuser.email" round dark v-on:click="modifyUser">
                <v-icon size="17" class="mr-2">create</v-icon>Modify
              </v-btn>

              <v-btn color="three" v-if="user&&user.email==pageuser.email" dark round v-on:click="deleteUser">
                <v-icon size="17" class="mr-2">cancel</v-icon>탈퇴하기
              </v-btn>
            </v-flex>
          </v-card>
        </v-tab-item>

        <v-tab-item :value="'tab-'+2" transition="fade-transition" reverse-transition="fade-transition">
          <v-card flat>
            <v-flex xs12 text-xs-center>
              <v-data-table :headers="portfolioHeaders" :items="portfolioSearchList" class="elevation-1">
                <template v-slot:items="props">
                  <td><p class="testbody"> {{ props.item.title }} </p></td>
                  <td>{{ props.item.name }}</td>
                  <td>{{ props.item.email }}</td>
                  <td>{{ props.item.created_at.getFullYear()}}.{{ props.item.created_at.getMonth()+1}}.{{ props.item.created_at.getDate()}}</td>
                  <td>
                    <v-btn fab flat small color="three" v-on:click="modifyPortfolio(props.item)"><v-icon size="17">create</v-icon></v-btn>
                    <v-btn fab flat small color ="two" v-on:click="deletePortfolio(props.item)"><v-icon size="17">delete</v-icon></v-btn>
                  </td>
                  <!-- </template> -->
                </template>

                <template v-slot:no-data transition="scale-transition">
                  <v-alert v-if="alertinit" :value="portfolioSearchList.length == 0" color="error" icon="warning" outline>
                    "{{search}}" is not in PORTFOLIOS
                  </v-alert>
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
                  <td> <span class="testbody">{{ props.item.title }} </span></td>
                  <td>{{ props.item.name }}</td>
                  <td>{{ props.item.email }}</td>
                  <td>{{ props.item.created_at.getFullYear()}}.{{ props.item.created_at.getMonth()+1}}.{{ props.item.created_at.getDate()}}</td>
                  <td>
                    <v-btn fab flat small color="three" v-on:click="modifyPost(props.item)"><v-icon size="17">create</v-icon></v-btn>
                    <v-btn fab flat small color ="two" v-on:click="deletePost(props.item)"><v-icon size="17">delete</v-icon></v-btn>
                  </td>
                  <!-- </template> -->
                </template>

                <template v-slot:no-data transition="scale-transition">
                  <v-alert v-if="alertinit" :value="postSearchList.length == 0" color="error" icon="warning" outline>
                    "{{search}}" is not in POSTS
                  </v-alert>
                </template>
              </v-data-table>
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

      // i don't know Data
      selected: [],
      edit: false,
      alertinit: false,

      // Tab Data
      tab : null,

      // users Data
      classifies: ["팀원", "수퍼맨", "방문자", "지스맨", "지쓰구리"],
      users: [],
      user: '',
      userHeaders: [
        { text: 'Name',sortable: false, value: 'name', align: 'center' },
        { text: 'Email', value: 'email', sortable: false, align: 'center' },
        { text: 'Classify', value: 'classify', sortable: false, align: 'center' },
        { text: 'Created_at', value: 'created_at', sortable: false, align: 'center' },
        { text: 'Current_at', value: 'current_at', sortable: false, align: 'center' },
        { text: 'Actions', value: 'btns', sortable: false, align: 'center' },
      ],

      // Portfolio Data
      portfolios:[],
      portfolioHeaders:[
        { text: 'Title', value: 'title', sortable: false, align: 'center' },
        { text: 'Name', value: 'writer', sortable: false, align: 'center' },
        { text: 'Email', value: 'email', sortable: false, align: 'center' },
        { text: 'Created_at', value: 'created_at', sortable: false, align: 'center' },
        { text: 'Actions', value: 'btns', sortable: false, align: 'center' },
      ],

      // Post Data
      posts:[],
      postHeaders:[
        { text: 'Title', value: 'title', sortable: false, align: 'center' },
        { text: 'Name', value: 'writer', sortable: false, align: 'center' },
        { text: 'Email', value: 'email', sortable: false, align: 'center' },
        { text: 'Created_at', value: 'created_at', sortable: false, align: 'center' },
        { text: 'Actions', value: 'btns', sortable: false, align: 'center' },
      ],

      // Search Data
      search: '',
      userSearchList: [],
      portfolioSearchList: [],
      postSearchList: [],
    }
  },
  components: {
    BlockAccess
  },
  mounted() {
    this.getPortfolios();
    this.getPosts();
  },
  created() {
    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        var currentUser = firebase.auth().currentUser;
        this.user = currentUser;
        this.pageuser = await FirebaseService.getUser(this.id);
        this.imageUrl = this.pageuser.userImageUrl;
      }
    })
    this.id = '3uB1Si78L8ZZy4UJuzbcjv06BVs2'
    //this.id= this.$route.params.id;
    // if(this.id==''){
    //   this.id=this.user.id;
    // }
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


    },


    async getPortfolios() {
      this.portfolios = await FirebaseService.getPortfoliosById(this.id);
      this.portfolioSearchList = [];
      for (var i = 0; i < this.portfolios.length; i++) {
        this.portfolioSearchList.push(this.portfolios[i]);
      }
    },

    async getPosts() {
      this.posts = await FirebaseService.getPosts();
      this.postSearchList = [];
      for (var i = 0; i < this.posts.length; i++) {
        this.postSearchList.push(this.posts[i]);
      }
    },


    async modifyUser(user) {
      await FirebaseService.modifyUser(user);
      swal("수정사항이 반영되었습니다.");
      this.getUsers();
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
        var lenUser = this.users.length;
        var lenPortfolio = this.portfolios.length;
        var lenPost = this.posts.length;

        this.userSearchList = [];
        this.portfolioSearchList= [];
        this.postSearchList= [];

        for (var i = 0; i < lenUser; i++) {
          this.userSearchList.push(this.users[i]);
        }
        for (var i = 0; i < lenPortfolio; i++) {
          this.portfolioSearchList.push(this.portfolios[i]);
        }
        for (var i = 0; i < lenPost; i++) {
          this.postSearchList.push(this.posts[i]);
        }
      } else {
        this.userSearchList = [];
        this.portfolioSearchList= [];
        this.postSearchList= [];

        var lenUser = this.users.length;
        var lenPortfolio = this.portfolios.length;
        var lenPost = this.posts.length;

        var search = this.search;
        search = search.toLowerCase();

        for (var i = 0; i < lenUser; i++) {
          var Usera = this.users[i].name.toLowerCase()
          var Userb = this.users[i].email.toLowerCase()
          var Userc = this.users[i].classify.toLowerCase()
          if (Usera.includes(search) || Userb.includes(search) || Userc.includes(search)) {
            this.userSearchList.push(this.users[i]);
          }
        }

        for (var i = 0; i < lenPortfolio; i++) {
          var portfolioA = this.portfolios[i].title.toLowerCase()
          var portfolioB = this.portfolios[i].name.toLowerCase()
          var portfolioC = this.portfolios[i].email.toLowerCase()
          if (portfolioA.includes(search) || portfolioB.includes(search) ||portfolioC.includes(search)) {
            this.portfolioSearchList.push(this.portfolios[i]);
          }
        }

        for (var i = 0; i < lenPost; i++) {
          var postA = this.posts[i].title.toLowerCase()
          var postB = this.posts[i].name.toLowerCase()
          var postC = this.posts[i].email.toLowerCase()
          if (postA.includes(search) || postB.includes(search) || postC.includes(search)) {
            this.postSearchList.push(this.posts[i]);
          }
        }

      }
    },
  },

}
</script>
