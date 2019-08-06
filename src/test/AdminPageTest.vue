<style>
.testbody {
   overflow: hidden;
   text-overflow: ellipsis;
   display: -webkit-box;
   max-height: 16px;
   max-width: 150px;
   -webkit-line-clamp: 1;
   -webkit-box-orient: vertical;
}

</style>

<template>
<v-container mt-5>
  <v-flex xs12 text-xs-center>
      TEST PAGE
  </v-flex>

  <v-flex xs12 text-xs-center>
    <v-text-field label="Search" v-model="search"></v-text-field>
  </v-flex>

  <v-card>
    <v-tabs
      v-model="tab"
      centered
      icons-and-text
    >
      <v-tabs-slider></v-tabs-slider>

      <v-tab href="#tab-1">
        <!-- Users ({{users.length}}) -->
        Users ({{userSearchList.length}})
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
      <v-tab-item :value="'tab-'+1">
        <v-card flat>
          <v-flex xs12 text-xs-center>
            <v-data-table :headers="userHeaders" :items="userSearchList" class="elevation-1">
              <template v-slot:items="props">
                <td>{{ props.item.name }}</td>
                <td>{{ props.item.email }}</td>
                <template v-if="props.item.classify=='관리자'">
                  <td >🔥{{ props.item.classify }}🔥</td>
                </template>
                <template v-else>
                  <td>
                    <v-select v-model="props.item.classify" :items="classifies" :menu-props="{offsetY: true }"></v-select>
                  </td>
                </template>
                <td>{{ props.item.created_at.getFullYear()}}.{{ props.item.created_at.getMonth()+1}}.{{ props.item.created_at.getDate()}}</td>
                <td>{{ props.item.current_at.getFullYear()}}.{{ props.item.current_at.getMonth()+1}}.{{ props.item.current_at.getDate()}}</td>
                <td>
                  <v-btn fab flat small color="three" v-on:click="modifyUser(props.item)">
                    <v-icon size="17">create</v-icon>
                  </v-btn>
                  <!-- <v-btn fab flat small color ="two" v-on:click="deleteUser(props.item)"><v-icon size="17">delete</v-icon></v-btn> -->
                </td>
                <!-- </template> -->
              </template>

              <template v-slot:no-data transition="scale-transition">
                <v-alert v-if="alertinit" :value="userSearchList.length == 0" color="error" icon="warning" outline>
                  "{{search}}" is not in USERS
                </v-alert>
              </template>
            </v-data-table>
          </v-flex>
        </v-card>
      </v-tab-item>


      <v-tab-item :value="'tab-'+2">
        <v-card flat>
          <v-flex xs12 text-xs-center>
            <v-data-table :headers="portfolioHeaders" :items="portfolioSearchList" class="elevation-1">
              <template v-slot:items="props">
                <td><span class="testbody"> {{ props.item.title }} </span> </td>
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



      <v-tab-item :value="'tab-'+3">
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
import firebase, {
  functions
} from "firebase/app";
import store from '../store'

export default {

  data() {
    return {
      // i don't know Data
      flat: false,
      raised: false,
      adminAccount: '',
      password: '',
      selected: [],
      edit: false,
      alertinit: false,

      // Tab Data
      tab : null,

      // users Data
      classifies: ["팀원", "수퍼맨", "방문자", "지스맨", "지쓰구리"],
      users: [],
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
  mounted() {
    this.getUsers();
    this.getPortfolios();
    this.getPosts();
  },
  methods: {
    async getUsers() {
      this.users = await FirebaseService.getUsers();
      this.userSearchList = [];
      for (var i = 0; i < this.users.length; i++) {
        this.userSearchList.push(this.users[i]);
      }
      this.alertinit = true;
    },

    async getPortfolios() {
      this.portfolios = await FirebaseService.getPortfolios();
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
      console.log("들어옴",text);
      var inputText = document.getElementById("table");
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

<style>
.highlight{
  color : "yellow";
}
</style>
