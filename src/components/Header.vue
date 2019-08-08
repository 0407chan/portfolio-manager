
<template>
<v-toolbar dense fixed style="opacity:0.8" color="one">
  <router-link to="/" style="text-decoration: none;">
    <v-btn color="#477ed6" flat depressed>
      <v-img width="100" class="logo" src="https://i.imgur.com/21KLf6x.png"></v-img>
    </v-btn>
  </router-link>

  <v-spacer></v-spacer>

  <v-toolbar-items class="hidden-sm-and-down">

    <!-- <v-btn v-if="user" flat :to="{ name: 'userinfo', params: {id: user.id}}">{{user.name}}님</v-btn> -->
    <v-btn flat :to="{name:'portfolio'}">Portfolio</v-btn>
    <v-btn flat :to="{name:'post'}">Post</v-btn>
    <v-btn flat v-if="wait&&!user">
      <LoginModal></LoginModal>
    </v-btn>
    <v-btn flat v-if="user" v-on:click="signOut">Logout</v-btn>


    <!-- 안예뻐서 일시적으로 주석처리 함 -->

    <!-- <v-btn flat icon>
      <Translate></Translate>
    </v-btn>
    <v-btn icon v-on:click="favorite()">
      <v-icon>bookmark_border</v-icon>
    </v-btn> -->


    <v-btn fab small v-if="user" :to="{ name: 'userinfo', params: {id: user.id}}">
      <v-avatar flat size="40">
        <img
        :src="user.userImageUrl"
        >
      </v-avatar>
    </v-btn>
  </v-toolbar-items>

  <v-toolbar-items class="hidden-md-and-up">
    <v-menu bottom left>
      <template v-slot:activator="{ on }">
        <v-btn flat icon v-on="on">
          <v-icon>fa-bars</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-tile v-if="user" :to="{ name: 'userinfo', params: {id: user.id}}">
          <v-list-tile-title flat>{{user.name}}님</v-list-tile-title>
        </v-list-tile>
        <v-list-tile v-for="(item, i) in items" :key="i" :to="{name: item.title}">
          <v-list-tile-title flat>{{ item.title }}</v-list-tile-title>
        </v-list-tile>
        <v-list-tile v-if="!user">
          <LoginModal></LoginModal>
        </v-list-tile>
        <v-list-tile v-if="user">
          <v-list-tile-title flat v-on:click="signOut">logout</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
  </v-toolbar-items>
</v-toolbar>
</template>

<script>
import FirebaseService from "@/services/FirebaseService";
import firebase from "firebase/app";
import store from '../store'
import LoginModal from "../components/LoginModal.vue";
import Translate from "../components/Translate.vue";

export default {
  components: {
    LoginModal,
    Translate,
  },

  data() {
    return {
      items: [{
        title: "post"
      }, {
        title: "portfolio"
      }],
      user: "",
      marked: false,
      wait: false
    };
  },
  methods: {
    favorite() {
      alert("ctrl + D 를 눌러 즐겨찾기에 추가해주세요.");
    },
    signOut() {
      FirebaseService.logout().then(function() {
          swal('로그아웃되었습니다')

        }),
        firebase.auth().signOut().then(function() {

        });
      this.$router.push({
        name: "home"
      });

    },
    check() {
      return $store.state.check
    },
  },
  created() {
    // 로그인, 로그아웃 을 위한 사용자 감지
    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        this.user = await FirebaseService.getUserData();
        await FirebaseService.alarmOnFirstVisit()
                .then(async token=>{
                  // console.log(token)
                  var result = await FirebaseService.getUserData();
                  if (result.classify==='관리자'){
                    this.isAdmin = true
                  } else {
                    this.isAdmin = false
                  }
                  // console.log(result)
                  await FirebaseService.updateToCloudMessagingUserList(token, result.allowPush, this.isAdmin);
                  // console.log(token, result.allowPush)
                });
      } else {
        this.user = "";
      }
      this.wait = true
    })
  }
};
</script>

<style>
.logo {
  width: 40px;
}
</style>
