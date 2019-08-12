
<template>
<v-container mt-2>
  <v-flex xs12 text-xs-center>
    <v-text-field label="Search" v-model="search"></v-text-field>
  </v-flex>

  <v-card>
    <v-tabs v-model="tab" centered icons-and-text transition="fade">
      <v-tabs-slider></v-tabs-slider>

      <v-tab href="#tab-1">
        <!-- Users ({{users.length}}) -->
        Information
        <v-icon size=17>account_box</v-icon>
      </v-tab>

      <template v-if="pageuser.isPortfolioOpen || this.isOwner">
        <v-tab href="#tab-2">
          Portfolios ({{portfolioSearchList.length}})
          <v-icon size=17>fa-pencil</v-icon>
        </v-tab>
      </template>

      <template v-if="pageuser.isPostOpen || this.isOwner">
        <v-tab href="#tab-3">
          <!-- Posts ({{posts.length}}) -->
          Posts ({{postSearchList.length}})
          <v-icon size=17>fa-clipboard</v-icon>
        </v-tab>
      </template>
      <template v-if="pageuser.isCommentOpen|| this.isOwner">
        <v-tab href="#tab-4">
          <!-- Posts ({{posts.length}}) -->
          Comments ({{commentSearchList.length}})
          <v-icon size=17>fa-clipboard</v-icon>
        </v-tab>
      </template>

    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item :value="'tab-'+1" transition="fade-transition" reverse-transition="fade-transition">
        <v-card flat min-height="480px">
          <v-layout wrap align-center justify-center my-3>
            <v-flex xs12 md5 align-center>
              <v-layout wrap>
                <v-flex xs12 text-xs-center>
                  <v-progress-circular v-if="loading" indeterminate color="four"></v-progress-circular>
                  <v-img :src="imageUrl" max-width="300" max-height="300" align-center style="margin: auto" />
                </v-flex>
                <v-flex style="margin: auto" xs7 md10>
                  <v-text-field label="Select Image" @click="pickFile" v-model="imageUrl" prepend-icon="attach_file" color="four" v-if="isOwner"></v-text-field>
                  <input type="file" style="display: none" ref="image" accept="image/*" @change="onFilePicked" />
                </v-flex>
              </v-layout>

            </v-flex>
            <v-flex sm1></v-flex>
            <v-flex xs7 md5>
              <v-layout align-center>
                <v-flex text-xs-12>
                  <v-text-field label="Name" v-model="pageuser.name" v-if="isOwner"> </v-text-field>
                  <v-text-field label="Name" v-model="pageuser.name" v-if="!isOwner" readonly></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout align-center>
                <v-flex text-xs-12>
                  <v-text-field label="Email" v-model="pageuser.email" readonly> </v-text-field>
                </v-flex>
              </v-layout>
              <v-layout align-center>
                <v-flex text-xs-12>
                  <v-text-field label="Classify" v-model="pageuser.classify" readonly> </v-text-field>
                </v-flex>
              </v-layout>

              <v-layout align-center v-if="isOwner">
                <v-flex text-xs-12 text-xs-center>
                  <h3 style="color:#696969;">프로필 공개 설정</h3>
                  <v-layout align-center style="margin: auto">
                    <v-flex text-xs-4 text-xs-center>
                      <v-checkbox v-model="pageuser.isPortfolioOpen" label="Portfolio" color="two"></v-checkbox>
                    </v-flex>
                    <v-flex text-xs-4 text-xs-center>
                      <v-checkbox v-model="pageuser.isPostOpen" label='Post' color="four"></v-checkbox>
                    </v-flex>
                    <v-flex text-xs-4 text-xs-center>
                      <v-checkbox v-model="pageuser.isCommentOpen" label="Comment" color="three"></v-checkbox>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
              <v-layout style="justify-content: center" v-if="isOwner">
                <div style="display: flex; flex-direction: column;">
                  <h3 style="color:#696969;">푸시 알림 설정</h3>
                  <v-checkbox style="margin: 0;" v-model="pageuser.allowPush" label="Push" color="five"></v-checkbox>
                </div>
              </v-layout>
            </v-flex>
          </v-layout>



          <v-flex text-xs-center mb2 v-if="isOwner">
            <v-btn color="two" round dark v-on:click="modifyUser">
              <v-icon size="17" class="mr-2">create</v-icon>Modify
            </v-btn>
            <router-link :to="{name:'admin'}">
              <v-btn color="three" v-if="pageuser.classify ==='관리자'" dark round>
                <v-icon size="17" class="mr-2">people</v-icon>Admin
              </v-btn>
            </router-link>
            <v-btn color="three" v-if="pageuser.classify !=='관리자'" dark round v-on:click="deleteUser">
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
                <!-- <td><p class="testbody"> {{ props.item.title }} </p></td> -->
                <td>
                  <router-link v-if="props.item.subTitle" :to="{ name: 'portfolioview', params: {id:props.item.id}}"><span v-html="highlight(props.item.subTitle,search)"></span> </router-link>
                  <router-link v-if="!props.item.subTitle" :to="{ name: 'portfolioview', params: {id:props.item.id}}"><span v-html="highlight(props.item.title,search)"></span> </router-link>
                  <template v-if="props.item.comments"> ({{props.item.comments.length}})</template>
                </td>
                <td>{{ props.item.created_at.getFullYear()}}.{{ props.item.created_at.getMonth()+1}}.{{ props.item.created_at.getDate()}}</td>
                <td>
                  <template v-if="isOwner">
                    <v-btn fab flat small color="three" v-on:click="modifyPortfolio(props.item)">
                      <v-icon size="17">create</v-icon>
                    </v-btn>
                    <v-btn fab flat small color="two" v-on:click="deletePortfolio(props.item)">
                      <v-icon size="17">delete</v-icon>
                    </v-btn>
                  </template>
                </td>
              </template>

            </v-data-table>
          </v-flex>
        </v-card>
      </v-tab-item>


      <v-tab-item :value="'tab-'+3" transition="fade-transition" reverse-transition="fade-transition">
        <v-card flat>
          <v-flex xs12 text-xs-center>
            <v-data-table :headers="postHeaders" :items="postSearchList" class="elevation-1">
              <template v-slot:items="props">
                <td>
                  <template v-if="props.item.subTitle">
                    <span v-html="highlight(props.item.subTitle,search)"></span>
                  </template>
                  <template v-else>
                    <span v-html="highlight(props.item.title,search)"></span>
                  </template>
                  <template v-if="props.item.comments"> ({{props.item.comments.length}})</template>
                </td>
                <td>{{ props.item.created_at.getFullYear()}}.{{ props.item.created_at.getMonth()+1}}.{{ props.item.created_at.getDate()}}</td>
                <td>
                  <template v-if="isOwner">
                    <v-btn fab flat small color="three" v-on:click="modifyPost(props.item)">
                      <v-icon size="17">create</v-icon>
                    </v-btn>
                    <v-btn fab flat small color="two" v-on:click="deletePost(props.item)">
                      <v-icon size="17">delete</v-icon>
                    </v-btn>
                  </template>
                </td>
              </template>

            </v-data-table>
          </v-flex>
        </v-card>
      </v-tab-item>

      <v-tab-item :value="'tab-'+4" transition="fade-transition" reverse-transition="fade-transition">
        <v-card flat>
          <v-flex xs12 text-xs-center>
            <v-data-table :headers="commnetHeaders" :items="commentSearchList" class="elevation-1">
              <template v-slot:items="props">
                <td>
                  <v-flex v-if="!props.item.isModify">
                    <span v-html="highlight(props.item.body,search)"></span>
                    <template v-if="props.item.recomments"> ({{props.item.recomments.length}})</template>
                    <div class="parentTitle">{{props.item.parentTitle}}</div>
                  </v-flex>
                  <v-flex v-if="props.item.isModify">
                    <v-text-field v-model="newComment" :value='props.item.body' @keyup.enter="modifyComment(props.item)"></v-text-field>
                  </v-flex>

                </td>
                <td>
                  <div v-html="highlight(props.item.classify,search)"></div>
                </td>
                <td>{{ props.item.created_at.getFullYear()}}.{{ props.item.created_at.getMonth()+1}}.{{ props.item.created_at.getDate()}}</td>
                <td>
                  <template v-if="isOwner">
                    <template v-if="props.item.isModify">
                      <v-btn fab dark small color="four" hover @click="modifyComment(props.item)">
                        <v-icon size="17">create</v-icon>
                      </v-btn>
                      <v-btn fab dark small color="red" hover @click="modifyCommentForm(props.item)">
                        <v-icon size="17">cancel</v-icon>
                      </v-btn>
                    </template>
                    <template v-else>
                      <v-btn fab flat small color="three" v-on:click="modifyCommentForm(props.item)">
                        <v-icon size="17">create</v-icon>
                      </v-btn>
                      <v-btn fab flat small color="two" v-on:click="deleteComment(props.item)">
                        <v-icon size="17">delete</v-icon>
                      </v-btn>
                    </template>
                  </template>
                </td>
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
      search: '',
      isOwner: false,
      // i don't know Data
      edit: false,
      token: '',
      isAdmin: false,

      // Tab Data
      tab: null,


      // Portfolio Data
      portfolios: [],
      portfolioHeaders: [{
          text: 'Title',
          value: 'title',
          sortable: false,
          align: 'center'
        },
        {
          text: 'Created_at',
          value: 'created_at',
          sortable: false,
          align: 'center'
        },
        {
          text: 'Actions',
          value: 'btns',
          sortable: false,
          align: 'center'
        },
      ],

      // Post Data
      posts: [],
      postHeaders: [{
          text: 'Title',
          value: 'title',
          sortable: false,
          align: 'center'
        },
        {
          text: 'Created_at',
          value: 'created_at',
          sortable: false,
          align: 'center'
        },
        {
          text: 'Actions',
          value: 'btns',
          sortable: false,
          align: 'center'
        },
      ],

      //Comment data
      portfolioComments: [],
      postComments: [],
      comments: [],
      commnetHeaders: [{
          text: 'Title',
          value: 'title',
          sortable: false,
          align: 'center'
        },
        {
          text: 'Classify',
          value: 'classify',
          sortable: false,
          align: 'center'
        },
        {
          text: 'Created_at',
          value: 'created_at',
          sortable: false,
          align: 'center'
        },
        {
          text: 'Actions',
          value: 'btns',
          sortable: false,
          align: 'center'
        },
      ],

      // Search Data
      search: '',
      portfolioSearchList: [],
      postSearchList: [],
      commentSearchList: [],

      // Whole
      wholePortfolios: [],
      wholePosts: [],

      totalIndex: -1,
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
        this.imageUrl = this.pageuser.userImageUrl;
        this.isOwner = false
      }
    })
    if (this.id == '') {
      this.id = this.user.uid;
    }
  },

  methods: {
    // 이거 실행할 수 있게 해야합니다. router-link 실행하기 전에 이거 실행해서 index 받아오고 그 index로 router-link 실행해야함 ㅠㅠㅠ 고고

    async getIndex(item) {
      this.wholePosts = await FirebaseService.getPosts();
      console.log(this.wholePosts)
      for (var i = 0; i < this.wholePosts.length; i++) {
        if (item.id == this.wholePosts[i].id) {
          this.totalIndex = i;
        }
      }
    },
    async test() {
      this.wholePosts = await FirebaseService.getPosts();
      console.log("이게되나?", this.postSearchList);
    },

    async modifyUser() {
      if (this.imageUrl === '') {
        this.imageUrl = this.pageuser.userImageUrl
      }
      this.pageuser.userImageUrl = this.imageUrl;
      //console.log(this.pageuser);


      // TODO 내가 이름이 수정되면, 내가 작성한 모든 post, 포폴, 댓글에 들어간 name 수정하기


      await FirebaseService.modifyUser(this.pageuser)
      await FirebaseService.alarmOnFirstVisit()
        .then(async token => {
          // console.log(token)
          var result = await FirebaseService.getUserData();
          if (result.classify === '관리자') {
            this.isAdmin = true;
            if (result.posts) {
              for (var i in result.posts) {
                var post = await FirebaseService.getPost(result.posts[i])
                await FirebaseService.modifyPost(post.title,post.body,post.id,this.pageuser.name)
              }
            }
            if (result.portfolios) {
              for (var i in result.portfolios) {
                var portfolio = await FirebaseService.getPortfolio(result.portfolios[i])
                await FirebaseService.modifyPortfolio(portfolio.title, portfolio.body, portfolio.img, portfolio.id, this.pageuser.name)
              }
            }
          } else {
            this.isAdmin = false
          }

          await FirebaseService.updateToCloudMessagingUserList(token, result.allowPush, this.isAdmin);
          // console.log(token, result.allowPush)
        });
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


    async deleteUser() {
      const res = await FirebaseService.getUserData();
      if (res.posts) {
        for (var i = 0; i < res.posts.length; i++)
          FirebaseService.deletePost(res.posts[i]);
      }
      if (res.portfolios) {
        for (var i = 0; i < res.portfolios.length; i++)
          FirebaseService.deletePortfolio(res.portfolios[i]);
      }
      if (res.comments) {
        for (var i = 0; i < res.comments.length; i++)
          FirebaseService.deleteComment(res.comments[i].parentId, res.comments[i].classify, res.comments.id[i]);
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
        if (this.portfolios[i].title.length >= 15) {
          this.portfolios[i].subTitle = this.portfolios[i].title.substring(0, 15) + "⋯"
        }
        this.portfolioSearchList.push(this.portfolios[i]);
      }
    },

    async getPosts() {
      this.posts = await FirebaseService.getPostsById(this.id);
      this.wholePosts = await FirebaseService.getPosts();
      this.postSearchList = [];
      for (var i = 0; i < this.posts.length; i++) {
        if (this.posts[i].title.length >= 15) {
          this.posts[i].subTitle = this.posts[i].title.substring(0, 15) + "⋯"
        }
        for (var j = 0; j < this.wholePosts.length; j++) {
          if (this.posts[i].id == this.wholePosts[j].id) {
            this.posts[i].index = this.wholePosts[j].index;
          }
        }
        this.postSearchList.push(this.posts[i]);
      }
    },

    async getComments() {
      this.comments = await FirebaseService.getCommentsById(this.id);
      this.wholePosts = await FirebaseService.getPosts();
      this.wholePortfolios = await FirebaseService.getPortfolios();
      this.commentSearchList = [];
      for (var i = 0; i < this.comments.length; i++) {
        if (this.comments[i].body.length >= 15) {
          this.comments[i].subTitle = this.comments[i].body.substring(0, 15) + "⋯"
        }
        if (this.comments[i].classify == "portfolio") {
          for (var j = 0; j < this.wholePortfolios.length; j++) {
            if (this.comments[i].parentId == this.wholePortfolios[j].id) {
              this.comments[i].parentTitle = this.wholePortfolios[j].title + " (" + this.wholePortfolios[j].comments.length + ")";

            }
          }
        } else if (this.comments[i].classify == "post") {
          for (var j = 0; j < this.wholePosts.length; j++) {
            if (this.comments[i].parentId == this.wholePosts[j].id) {
              this.comments[i].parentTitle = this.wholePosts[j].title + " (" + this.wholePosts[j].comments.length + ")";

            }
          }
        }
        this.commentSearchList.push(this.comments[i]);


        // 대댓글 만들어지면 그때 다시 도전!!!!!!!!!!!!!!!!!!!!!!!!!!
        // for(var i =0; i<this.comments.length; i++){
        //   for(var j =0; j<this.comments.length; j++){
        //     if(!this.comments[i].parentTitle && this.comments[i].parentId == this.comments[j].id){
        //       this.comments[i].parentTitle = this.comments[j].parentTitle;
        //     }
        //   }
        // }
      }
    },

    async modifyComment(comment) {
      var temp = this.newComment;
      await FirebaseService.modifyComment(comment, this.newComment);
      this.modifyCommentForm(comment);
      comment.body = temp;
    },

    modifyCommentForm(comment) {
      if (comment.isModify) {
        comment.isModify = false;
      } else {
        comment.isModify = true;
      }
      this.newComment = comment.body;
    },

    async deleteComment(comment) {
      await FirebaseService.deleteComment(comment.parentId, comment.classify, comment.id);
      this.commentSearchList = this.arrayRemove(this.commentSearchList, comment);
      this.comments = this.arrayRemove(this.comments, comment);
    },

    arrayRemove(arr, value) {
      return arr.filter(function(ele) {
        return ele != value;
      });
    },

    // async deleteUser(user) {
    //   await FirebaseService.deleteUserbyId(user.id);
    //   this.getUsers();
    // },

    modifyPortfolio(portfolio) {
      this.$router.push({
        path: "/modifyportfolio/" + portfolio.id
      });
    },
    async deletePortfolio(portfolio) {
      await FirebaseService.deletePortfolio(portfolio.id);
      this.getPortfolios();
      this.getComments();
    },

    modifyPost(post) {
      this.$router.push({
        path: "/modifypost/" + post.id
      });
    },

    async deletePost(post) {
      await FirebaseService.deletePost(post.id);
      this.getComments();
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

    highlight(value, search) {
      var iQuery = new RegExp(search, "ig");
      return value.toString().replace(iQuery, function(matchedTxt, a, b) {
        return ('<span class=\'highlight\'>' + matchedTxt + '</span>');
      });
    },

    searchInit(list,searchList,title){
      for (var i = 0; i < list.length; i++) {
        if(title =='title'){
          if (list[i].title.length >= 15) {
            list[i].subTitle = list[i].title.substring(0, 15) + "⋯"
          }
        }
        else if(title =='body'){
          if (list[i].body.length >= 15) {
            list[i].subTitle = list[i].body.substring(0, 15) + "⋯"
          }
        }
        searchList.push(list[i]);
      }
    }
  },
  watch: {
    search() {
      this.portfolioSearchList = [];
      this.postSearchList = [];
      this.commentSearchList = [];

      if (this.search.length == 0) {

        this.searchInit(this.portfolios,this.portfolioSearchList, 'title');
        this.searchInit(this.posts,this.postSearchList, 'title');
        this.searchInit(this.comments,this.commentSearchList, 'body');

      } else {
        var search = this.search.toLowerCase();

        for (var i = 0; i < this.portfolios.length; i++) {
          var portfolioA = this.portfolios[i].title.toLowerCase()
          if (portfolioA.includes(search)) {
            this.portfolioSearchList.push(this.portfolios[i]);
          }
        }

        for (var i = 0; i < this.posts.length; i++) {
          var postA = this.posts[i].title.toLowerCase()
          if (postA.includes(search)) {
            this.postSearchList.push(this.posts[i]);
          }
        }

        for (var i = 0; i < this.comments.length; i++) {
          var body = this.comments[i].body.toLowerCase()
          var classify = this.comments[i].classify.toLowerCase()
          if (body.includes(search) || classify.includes(search)) {
            this.commentSearchList.push(this.comments[i]);
          }
        }
      }
    },

    async '$route'(to, from) {
      this.id = this.$route.params.id;
      this.pageuser = await FirebaseService.getUser(this.id);
      this.imageUrl = this.pageuser.userImageUrl;

      if (this.user.uid == this.pageuser.id) {
        this.isOwner = true;
      } else {
        this.isOwner = false;
      }
      this.getPortfolios();
      this.getPosts();
      this.getComments();

    }

  },

}
</script>

<style>
.parentTitle {
  color: #AAAAAA;
}

.highlight {
  background-color: #fdc23e;
  font-weight: bold;
}
</style>
